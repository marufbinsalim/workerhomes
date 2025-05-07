"use client";

import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignInForm() {
  const [isEyeClosed, setIsEyeClosed] = useState(true);
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");

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
      <div className="tw:flex tw:items-center tw:justify-between tw:bg-amber-300">
        <div className="tw:flex tw:gap-2 tw:bg-amber-50">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            value="remember"
            onChange={(e) => {
              console.log(e);
            }}
          />
          <label for="remember"> Remember Me</label>
        </div>
        <div className="tw:bg-blue-50 tw:flex tw:items-center tw:justify-center tw:h-min">
          <p className="tw:bg-red-500 tw:block tw:mt-auto">
            Forgot your password?
          </p>
        </div>
      </div>
      <button className="tw:text-white tw:bg-[var(--color-primary)] tw:py-2.5 tw:px-5 tw:font-medium tw:w-max tw:min-w-[156px]">
        Login
      </button>
    </div>
  );
}
