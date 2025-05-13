"use client";

import { Icon } from "@iconify/react";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useTranslations } from 'next-intl';
import { showToast } from "@/components/toast/Toast";

const SignInForm = (params) => {
  const [isEyeClosed, setIsEyeClosed] = useState(true);
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const [emailError, setEmailError] = useState('');


  const t = useTranslations('authentication.signin');

  const validateEmailFormat = (email) => {
    // Basic regex for email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };



  async function onSubmit(locale) {
    console.log(locale, "locale");

    if (!validateEmailFormat(email)) {
      showToast('info', t('toast.invalidEmail')); 
      return;
    }
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: passWord,
    });

    setIsLoading(false);

    if (!result.ok) {
      showToast('failure', t('toast.error'));
    } else {
      showToast('success', t('toast.success'));
      router.push(`/${locale}/dashboard/statistics`);
    }
  }

  return (
    <div className="tw:flex-1/3 tw:w-full tw:text-left tw:flex tw:flex-col tw:gap-5">
      <div className="tw:w-full tw:flex tw:flex-col">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          {t('email')} <span className="tw:text-[var(--color-red)]">*</span>
        </label>

        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder={t('emailPlaceholder')}
          type="text"
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
        />
      </div>
      <div className="tw:w-full tw:flex tw:flex-col">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          {t('password')} <span className="tw:text-[var(--color-red)]">*</span>
        </label>
        {isEyeClosed === false ? (
          <div className="tw:relative">
            <input
              value={passWord}
              onChange={(e) => {
                setPassWord(e.target.value);
              }}
              placeholder={t('passwordPlaceholder')}
              type="text"
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
            />
            <div className="tw:absolute tw:right-2 tw:top-1/2 tw:-translate-1/2">
              <EyeClosed
                onClick={(e) => {
                  setIsEyeClosed(true);
                }}
                className="h-[16px] w-[22px] tw:text-[var(--color-font-regular)] tw:cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="tw:relative">
            <input
              value={passWord}
              onChange={(e) => {
                setPassWord(e.target.value);
              }}
              placeholder={t('passwordPlaceholder')}
              type="password"
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
            />
            <div className="tw:absolute tw:right-2 tw:top-1/2 tw:-translate-1/2">
              <Eye
                onClick={(e) => {
                  setIsEyeClosed(false);
                }}
                className="h-[16px] w-[22px] tw:text-[var(--color-font-regular)] tw:cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
      <div className="tw:flex tw:items-center tw:justify-between ">
        <div className="tw:flex tw:gap-2 ">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            value="remember"
            onChange={(e) => {
              setRemember(e.target.checked);
            }}
          />
          <label htmlFor="remember">{t('rememberMe')}</label>
        </div>
        <div className="tw:h-full tw:flex tw:items-center tw:justify-center">
          <Link href="/forgot-password">
            <p className="tw:m-0 tw:text-[var(--color-font-regular)] tw:underline">
              {t('forgotPassword')}
            </p>
          </Link>
        </div>
      </div>
      <button
        onClick={async () => {
          await onSubmit(params.locale);
        }}
        className="tw:text-white tw:bg-[var(--color-primary)] tw:py-2.5 tw:px-5 tw:font-medium tw:w-max tw:min-w-[156px]"
      >
        {t('loginButton')}
      </button>

      <p className="tw:text-[var(--color-font-regular)] tw:m-0 tw:my-2.5">
        {t('dontHaveAccount')}
        <Link href="/signup">
          <span className="tw:text-[var(--color-primary)] tw:hover:underline tw:ml-1">
            {t('signup')}
          </span>
        </Link>
      </p>

      <div className="tw:flex tw:items-center tw:gap-2">
        <div className="tw:flex-1 tw:h-[1px] tw:bg-[var(--color-border-light)]" />
        <p className="tw:m-0 tw:text-[16px] tw:text-[var(--color-font-light)]">
          {t('or')}
        </p>
        <div className="tw:flex-1 tw:h-[1px] tw:bg-[var(--color-border-light)]" />
      </div>
      <button
        className="tw:rounded-[36px] tw:bg-[var(--color-white-grey)] tw:flex tw:items-center tw:justify-center tw:h-10"
        onClick={() => signIn("google", { callbackUrl: `/${params.locale}` })}
      >
        <Icon icon="devicon:google" className="mr-10" />
        {t('loginWithGoogle')}
      </button>
    </div>
  );
};

export default SignInForm;