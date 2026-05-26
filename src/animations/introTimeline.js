import gsap from "gsap";

export function createIntroTimeline({ overlay, title, onComplete }) {
  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete
  });

  timeline
    .set(overlay, { opacity: 0 })
    .to(overlay, { opacity: 1, duration: 1.35 }, 0.25)
    .fromTo(".hud-panel", { opacity: 0, y: 24, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, duration: 1.1 }, 1.65)
    .fromTo(".hud-readout", { opacity: 0, x: -18 }, { opacity: 1, x: 0, stagger: 0.045, duration: 0.7 }, 2.1)
    .fromTo(".waveform-shell", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, 2.35)
    .fromTo(title, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9 }, 2.55)
    .fromTo(".system-online", { opacity: 0, letterSpacing: "0.5em" }, { opacity: 1, letterSpacing: "0.18em", duration: 1.1 }, 3.05);

  return timeline;
}
