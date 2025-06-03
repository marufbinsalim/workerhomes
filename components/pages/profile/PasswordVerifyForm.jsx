import Input from "@/components/common/Input";
import { verifyPassword } from "@/lib/services/user";
import { profilePWDVerifySchema } from "@/lib/validation/profile";
import { Icon } from "@iconify/react";
import { Form, Formik } from "formik";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

const PasswordVerifiedForm = ({ formData, onSuccess, cancelButton }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    password: false,
    confirmPassword: false,
  });
  const t = useTranslations("profile");

  return (
    <Formik
      initialValues={{
        password: "",
        confirm_password: "",
      }}
      enableReinitialize={true}
      validationSchema={profilePWDVerifySchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true);

        try {
          const isPasswordValid = await verifyPassword({
            id: formData?.id,
            password: values?.password,
          });

          if (!isPasswordValid) {
            setIsLoading(false);
            return toast.error(t("messages.invalid-password"));
          } else {
            toast.success(t("messages.password-verified"));
            onSuccess(true);
            resetForm();
          }
        } catch (error) {
          if (error.response?.status === 400) {
            toast.error(t("messages.invalid-password"));
            resetForm();
          }
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ dirty, errors }) => (
        <Form>
          <div className={"tw:grid tw:grid-cols-1"}>
            <div>
              <Input
                action={{
                  icon: showPassword.currentPassword
                    ? "iconamoon:eye-off-duotone"
                    : "ph:eye-duotone",
                  onClick: () =>
                    setShowPassword((prev) => ({
                      ...prev,
                      currentPassword: !showPassword.currentPassword,
                    })),
                }}
                label={t("form.field.current-password")}
                type={showPassword.currentPassword ? "text" : "password"}
                name="password"
                disabled={isLoading}
                required
              />
            </div>

            <div className={"tw:flex tw:justify-end"}>
              {cancelButton}
              <button
                disabled={!dirty || Object.keys(errors).length > 0 || isLoading}
                type="submit"
                className={
                  "tw:bg-[#FE475B] tw:text-white tw:px-4 tw:py-2 tw:rounded-md tw:mr-2 tw:flex tw:items-center"
                }
              >
                <Trash className="tw:mr-2" size={16} />
                Confirm Delete
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordVerifiedForm;
