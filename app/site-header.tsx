"use client";

import { useEffect, useState } from "react";
import { Lang, LanguageSwitch } from "./language";
import {
  CartLargeMinimalisticIcon,
  CloseCircleIcon,
  HamburgerMenuIcon,
  ShieldUserIcon,
} from "./icons";

type ActivePage = "home" | "menu" | "track";

const copy = {
  uz: { home: "Bosh sahifa", menu: "Menyu", about: "Biz haqimizda", track: "Kuzatish", admin: "Admin", cart: "Savat", open: "Menyuni ochish", close: "Menyuni yopish" },
  ru: { home: "Главная", menu: "Меню", about: "О нас", track: "Отследить", admin: "Админ", cart: "Корзина", open: "Открыть меню", close: "Закрыть меню" },
  en: { home: "Home", menu: "Menu", about: "About", track: "Track", admin: "Admin", cart: "Cart", open: "Open menu", close: "Close menu" },
};

export default function SiteHeader({
  lang,
  setLang,
  active,
  cartCount,
  onCart,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
  active: ActivePage;
  cartCount?: number;
  onCart?: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const t = copy[lang];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("yashil:cart") || "[]");
      setSavedCount(Array.isArray(saved) ? saved.length : 0);
    } catch {}
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const count = cartCount ?? savedCount;
  const links = [
    { id: "home", href: "/", label: t.home },
    { id: "menu", href: "/menu", label: t.menu },
    { id: "about", href: "/#about", label: t.about },
    { id: "track", href: "/track", label: t.track },
  ];

  const cartContent = <><CartLargeMinimalisticIcon size={20}/><span className="headerCartLabel">{t.cart}</span><b>{count}</b></>;

  return <header className="siteHeader">
    <div className="siteHeaderInner shell">
      <a className="siteBrand" href="/" aria-label="YASHIL bosh sahifa">
        <strong>yashil</strong>
        <small>healthy kitchen</small>
      </a>

      <nav className="siteNav" aria-label="Asosiy navigatsiya">
        {links.map(link => <a
          key={link.id}
          href={link.href}
          className={active === link.id ? "active" : ""}
          aria-current={active === link.id ? "page" : undefined}
        >{link.label}</a>)}
      </nav>

      <div className="headerActions">
        <div className="desktopLanguage"><LanguageSwitch lang={lang} setLang={setLang}/></div>
        <a className="headerAdmin" href="/admin" aria-label={t.admin} title={t.admin}><ShieldUserIcon size={20}/></a>
        {onCart
          ? <button className="headerCart" onClick={onCart}>{cartContent}</button>
          : <a className="headerCart" href="/menu">{cartContent}</a>}
        <button
          className="mobileMenuToggle"
          aria-label={mobileOpen ? t.close : t.open}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
        >{mobileOpen ? <CloseCircleIcon size={25}/> : <HamburgerMenuIcon size={25}/>}</button>
      </div>
    </div>

    <div id="mobile-navigation" className={`mobileNavPanel ${mobileOpen ? "open" : ""}`}>
      <nav className="shell" aria-label="Mobil navigatsiya">
        {links.map(link => <a
          key={link.id}
          href={link.href}
          className={active === link.id ? "active" : ""}
          aria-current={active === link.id ? "page" : undefined}
          onClick={() => setMobileOpen(false)}
        >{link.label}</a>)}
        <a href="/admin" onClick={() => setMobileOpen(false)}>{t.admin}</a>
        <div className="mobileLanguage"><LanguageSwitch lang={lang} setLang={setLang}/></div>
      </nav>
    </div>
  </header>;
}
