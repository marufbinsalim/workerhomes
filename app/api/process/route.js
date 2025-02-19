import { createClient } from "@/utils/supabase/server";
import { simpleParser } from "mailparser";
import { NextResponse } from "next/server";

import * as sgMail from "@sendgrid/mail";

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

    if (parsed.subject.includes("Re:")) {
      let endIndex = emailBody.indexOf("On ");
      emailBody = emailBody.substring(0, endIndex);
    }

    function extractEmail(from) {
      const match = from.match(/<(.*?)>/);
      return match ? match[1] : from;
    }

    let email = {
      thread_id: parsed.to?.text.split("@")[0] || "",
      subject: parsed.subject,
      from: extractEmail(parsed.from.text || ""),
      to: parsed.to?.text || "",
      content: emailBody.trim() || "No Reply Found",
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
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

          <p style="font-size: 14px; color: #777;">
           You have recieved a new message in <span style="color: #ff5a5f; font-weight: bold;">Workerhomes</span> for ${span}
          </p>

          <div style="margin-top: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p>${newMessage.content}</p>
          </div>

          <a href="https://workerhomes-two.vercel.app/pl/dashboard/messenger?thread=${newMessage.thread_id}"
          style="display: block; text-align: center; background-color: #ff5a5f; color: white; text-decoration: none; padding: 12px; border-radius: 5px; font-size: 16px; margin-top: 20px;">
            Reply to the chat
          </a>

          <p style="font-size: 14px; color: #888; text-align: left; margin-top: 15px;">
            You can reply to this email to participate in the conversation
          </p>
        </div>
      </div>
    `;

    const msg = {
      to:
        email.from === thread.user.email
          ? thread.owner.email
          : thread.user.email,
      from: `${thread.thread_id}@parse.workerhomes.pl`,
      subject: email.subject.includes("Re:")
        ? email.subject.substring(4)
        : email.subject,
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
