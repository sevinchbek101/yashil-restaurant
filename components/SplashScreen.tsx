"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  // phase: "loading" → "ready" → "done"
  const [phase, setPhase] = useState<"loading" | "ready" | "done">("loading");

  useEffect(() => {
    const MIN_MS = 1200; // minimum ko'rsatish vaqti
    const start = Date.now();

    const advance = () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_MS - elapsed);
      setTimeout(() => {
        setPhase("ready");
        setTimeout(() => setPhase("done"), 900);
      }, delay);
    };

    if (document.readyState === "complete") {
      advance();
    } else {
      window.addEventListener("load", advance, { once: true });
    }
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`splash${phase === "ready" ? " splash--out" : ""}`}
      aria-hidden="true"
    >
      <div className="splash__inner">
        {phase === "loading" ? (
          <>
            <div className="splash__spinner" />
            <p className="splash__label">Yuklanmoqda…</p>
          </>
        ) : (
          <p className="splash__ready">Tayyor ✓</p>
        )}
      </div>
    </div>
  );
}
