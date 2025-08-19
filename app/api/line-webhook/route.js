// app/api/line-webhook/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("[LINE webhook]", body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
