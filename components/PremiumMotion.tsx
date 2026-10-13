"use client";
import { useEffect } from "react";

const tiltSelector = ".food,.facts > div,.stat,.panel,.orderCard,.promoGrid article,.trackingCard,.adminLoginCard,.onlinePaymentBlock";
const magneticSelector = ".outline,.siteBrand,.mobileMenuToggle";
const rippleSelector = ".pill,.primaryBtn,.outline,.headerCart,.mobileMenuToggle,.iconBtn,.tabs button";
const revealSelector = ".heroCard,.sectionTop,.food,.split > *,.facts > div,.dark > *,.menuHero > *,.menuTools,.trackHero > *,.trackForm,.trackingCard,.stat,.panel,.orderCard,.promoGrid article";

export default function PremiumMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const abort = new AbortController();
    const observed = new WeakSet<HTMLElement>();
    root.classList.add("premium-motion-ready");
    if (reduced) root.classList.add("premium-motion-reduced");

    const reveal = reduced ? null : new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).classList.add("is-revealed");
      reveal?.unobserve(entry.target);
    }), { rootMargin: "0px 0px -8% 0px", threshold: .12 });
    const scan = () => {
      if (fine && !reduced) document.querySelectorAll<HTMLElement>(tiltSelector).forEach(el => el.classList.add("tilt3d"));
      if (fine && !reduced) document.querySelectorAll<HTMLElement>(magneticSelector).forEach(el => el.classList.add("magneticFx"));
      document.querySelectorAll<HTMLElement>(rippleSelector).forEach(el => el.classList.add("rippleFx"));
      if (!reveal) return;
      document.querySelectorAll<HTMLElement>(revealSelector).forEach((el, i) => {
        if (observed.has(el)) return;
        observed.add(el); el.classList.add("motionReveal");
        el.style.setProperty("--reveal-delay", `${Math.min(i % 5, 4) * 65}ms`); reveal.observe(el);
      });
    };
    scan();
    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });

    let frame = 0, event: PointerEvent | null = null, activeTilt: HTMLElement | null = null, activeMagnet: HTMLElement | null = null;
    const resetTilt = (el: HTMLElement | null) => { if (el) { el.style.setProperty("--tilt-rx", "0deg"); el.style.setProperty("--tilt-ry", "0deg"); el.classList.remove("is-tilting"); } };
    const resetMagnet = (el: HTMLElement | null) => { if (el) { el.style.setProperty("--mag-x", "0px"); el.style.setProperty("--mag-y", "0px"); } };
    const update = () => {
      frame = 0; if (!event) return;
      const target = event.target as Element | null;
      const tilt = target?.closest<HTMLElement>(tiltSelector) || null;
      const magnet = target?.closest<HTMLElement>(magneticSelector) || null;
      if (tilt !== activeTilt) { resetTilt(activeTilt); activeTilt = tilt; }
      if (magnet !== activeMagnet) { resetMagnet(activeMagnet); activeMagnet = magnet; }
      if (tilt) {
        const r = tilt.getBoundingClientRect(), x = Math.min(1, Math.max(0, (event.clientX-r.left)/r.width)), y = Math.min(1, Math.max(0, (event.clientY-r.top)/r.height));
        tilt.style.setProperty("--tilt-rx", `${((.5-y)*7).toFixed(2)}deg`); tilt.style.setProperty("--tilt-ry", `${((x-.5)*7).toFixed(2)}deg`);
        tilt.style.setProperty("--glow-x", `${(x*100).toFixed(1)}%`); tilt.style.setProperty("--glow-y", `${(y*100).toFixed(1)}%`); tilt.classList.add("is-tilting");
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect(), x = (event.clientX-r.left)/r.width-.5, y = (event.clientY-r.top)/r.height-.5;
        magnet.style.setProperty("--mag-x", `${(x*7).toFixed(2)}px`); magnet.style.setProperty("--mag-y", `${(y*5).toFixed(2)}px`);
        magnet.style.setProperty("--ripple-x", `${((x+.5)*100).toFixed(1)}%`); magnet.style.setProperty("--ripple-y", `${((y+.5)*100).toFixed(1)}%`);
      }
    };
    const onMove = (e: PointerEvent) => { if (!fine || reduced) return; event=e; if (!frame) frame=requestAnimationFrame(update); };
    const onOut = (e: PointerEvent) => { if (e.relatedTarget && document.documentElement.contains(e.relatedTarget as Node)) return; resetTilt(activeTilt); resetMagnet(activeMagnet); activeTilt=null; activeMagnet=null; };
    const onClick = (e: MouseEvent) => {
      if (reduced) return; const el=(e.target as Element | null)?.closest<HTMLElement>(rippleSelector); if (!el) return;
      const r=el.getBoundingClientRect(), ripple=document.createElement("span"); ripple.className="motionRipple"; ripple.style.left=`${e.clientX-r.left}px`; ripple.style.top=`${e.clientY-r.top}px`; el.appendChild(ripple); setTimeout(()=>ripple.remove(),760);
    };
    document.addEventListener("pointermove",onMove,{signal:abort.signal,passive:true}); document.addEventListener("pointerout",onOut,{signal:abort.signal,passive:true}); document.addEventListener("click",onClick,{signal:abort.signal});

    const layers=Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-speed]")); let scrollFrame=0;
    const updateScroll=()=>{scrollFrame=0;layers.forEach(el=>el.style.setProperty("--scroll-shift",`${(scrollY*Number(el.dataset.parallaxSpeed||0)).toFixed(2)}px`))};
    const onScroll=()=>{if(!scrollFrame&&!reduced)scrollFrame=requestAnimationFrame(updateScroll)}; updateScroll(); addEventListener("scroll",onScroll,{signal:abort.signal,passive:true});
    return()=>{abort.abort();mutation.disconnect();reveal?.disconnect();if(frame)cancelAnimationFrame(frame);if(scrollFrame)cancelAnimationFrame(scrollFrame);root.classList.remove("premium-motion-ready","premium-motion-reduced")};
  },[]);
  return <div className="premiumAmbient" aria-hidden="true"><span className="ambientLayer ambientLayerOne" data-parallax-speed="-0.045"><i className="ambientShape ambientOrb"/></span><span className="ambientLayer ambientLayerTwo" data-parallax-speed="0.075"><i className="ambientShape ambientRing"/></span><span className="ambientLayer ambientLayerThree" data-parallax-speed="-0.11"><i className="ambientShape ambientPrism"/></span><span className="ambientLayer ambientLayerFour" data-parallax-speed="0.035"><i className="ambientShape ambientGlow"/></span></div>;
}
