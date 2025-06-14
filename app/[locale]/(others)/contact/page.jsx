import dynamic from "next/dynamic";
import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/header/default-header";
import DefaultFooter from "@/components/footer/default";
import WhyChoose from "@/components/block/BlockGuide";
import Address from "@/components/block/Address";
import Social from "@/components/common/social/Social";
import LocationTopBar from "@/components/common/LocationTopBar";
import Wrapper from "@/components/layout/Wrapper";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact-page-v2/form";
import ReCaptchaProvider from "@/context/ReCaptchaProvider";
import Header3 from "@/components/header/header-3";
import Footer3 from "@/components/footer/footer-3";
import ContactInfo from "@/components/contact-page-v2/info";
import Footer from "@/components/common-v2/footer";
import Navbar from "@/components/common-v2/nav";
import { getCurrentUser } from "@/lib/session";
import { useTranslations } from "next-intl";


export const metadata = {
  title: "Contact || Wokerhomes",
  description: "Contact Workerhomes Support Team!",
};


const Contact = async () => {
  const t = await getTranslations("contactUs");
  const session = (await getCurrentUser()) || null;

  return (
    <div className="tw:pt-[90px]">
      <Navbar session={session} />
      <div className="tw:relative tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-10 tw:text-center tw:gap-2 font-primary tw:px-10">
        <img
          src={"/assets/contact/pattern.png"}
          alt="pattern"
          className="tw:absolute tw:right-0 tw:bottom-0 tw:w-[60dvw] tw:md:w-auto"
        />
        <h1 className="tw:font-semibold tw:text-5xl tw:text-[var(--color-font-dark)] tw:max-w-4xl">
          {t("title")}
        </h1>
        <p className="tw:text-[var(--color-font-regular)]">
          {t("subtitle")}
        </p>
      </div>

      <div className="tw:flex tw:flex-col-reverse tw:gap-10 tw:md:flex-row tw:px-10 tw:py-5 tw:md:px-20 tw:md:py-10">
        <ContactInfo />
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Contact), { ssr: false });
