"use client";

import { useEffect, useState } from "react";
import { GlobeIcon } from "./icons";

export type Lang = "uz" | "ru" | "en";

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>("uz");
  useEffect(() => {
    const saved = localStorage.getItem("yashil:lang") as Lang | null;
    if (saved === "uz" || saved === "ru" || saved === "en") setLangState(saved);
  }, []);
  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem("yashil:lang", next);
    document.documentElement.lang = next;
  }
  return { lang, setLang };
}

export function LanguageSwitch({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  return <div className="langSwitch" aria-label="Language"><GlobeIcon size={16}/>{(["uz", "ru", "en"] as Lang[]).map(code => <button key={code} className={lang === code ? "active" : ""} onClick={() => setLang(code)}>{code.toUpperCase()}</button>)}</div>;
}
