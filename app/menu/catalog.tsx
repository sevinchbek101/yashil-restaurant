"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; description: string; price: number; image: string; badge?: string };
type Zone = { id: number; name: string; fee: number; eta: string };
const categories = [{ id: "all", label: "Barchasi" }, { id: "bowl", label: "Bowl" }, { id: "salad", label: "Salatlar" }, { id: "drink", label: "Ichimliklar" }];
const money = (n: number) => n.toLocaleString("uz-UZ") + " so‘m";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]), [zones, setZones] = useState<Zone[]>([]), [category, setCategory] = useState("all"), [cart, setCart] = useState<Product[]>([]), [drawer, setDrawer] = useState(false), [checkout, setCheckout] = useState(false), [busy, setBusy] = useState(false), [done, setDone] = useState(0);
  useEffect(() => { fetch("/api/data").then(r => r.json()).then(d => { setProducts(d.products || []); setZones(d.zones || []); }); }, []);
  const shown = category === "all" ? products : products.filter(x => x.category === category);
  const subtotal = useMemo(() => cart.reduce((sum, x) => sum + x.price, 0), [cart]);

  async function order(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/data", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, action: "create-order", items: cart }) });
    const d = await r.json(); setBusy(false);
    if (r.ok) { localStorage.setItem("yashil:lastOrder", JSON.stringify({ id: d.id, phone: String(body.phone) })); setDone(d.id); setCart([]); }
    else alert(d.error || "Xatolik yuz berdi");
  }

  return <main className="menuPage">
    <header className="trackNav shell"><a className="logo" href="/">yashil</a><nav className="menuNav"><a href="/">BOSH SAHIFA</a><a href="/track">KUZATISH</a><button className="outline" onClick={() => setDrawer(true)}>SAVAT <b>{cart.length}</b></button></nav></header>
    <section className="menuHero shell"><span className="eyebrow">HAR KUNI YANGI TAYYORLANADI</span><h1>Bugun nima<br/>tanlaysiz?</h1><p>Foydali bowl, yangi salat va tetiklashtiruvchi ichimliklar — barchasi bir joyda.</p></section>
    <section className="menuCatalog shell">
      <div className="tabs">{categories.map(c => <button key={c.id} className={category === c.id ? "active" : ""} onClick={() => setCategory(c.id)}>{c.label}</button>)}</div>
      <div className="menuGrid">{shown.map(x => <article className="food" key={x.id}><div className="foodImg"><img src={x.image} alt={x.name}/>{x.badge && <span>{x.badge}</span>}</div><h3>{x.name}</h3><p>{x.description}</p><div><b>{money(x.price)}</b><button onClick={() => setCart([...cart, x])}>Savatga +</button></div></article>)}</div>
      {!shown.length && <p className="empty">Bu bo‘limda hozircha taom yo‘q.</p>}
    </section>
    <footer><div className="shell"><a className="logo" href="/">yashil</a><p>© 2026 YASHIL · Toshkent · +998 90 123 45 67</p></div></footer>

    <div className={drawer ? "back open" : "back"} onClick={e => { if (e.target === e.currentTarget) setDrawer(false); }}><aside className="cart"><div className="cartHead"><h3>Sizning savatingiz</h3><button onClick={() => setDrawer(false)}>×</button></div><div className="cartList">{cart.map((x, i) => <div className="cartRow" key={i}><span><b>{x.name}</b><small>{money(x.price)}</small></span><button onClick={() => setCart(cart.filter((_, j) => j !== i))}>Olib tashlash</button></div>)}{!cart.length && <p>Savatingiz hozircha bo‘sh.</p>}</div><div className="cartFoot"><div><b>Jami</b><strong>{money(subtotal)}</strong></div><button className="pill" disabled={!cart.length} onClick={() => setCheckout(true)}>BUYURTMANI RASMIYLASHTIRISH</button></div></aside></div>
    {checkout && <div className="modal"><div className="dialog">{done ? <div className="success"><div>✓</div><h2>Buyurtma qabul qilindi!</h2><p>Buyurtma raqami: <b>#{done}</b></p><p className="successNote">Holatini istalgan vaqtda buyurtma raqami va telefoningiz orqali ko‘rishingiz mumkin.</p><a className="pill" href="/track">BUYURTMANI KUZATISH</a><button className="ghostBtn" onClick={() => { setCheckout(false); setDrawer(false); setDone(0); }}>Yopish</button></div> : <><div className="dialogHead"><h2>Buyurtma ma’lumotlari</h2><button onClick={() => setCheckout(false)}>×</button></div><form onSubmit={order} className="form"><label>Ismingiz<input name="name" required/></label><label>Email<input name="email" type="email" required/></label><label>Telefon<input name="phone" required placeholder="+998"/></label><label>Manzil<textarea name="address" required/></label><div className="form2"><label>Hudud<select name="zoneId" required>{zones.map(z => <option value={z.id} key={z.id}>{z.name} · {money(z.fee)}</option>)}</select></label><label>To‘lov<select name="payment"><option>Naqd</option><option>Payme</option><option>Click</option></select></label></div><label>Promo-kod<input name="promo" placeholder="Masalan: YASHIL10"/></label><div className="orderSum"><span>Taomlar</span><b>{money(subtotal)}</b></div><button className="pill" disabled={busy}>{busy ? "YUBORILMOQDA..." : "TASDIQLASH"}</button></form></>}</div></div>}
  </main>;
}
