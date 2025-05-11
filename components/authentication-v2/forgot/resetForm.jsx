"use client";

import { resetPassword } from "@/lib/services/auth";
import { Icon } from "@iconify/react";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const ResetForm = (params) => {
  const code = useSearchParams().get("code");
  const [isEyeClosed, setIsEyeClosed] = useState(true);
  const [isConfirmEyeClosed, setIsConfirmEyeClosed] = useState(true);
  const [passWord, setPassWord] = useState("");
  const [confirmPassWord, setConfirmPassWord] = useState("");
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(locale) {
    if (!passWord || !confirmPassWord) {
      alert("Please fill out all fields.");
      return;
    }

    if (passWord !== confirmPassWord) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(code, passWord, confirmPassWord);
      console.log(result);
      alert("Password reset successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setPassWord("");
      setConfirmPassWord("");
    }
  }

  return (
    <div className="tw:flex-1/3 tw:w-[90dvw] tw:md:w-full tw:text-left tw:flex tw:flex-col tw:gap-5">
      <div className="tw:w-full tw:flex tw:flex-col">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          New Password <span className="tw:text-[var(--color-red)]">*</span>
        </label>
        {isEyeClosed === false ? (
          <div className="tw:relative">
            <input
              value={passWord}
              onChange={(e) => {
                setPassWord(e.target.value);
              }}
              placeholder="Password"
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
              placeholder="Password"
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

      <div className="tw-w-full tw-flex tw-flex-col">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Confirm Password <span className="tw:text-[var(--color-red)]">*</span>
        </label>

        {isConfirmEyeClosed === false ? (
          <div className="tw:relative">
            <input
              value={confirmPassWord}
              onChange={(e) => {
                setConfirmPassWord(e.target.value);
              }}
              placeholder="Confirm Password"
              type="text"
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
            />
            <div className="tw:absolute tw:right-2 tw:top-1/2 tw:-translate-1/2">
              <EyeClosed
                onClick={(e) => {
                  setIsConfirmEyeClosed(true);
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
              placeholder="Confirm Password"
              type="password"
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
            />
            <div className="tw:absolute tw:right-2 tw:top-1/2 tw:-translate-1/2">
              <Eye
                onClick={(e) => {
                  setIsConfirmEyeClosed(false);
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
        Change Password
      </button>
      <p className="tw:text-[var(--color-font-regular)] tw:m-0 tw:my-2.5">
        Remembered Your Password?
        <Link href="/login">
          <span className="tw:text-[var(--color-primary)] tw:hover:underline tw:ml-1">
            Log in
          </span>
        </Link>
      </p>
    </div>
  );
};
export default ResetForm;
