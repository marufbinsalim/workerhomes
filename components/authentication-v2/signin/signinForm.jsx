"use client";

import { Icon } from "@iconify/react";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const SignInForm = (params) => {
  const [isEyeClosed, setIsEyeClosed] = useState(true);
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(locale) {
    console.log(locale, "locale");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: passWord,
    });

    setIsLoading(false);

    if (!result.ok) {
      alert("Invalid credentials. Please try again.");
    } else {
      router.push(`/${locale}/dashboard/statistics`);
    }
  }

  return (
    <div className="tw:flex-1/3 tw:w-full tw:text-left tw:flex tw:flex-col tw:gap-5">
      <div className="tw:w-full tw:flex tw:flex-col">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Email <span className="tw:text-[var(--color-red)]">*</span>
        </label>

        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          type="text"
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[var(--color-primary)] tw:rounded-xl"
        />
      </div>
      <div className="tw:w-full tw:flex tw:flex-col">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Password <span className="tw:text-[var(--color-red)]">*</span>
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
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[var(--color-primary)] tw:rounded-xl"
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
              className="tw:w-full tw:bg-[var(--color-white-grey)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[var(--color-primary)] tw:rounded-xl"
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
          <label for="remember"> Remember Me</label>
        </div>
        <div className="tw:h-full tw:flex tw:items-center tw:justify-center">
          <p className="tw:m-0 tw:text-[var(--color-font-regular)] tw:underline">
            Forgot your password?
          </p>
        </div>
      </div>
      <button
        onClick={async () => {
          await onSubmit(params.locale);
        }}
        className="tw:text-white tw:bg-[var(--color-primary)] tw:py-2.5 tw:px-5 tw:font-medium tw:w-max tw:min-w-[156px]"
      >
        Login
      </button>
      <div className="tw:flex tw:items-center tw:gap-2">
        <div className="tw:flex-1 tw:h-[1px] tw:bg-[var(--color-border-light)]" />
        <p className="tw:m-0 tw:text-[16px] tw:text-[var(--color-font-light)]">
          or
        </p>
        <div className="tw:flex-1 tw:h-[1px] tw:bg-[var(--color-border-light)]" />
      </div>
      <button className="tw:rounded-[36px] tw:bg-[var(--color-white-grey)] tw:flex tw:items-center tw:justify-center tw:h-10">
        <Icon icon="devicon:google" className="mr-10" />
        Login With Google
      </button>
    </div>
  );
};
export default SignInForm;
