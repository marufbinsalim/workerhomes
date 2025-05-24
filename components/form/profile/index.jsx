import Checkbox from "@/components/common/Checkbox";
import ComboBox from "@/components/common/ComboBox";
import Divider from "@/components/common/Divider";
import Input from "@/components/common/Input";
import { spokenLanguages, url } from "@/config";
import { update } from "@/lib/services/user";
import { initProfile, profileSchema } from "@/lib/validation/profile";
import { Icon } from "@iconify/react";
import axios from "axios";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ProfileForm = ({ formData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("profile");
  const localeT = useTranslations("localizations");
  const { data: session, update: updateSession } = useSession();
  const locale = useParams().locale;
  const router = useRouter();

  const formattedLocales = spokenLanguages?.map((lang) => ({
    value: lang?.locale,
    id: lang?.id,
    label: lang?.[locale],
    selected: lang?.locale === formData?.locale,
  }));

  return (
    <Formik
      initialValues={initProfile(formData)}
      enableReinitialize={true}
      profileSchema
      validationSchema={profileSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true);

        try {
          const formattedValues = {
            ...values,
            name: `${values?.first_name || ""} ${values?.last_name || ""}`,
            id: formData?.id,
          };

          const res = await update(formattedValues, t("messages.update"));

          if (res.status === 200 || res.status === 201) {
            await updateSession({
              email: values?.email,
              name: `${values?.first_name || ""} ${values?.last_name || ""}`,
            });

            await axios.put(
              `${url}/api/stripe/customer/${formData?.stripe_customer_id}`,
              {
                name: `${values?.first_name || ""} ${values?.last_name || ""}`,
                email: values?.email,
                address: {
                  city: values?.address?.city,
                  country: values?.address?.country,
                  line1: values?.address?.street_one,
                  line2: values?.address?.street_two,
                  postal_code: values?.address?.zip_code,
                  state: values?.address?.state,
                },
              },
            );

            router.refresh();
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className="row x-gap-20 y-gap-20">
            <div className="col-md-6 col-sm-12">
              <Checkbox
                name="Private Account"
                label={
                  values?.businessAccount
                    ? t("form.field.business-account")
                    : t("form.field.private-account")
                }
                value={values?.businessAccount}
                onChange={(value) => {
                  setFieldValue("businessAccount", value);
                }}
                required
                yesLabel={t("form.field.business-account")}
                noLabel={t("form.field.private-account")}
              />
            </div>

            <div className="col-md-6" />

            <div className="col-6">
              <Input
                type="text"
                name="first_name"
                label={t("form.field.first_name")}
                required
              />
            </div>

            <div className="col-6">
              <Input
                type="text"
                name="last_name"
                label={t("form.field.last_name")}
                required
              />
            </div>

            {values?.businessAccount && (
              <>
                <div className="col-6">
                  <Input
                    type="text"
                    name="company"
                    label={t("form.field.company")}
                    required
                  />
                </div>

                <div className="col-6">
                  <Input
                    type="text"
                    name="vat_number"
                    label={t("form.field.vat")}
                    required
                  />
                </div>
              </>
            )}

            <div className="col-6">
              <Input
                type="text"
                name="email"
                label={t("form.field.email")}
                required
              />
            </div>

            <div className="col-6">
              <Input
                type="text"
                name="phone"
                label={t("form.field.phone")}
                required
              />
            </div>

            <div className="col-12">
              <Input
                required
                type="text"
                name="address.street_one"
                label={t("form.field.first_line")}
              />
            </div>

            <div className="col-4">
              <Input
                type="text"
                name="address.zip_code"
                label={t("form.field.zip")}
              />
            </div>

            <div className="col-4">
              <Input
                required
                type="text"
                name="address.city"
                label={t("form.field.city")}
              />
            </div>

            <div className="col-4">
              <Input
                required
                type="text"
                name="address.country"
                label={t("form.field.country")}
              />
            </div>

            <div className="col-4">
              <Input
                required
                type="select"
                options={formattedLocales}
                name="locale"
                label={t("form.field.spoken-language")}
              />
            </div>

            <div className="modal-footer">
              <button
                disabled={Object.keys(errors).length > 0 || isLoading}
                type="submit"
                className="col-auto button -sm bg-blue-1 text-white"
              >
                {t("control-panel.edit")}
                <Icon
                  icon={
                    isLoading
                      ? "line-md:loading-loop"
                      : formData?.id
                        ? "mage:edit-fill"
                        : "ph:plus-bold"
                  }
                  className="ml-10"
                  width={15}
                  height={15}
                />
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
