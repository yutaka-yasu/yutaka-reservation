import fetch from "node-fetch";

export async function sendLineMessage(to, message) {
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to,
      messages: [{ type: "text", text: message }],
    }),
  });

  if (!res.ok) {
    console.error("LINE送信エラー", await res.text());
  }
}
