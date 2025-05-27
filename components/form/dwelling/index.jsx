import Checkbox from "@/components/common/Checkbox";
import ComboBox from "@/components/common/ComboBox";
import Input from "@/components/common/Input";
import SelectableOptions from "@/components/common/selectableOptions";
import TextEditor from "@/components/common/TextEditor";
import { api, roles } from "@/config";
import { create, translate, update } from "@/lib/services/dwelling";
import { create as CreateSubscription } from "@/lib/services/subscription";
import { dwellingSchema, initDwelling } from "@/lib/validation/dwelling";
import { genSlug, getLocales } from "@/utils";
import { Icon } from "@iconify/react";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DwellingForm = ({
  formData,
  onSuccess,
  locale,
  translation,
  session,
  defaultPackage,
  plan,
}) => {
  const [initData, setInitData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("dwelling-equipments");
  const tDwellings = useTranslations("dwellings");
  const tStatus = useTranslations("status");
  const localeT = useTranslations("localizations");
  const subscriptionId = useSearchParams().get("subscription");

  const localeOptions = getLocales(locale, formData?.localizations, localeT);
  const statusOptions = [
    { label: "Select Item", value: "", selected: true },
    { label: tStatus("PENDING"), value: "PENDING" },
    { label: tStatus("AVAILABLE"), value: "AVAILABLE" },
    { label: tStatus("RENT"), value: "RENT" },
  ];

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const formattedValues = {
        ...values,
        id: formData?.id ? formData?.id : null,
        guidline: values.guidline ? values?.guidline : null,
        isApproved: values?.status === "AVAILABLE" ? values?.isApproved : false,
        isFree: values?.subscription?.isFree,
        service_lang: session?.locale || "pl",
        owner:
          session?.role === roles.user
            ? session?.id
            : values?.amIOwner
              ? session?.id
              : null,
        seo: [
          {
            metaTitle: values.title,
            metaDescription: values.description?.slice(0, 160),
            metaImage: values?.images?.[0] || null,
            keywords: values.title,
            canonicalURL: api + "/dwellings/" + values.slug,
            locale: values.locale,
          },
        ],
      };

      if (!formattedValues?.subscription?.id) {
        delete formattedValues?.subscription;
      }

      if (!formattedValues?.amenities) {
        delete formattedValues?.amenities;
      }

      let res = null;

      if (formData?.id && !translation) {
        res = await update(formattedValues, t("messages.update"));
      } else if (formData?.id && translation) {
        res = await translate(
          {
            ...initData,
            ...formattedValues,
          },
          t("messages.translate"),
        );
      } else {
        let subId = null;

        if (
          values?.package?.id &&
          values?.package?.isFree === true &&
          values?.package?.price === 0
        ) {
          const { data } = await CreateSubscription({
            user: session?.id,
            package: values?.package?.id,
            start_date: new Date(),
            end_date: null,
            stripe_product_id: values?.package?.stripe_product_id,
            stripe_customer_id: session?.stripe_customer_id,
            payment_status: "active",
            payment_currency: "PLN",
            payment_method: "automatic",
            payment_amount: "0",
            isFree: true,
          });

          subId = data?.data?.id;
        }

        res = await create(
          {
            ...formattedValues,
            locale,
            isMainItem: true,
            status: "PENDING",
            user: session?.id,
            subscription: subId ? subId : null,
          },
          t("messages.create"),
        );
      }

      if (res.status === 200 || res.status === 201) {
        onSuccess && onSuccess(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData?.id && translation) {
      const newObject = {
        ...formData,
      };

      delete newObject?.category;
      delete newObject?.amenities;
      delete newObject?.features;
      delete newObject?.title;
      delete newObject?.description;
      delete newObject?.slug;

      setInitData(newObject);
    }
  }, [formData?.id]);

  return (
    <Formik
      initialValues={
        initDwelling({
          ...formData,
          package: formData?.package ? formData?.package : defaultPackage,
        }) || {}
      }
      enableReinitialize={true}
      validationSchema={dwellingSchema()}
      onSubmit={handleSubmit}
    >
      {({
        dirty,
        values,
        errors,
        touched,
        setTouched,
        setFieldValue,
        submitForm,
      }) => {
        return (
          <Form>
            <div className="tw:mb-8 font-secondary">
              <h2 className="tw:text-[20px] tw:font-semibold tw:mb-2 tw:text-[var(--color-font-dark)]">Listing Details</h2>
              <p className="tw:text-[var(--color-font-regular)] tw:text-[14px] tw:font-normal">Provide your details for the listing</p>
            </div>
            <div className="tw:flex tw:flex-col tw:md:flex-row tw:w-full tw:gap-6 font-secondary">
              {/* Left Column */}
              <div className="tw:flex tw:flex-col tw:gap-6 tw:flex-1 tw:max-w-[74vw] tw:md:max-w-[35vw] tw:h-min">
                {translation && (
                  <div className="tw:w-full ">
                    <Input
                      label={tDwellings("form.field.translate")}
                      name="locale"
                      type="select"
                      options={localeOptions}
                      required
                    />
                  </div>
                )}

                {(values?.package?.id && !formData?.id) ||
                !values?.package?.id ? (
                  <div className="tw:w-full ">
                    {!plan && (
                      <ComboBox
                        onChange={(item) => setFieldValue("package", item)}
                        label={tDwellings("form.field.plan")}
                        value={values?.package}
                        placeholder={tDwellings("form.field.search")}
                        url="/api/packages"
                        name="package"
                        keyValue="name"
                        symbol="zł"
                        params={{
                          sort: ["order:desc"],
                        }}
                        disabled={defaultPackage ? true : false}
                        extraKeys={["price"]}
                        setTouched={setTouched}
                        error={
                          errors.package && touched.package
                            ? errors.package
                            : ""
                        }
                        required
                      />
                    )}
                  </div>
                ) : null}

                <div className="tw:w-full">
                  <ComboBox
                    onChange={(item) => setFieldValue("category", item)}
                    label={tDwellings("form.field.category")}
                    value={values?.category}
                    placeholder={tDwellings("form.field.search2")}
                    url="/api/categories"
                    locale={values?.locale || locale}
                    name="category"
                    keyValue="title"
                    setTouched={setTouched}
                    error={
                      errors.category && touched.category ? errors.category : ""
                    }
                    required
                  />
                </div>

                <div className="tw:w-full">
                  <Input
                    type="text"
                    name="title"
                    label={tDwellings("form.field.title")}
                    onChange={(e) => {
                      setFieldValue("slug", genSlug(e.target.value));
                      setFieldValue("title", e.target.value);
                    }}
                    required
                  />
                </div>

                <div className="tw:w-full">
                  <div className="tw:flex tw:justify-between tw:items-center tw:w-full">
                    <span className="tw:font-medium tw:text-[14px] tw:text-[var(--color-font-dark)]">{tDwellings("form.field.description")}
                      <span className="tw:text-red-500 tw:ml-1">*</span>
                    </span>
                  </div>
                  <TextEditor
                    ignoreMediaImport
                    initialData={values?.description}
                    name="description"
                    onChange={(value) => setFieldValue("description", value)}
                    error={errors?.description ? errors?.description : ""}
                    setTouched={setTouched}
                  />
                </div>

                {!formData?.owner?.id && session?.role === roles.admin && (
                  <div className="tw:w-full">
                    <Checkbox
                      name="amIOwner"
                      label={tDwellings("form.field.owner")}
                      value={values?.amIOwner}
                      onChange={(value) => {
                        setFieldValue("amIOwner", value);
                      }}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="tw:flex-1 tw:flex tw:flex-col font-secondary tw:gap-6">
                <div className="tw:w-full">
                  <div className="tw:mb-2">
                    <label className="tw:font-medium tw:text-[14px] tw:text-[var(--color-font-dark)]">
                      Select Features and Amenities
                      <span className="tw:text-red-500 tw:ml-1">*</span>
                    </label>
                    <p className="tw:font-normal tw:text-[14px] tw:text-[var(--color-font-regular)]">
                      Choose amenities and Features you want to add to your
                      listing
                    </p>
                  </div>
                  <div className="tw:flex tw:flex-col tw:gap-3">
                    <SelectableOptions
                      onChange={(item) => setFieldValue("features", item)}
                      label=""
                      values={values?.features}
                      url="/api/features"
                      locale={values?.locale || locale}
                      name="features"
                      keyValue="title"
                      error={
                        errors?.features && touched?.features
                          ? errors?.features
                          : ""
                      }
                      setTouched={setTouched}
                      required
                    />
                    <SelectableOptions
                      onChange={(item) => setFieldValue("amenities", item)}
                      label=""
                      values={values?.amenities}
                      url="/api/amenities"
                      locale={values?.locale || locale}
                      name="amenities"
                      keyValue="title"
                      error={errors?.amenities}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="tw:flex font-secondary tw:justify-start tw:gap-3 tw:mt-6">
              <button
                type="reset"
                className="tw:flex tw:items-center tw:px-4 tw:py-2 tw:border tw:border--[var(--color-primary)] tw:font-semibold tw:text-[14px] tw:text-[var(--color-primary)]"
              >
                {tDwellings("control-panel.reset")}
                <Icon icon="bi:x" className="tw:ml-2 tw:font-bold" width={28}
                  height={28} />
              </button>
              <button
                disabled={Object.keys(errors).length > 0 || isLoading}
                onClick={() => {
                  if (!dirty && !formData?.id) {
                    onSuccess && onSuccess();
                  } else {
                    submitForm();
                  }
                }}
                type="button"
                className="tw:flex tw:items-center tw:px-4 tw:py-2 tw:bg-orange-500 tw:text-white  tw:font-semibold tw:text-[14px]tw:hover:bg-orange-600 tw:disabled:bg-gray-400"
              >
                {tDwellings("control-panel.next2")}
                <Icon
                  icon={
                    isLoading ? "line-md:loading-loop" : "ph:arrow-right-bold"
                  }
                  className="tw:ml-2  tw:font-bold"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DwellingForm;
