import CallToActions from "@/components/common/CallToActions";
import LoginForm from "@/components/form/auth/signin";
import LoginWithSocial from "@/components/common/LoginWithSocial";
import Wrapper from "@/components/layout/Wrapper";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import ReCaptchaProvider from "@/context/ReCaptchaProvider";

export const metadata = {
  title: `Login || WorkerHomes`,
  description: `HomesWorkers - Travel & Tour React NextJS Template`,
};

const LogIn = async ({ params }) => {
  const t = await getTranslations("login");

  return <div>a</div>;

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
