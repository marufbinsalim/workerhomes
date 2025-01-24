"use client";

import Input from "@/components/common/Input";
import useMessenger from "@/hooks/useMessenger";
import { create } from "@/lib/services/dwelling/contact";
import {
  dwellingContactSchema,
  initDwellingContact,
} from "@/lib/validation/dwelling/contact";
import { Icon } from "@iconify/react";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { api } from "@/config";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ContactForm = ({ dwelling, onSuccess }) => {
  // const { executeRecaptcha } = useGoogleReCaptcha();
  //
  //
  const locale = useParams().locale;

  const [isLoading, setIsLoading] = React.useState(false);
  const { data: session } = useSession();
  const { functions } = useMessenger("dwelling_contact");

  const t = useTranslations("listing-contact");
  return (
    <Formik
      initialValues={initDwellingContact(null)}
      enableReinitialize={true}
      validationSchema={dwellingContactSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true);

        // if (!executeRecaptcha) {
        //   setIsLoading(false)
        //   return toast.error(t('messages.recaptcha-not-ready'))
        // }

        const formattedValues = {
          ...values,
          check_in: new Date(values.check_in).toISOString(),
          check_out: new Date(values.check_out).toISOString(),
          dwelling: dwelling?.id,
        };

        try {
          // const token = await executeRecaptcha('login')

          // const recaptchaResponse = await fetch('/api/recaptcha', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ token }),
          // })

          // const recaptchaData = await recaptchaResponse.json()

          // if (!recaptchaData.success) {
          //   setIsLoading(false)
          //   return toast.error(t('messages.recaptcha-failed'))
          // }

          // toast.success(t('messages.recaptcha-success'))
          //
          await create(formattedValues, t("messages.create"));

          const fetchListingBySlug = async (slug, locale) => {
            // Fetch listing by slug
            const res = await fetch(
              api +
                `/api/dwellings?filters[slug][$eq]=${slug}&populate=galleries.image,features.icon,seo,location,contact,amenities,category,prices,subscription.package,owner,subscription.package.icon,localizations&locale=${locale}`,
              {
                next: {
                  revalidate: 0,
                },
              },
            );
            const data = await res.json();
            return data?.data?.[0] || [];
          };

          const fetchedDwelling = await fetchListingBySlug(
            dwelling.slug,
            locale,
          );

          console.log("formattedValues", formattedValues);
          console.log("session", session);
          console.log("fetchedDwelling", fetchedDwelling);

          let allIds = [
            fetchedDwelling.id,
            ...fetchedDwelling.localizations.map((l) => l.id),
          ];
          allIds.sort((a, b) => a - b);
          let combined_id = `${allIds.join("-")}`;

          const thread = {
            thread_id: combined_id,
            dwelling_title: [
              {
                locale: fetchedDwelling.locale,
                value: fetchedDwelling.title,
              },
              ...fetchedDwelling.localizations.map((l) => ({
                locale: l.locale,
                value: l.title,
              })),
            ],

            dwelling_slug: [
              {
                locale: fetchedDwelling.locale,
                value: fetchedDwelling.slug,
              },
              ...fetchedDwelling.localizations.map((l) => ({
                locale: l.locale,
                value: l.slug,
              })),
            ],
            user: {
              email: session ? session.user.email : formattedValues.email,
              username: session ? session.user.name : "Guest",
            },
            owner: {
              email: fetchedDwelling.owner.email,
              username:
                fetchedDwelling.owner.name || fetchedDwelling.owner.username,
            },
            last_message: {
              type: "text",
              content:
                `Name / Company: ${formattedValues.name_or_company}` +
                "\n" +
                `Email: ${formattedValues.email}` +
                "\n" +
                `Phone: ${formattedValues.phone}` +
                "\n" +
                `Check-in: ${formattedValues.check_in}` +
                "\n" +
                `Check-out: ${formattedValues.check_out}` +
                "\n" +
                `Guests: ${formattedValues.guests}` +
                "\n" +
                `Additional information: ${formattedValues.additional_information}`,

              timestamp: new Date().toISOString(),
            },
          };

          console.log("thread", thread);
          await functions.createThread(thread);
          const message = {
            thread_id: combined_id,
            content:
              `Name / Company: ${formattedValues.name_or_company}` +
              "\n" +
              `Email: ${formattedValues.email}` +
              "\n" +
              `Phone: ${formattedValues.phone}` +
              "\n" +
              `Check-in: ${formattedValues.check_in}` +
              "\n" +
              `Check-out: ${formattedValues.check_out}` +
              "\n" +
              `Guests: ${formattedValues.guests}` +
              "\n" +
              `Additional information: ${formattedValues.additional_information}`,

            timestamp: new Date().toISOString(),
            type: "text",
            sender: {
              email: session ? session.user.email : formattedValues.email,
              username: session ? session.user.name : "Guest",
            },
            recipient: {
              email: fetchedDwelling.owner.email,
              username:
                fetchedDwelling.owner.name || fetchedDwelling.owner.username,
            },
          };

          console.log("message", message);
          await functions.sendMessage(message);

          onSuccess && onSuccess();
          resetForm();
        } catch (error) {
          console.log(error);
          toast.error(t("messages.error"));
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ dirty, values, errors, setFieldValue }) => (
        <Form>
          <div className="row x-gap-20 y-gap-20">
            <div className="col-12">
              <Input
                type="text"
                name="name_or_company"
                label={t("form.name_or_company")}
                required
              />
            </div>

            <div className="col-12">
              <Input
                type="email"
                name="email"
                label={t("form.email")}
                required
              />
            </div>

            <div className="col-12">
              <Input
                type="phone"
                name="phone"
                label={t("form.phone")}
                required
              />
            </div>

            <div className="col-sm-12 col-md-6">
              <Input
                type="datetime-local"
                name="check_in"
                min={new Date()}
                label={t("form.check_in")}
                required
              />
            </div>

            <div className="col-sm-12 col-md-6">
              <Input
                type="datetime-local"
                name="check_out"
                label={t("form.check_out")}
                required
              />
            </div>

            <div className="col-12">
              <Input type="text" name="guests" label={t("form.guests")} />
            </div>

            <div className="col-12">
              <Input
                type="textarea"
                name="additional_information"
                rows={5}
                label={t("form.additional_information")}
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="button px-24 h-50 -dark-1 bg-blue-1 text-white"
              >
                {t("form.button")}
                <Icon
                  icon={
                    isLoading
                      ? "line-md:loading-loop"
                      : "streamline:mail-send-email-message"
                  }
                  className="ml-10"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
