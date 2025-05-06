import { NextResponse } from "next/server";
import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { to, from, subject, text, html } = await req.json();

    console.log(to, from, subject, text, html);

    // Ensure required fields are present
    if (!to || !from || !subject || !text || !html) {
      return NextResponse.json(
        { error: "Missing required fields", to, from, subject, text, html },
        { status: 400 }
      );
    }

    const msg = {
      to,
      from, // Dynamically set sender email
      subject,
      text,
      html,
    };

    let data = await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to send email", details: error },
      { status: 500 }
    );
  }
}
