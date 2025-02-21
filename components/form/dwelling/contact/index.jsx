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
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ContactForm = ({ dwelling, onSuccess }) => {
  // const { executeRecaptcha } = useGoogleReCaptcha();

  const locale = useParams().locale;

  const [isLoading, setIsLoading] = React.useState(false);
  const { data: session } = useSession();
  const { functions } = useMessenger("dwelling_contact");

  const t = useTranslations("listing-contact");

  let email = session ? session.user.email : "";

  const { data, reFetch } = useFetch(
    session
      ? {
          keys: ["me"],
          url: "/api/users/me",
          query: {
            populate: ["address", "subscriptions"],
          },
        }
      : {
          keys: [""],
        },
  );
  let phone = data?.phone;

  return (
    <Formik
      initialValues={initDwellingContact({ email: email, phone: phone })}
      enableReinitialize={true}
      validationSchema={dwellingContactSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true);

        // if (!executeRecaptcha) {
        //   setIsLoading(false);
        //   return toast.error(t("messages.recaptcha-not-ready"));
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

          function randomString(length) {
            var result = [];
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
              result.push(
                characters.charAt(Math.floor(Math.random() * charactersLength)),
              );
            }
            return result.join("");
          }

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
          combined_id += "-" + randomString(10);

          let polishTitle = [
            {
              locale: fetchedDwelling.locale,
              value: fetchedDwelling.title,
            },
            ...fetchedDwelling.localizations.map((l) => ({
              locale: l.locale,
              value: l.title,
            })),
          ].find((l) => l.locale === "pl")?.value;

          let polishSlug = [
            {
              locale: fetchedDwelling.locale,
              value: fetchedDwelling.slug,
            },
            ...fetchedDwelling.localizations.map((l) => ({
              locale: l.locale,
              value: l.slug,
            })),
          ].find((l) => l.locale === "pl")?.value;

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
              username: session
                ? session.user.name
                : formattedValues.name_or_company,
            },
            owner: {
              email: fetchedDwelling.owner.email,
              username:
                fetchedDwelling.owner.name || fetchedDwelling.owner.username,
            },
            last_message: {
              type: "text",
              sender: {
                email: session ? session.user.email : formattedValues.email,
                username: session
                  ? session.user.name
                  : formattedValues.name_or_company,
              },
              content:
                `Name / Company: ${formattedValues.name_or_company}` +
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
              recipient: {
                email: fetchedDwelling.owner.email,
                username:
                  fetchedDwelling.owner.name || fetchedDwelling.owner.username,
              },
              thread_id: combined_id,
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

          let span = `<span style="color: #ff5a5f; font-weight: bold;"><a href="https://workerhomes-two.vercel.app/pl/listings/${polishSlug}">${polishTitle}</a></span>`;

          let html = `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px 20px; text-align: center;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">

            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.webp"
                alt="Workerhomes" style="max-width: 200px; display: block; margin: 0;"/>
            </div>

            <!-- Title (Listing Name) -->
            <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">You have recieved a new message in Workerhomes for ${span}</h2>

            <!-- Reply Name -->
            <p style="font-size: 16px; font-weight: bold; color: #555;"> ${session ? session.user.name : formattedValues.name_or_company}</p>

            <!-- Message Content -->
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p>Name / Company: ${formattedValues.name_or_company}</p>
              <p>Phone: ${formattedValues.phone}</p>
              <p>Check-in: ${formattedValues.check_in}</p>
              <p>Check-out: ${formattedValues.check_out}</p>
              <p>Guests: ${formattedValues.guests}</p>
              <p>Additional information: ${formattedValues.additional_information}</p>
            </div>


            <!-- Button -->
            <div style="text-align: center;">
              <a href="https://workerhomes-two.vercel.app/${locale}/dashboard/messenger?thread=${
                thread.thread_id
              }"
                style="display: inline-block; background-color: #ff5a5f; color: white; text-decoration: none; padding: 12px 20px;
                border-radius: 5px; font-size: 16px; margin-top: 20px;">
                Reply to the chat
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; width: 600px;">

                <!-- Left side: Logo + Company Address -->
                <div style="text-align: left;">
                  <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.webp"
                    alt="Workerhomes" style="max-width: 100px;"/>
                  <p style="font-size: 12px; color: #888; margin-top: 5px;">123 Placeholder Street, City, Country</p>
                </div>

                <!-- Right side: Social Media Icons -->
                <div style="display: flex; margin-left: auto; gap: 10px;">
                  <a href="https://facebook.com" style="text-decoration: none; margin-left: 10px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="Facebook" width="20"/>
                  </a>
                  <a href="https://instagram.com" style="text-decoration: none; margin-left: 10px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="20"/>
                  </a>
                  <a href="https://x.com" style="text-decoration: none; margin-left: 10px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="X" width="20"/>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      `;
          await functions.sendMessage(message);

          const data = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              headers: {
                "Message-ID": `<${combined_id}-${thread.owner.email}@workerhomes.pl>`,
              },
              to: fetchedDwelling.owner.email,
              from: {
                email: `${combined_id}@parse.workerhomes.pl`,
                name: "Workerhomes",
              },
              subject: `You received a new message from Workerhomes for "${polishTitle}"`,
              text:
                `Name / Company: ${formattedValues.name_or_company}` +
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
              html: html,
            }),
          });

          let JSONdata = await data.json();
          console.log(JSONdata);

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
