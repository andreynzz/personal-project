import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= 960
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: window.innerWidth > 960 ? 1.25 : 1.05,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 0.95,
      wheelMultiplier: 0.78,
      infinite: false,
      anchors: true,
      easing: (t: number) => 1 - Math.pow(1 - t, 3.4)
    });

    const onScroll = () => {
      ScrollTrigger.update();
    };

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    lenis.on("scroll", onScroll);
    gsap.ticker.lagSmoothing(0);
    frameId = window.requestAnimationFrame(raf);
    document.documentElement.classList.add("has-smooth-scroll");
    document.body.dataset.scrollMode = "smooth";

    const onRefresh = () => {
      lenis.resize();
    };

    ScrollTrigger.addEventListener("refresh", onRefresh);

    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      document.documentElement.classList.remove("has-smooth-scroll");
      document.body.dataset.scrollMode = "";
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
