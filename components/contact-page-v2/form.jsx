"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { showToast } from "@/components/toast/Toast";


export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const t = useTranslations('contactUs');


  async function handleSubmit() {
    if (!firstName || !lastName || !email || !message) {
     showToast('info', t('toast.missingFields'));
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "waliurrahman957@gmail.com",
          from: {
            email: "contact@workerhomes.pl", // must match the allowed domain
            name: `${firstName} ${lastName}`,
          },
          subject: `Message from ${firstName} ${lastName}`,
          text: `
            You recieved a message from ${firstName} ${lastName} (${email}).
            Message: ${message}
          `,
          html: `
                <div style="font-family: 'Arial', sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header with blue-orange gradient -->
          <div style="background: linear-gradient(135deg, #1a73e8 0%, #f97316 100%); padding: 25px 30px; text-align: center;">
            <img src="https://workerhomes-two.vercel.app/assets/logo.png" alt="Worker Homes Logo" style="max-height: 50px; height: auto; display: inline-block;">
          </div>

          <!-- Main Content -->
          <div style="padding: 30px;">
            <h2 style="color: #1e3a8a; margin-top: 0; font-size: 22px; font-weight: 600; border-bottom: 2px solid #f97316; padding-bottom: 10px; display: inline-block;">New Contact Form Submission</h2>

            <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #f97316;">
              <div style="display: flex; margin-bottom: 15px; align-items: center;">
                <div style="width: 40px; height: 40px; background-color: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: #1a73e8; font-size: 18px;">👤</span>
                </div>
                <div>
                  <p style="margin: 0; font-weight: 600; color: #1e3a8a;">${firstName} ${lastName}</p>
                  <p style="margin: 0; color: #64748b; font-size: 14px;"><a href="mailto:${email}" style="color: #1a73e8; text-decoration: none; font-weight: 500;">${email}</a></p>
                </div>
              </div>
              
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-top: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #f97316; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
                <div style="color: #334155; line-height: 1.7;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>
            </div>
            
            <!-- Call-to-action button with orange accent -->
            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; font-size: 14px; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3);">Reply to ${firstName}</a>
            </div>
          </div>
          
          <!-- Footer with subtle branding -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              This message was sent from the Worker Homes contact form.
              <br>
              <span style="color: #1a73e8; font-weight: 500;">Worker</span><span style="color: #f97316; font-weight: 500;">Homes</span> &copy; ${new Date().getFullYear()}
            </p>
          </div>
        </div>

        `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Email failed:", data);
        showToast('failure', t('toast.failedEmail'));
      } else {
        showToast('success', t('toast.successEmail'));
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      showToast('failure', t('toast.error'));
    } finally {
      setSending(false);
    }
  }
  return (
    <div className="tw:flex-1 font-primary tw:flex tw:flex-col tw:gap-5">
      <div className="tw:grid tw:grid-cols-2 tw:gap-5">
        <div>
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            {t('firstName')}
          </label>
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder={t('firstNamePlaceholder')}
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  "
          />
        </div>
        <div>
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            {t('lastName')}
          </label>
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder={t('lastNamePlaceholder')}
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  "
          />
        </div>
      </div>

      <div className="">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          {t('email')}
        </label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder={t('emailPlaceholder')}
          type="email"
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  "
        />
      </div>

      <div className="">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          {t('message')}
        </label>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1   tw:h-32"
          placeholder={t('messagePlaceholder')}
        ></textarea>
      </div>

      <button
        disabled={sending}
        onClick={handleSubmit}
        className="tw:w-max tw:bg-[var(--color-primary)] tw:disabled:opacity-85 tw:text-white tw:py-[10px] tw:px-5  hover:tw:bg-blue-700 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:ring-offset-2"
      >
        {t('sendButton')}
      </button>
    </div>
  );
}
