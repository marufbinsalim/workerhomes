import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/Input";
import { modify } from "@/lib/services/dwelling/price";
import { initPrice, priceSchema } from "@/lib/validation/dwelling/price";
import { Icon } from "@iconify/react";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const PriceForm = forwardRef(
  ({ assignedType, formData, onSuccess, data }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [minStay, setMinStay] = useState(1);
    const [expanded, setExpanded] = useState({});
    const t = useTranslations("prices");
    const tType = useTranslations("accommodation-types");

    const handleSubmit = async (values, { resetForm }) => {
      const filteredValues = values.accommodations
        .filter((acc) => acc.amount > 0)
        .map((acc) => ({
          id: acc.id || null,
          amount: parseInt(acc.amount),
          guest: parseInt(acc.guest),
          min_stay: parseInt(minStay || 1),
          total: parseInt(acc.total),
          type: acc.type,
          dwellings: formData?.dwelling,
          note: "PER NIGHT",
        }));

      if (filteredValues.length === 0) {
        toast.warn(t("messages.required"));
        return;
      }
      try {
        const res = await modify(formData?.dwelling, filteredValues, "");

        if (![200, 201, 204].includes(res?.status)) {
          throw new Error(
            `Failed to save accommodation: ${accommodation.type}`
          );
        }

        onSuccess();
        resetForm();
        setExpanded({});
      } catch (error) {
        console.error("Error submitting form:", error);
      }

      setIsLoading(false);
    };

    const accommodationTypes = [
      { label: tType("SINGLE ROOMS"), value: "SINGLE ROOMS" },
      { label: tType("DOUBLE ROOMS"), value: "DOUBLE ROOMS" },
      { label: tType("SHARED ROOMS"), value: "SHARED ROOMS" },
      { label: tType("WHOLE ACCOMMODATION"), value: "WHOLE ACCOMMODATION" },
    ];

    const initializeAccommodationData = () => {
      return accommodationTypes.map((type) => {
        const existingData = data?.find((d) => d.type === type.value);
        return {
          id: existingData?.id || null,
          type: type.value,
          amount: existingData?.amount ? existingData.amount : 0,
          guest: existingData?.guest
            ? existingData.guest
            : type.value === "SINGLE ROOMS"
            ? 1
            : type.value === "DOUBLE ROOMS"
            ? 2
            : 0,
          total: existingData?.total ? existingData.total || 0 : 0,
        };
      });
    };

    useEffect(() => {
      if (data?.length === 0) {
        setMinStay(1);
      } else {
        setMinStay(data?.[0]?.min_stay);
      }
      const initialExpanded = {};
      accommodationTypes.forEach((type, idx) => {
        initialExpanded[type.value] =
          data?.[idx]?.amount > 0 ||
          (type.value === "SINGLE ROOMS" && data?.[0]?.amount > 0);
      });
      setExpanded(initialExpanded);
    }, [data]);

    return (
      <div className="tw:p-4 tw:bg-white tw:rounded-lg tw:shadow tw:border tw:border-gray-200 tw:min-w-flex">
        <h2 className="tw:text-lg tw:font-semibold tw:mb-4">
          Prices <span className="tw:text-red-500">*</span>
        </h2>
        <Formik
          initialValues={{
            accommodations: initializeAccommodationData(),
          }}
          validationSchema={priceSchema()}
          onSubmit={handleSubmit}
          innerRef={ref}
          enableReinitialize
        >
          {({ values, errors, dirty, setFieldValue }) => (
            <Form className="tw:space-y-4">
              {values.accommodations.map((acc, idx) => (
                <div
                  key={idx}
                  className="tw:p-4 tw:border tw:border-gray-300 tw:rounded-md"
                >
                  <label className="tw:flex tw:items-center tw:cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expanded[acc.type] || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setExpanded((prev) => ({
                          ...prev,
                          [acc.type]: isChecked,
                        }));
                        if (!isChecked) {
                          setFieldValue(`accommodations[${idx}].amount`, 0);
                          setFieldValue(`accommodations[${idx}].guest`, 0);
                          setFieldValue(`accommodations[${idx}].total`, 0);
                        } else {
                          setFieldValue(
                            `accommodations[${idx}].amount`,
                            acc.amount || 0
                          );
                          setFieldValue(
                            `accommodations[${idx}].guest`,
                            acc.guest ||
                              (acc.type === "SINGLE ROOMS"
                                ? 1
                                : acc.type === "DOUBLE ROOMS"
                                ? 2
                                : 0)
                          );
                          setFieldValue(
                            `accommodations[${idx}].total`,
                            acc.total || 0
                          );
                        }
                      }}
                      className="tw:mr-2 tw:text-blue-600 tw:focus:ring-blue-500"
                    />
                    <span className="tw:text-gray-700">
                      {accommodationTypes[idx].label}
                    </span>
                  </label>
                  {expanded[acc.type] && (
                    <div className="tw:mt-2 tw:ml-6 tw:grid tw:grid-cols-3 tw:gap-4">
                      <div>
                        <Input
                          type="number"
                          name={`accommodations[${idx}].amount`}
                          label={t("form.fields.price")}
                          value={acc.amount}
                          required
                          onChange={(e) =>
                            setFieldValue(
                              `accommodations[${idx}].amount`,
                              e.target.value
                            )
                          }
                          min={0}
                          className="tw:mt-1 tw:p-2 tw:w-full tw:border tw:border-gray-300 tw:rounded-md"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          name={`accommodations[${idx}].guest`}
                          label={t("form.fields.guest")}
                          value={acc.guest}
                          onChange={(e) =>
                            setFieldValue(
                              `accommodations[${idx}].guest`,
                              e.target.value
                            )
                          }
                          min={0}
                          className="tw:mt-1 tw:p-2 tw:w-full tw:border tw:border-gray-300 tw:rounded-md"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          name={`accommodations[${idx}].total`}
                          label={t("form.fields.rooms")}
                          value={acc.total}
                          onChange={(e) =>
                            setFieldValue(
                              `accommodations[${idx}].total`,
                              e.target.value
                            )
                          }
                          min={0}
                          className="tw:mt-1 tw:p-2 tw:w-full tw:border tw:border-gray-300 tw:rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="tw:p-4 tw:border tw:border-gray-300 tw:rounded-md">
                <Input
                  type="number"
                  name={"min_stay"}
                  label={t("form.fields.min_stay")}
                  value={minStay}
                  onChange={(e) => setMinStay(e.target.value)}
                  min={0}
                  className="tw:mt-1 tw:p-2 tw:w-full tw:border tw:border-gray-300 tw:rounded-md"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);

export default PriceForm;
