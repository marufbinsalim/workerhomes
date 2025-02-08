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

    console.log("Received Raw MIME Email:", rawEmail);

    return NextResponse.json({ message: "Email received" }, { status: 200 });
  } catch (error) {
    console.error("Error handling MIME email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
