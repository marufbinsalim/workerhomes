"use client";

import { resetPassword } from "@/lib/services/auth";
import { authSchema } from "@/lib/validation/auth";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "react-toastify";

const ResetPasswordForm = ({ locale }) => {
  const code = useSearchParams().get("code");
  // const { executeRecaptcha } = useGoogleReCaptcha()
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("reset-password");
  const searchParams = useSearchParams();
  const callbackUrl = `/${locale}`;

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: authSchema.resetPassword,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);

      // if (!executeRecaptcha) {
      //   setIsLoading(false)
      //   return toast.error(t('messages.recaptcha-not-ready'))
      // }

      try {
        // const token = await executeRecaptcha('login')

        // const recaptchaResponse = await fetch('/api/recaptcha', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ token }),
        // })

        // const recaptchaData = await recaptchaResponse.json()

        // if (!recaptchaData.success) {
        //   setIsLoading(false)
        //   return toast.error(t('messages.recaptcha-failed'))
        // }

        // toast.success(t('messages.recaptcha-success'))

        const result = await resetPassword(
          code,
          values.password,
          values.confirmPassword
        );

        // if (
        //   result.status !== 200 ||
        //   result.status !== 201 ||
        //   result.status !== 204
        // ) {
        //   setIsLoading(false)
        //   return toast.error(t('messages.failed'))
        // }

        toast.success(t("messages.success"));
        return router.push(`/${locale}/login`);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        toast.error(t("messages.error"));
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (!code) {
    return router.push(`/${locale}/`);
  }

  return (
    <form
      className="row y-gap-20"
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      <div className="col-12">
        <div className="form-input ">
          <input
            type={showPassword.password ? "text" : "password"}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            disabled={isLoading}
            required
          />

          <label
            style={{
              pointerEvents: "all",
            }}
            className="lh-1 text-14 text-light-1 w-100 d-flex justify-content-between "
          >
            {t("form.confirmPassword")}

            <Icon
              className="cursor-pointer text-light-1"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  password: !showPassword.password,
                }))
              }
              icon={
                showPassword.password
                  ? "iconamoon:eye-off-duotone"
                  : "ph:eye-duotone"
              }
            />
          </label>
        </div>
      </div>

      <div className="col-12">
        <div className="form-input ">
          <input
            type={showPassword.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            disabled={isLoading}
            required
          />

          <label
            style={{
              pointerEvents: "all",
            }}
            className="lh-1 text-14 text-light-1 w-100 d-flex justify-content-between "
          >
            {t("form.password")}

            <Icon
              className="cursor-pointer text-light-1"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirmPassword: !showPassword.confirmPassword,
                }))
              }
              icon={
                showPassword.confirmPassword
                  ? "iconamoon:eye-off-duotone"
                  : "ph:eye-duotone"
              }
            />
          </label>
        </div>
      </div>

      <div className="col-12">
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className="button py-20  -dark-1 bg-blue-1 text-white w-100"
        >
          {t("send")}{" "}
          <Icon
            icon={
              isLoading ? "line-md:loading-loop" : "material-symbols:lock-reset"
            }
            className="ml-10"
            width={20}
            height={20}
          />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default ResetPasswordForm;
