import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type UseTiltedStackAnimationOptions = {
  root: React.RefObject<HTMLElement | null>;
  cardSelector: string;
  glowSelector?: string;
  numberSelector?: string;
  contentSelector?: string;
  enterStart?: string;
  baseY?: number;
  hoverTilt?: number;
  hoverLift?: number;
  travelByIndex?: (index: number) => number;
};

export function useTiltedStackAnimation({
  root,
  cardSelector,
  glowSelector,
  numberSelector,
  contentSelector,
  enterStart = "top 76%",
  baseY = 96,
  hoverTilt = 8,
  hoverLift = 8,
  travelByIndex = (index) => (index === 1 ? -38 : index === 2 ? -24 : -30)
}: UseTiltedStackAnimationOptions) {
  useEffect(() => {
    const rootElement = root.current;

    if (!rootElement) {
      return;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= 960
    ) {
      return;
    }

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(cardSelector, rootElement);
      const cleanupFns: Array<() => void> = [];

      gsap.set(cards, {
        autoAlpha: 0,
        y: baseY,
        rotate: (index) => (index === 1 ? 2 : -2),
        scale: 0.96,
        transformOrigin: "50% 50%"
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootElement,
          start: enterStart
        }
      });

      timeline.to(cards, {
        autoAlpha: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14
      });

      cards.forEach((card, index) => {
        const travel = travelByIndex(index);

        gsap.to(card, {
          y: travel,
          ease: "none",
          scrollTrigger: {
            trigger: rootElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        const glow = glowSelector ? card.querySelector<HTMLElement>(glowSelector) : null;
        const number = numberSelector ? card.querySelector<HTMLElement>(numberSelector) : null;
        const content = contentSelector ? card.querySelector<HTMLElement>(contentSelector) : null;

        const rotateXTo = gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power3.out" });
        const rotateYTo = gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.35, ease: "power3.out" });
        const glowXTo = glow ? gsap.quickTo(glow, "x", { duration: 0.4, ease: "power3.out" }) : null;
        const glowYTo = glow ? gsap.quickTo(glow, "y", { duration: 0.4, ease: "power3.out" }) : null;

        const handleMove = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          const offsetX = event.clientX - bounds.left;
          const offsetY = event.clientY - bounds.top;
          const rotateY = ((offsetX / bounds.width) - 0.5) * hoverTilt;
          const rotateX = (0.5 - offsetY / bounds.height) * hoverTilt;

          rotateXTo(rotateX);
          rotateYTo(rotateY);
          yTo(travel - hoverLift);

          if (number) {
            gsap.to(number, {
              x: rotateY * 0.7,
              y: rotateX * -0.7,
              duration: 0.35,
              ease: "power3.out"
            });
          }

          if (content) {
            gsap.to(content, {
              x: rotateY * 0.45,
              y: rotateX * -0.45,
              duration: 0.35,
              ease: "power3.out"
            });
          }

          glowXTo?.((offsetX - bounds.width / 2) * 0.12);
          glowYTo?.((offsetY - bounds.height / 2) * 0.12);
        };

        const handleEnter = () => {
          card.dataset.interacting = "true";
        };

        const handleLeave = () => {
          card.dataset.interacting = "false";
          rotateXTo(0);
          rotateYTo(0);
          yTo(travel);

          if (number) {
            gsap.to(number, {
              x: 0,
              y: 0,
              duration: 0.35,
              ease: "power3.out"
            });
          }

          if (content) {
            gsap.to(content, {
              x: 0,
              y: 0,
              duration: 0.35,
              ease: "power3.out"
            });
          }

          glowXTo?.(0);
          glowYTo?.(0);
        };

        card.addEventListener("pointerenter", handleEnter);
        card.addEventListener("pointermove", handleMove);
        card.addEventListener("pointerleave", handleLeave);

        cleanupFns.push(() => {
          card.removeEventListener("pointerenter", handleEnter);
          card.removeEventListener("pointermove", handleMove);
          card.removeEventListener("pointerleave", handleLeave);
        });
      });

      return () => {
        cleanupFns.forEach((cleanup) => cleanup());
      };
    }, rootElement);

    return () => {
      context.revert();
    };
  }, [
    baseY,
    cardSelector,
    contentSelector,
    enterStart,
    glowSelector,
    hoverLift,
    hoverTilt,
    numberSelector,
    root,
    travelByIndex
  ]);
}
