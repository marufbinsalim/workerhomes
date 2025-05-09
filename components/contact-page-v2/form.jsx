"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!firstName || !lastName || !email || !message) {
      alert("Please fill in all required fields.");
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
          to: "mdmarufbinsalim@gmail.com",
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
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>You received a message from:</strong> ${firstName} ${lastName} (${email})</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
        `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Email failed:", data);
        alert("Failed to send email.");
      } else {
        alert("Email sent successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      alert("An error occurred while sending the email.");
    } finally {
      setSending(false);
    }
  }
  return (
    <div className="tw:flex-1 font-primary tw:flex tw:flex-col tw:gap-5">
      <div className="tw:grid tw:grid-cols-2 tw:gap-5">
        <div>
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            First name
          </label>
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="First Name"
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  "
          />
        </div>
        <div>
          <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
            Last name
          </label>
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Last Name"
            type="text"
            className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  "
          />
        </div>
      </div>

      <div className="">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="youremail@gmail.com"
          type="email"
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1  "
        />
      </div>

      <div className="">
        <label className="tw:block tw:text-[var(--color-font-dark)] tw:mb-[10px] tw:font-semibold">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="tw:w-full tw:bg-[var(--color-white-grey)] tw:focus:ring-[var(--color-primary)] tw:px-3 tw:py-2 tw:border tw:border-gray-300  tw:focus:outline-none tw:focus:ring-1   tw:h-32"
          placeholder="Leave a message for us..."
        ></textarea>
      </div>

      <button
        disabled={sending}
        onClick={handleSubmit}
        className="tw:w-max tw:bg-[var(--color-primary)] tw:disabled:opacity-85 tw:text-white tw:py-[10px] tw:px-5  hover:tw:bg-blue-700 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-orange-500 focus:tw:ring-offset-2"
      >
        {"Send to a message "}
      </button>
    </div>
  );
}
