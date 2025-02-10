import { NextResponse } from "next/server";
import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export async function GET() {
//   try {
//     const msg = {
//       to: "waliurrahman957@gmail.com", // Change to your recipient
//       from: "sender-2@workerhomes.pl", // Change to your verified sender
//       subject: "This is a simple message",
//       text: "which contains some text",
//       // html: "<strong>and some html</strong>",
//     };

//     await sgMail.send(msg);

//     return NextResponse.json({
//       success: true,
//       message: "Email sent successfully",
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to send email", details: error },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req) {
  try {
    const { to, from, subject, text, html } = await req.json();

    console.log(to, from, subject, text, html);

    // Ensure required fields are present
    if (!to || !from || !subject || !text || !html) {
      return NextResponse.json(
        { error: "Missing required fields", to, from, subject, text, html },
        { status: 400 },
      );
    }

    // Validate that the sender email is from an allowed domain
    const allowedDomain = "parse.workerhomes.pl"; // Change this to your verified domain
    if (!from.endsWith(`@${allowedDomain}`)) {
      return NextResponse.json(
        { error: "Unauthorized sender email" },
        { status: 403 },
      );
    }

    const msg = {
      to,
      from, // Dynamically set sender email
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email", details: error },
      { status: 500 },
    );
  }
}
