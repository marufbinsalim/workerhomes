import InvoicePage from "@/components/pages/invoice";
import MessengerPage from "@/components/pages/messenger";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "invoice" });

  return {
    title: t("title"),
  };
}

export default dynamic(
  () =>
    Promise.resolve(({ params: { locale } }) => (
      <MessengerPage locale={locale} />
    )),
  {
    ssr: false,
  },
);
