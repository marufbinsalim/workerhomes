"use client";

import { signUp } from "@/lib/services/auth";
import { Icon } from "@iconify/react";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useTranslations } from 'next-intl'
import { showToast } from "@/components/toast/Toast";

const SignUpForm = (params) => {
  const [isEyeClosed, setIsEyeClosed] = useState(true);
  const [isEyeClosedConfirm, setIsEyeClosedConfirm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [confirmPassWord, setConfirmPassWord] = useState("");
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const t = useTranslations('authentication.signup');

  const validateEmailFormat = (email) => {
    // Basic regex for email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  async function onSubmit(locale) {
    if (!firstName || !lastName || !email || !passWord || !confirmPassWord) {
      showToast('info', t('toast.missingFields'));
      return;
    }

    if (passWord !== confirmPassWord) {
      showToast('info', t('toast.passwordMismatch'));
      return;
    }

    if (!validateEmailFormat(email)) {
      showToast('info', t('toast.invalidEmail'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await signUp({
        first_name: firstName,
        last_name: lastName,
        identifier: email,
        password: passWord,
      });

      console.log(res, "res");

      if (!res?.data) {
        throw new Error("Something went wrong");
      }

      showToast('success', t('toast.success'));
      router.push(`/${locale}/dashboard`); // Redirect after successful registration
    } catch (error) {
      console.error(error);
      showToast('failure', t('toast.error'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="tw:flex-1/3 tw:w-full tw:text-left tw:flex tw:flex-col tw:gap-5">
      <div className="tw:w-full tw:flex tw:gap-5">
        <div className="tw:w-full tw:flex tw:flex-col">
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            {t('firstname')} <span className="tw:text-[var(--color-red)]">*</span>
          </label>
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder={t('firstnamePlaceholder')}
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
          />
        </div>

        <div className="tw:w-full tw:flex tw:flex-col">
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            {t('lastname')} <span className="tw:text-[var(--color-red)]">*</span>
          </label>
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder={t('lastnamePlaceholder')}
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
          />
        </div>
      </div>

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
      <div className="tw:w-full tw:flex tw:flex-col">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          {t('confirmPassword')} <span className="tw:text-[var(--color-red)]">*</span>
        </label>
        {isEyeClosedConfirm === false ? (
          <div className="tw:relative">
            <input
              value={confirmPassWord}
              onChange={(e) => {
                setConfirmPassWord(e.target.value);
              }}
              placeholder={t('confirmPasswordPlaceholder')}
              type="text"
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
            />
            <div className="tw:absolute tw:right-2 tw:top-1/2 tw:-translate-1/2">
              <EyeClosed
                onClick={(e) => {
                  setIsEyeClosedConfirm(true);
                }}
                className="h-[16px] w-[22px] tw:text-[var(--color-font-regular)] tw:cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="tw:relative">
            <input
              value={confirmPassWord}
              onChange={(e) => {
                setConfirmPassWord(e.target.value);
              }}
              placeholder={t('confirmPasswordPlaceholder')}
              type="password"
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
            />
            <div className="tw:absolute tw:right-2 tw:top-1/2 tw:-translate-1/2">
              <Eye
                onClick={(e) => {
                  setIsEyeClosedConfirm(false);
                }}
                className="h-[16px] w-[22px] tw:text-[var(--color-font-regular)] tw:cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={async () => {
          await onSubmit(params.locale);
        }}
        className="tw:text-white tw:bg-[var(--color-primary)] tw:py-2.5 tw:px-5 tw:font-medium tw:w-max tw:min-w-[156px]"
      >
        {t('signupButton')}
      </button>

      <p className="tw:text-[var(--color-font-regular)] tw:m-0 tw:my-2.5">
        {t('alreadyHaveAccount')}
        <Link href="/login">
          <span className="tw:text-[var(--color-primary)] tw:hover:underline tw:ml-1">
            {t('login')}
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

export default SignUpForm;