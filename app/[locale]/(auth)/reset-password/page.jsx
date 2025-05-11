import ResetForm from "@/components/authentication-v2/forgot/resetForm";
import SignInForm from "@/components/authentication-v2/signin/signinForm";
import Navbar from "@/components/common-v2/nav";
import ResetPasswordForm from "@/components/form/auth/reset-password";
import Wrapper from "@/components/layout/Wrapper";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import Link from "next/link";

export const metadata = {
  title: `Forgot Password || HomesWorkers - Find your best place with lower charges.`,
  description: `HomesWorkers - Find your best place with lower charges.`,
};

const ForgotPasswordPage = async ({ params }) => {
  const t = await getTranslations("forgot-password");

  return (
    <div className="tw:pt-[90px] font-primary">
      <Navbar />
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:p-4 tw:md:p-20 tw:gap-10">
        <div className="tw:md:flex-2/3 tw:flex tw:flex-col tw:items-center">
          <div className="tw:flex tw:flex-col tw:gap-4 tw:text-center">
            <div className="tw:flex tw:flex-col tw:gap-1">
              <h2 className="tw:text-[var(--color-font-dark)] tw:font-medium tw:text-[40px]">
                Reset Password
              </h2>
              <p className="tw:text-[var(--color-font-regular)] tw:m-0">
                Confirm Your New Password
              </p>
            </div>
            <div className="tw:md:hidden">
              <img
                src="/assets/forgot-illustration.png"
                alt="login illustration"
                className="tw:h-[20dvh] tw:m-auto tw:my-2.5"
              />
              <ResetForm locale={params.locale} />
            </div>
          </div>
          <img
            src="/assets/forgot-illustration.png"
            alt="login illustration"
            className="tw:w-max tw:hidden tw:md:block"
          />
        </div>

        {/* sign in form */}
        <div className="tw:hidden tw:md:block tw:flex-1/3 tw:pt-28">
          <ResetForm locale={params.locale} />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ForgotPasswordPage), {
  ssr: false,
});
