import dynamic from "next/dynamic";
import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/header/default-header";
import DefaultFooter from "@/components/footer/default";
import LoginWithSocial from "@/components/common/LoginWithSocial";

import Wrapper from "@/components/layout/Wrapper";
import { getTranslations } from "next-intl/server";
import ReCaptchaProvider from "@/context/ReCaptchaProvider";
import SignInForm from "@/components/authentication-v2/signin/signinForm";
import Navbar from "@/components/common-v2/nav";
import Link from "next/link";
import SignUpForm from "@/components/authentication-v2/signup/signupForm";

export const metadata = {
  title: "Sign Up || Workerhomes",
  description: "Sign up to Workerhomes to get access to all the features",
};

const SignUp = async ({ params }) => {
  const t = await getTranslations("register");

  return (
    <div className="tw:pt-[90px] font-primary">
      <Navbar />
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:p-4 tw:md:p-20 tw:gap-10">
        <div className="tw:md:flex-2/3 tw:flex tw:flex-col tw:items-center">
          <div className="tw:flex tw:flex-col tw:gap-4 tw:text-center">
            <div className="tw:flex tw:flex-col tw:gap-1">
              <h2 className="tw:text-[var(--color-font-dark)] tw:font-medium tw:text-[40px]">
                Create your account
              </h2>
              <p className="tw:text-[var(--color-font-regular)] tw:m-0">
                Let’s get you started with your account
              </p>
            </div>
            <div className="tw:md:hidden">
              <img
                src="/assets/login-illustration.png"
                alt="login illustration"
                className="tw:h-[20dvh] tw:m-auto tw:my-5"
              />
              <SignUpForm locale={params.locale} />
            </div>
          </div>
          <img
            src="/assets/login-illustration.png"
            alt="login illustration"
            className="tw:w-max tw:hidden tw:md:block"
          />
        </div>

        {/* sign in form */}
        <div className="tw:hidden tw:md:block tw:flex-1/3">
          <SignUpForm locale={params.locale} />
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
  //                 <SignUpForm />
  //               </ReCaptchaProvider>
  //               {/* End SignUP */}

  //               {/* <div className='row y-gap-20 pt-30'>
  //                 <div className='col-12'>
  //                   <div className='text-center'>{t('social.title')}</div>
  //                 </div>
  //                 <LoginWithSocial />
  //                 <div className='col-12'>
  //                   <div className='text-center px-30'>
  //                     {t('social.description')}
  //                   </div>
  //                 </div>
  //               </div> */}
  //               {/* End .row */}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //     {/* End login section */}

  //     {/* <CallToActions /> */}
  //     {/* End Call To Actions Section */}
  //   </Wrapper>
  // );
};

export default dynamic(() => Promise.resolve(SignUp), { ssr: false });
