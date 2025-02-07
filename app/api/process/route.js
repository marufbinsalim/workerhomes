import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const data = await req.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
