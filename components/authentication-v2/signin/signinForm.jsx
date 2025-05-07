"use client";

export default function SignInForm() {
  return (
    <div className="tw:flex-1/3 tw:w-full">
      <div className="tw:w-full">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Email <span className="tw:text-[var(--color-red)]">*</span>
        </label>
        <input
          placeholder="Email"
          type="text"
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[var(--color-primary)] tw:rounded-xl"
        />
      </div>
      <div className="tw:w-full">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Password <span className="tw:text-[var(--color-red)]">*</span>
        </label>
        <div className="tw:relative">
          <input
            placeholder="Password"
            type="password"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:p-[10px] tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[var(--color-primary)] tw:rounded-xl"
          />
          <div className="tw:absolute tw:right-0.5 tw:top-1/2 tw:-translate-x-1/2">
            a
          </div>
        </div>
      </div>
    </div>
  );
}
