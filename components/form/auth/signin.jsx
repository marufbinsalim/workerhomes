"use client";

import Link from "@/components/common/Link";
import { authSchema } from "@/lib/validation/auth";
import { Form, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { signOut, useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const LoginForm = ({ locale }) => {
  // const { executeRecaptcha } = useGoogleReCaptcha()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const callbackUrl = `/${locale}`;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: authSchema.signIn,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);

      // if (!executeRecaptcha) {
      //   setIsLoading(false)
      //   return toast.error(t('message.recaptcha-not-ready'))
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
        //   return toast.error(t('message.recaptcha-failed'))
        // }

        // toast.success(t('message.recaptcha-success'))

        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
          callbackUrl: callbackUrl,
        });

        setIsLoading(false);

        if (!result.ok) {
          return toast.error(t("message.invalid"));
        }

        toast.success(t("message.success"));
        // router.refresh()
        // return router.push(`/${locale}`)

        location.reload(true);
        window.location.href = `/${locale}`;

        return true;
      } catch (error) {
        setIsLoading(false);
        toast.error(t("message.error"));
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      className="row y-gap-20"
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      <div className="col-12">
        <h1 className="text-22 fw-500">{t("title")}</h1>
        <p className="mt-10">
          {t("message.text")}{" "}
          <Link href="/signup" className="text-blue-1">
            {t("message.link")}
          </Link>
        </p>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input ">
          <input
            type="email"
            name="email"
            autoFocus
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            disabled={isLoading}
            required
          />
          <label className="lh-1 text-14 text-light-1">{t("form.email")}</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input ">
          <input
            type={showPassword ? "text" : "password"}
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
            {t("form.password")}

            <Icon
              className="cursor-pointer text-light-1"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              icon={
                showPassword ? "iconamoon:eye-off-duotone" : "ph:eye-duotone"
              }
            />
          </label>
        </div>
      </div>
      {/* End .col */}

      {/* <div className='col-12'>
        <a href='#' className='text-14 fw-500 text-blue-1 underline'>
          {t('form.forgot')}
        </a>
      </div> */}
      {/* End .col */}

      <div className="col-12">
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className="button py-20  -dark-1 bg-blue-1 text-white w-100"
        >
          {t("form.button")}{" "}
          <Icon
            icon={
              isLoading ? "line-md:loading-loop" : "solar:login-3-line-duotone"
            }
            className="ml-10"
            width={20}
            height={20}
          />
        </button>
      </div>
      {/* End .col */}

      <Link href="/forgot-password">{t("form.forgot")}</Link>
    </form>
  );
};

export default LoginForm;
