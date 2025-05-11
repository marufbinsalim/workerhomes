import ForgotForm from "@/components/authentication-v2/forgot/forgotForm";
import SignInForm from "@/components/authentication-v2/signin/signinForm";
import Navbar from "@/components/common-v2/nav";
import LoginWithSocial from "@/components/common/LoginWithSocial";
import ForgotPasswordForm from "@/components/form/auth/forgot-password";
import Wrapper from "@/components/layout/Wrapper";
import ReCaptchaProvider from "@/context/ReCaptchaProvider";
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
            <div className="tw:md:hidden">
              <img
                src="/assets/forgot-illustration.png"
                alt="forgot illustration"
                className="tw:h-[20dvh] tw:m-auto tw:my-2.5"
              />
              <div className="tw:flex tw:flex-col tw:gap-1 tw:mb-2.5">
                <h2 className="tw:text-[var(--color-font-dark)] tw:font-medium tw:text-[40px]">
                  Forgot your password?
                </h2>
                <p className="tw:text-[var(--color-font-regular)] tw:m-0">
                  Enter your email to receive your link to reset your password
                </p>
              </div>
              <ForgotForm locale={params.locale} />
            </div>
          </div>
          <img
            src="/assets/forgot-illustration.png"
            alt="forgot illustration"
            className="tw:w-max tw:hidden tw:md:block"
          />
        </div>

        {/* sign in form */}
        <div className="tw:hidden tw:md:block tw:flex-1/3 tw:pt-10">
          <div className="tw:flex tw:flex-col tw:gap-1 tw:mb-10 tw:text-center">
            <h2 className="tw:text-[var(--color-font-dark)] tw:font-medium tw:text-[40px]">
              Forgot your password?
            </h2>
            <p className="tw:text-[var(--color-font-regular)] tw:m-0">
              Enter your email to receive your link to reset your password
            </p>
          </div>
          <ForgotForm />
        </div>
      </div>
    </div>
  );

  // return (
  //   <Wrapper>
  //     {/* End Page Title */}

  //     <div className="header-margin"></div>
  //     {/* header top margin */}

  //     <section className="layout-pt-lg layout-pb-lg bg-blue-2">
  //       <div className="container">
  //         <div className="row justify-center">
  //           <div className="col-xl-6 col-lg-7 col-md-9">
  //             <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
  //               <ReCaptchaProvider>
  //                 <ForgotPasswordForm locale={params.locale} />
  //               </ReCaptchaProvider>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   </Wrapper>
  // );
};

export default dynamic(() => Promise.resolve(ForgotPasswordPage), {
  ssr: false,
});
