import Link from "next/link";

export default function ReserveTop() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">リラクゼーションゆたか 予約ページ</h1>
      <p className="text-lg mb-8 text-center">ご予約はこちらから</p>

      <div className="space-y-4 w-full max-w-xs">
        <Link href="/reserve/form">
          <button className="w-full bg-blue-600 text-white py-2 rounded-xl shadow">
            新規予約をする
          </button>
        </Link>

        <Link href="/reserve/login">
          <button className="w-full bg-green-600 text-white py-2 rounded-xl shadow">
            LINEでログイン
          </button>
        </Link>

        <Link href="/reserve/thanks">
          <button className="w-full bg-gray-400 text-white py-2 rounded-xl shadow">
            完了ページを確認（テスト）
          </button>
        </Link>
      </div>
    </div>
  );
}
