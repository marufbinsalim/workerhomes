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
      }) // update last message
      .eq("thread_id", thread.thread_id);

    if (threadError) {
      console.error("Error updating thread:", threadError);
      return NextResponse.json(
        { error: "Error updating thread" },
        { status: 500 },
      );
    }

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
      html: email.content,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: "Email received" }, { status: 200 });
  } catch (error) {
    console.error("Error handling MIME email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
