import Input from "@/components/common/Input";
import { update, verifyPassword } from "@/lib/services/user";
import { profilePWDSchema } from "@/lib/validation/profile";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2, Plus, Pencil } from "lucide-react";

const PasswordForm = ({ formData, onSuccess, cancelButton }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    password: false,
    confirmPassword: false,
  });
  const t = useTranslations("profile");
  const { data: session } = useSession();

  return (
    <Formik
      initialValues={{
        password: "",
        confirm_password: "",
        current_password: "",
      }}
      enableReinitialize={true}
      validationSchema={profilePWDSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true);

        try {
          const isPasswordValid = await verifyPassword({
            id: formData?.id,
            password: values?.current_password,
          });

          if (!isPasswordValid) {
            setIsLoading(false);
            return toast.error(t("messages.invalid-password"));
          }

          toast.success(t("messages.password-verified"));

          const res = await update(
            {
              password: values.password,
              id: formData?.id,
            },
            t("messages.update"),
          );

          if (res.status === 200 || res.status === 201) {
            onSuccess();
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
          <div className={"tw:grid"}>
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
                name="current_password"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Input
                action={{
                  icon: showPassword.password
                    ? "iconamoon:eye-off-duotone"
                    : "ph:eye-duotone",
                  onClick: () =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password: !showPassword.password,
                    })),
                }}
                label={t("form.field.password")}
                name="password"
                type={showPassword.password ? "text" : "password"}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Input
                action={{
                  icon: showPassword.confirmPassword
                    ? "iconamoon:eye-off-duotone"
                    : "ph:eye-duotone",
                  onClick: () =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirmPassword: !showPassword.confirmPassword,
                    })),
                }}
                label={t("form.field.confirm-password")}
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirm_password"
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
                  "tw:flex tw:items-center tw:gap-2 tw:bg-[var(--color-primary)] tw:text-white tw:px-4 tw:py-2 tw:rounded-md tw:transition hover:tw:bg-blue-700 disabled:tw:opacity-50"
                }
              >
                {t("control-panel.edit")}
                {isLoading ? (
                  <Loader2 className="tw:animate-spin" size={18} />
                ) : formData?.id ? (
                  <Pencil size={18} />
                ) : (
                  <Plus size={18} />
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordForm;
