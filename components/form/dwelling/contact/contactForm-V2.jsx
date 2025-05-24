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
import React, { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/config";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { Minus, Plus } from "lucide-react";

const ContactForm = ({ dwelling, onSuccess }) => {
  const locale = useParams().locale;

  const [isLoading, setIsLoading] = React.useState(false);
  const { data: session } = useSession();
  const { functions } = useMessenger("dwelling_contact");
  const [guests, setGuests] = useState(1);

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
  let phone = data?.phone || "";

  return (
    <Formik
      initialValues={initDwellingContact({
        email: email,
        phone: phone,
        additional_information: "",
      })}
      enableReinitialize={true}
      validationSchema={dwellingContactSchema()}
      onSubmit={async (values, { resetForm }) => {
        setIsLoading(true);

        const formattedValues = {
          ...values,
          check_in: new Date(values.check_in).toISOString(),
          check_out: new Date(values.check_out).toISOString(),
          dwelling: dwelling?.id,
        };

        try {
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
                `Name / Company: ${formattedValues.name_or_company}\n` +
                `Phone: ${formattedValues.phone}\n` +
                `Check-in: ${formattedValues.check_in}\n` +
                `Check-out: ${formattedValues.check_out}\n` +
                `Guests: ${formattedValues.guests}\n` +
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

          await functions.createThread(thread);

          const message = {
            thread_id: combined_id,
            content:
              `Name / Company: ${formattedValues.name_or_company}\n` +
              `Phone: ${formattedValues.phone}\n` +
              `Check-in: ${formattedValues.check_in}\n` +
              `Check-out: ${formattedValues.check_out}\n` +
              `Guests: ${formattedValues.guests}\n` +
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

          let span = `<span style="color: #F59024; font-weight: bold;"><a href="https://workerhomes-two.vercel.app/pl/listings/${polishSlug}">${polishTitle}</a></span>`;

          let html = `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px 20px; text-align: center;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.png" alt="Workerhomes" style="max-width: 200px; display: block; margin: 0;"/>
            </div>
            <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">You have received a new message in Workerhomes for ${span}</h2>
            <p style="font-size: 16px; font-weight: bold; color: #555;">${session ? session.user.name : formattedValues.name_or_company}</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p>Name / Company: ${formattedValues.name_or_company}</p>
              <p>Phone: ${formattedValues.phone}</p>
              <p>Check-in: ${formattedValues.check_in}</p>
              <p>Check-out: ${formattedValues.check_out}</p>
              <p>Guests: ${formattedValues.guests}</p>
              <p>Additional information: ${formattedValues.additional_information}</p>
            </div>
            <div style="text-align: center;">
              <a href="https://workerhomes-two.vercel.app/${locale}/dashboard/messenger?thread=${thread.thread_id}" style="display: inline-block; background-color: #F59024; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px; margin-top: 20px;">Reply to the chat</a>
            </div>
            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; width: 600px;">
                <div style="text-align: left;">
                  <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.png" alt="Workerhomes" style="max-width: 100px;"/>
                  <p style="font-size: 12px; color: #888; margin-top: 5px;">Workerhomes Placeholder UC,<br/>8 Test Street,<br/>Munich, Germany</p>
                </div>
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
          let messageId = `${randomString(15)}@workerhomes.pl`;
          await functions.addEmailToDatabase(messageId, combined_id, true);

          const data = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              headers: {
                "Message-ID": messageId,
              },
              to: fetchedDwelling.owner.email,
              from: {
                email: `${combined_id}@parse.workerhomes.pl`,
                name: "Workerhomes",
              },
              subject: `You received a new message from Workerhomes for "${polishTitle}"`,
              text:
                `Name / Company: ${formattedValues.name_or_company}\n` +
                `Phone: ${formattedValues.phone}\n` +
                `Check-in: ${formattedValues.check_in}\n` +
                `Check-out: ${formattedValues.check_out}\n` +
                `Guests: ${formattedValues.guests}\n` +
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
          <div className="tw:bg-white tw:p-6 tw:rounded-lg tw:shadow-md tw:h-[90dvh] tw:overflow-auto">
            <h2 className="tw:text-lg tw:font-bold tw:mb-4">
              Contact the owner
            </h2>
            <p className="tw:text-gray-600 tw:mb-4">
              You can contact the owner of this listing by filling the form
              below.
            </p>
            <div className="tw:space-y-4">
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                  Company name
                </label>
                <Input
                  type="text"
                  name="name_or_company"
                  className="tw:w-full tw:p-2 tw:border tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                  required
                />
              </div>
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  className="tw:w-full tw:p-2 tw:border tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                  disabled={session ? true : false}
                  required
                />
              </div>
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                  Contact no
                </label>
                <Input
                  type="phone"
                  name="phone"
                  className="tw:w-full tw:p-2 tw:border tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                  disabled={session ? (phone ? true : false) : false}
                  required
                />
              </div>
              <div className="tw:flex tw:space-x-4">
                <div className="tw:w-1/2">
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                    Check in
                  </label>
                  <Input
                    type="datetime-local"
                    name="check_in"
                    min={new Date()}
                    className="tw:w-full tw:p-2 tw:border tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                    required
                  />
                </div>
                <div className="tw:w-1/2">
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                    Check out
                  </label>
                  <Input
                    type="datetime-local"
                    name="check_out"
                    className="tw:w-full tw:p-2 tw:border tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                  No of guests
                </label>
                <div className="tw:flex tw:items-center">
                  <Input
                    type="text"
                    name="guests"
                    disabled={true}
                    value={guests}
                    className="tw:w-full tw:p-2 tw:border tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                  />
                  <button
                    className="tw:ml-2 tw:bg-orange-500 tw:p-2 tw:py-3 tw:rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      if (guests > 1) {
                        setGuests(guests - 1);
                      }
                    }}
                  >
                    <Minus size={16} color="white" />
                  </button>
                  <button
                    className="tw:ml-2 tw:bg-orange-500 tw:p-2 tw:py-3 tw:rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      setGuests(guests + 1);
                    }}
                  >
                    <Plus color="white" size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                  Additional information
                </label>
                <Input
                  type="textarea"
                  name="additional_information"
                  rows={5}
                  className="tw:w-full tw:p-2 tw:border tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                />
              </div>
              <div className="tw:flex tw:justify-end tw:space-x-4">
                <button
                  type="button"
                  className="tw:px-4 tw:py-2 tw:bg-gray-200 tw:text-gray-800 tw:rounded tw:hover:bg-gray-300 tw:flex"
                  onClick={(e) => {
                    e.preventDefault();
                    onSuccess();
                  }}
                >
                  Cancel
                  <Icon
                    icon="mdi:close"
                    className="tw:ml-2"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  type="submit"
                  className="tw:px-4 tw:py-2 tw:bg-orange-500 tw:text-white tw:rounded tw:hover:bg-orange-600 tw:flex tw:items-center"
                  disabled={isLoading}
                >
                  Add
                  <Icon
                    icon={isLoading ? "line-md:loading-loop" : "mdi:check"}
                    className="tw:ml-2"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
