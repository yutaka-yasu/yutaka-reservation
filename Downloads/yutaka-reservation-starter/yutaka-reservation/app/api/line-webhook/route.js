// app/api/line-webhook/route.js
import { NextResponse } from "next/server";

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || ""; // LINE Developersで発行されるチャネルシークレット
const ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || ""; // チャネルアクセストークン

// LINEに返信するための関数
async function replyMessage(replyToken, messages) {
  if (!ACCESS_TOKEN) {
    console.error("[LINE] アクセストークン未設定のため返信できません");
    return;
  }

  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[LINE reply error]", res.status, text);
  }
}

// Webhookエンドポイント
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("[LINE webhook event]", JSON.stringify(body, null, 2));

    // LINEプラットフォームから送られてくるイベントを処理
    if (body.events) {
      for (const event of body.events) {
        if (event.type === "message" && event.message.type === "text") {
          const userMessage = event.message.text;
          console.log("ユーザーからのメッセージ:", userMessage);

          // 例: オウム返し
          await replyMessage(event.replyToken, [
            { type: "text", text: `受け取りました: ${userMessage}` },
          ]);
        } else if (event.type === "follow") {
          console.log("新しい友だち追加");
          await replyMessage(event.replyToken, [
            { type: "text", text: "友だち追加ありがとうございます！" },
          ]);
        }
      }
    }

    // LINEに必ず200で返す
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// GETアクセスが来たとき（テスト用）
export async function GET() {
  return NextResponse.json({ message: "LINE webhook is running" }, { status: 200 });
}
