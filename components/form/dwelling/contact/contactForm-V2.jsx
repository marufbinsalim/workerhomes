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

  const tl = useTranslations("listingDetails");

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
          <div className="tw:bg-white tw:shadow-md font-primary tw:h-[93dvh] tw:overflow-auto tw:w-full">
            {/* Header - unchanged on large screens */}
            <div className="tw:bg-[#F8F9FB] tw:h-[60px] tw:flex tw:items-center tw:px-6 tw:mb-5">
              <h2 className="tw:text-xl tw:font-semibold tw:text-[#3B3B3B]">
                {tl("form.contactOwner")}
              </h2>
            </div>

            {/* Content container */}
            <div className="tw:px-6">
              {/* Instruction text - full width on mobile */}
              <p className="tw:text-[#797979] tw:text-[16px] tw:font-normal tw:mb-5 tw:md:max-w-[500px] tw:break-words">
                {tl("form.contactInstruction")}
              </p>

              <div className="tw:space-y-4">
                {/* Form fields - unchanged on large screens */}
                <div>
                  <label className="tw:block tw:text-[16px] tw:font-semibold tw:text-[#3B3B3B]">
                    {tl("form.companyName")}
                  </label>
                  <Input
                    type="text"
                    name="name_or_company"
                    className="tw:w-full tw:p-2 tw:border tw:placeholder:text-[#797979] tw:placeholder:text-[14px] tw:placeholder:font-normal tw:border-[#D8E0ED] tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                    required
                    placeholder={tl("form.companyName")}
                  />
                </div>

                <div>
                  <label className="tw:block tw:text-[16px] tw:font-semibold tw:text-[#3B3B3B]">
                    {tl("form.email")}
                  </label>
                  <Input
                    type="email"
                    name="email"
                    className="tw:w-full tw:p-2 tw:border tw:placeholder:text-[#797979] tw:placeholder:text-[14px] tw:placeholder:font-normal tw:border-[#D8E0ED] tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                    disabled={session ? true : false}
                    required
                    placeholder={tl("form.email")}
                  />
                </div>

                <div>
                  <label className="tw:block tw:text-[16px] tw:font-semibold tw:text-[#3B3B3B]">
                    {tl("form.contactNo")}
                  </label>
                  <Input
                    type="phone"
                    name="phone"
                    className="tw:w-full tw:p-2 tw:border tw:placeholder:text-[#797979] tw:placeholder:text-[14px] tw:placeholder:font-normal tw:border-[#D8E0ED] tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                    disabled={session ? (phone ? true : false) : false}
                    required
                    placeholder={tl("form.contactNo")}
                  />
                </div>

                {/* Date pickers - stack vertically on mobile only */}
                <div className="tw:flex tw:flex-col tw:md:flex-row tw:md:space-x-4 tw:space-y-4 tw:md:space-y-0">
                  <div className="tw:w-full tw:md:w-1/2">
                    <label className="tw:block tw:text-[16px] tw:font-semibold tw:text-[#3B3B3B]">
                      {tl("form.checkIn")}
                    </label>
                    <Input
                      type="datetime-local"
                      name="check_in"
                      min={new Date()}
                      className="tw:w-full tw:p-2 tw:border tw:placeholder:text-[#797979] tw:placeholder:text-[14px] tw:placeholder:font-normal tw:border-[#D8E0ED] tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                      required
                    />
                  </div>
                  <div className="tw:w-full tw:md:w-1/2">
                    <label className="tw:block tw:text-[16px] tw:font-semibold tw:text-[#3B3B3B]">
                      {tl("form.checkOut")}
                    </label>
                    <Input
                      type="datetime-local"
                      name="check_out"
                      className="tw:w-full tw:p-2 tw:border tw:placeholder:text-[#797979] tw:placeholder:text-[14px] tw:placeholder:font-normal tw:border-[#D8E0ED] tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="tw:block tw:text-[16px] tw:font-semibold tw:text-[#3B3B3B]">
                    {tl("form.noOfGuests")}
                  </label>
                  <div className="tw:flex tw:mt-1 tw:gap-2">
                    <Input
                      type="text"
                      name="guests"
                      disabled
                      value={guests}
                      className="tw:w-full tw:h-[44px] tw:p-2 tw:border tw:placeholder:text-[#797979] tw:placeholder:text-[14px] tw:placeholder:font-normal tw:border-[#D8E0ED] tw:rounded tw:bg-[#F8F9FB] "
                    />
                    <button
                      className="tw:bg-orange-500 tw:w-[44px] tw:h-[44px] tw:rounded tw:flex tw:items-center tw:justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        if (guests > 1) setGuests(guests - 1);
                      }}
                    >
                      <Minus size={16} color="white" />
                    </button>
                    <button
                      className="tw:bg-orange-500 tw:w-[44px] tw:h-[44px] tw:rounded tw:flex tw:items-center tw:justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        setGuests(guests + 1);
                      }}
                    >
                      <Plus size={16} color="white" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="tw:block tw:text-[16px] tw:font-semibold tw:text-[#3B3B3B]">
                    {tl("form.additionalInfo")}
                  </label>
                  <Input
                    type="textarea"
                    name="additional_information"
                    placeholder={tl("form.leaveAdditionalInfo")}
                    rows={5}
                    className="tw:w-full tw:p-2 tw:border tw:placeholder:text-[#797979] tw:placeholder:text-[14px] tw:placeholder:font-normal tw:border-[#D8E0ED] tw:rounded tw:mt-1 tw:bg-[#F8F9FB]"
                  />
                </div>


                {/* Action buttons - stack vertically on mobile only */}
                <div className="tw:flex tw:flex-col tw:md:flex-row tw:justify-end tw:md:space-x-4 tw:space-y-3 tw:md:space-y-0 tw:mb-4">
                  <button
                    type="button"
                    className="tw:px-4 tw:py-2 tw:bg-white tw:text-[#FF780B] tw:font-medium tw:text-sm tw:rounded tw:border tw:border-[#FF780B] tw:flex tw:justify-center tw:items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      onSuccess();
                    }}
                  >
                    {tl("form.cancel")}
                    <Icon
                      icon="mdi:close"
                      className="tw:ml-2 tw:text-[#FF780B]"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    type="submit"
                    className="tw:px-4 tw:py-2 tw:bg-orange-500 tw:text-white tw:rounded tw:font-medium tw:text-sm tw:hover:bg-orange-600 tw:flex tw:justify-center tw:items-center"
                    disabled={isLoading}
                  >
                    {tl("form.add")}
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
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
