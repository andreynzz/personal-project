import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroExperience() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= 960
    ) {
      return;
    }

    const hero = document.querySelector<HTMLElement>("[data-hero-root]") ?? document.querySelector<HTMLElement>("section");
    const headlineLines = document.querySelectorAll<HTMLElement>("[data-hero-line]");
    const heroContent = document.querySelector<HTMLElement>("[data-hero-content]");
    const heroVisual = document.querySelector<HTMLElement>("[data-hero-visual]");
    const heroImage = document.querySelector<HTMLElement>("[data-hero-image]");
    const heroReveal = document.querySelector<HTMLElement>("[data-hero-reveal]");
    const ticker = document.querySelector<HTMLElement>("[data-hero-ticker]");
    const glows = document.querySelectorAll<HTMLElement>("[data-hero-glow]");
    const heroMeta = heroContent?.querySelector<HTMLElement>("[data-hero-meta]");
    const heroCopy = heroContent?.querySelector<HTMLElement>("[data-hero-copy]");
    const heroActions = heroContent?.querySelector<HTMLElement>("[data-hero-actions]");

    const context = gsap.context(() => {
      if (headlineLines.length) {
        gsap.fromTo(
          headlineLines,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.11,
            ease: "power4.out",
            delay: 0.12
          }
        );
      }

      const secondaryTargets = [heroMeta, heroCopy, heroActions].filter(Boolean);

      if (secondaryTargets.length) {
        gsap.fromTo(
          secondaryTargets,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.42
          }
        );
      }

      if (heroReveal && heroImage) {
        gsap.set(heroImage, { scale: 1.16 });
        const tl = gsap.timeline({ delay: 0.18 });
        tl.fromTo(heroReveal, { xPercent: 0 }, { xPercent: 102, duration: 1.05, ease: "power4.inOut" });
        tl.to(heroImage, { scale: 1, duration: 1.3, ease: "power3.out" }, 0.08);
      }

      if (heroContent) {
        gsap.to(heroContent, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: heroContent,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }

      if (heroVisual) {
        gsap.to(heroVisual, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: heroVisual,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }

      if (heroImage) {
        gsap.to(heroImage, {
          yPercent: 8,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: heroImage,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }

      if (ticker) {
        const loop = gsap.to(ticker, {
          xPercent: -50,
          ease: "none",
          duration: 20,
          repeat: -1
        });

        let settleTween: gsap.core.Tween | null = null;

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const nextScale = gsap.utils.clamp(0.9, 2.1, Math.abs(velocity) / 1200 + 1);
            settleTween?.kill();

            gsap.to(loop, {
              timeScale: nextScale,
              duration: 0.16,
              overwrite: true,
            });

            settleTween = gsap.to(loop, {
              timeScale: 1,
              duration: 0.7,
              ease: "power2.out",
              delay: 0.08,
              overwrite: true
            });
          }
        });
      }
    }, hero ?? document.body);

    const quickGlowX = Array.from(glows).map((glow) => gsap.quickTo(glow, "x", { duration: 0.8, ease: "power3.out" }));
    const quickGlowY = Array.from(glows).map((glow) => gsap.quickTo(glow, "y", { duration: 0.8, ease: "power3.out" }));

    const onMouseMove = (event: MouseEvent) => {
      glows.forEach((_, index) => {
        const strength = index === 0 ? 0.016 : -0.01;
        quickGlowX[index]?.((event.clientX - window.innerWidth / 2) * strength);
        quickGlowY[index]?.((event.clientY - window.innerHeight / 2) * strength);
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      context.revert();
    };
  }, []);

  return null;
}
