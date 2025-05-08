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
              <p className="tw:text-[var(--color-font-regular)]">
                Login to your account to get started with our service
              </p>
            </div>
            <div className="tw:md:hidden">
              {JSON.stringify(params)}
              <SignInForm locale={params.locale} />
            </div>
            <p className="tw:text-[var(--color-font-regular)]">
              Don't Have an account?
              <Link href="sign-up">
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
        <div className="tw:hidden tw:md:block tw:flex-1/3">
          <SignInForm />
        </div>
      </div>
    </div>
  );
  return (
    <Wrapper>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                <LoginForm locale={params.locale} />
                {/* End .Login */}

                <div className="row y-gap-20 pt-30">
                  <div className="col-12">
                    <div className="text-center">{t("social.title")}</div>
                  </div>
                  <LoginWithSocial />
                  <div className="col-12">
                    <div className="text-center px-30">
                      {t("social.description")}
                    </div>
                  </div>
                </div>
                {/* End .row */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End login section */}

      {/* <CallToActions /> */}
      {/* End Call To Actions Section */}
    </Wrapper>
  );
};

export default dynamic(() => Promise.resolve(LogIn), { ssr: false });
