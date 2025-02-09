import { createClient } from "@/utils/supabase/server";
import { simpleParser } from "mailparser";
import { NextResponse } from "next/server";

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

    let email = {
      thread_id: parsed.to.split("@")[0],
      subject: parsed.subject,
      from: parsed.from?.text || "",
      to: parsed.to?.text || "",
      latestReply: emailBody.trim() || "No Reply Found",
    };
    console.log("Received Email:", email);

    let supabase = await createClient();

    let { data: thread, error } = await supabase
      .select("*")
      .from("threads")
      .eq("thread_id", email.thread_id)
      .single();

    if (!thread || error) {
      console.error("Error fetching thread:", error);
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    console.log("Thread found:", thread);
    console.log("Emaio:", email);

    return NextResponse.json({ message: "Email received" }, { status: 200 });
  } catch (error) {
    console.error("Error handling MIME email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
