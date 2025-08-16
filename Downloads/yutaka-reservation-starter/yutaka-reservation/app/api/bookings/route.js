// app/api/bookings/route.js
import { NextResponse } from 'next/server';
import { addBooking, listBookings } from '../../../lib/storage';
import { getSupabase } from '../../../lib/supabase';

/** --- 設定値 --- */
const TABLE = 'bookings';
const ADMIN_PWD = process.env.ADMIN_PASSWORD || '';
const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const LINE_TO = process.env.LINE_ADMIN_USER_ID || ''; // あなたの userId（未設定なら通知はスキップ）

/** --- ユーティリティ --- */
function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    promise.then(v => { clearTimeout(t); resolve(v); })
           .catch(e => { clearTimeout(t); reject(e); });
  });
}

async function trySupabaseSelect() {
  const sb = getSupabase();
  if (!sb) return { data: null, error: new Error('Supabase not configured') };
  return withTimeout(
    sb.from(TABLE).select('*').order('created_at', { ascending: false }),
    6000,
    'Supabase select'
  );
}

async function trySupabaseInsert(body) {
  const sb = getSupabase();
  if (!sb) return { error: new Error('Supabase not configured') };
  return withTimeout(
    sb.from(TABLE).insert({
      store: body.store,
      date: body.date,
      time: body.time,
      menu: body.menu,
      staff_id: body.staffId || null,
      name: body.name,
      phone: body.phone,
      note: body.note || null,
    }),
    6000,
    'Supabase insert'
  );
}

async function pushLineIfReady(payloadLines) {
  if (!LINE_TOKEN || !LINE_TO) {
    console.warn('[LINE] token/userId 未設定のため通知スキップ');
    return;
  }
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LINE_TOKEN}`,
    },
    body: JSON.stringify({
      to: LINE_TO,
      messages: [{ type: 'text', text: payloadLines.join('\n') }],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[LINE push error]', res.status, text);
  }
}

/** --- ハンドラ --- */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pwd = searchParams.get('pwd') || '';

  if (ADMIN_PWD && pwd !== ADMIN_PWD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await trySupabaseSelect();
    if (!error && Array.isArray(data)) {
      return NextResponse.json({ mode: 'supabase', items: data });
    }
    console.warn('[GET] use memory fallback:', String(error?.message || error));
    return NextResponse.json({ mode: 'memory', items: listBookings() });
  } catch (e) {
    console.error('[GET] unexpected error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    // 1) まずメモリにも保存（UX優先）
    addBooking(body);

    // 2) Supabase へ書き込み（失敗してもエラーにはしない）
    try {
      const { error } = await trySupabaseInsert(body);
      if (error) console.error('[POST] Supabase insert error:', error);
    } catch (e) {
      console.error('[POST] Supabase insert exception:', e);
    }

    // 3) LINE 通知（環境変数が揃っていれば送信）
    try {
      const lines = [
        '🟠 新規予約が入りました',
        `店舗：${body.store}`,
        `日時：${body.date} ${body.time}`,
        `メニュー：${body.menu}`,
        `指名：${body.staffId || '指名なし'}`,
        `お名前：${body.name}`,
        `電話：${body.phone}`,
        body.note ? `メモ：${body.note}` : '',
      ].filter(Boolean);
      await pushLineIfReady(lines);
    } catch (e) {
      console.error('[POST] LINE notify error:', e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/bookings failed:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
