"use client";

import { forgotPassword, signUp } from "@/lib/services/auth";
import { Icon } from "@iconify/react";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const ForgotForm = (params) => {
  const [email, setEmail] = useState("");
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(locale) {
    if (!email) {
      alert("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await forgotPassword(email);

      if (!res?.data) {
        throw new Error("Something went wrong");
      }
      alert("you have been sent an email!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setEmail("");
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
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:text-[var(--color-font-regular)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  tw:rounded-xl"
        />
      </div>

      <button
        onClick={async () => {
          await onSubmit(params.locale);
        }}
        className="tw:text-white tw:bg-[var(--color-primary)] tw:py-2.5 tw:px-5 tw:font-medium tw:w-max tw:min-w-[156px]"
      >
        Send Email
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

export default ForgotForm;
