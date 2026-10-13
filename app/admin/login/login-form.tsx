"use client";

import { FormEvent, useState } from "react";
import { LockKeyholeIcon, LoginIcon, UserIcon } from "../../icons";

export default function AdminLoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Kirishda xatolik yuz berdi");
      setBusy(false);
      return;
    }
    window.location.assign("/admin");
  }

  return <main className="adminLoginPage" id="main-content">
    <a className="adminLoginBrand" href="/" aria-label="YASHIL bosh sahifasi">yashil</a>
    <section className="adminLoginCard">
      <div className="adminLoginIcon"><LockKeyholeIcon size={30}/></div>
      <span className="eyebrow">HIMOYALANGAN BO‘LIM</span>
      <h1>Admin panelga kirish</h1>
      <p>Restoran menyusi va buyurtmalarini boshqarish uchun login ma’lumotlarini kiriting.</p>
      <form onSubmit={submit}>
        <label>Login<div><UserIcon size={20}/><input name="login" autoComplete="username" required autoFocus/></div></label>
        <label>Parol<div><LockKeyholeIcon size={20}/><input name="password" type="password" autoComplete="current-password" required/></div></label>
        {error && <div className="adminLoginError" role="alert">{error}</div>}
        <button className="primaryBtn adminLoginSubmit" disabled={busy}>
          {busy ? <span className="loginSpinner"/> : <LoginIcon size={20}/>}
          {busy ? "Tekshirilmoqda…" : "Kirish"}
        </button>
      </form>
      <a className="adminLoginBack" href="/">← Saytga qaytish</a>
    </section>
  </main>;
}
