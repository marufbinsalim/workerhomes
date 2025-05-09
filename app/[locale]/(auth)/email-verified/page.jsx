import ForgotForm from "@/components/authentication-v2/forgot/forgotForm";
import Navbar from "@/components/common-v2/nav";
import Link from "@/components/common/Link";
import Wrapper from "@/components/layout/Wrapper";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

export const metadata = {
  title: `Forgot Password || HomesWorkers - Find your best place with lower charges.`,
  description: `HomesWorkers - Find your best place with lower charges.`,
};

const EmailVerifiedPage = async ({ params }) => {
  const t = await getTranslations("email-verified");

  return (
    <div className="tw:pt-[90px] font-primary">
      <Navbar />
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:p-4 tw:md:p-20 tw:gap-10">
        <div className="tw:md:flex-2/3 tw:flex tw:flex-col tw:items-center">
          <div className="tw:flex tw:flex-col tw:gap-1 tw:mb-2.5 tw:text-center">
            <h2 className="tw:text-[var(--color-font-dark)] tw:font-medium tw:text-[40px]">
              Thank You!
            </h2>
            <p className="tw:text-[var(--color-font-regular)] tw:m-0">
              Your email has been verified successfully. You can now
              <Link href="/login">
                <span className="tw:text-[var(--color-primary)] tw:hover:underline tw:mx-1">
                  Log-In
                </span>
              </Link>
              to your account
            </p>
          </div>
          <div className="tw:flex tw:flex-col tw:gap-4 tw:text-center">
            <div className="">
              <img
                src="/assets/login-illustration.png"
                alt="forgot illustration"
                className="tw:w-full tw:m-auto tw:my-2.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(EmailVerifiedPage), {
  ssr: false,
});
