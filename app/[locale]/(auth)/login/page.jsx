import CallToActions from "@/components/common/CallToActions";
import LoginForm from "@/components/form/auth/signin";
import LoginWithSocial from "@/components/common/LoginWithSocial";
import Wrapper from "@/components/layout/Wrapper";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import Link from "next/link";
import SignInForm from "@/components/authentication-v2/signin/signinForm";
import Navbar from "@/components/common-v2/nav";

export const metadata = {
  title: `Login || WorkerHomes`,
  description: `HomesWorkers - Travel & Tour React NextJS Template`,
};

const LogIn = async ({ params }) => {
  const t = await getTranslations("login");

  return (
    <div className="tw:pt-[90px] font-primary">
      <Navbar />
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:p-4 tw:md:p-20 tw:gap-10">
        <div className="tw:md:flex-2/3 tw:flex tw:flex-col tw:items-center">
          <div className="tw:flex tw:flex-col tw:gap-4 tw:text-center">
            <div className="tw:flex tw:flex-col tw:gap-1">
              <h2 className="tw:text-[var(--color-font-dark)] tw:font-medium tw:text-[40px]">
                Login to your account
              </h2>
              <p className="tw:text-[var(--color-font-regular)] tw:m-0">
                Login to your account to get started with our service
              </p>
            </div>
            <div className="tw:md:hidden">
              <img
                src="/assets/login-illustration.png"
                alt="login illustration"
                className="tw:h-[20dvh] tw:m-auto tw:my-2.5"
              />
              <SignInForm locale={params.locale} />
            </div>
            <p className="tw:text-[var(--color-font-regular)] tw:m-0">
              Don't Have an account?
              <Link href="/signup">
                <span className="tw:text-[var(--color-primary)] tw:hover:underline tw:ml-1">
                  Sign up now
                </span>
              </Link>
            </p>
          </div>
          <img
            src="/assets/login-illustration.png"
            alt="login illustration"
            className="tw:w-max tw:hidden tw:md:block"
          />
        </div>

        {/* sign in form */}
        <div className="tw:hidden tw:md:block tw:flex-1/3 tw:pt-28">
          <SignInForm locale={params.locale} />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(LogIn), { ssr: false });
