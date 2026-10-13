"use client";

import { useEffect } from "react";

const tiltSelector = [
  ".food",
  ".facts > div",
  ".stat",
  ".panel",
  ".orderCard",
  ".promoGrid article",
  ".trackingCard",
  ".adminLoginCard",
  ".onlinePaymentBlock",
].join(",");

const magneticSelector = [
  ".pill",
  ".primaryBtn",
  ".outline",
  ".headerCart",
  ".mobileMenuToggle",
  ".iconBtn",
  ".tabs button",
].join(",");

const revealSelector = [
  ".heroCard",
  ".sectionTop",
  ".food",
  ".split > *",
  ".facts > div",
  ".dark > *",
  ".menuHero > *",
  ".menuTools",
  ".trackHero > *",
  ".trackForm",
  ".trackingCard",
  ".stat",
  ".panel",
  ".orderCard",
  ".promoGrid article",
].join(",");

export default function PremiumMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const abort = new AbortController();
    const boundTilt = new WeakSet<HTMLElement>();
    const boundMagnetic = new WeakSet<HTMLElement>();
    const observedReveal = new WeakSet<HTMLElement>();

    root.classList.add("premium-motion-ready");
    if (reduceMotion) {
      root.classList.add("premium-motion-reduced");
      return () => {
        root.classList.remove("premium-motion-ready", "premium-motion-reduced");
      };
    }

    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("is-revealed");
          revealObserver.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const bindTilt = (element: HTMLElement) => {
      if (!finePointer || boundTilt.has(element)) return;
      boundTilt.add(element);
      element.classList.add("tilt3d");

      element.addEventListener("pointermove", event => {
        const rect = element.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        const rotateX = (0.5 - y) * 13;
        const rotateY = (x - 0.5) * 13;
        element.style.setProperty("--tilt-rx", `${rotateX.toFixed(2)}deg`);
        element.style.setProperty("--tilt-ry", `${rotateY.toFixed(2)}deg`);
        element.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
        element.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
        element.classList.add("is-tilting");
      }, { signal: abort.signal, passive: true });

      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--tilt-rx", "0deg");
        element.style.setProperty("--tilt-ry", "0deg");
        element.classList.remove("is-tilting");
      }, { signal: abort.signal, passive: true });
    };

    const bindMagnetic = (element: HTMLElement) => {
      if (!finePointer || boundMagnetic.has(element)) return;
      boundMagnetic.add(element);
      element.classList.add("magneticFx");

      element.addEventListener("pointermove", event => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty("--mag-x", `${(x * 10).toFixed(2)}px`);
        element.style.setProperty("--mag-y", `${(y * 8).toFixed(2)}px`);
        element.style.setProperty("--ripple-x", `${((x + 0.5) * 100).toFixed(1)}%`);
        element.style.setProperty("--ripple-y", `${((y + 0.5) * 100).toFixed(1)}%`);
      }, { signal: abort.signal, passive: true });

      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--mag-x", "0px");
        element.style.setProperty("--mag-y", "0px");
      }, { signal: abort.signal, passive: true });

      element.addEventListener("click", event => {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "motionRipple";
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        element.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 760);
      }, { signal: abort.signal });
    };

    const bindReveal = (element: HTMLElement, index: number) => {
      if (observedReveal.has(element)) return;
      observedReveal.add(element);
      element.classList.add("motionReveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 65}ms`);
      revealObserver.observe(element);
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>(tiltSelector).forEach(bindTilt);
      document.querySelectorAll<HTMLElement>(magneticSelector).forEach(bindMagnetic);
      document.querySelectorAll<HTMLElement>(revealSelector).forEach(bindReveal);
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-speed]"));
    let scrollFrame = 0;
    const updateParallax = () => {
      scrollFrame = 0;
      const scrollY = window.scrollY;
      layers.forEach(layer => {
        const speed = Number(layer.dataset.parallaxSpeed || 0);
        layer.style.setProperty("--scroll-shift", `${(scrollY * speed).toFixed(2)}px`);
      });
    };
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { signal: abort.signal, passive: true });

    return () => {
      abort.abort();
      mutationObserver.disconnect();
      revealObserver.disconnect();
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      root.classList.remove("premium-motion-ready");
    };
  }, []);

  return (
    <div className="premiumAmbient" aria-hidden="true">
      <span className="ambientLayer ambientLayerOne" data-parallax-speed="-0.045"><i className="ambientShape ambientOrb"/></span>
      <span className="ambientLayer ambientLayerTwo" data-parallax-speed="0.075"><i className="ambientShape ambientRing"/></span>
      <span className="ambientLayer ambientLayerThree" data-parallax-speed="-0.11"><i className="ambientShape ambientPrism"/></span>
      <span className="ambientLayer ambientLayerFour" data-parallax-speed="0.035"><i className="ambientShape ambientGlow"/></span>
    </div>
  );
}
