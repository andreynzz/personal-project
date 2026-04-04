import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type UseScrollRevealAnimationOptions = {
  selector?: string;
  y?: number;
  duration?: number;
  start?: string;
};

export function useScrollRevealAnimation({
  selector = ".reveal",
  y = 36,
  duration = 0.9,
  start = "top 84%"
}: UseScrollRevealAnimationOptions = {}) {
  useEffect(() => {
    const context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(selector);

      elements.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start
            }
          }
        );
      });
    });

    return () => {
      context.revert();
    };
  }, [duration, selector, start, y]);
}
