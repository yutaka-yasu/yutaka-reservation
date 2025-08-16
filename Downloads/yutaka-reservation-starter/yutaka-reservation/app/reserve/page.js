'use client';
import { useState, useMemo } from 'react';
import { stores, staff, menus } from '../../data/config';

export default function ReservePage(){
  const [form,setForm]=useState({store:'miwa',date:'',time:'',menu:'thai60',staffId:'',name:'',phone:'',note:''});
  const [done,setDone]=useState(null);
  const filteredStaff=useMemo(()=>staff.filter(s=>s.stores.includes(form.store)),[form.store]);
  const submit=async(e)=>{e.preventDefault();const r=await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const j=await r.json();setDone(j);};
  if(done?.ok){return(<div className="card"><h1>送信完了</h1><p>ありがとうございました。</p><a className="button" href="/reserve">もう一件予約する</a></div>);}
  return (<div><h1>予約フォーム</h1>
    <form className="card" onSubmit={submit}>
      <div className="form-row">
        <div><label>店舗</label><select value={form.store} onChange={e=>setForm({...form,store:e.target.value})}>{stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div><label>ご希望日</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></div>
      </div>
      <div className="form-row">
        <div><label>ご希望時間</label><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} required/></div>
        <div><label>メニュー</label><select value={form.menu} onChange={e=>setForm({...form,menu:e.target.value})}>{menus.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
      </div>
      <div className="form-row">
        <div><label>担当指名（任意）</label><select value={form.staffId} onChange={e=>setForm({...form,staffId:e.target.value})}><option value="">指名なし</option>{filteredStaff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div><label>お名前</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
      </div>
      <div className="form-row">
        <div><label>電話番号</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required/></div>
        <div><label>ご要望など（任意）</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></div>
      </div>
      <button className="button" type="submit">予約内容を送信</button>
      <p><small className="muted">※ 現在はデモ保存です（リロードで消えます）。</small></p>
    </form></div>);
}
