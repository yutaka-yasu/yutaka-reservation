'use client';
import { useState } from 'react';

export default function AdminPage(){
  const [items,setItems]=useState([]);
  const [pwd,setPwd]=useState('');
  const load=async()=>{const r=await fetch('/api/bookings?pwd='+encodeURIComponent(pwd));const j=await r.json();setItems(j.items||[]);};
  return (<div>
    <h1>管理（簡易版）</h1>
    <div className="card">
      <label>管理パスワード</label>
      <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="ADMIN_PASSWORD"/>
      <button className="button" onClick={load}>読込</button>
      <p><small className="muted">.env に ADMIN_PASSWORD を設定するとログイン必須にできます（未設定なら閲覧可）。</small></p>
    </div>
    <div className="grid">
      {items.map(b=>(<div className="card" key={b.id}>
        <strong>{b.date} {b.time}</strong>
        <div>{b.store} / {b.menu} / {b.staffId||'指名なし'}</div>
        <div>{b.name}（{b.phone}）</div>
        <div><small className="muted">{b.note}</small></div>
      </div>))}
    </div>
  </div>);
}
