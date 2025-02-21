import { createClient } from "@/utils/supabase/server";
import { simpleParser } from "mailparser";
import { NextResponse } from "next/server";

import * as sgMail from "@sendgrid/mail";
import { extractReplyContent } from "@/utils/emailParse";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData(); // Parse multipart form data
    const rawEmail = formData.get("email"); // Extract the raw MIME message

    if (!rawEmail) {
      return NextResponse.json(
        { error: "Missing email content" },
        { status: 400 },
      );
    }

    const parsed = await simpleParser(rawEmail);
    let emailBody = parsed.text || "";

    console.log("Parsed Email:", parsed);

    let message = extractReplyContent(emailBody);

    function extractEmail(from) {
      const match = from.match(/<(.*?)>/);
      return match ? match[1] : from;
    }

    let email = {
      thread_id: parsed.to?.text.split("@")[0]?.split("<")[1],
      subject: parsed.subject,
      from: extractEmail(parsed.from.text || ""),
      to: parsed.to?.text || "",
      content: message,
    };
    console.log("Received Email:", email);

    if (email.from === email.to) {
      return NextResponse.json(
        { error: "Email from and to are the same" },
        { status: 200 },
      );
    }

    let supabase = await createClient();

    let { data: thread, error } = await supabase
      .from("threads")
      .select("*")
      .eq("thread_id", email.thread_id)
      .single();

    if (!thread || error) {
      console.error("Error fetching thread:", error);
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    let sender = null;
    let recipient = null;

    if (thread.user.email === email.from) {
      sender = thread.user;
      recipient = thread.owner;
    } else {
      sender = thread.owner;
      recipient = thread.user;
    }

    let newMessage = {
      thread_id: thread.thread_id,
      content: email.content,
      sender: sender,
      recipient: recipient,
      type: "text",
    };

    if (!sender || !recipient) {
      console.error("Error fetching sender or recipient");
      return NextResponse.json(
        { error: "Sender or recipient not found" },
        { status: 404 },
      );
    }

    let { error: messageError } = await supabase
      .from("messages")
      .insert([newMessage]);

    if (messageError) {
      console.error("Error inserting message:", messageError);
      return NextResponse.json(
        { error: "Error inserting message" },
        { status: 500 },
      );
    }

    console.log("Thread found:", thread);
    console.log("Email:", email);
    console.log("Message: ", newMessage);

    let timestamp = new Date().toISOString();

    let { error: threadError } = await supabase
      .from("threads")
      .update({
        last_message: {
          type: "text",
          sender: sender,
          content: email.content,
          recipient: recipient,
          timestamp: timestamp,
        },
        seen: false,
      }) // update last message
      .eq("thread_id", thread.thread_id);

    if (threadError) {
      console.error("Error updating thread:", threadError);
      return NextResponse.json(
        { error: "Error updating thread" },
        { status: 500 },
      );
    }

    let polishListingTitle = thread.dwelling_title.find(
      (title) => title.locale === "pl",
    )?.value;

    let polishSlug = thread.dwelling_slug.find(
      (slug) => slug.locale === "pl",
    )?.value;

    let span = `<span style="color: #ff5a5f; font-weight: bold;"><a href="https://workerhomes-two.vercel.app/pl/listings/${polishSlug}">${polishListingTitle}</a></span>`;

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
      <p style="font-size: 16px; font-weight: bold; color: #555;"> ${newMessage.sender.username || "Guest"}</p>

      <!-- Message Content -->
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #333;">${newMessage.content}</p>
      </div>



      <!-- Button -->
      <div style="text-align: center;">
        <a href="https://workerhomes-two.vercel.app/pl/dashboard/messenger?thread=${
          newMessage.thread_id
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

    const msg = {
      to:
        email.from === thread.user.email
          ? thread.owner.email
          : thread.user.email,
      from: {
        email: `${thread.thread_id}@parse.workerhomes.pl`,
        name: "Workerhomes",
      },
      subject: email.subject.includes("Re:")
        ? email.subject
        : "Re: " + email.subject,
      text: email.content,
      html: html,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: "Email received" }, { status: 200 });
  } catch (error) {
    console.error("Error handling MIME email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
