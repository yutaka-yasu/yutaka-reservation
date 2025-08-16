import './(styles)/globals.css';

export const metadata = { title:'yutaka-reservation', description:'リラクゼーションゆたかの予約アプリ（スターター）' };

export default function RootLayout({ children }){
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <div className="container">
            <div className="brand"><span className="brand-badge" /><strong>リラクゼーションゆたか</strong></div>
            <nav className="nav"><a href="/">ホーム</a><a href="/reserve">予約</a><a href="/admin">管理</a></nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
