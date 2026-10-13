"use client";

import { useEffect, useState } from "react";
import { GlobeIcon } from "./icons";

export type Lang = "uz" | "ru" | "en";

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>("uz");
  useEffect(() => {
    const saved = localStorage.getItem("yashil:lang") as Lang | null;
    const next = saved === "uz" || saved === "ru" || saved === "en" ? saved : "uz";
    setLangState(next);
    document.documentElement.lang = next;
  }, []);
  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem("yashil:lang", next);
    document.documentElement.lang = next;
  }
  return { lang, setLang };
}

export function LanguageSwitch({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const label = lang === "uz" ? "Tilni tanlang" : lang === "ru" ? "Выберите язык" : "Choose language";
  return <div className="langSwitch" role="group" aria-label={label}><GlobeIcon size={16}/>{(["uz", "ru", "en"] as Lang[]).map(code => <button type="button" key={code} className={lang === code ? "active" : ""} aria-pressed={lang === code} aria-label={code === "uz" ? "O‘zbekcha" : code === "ru" ? "Русский" : "English"} onClick={() => setLang(code)}>{code.toUpperCase()}</button>)}</div>;
}
