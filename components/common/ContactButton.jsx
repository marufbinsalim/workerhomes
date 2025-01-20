import ContactForm from "@/components/form/dwelling/contact";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import React from "react";
import Modal from "./Modal";
import ReCaptchaProvider from "@/context/ReCaptchaProvider";

const ContactButton = ({ dwelling }) => {
  const t = useTranslations("listing-contact");
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
        className="button px-24 h-50 -dark-1 bg-blue-1 text-white"
      >
        {t("create")}
        <Icon icon="dashicons:phone" className="ml-10" />
      </button>

      <ReCaptchaProvider>
        <Modal
          title={t("title")}
          description={t("description")}
          open={open}
          setOpen={() => {
            setOpen(!open);
          }}
        >
          <ContactForm
            dwelling={dwelling}
            onSuccess={() => {
              setOpen(!open);
            }}
          />
        </Modal>
      </ReCaptchaProvider>
    </>
  );
};

export default ContactButton;
