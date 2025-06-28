export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, message } = req.body;

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LINE_MESSAGING_API_CHANNEL_TOKEN}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [{ type: 'text', text: message || 'ご予約ありがとうございます！' }],
      }),
    });

    if (!response.ok) throw new Error('LINE送信失敗');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('LINE通知エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}



