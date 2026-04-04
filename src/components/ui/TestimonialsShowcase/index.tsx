import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "../../../data/testimonials";
import styles from "./TestimonialsShowcase.module.scss";

gsap.registerPlugin(ScrollTrigger);

const cardVariants = [styles.cardTall, styles.cardOffset, styles.cardWide];

export default function TestimonialsShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-testimonial-card]", root);
      const images = gsap.utils.toArray<HTMLElement>("[data-testimonial-image]", root);

      const cleanupFns: Array<() => void> = [];

      gsap.set(cards, {
        autoAlpha: 0,
        y: 72,
        rotate: (index) => (index % 2 === 0 ? -5 : 5),
        scale: 0.94,
        transformOrigin: "50% 50%"
      });

      gsap.set(images, { scale: 1.18 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 76%"
        }
      });

      timeline.to(cards, {
        autoAlpha: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.14
      });

      images.forEach((image, index) => {
        gsap.to(image, {
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cards[index],
            start: "top 86%"
          }
        });
      });

      cards.forEach((card, index) => {
        const travel = index === 1 ? -28 : index === 2 ? -18 : -22;

        gsap.to(card, {
          y: travel,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        const media = card.querySelector<HTMLElement>("[data-testimonial-image]");
        const glow = card.querySelector<HTMLElement>("[data-testimonial-glow]");
        const badge = card.querySelector<HTMLElement>("[data-testimonial-badge]");

        const rotateXTo = gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power3.out" });
        const rotateYTo = gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.35, ease: "power3.out" });
        const glowXTo = glow ? gsap.quickTo(glow, "x", { duration: 0.4, ease: "power3.out" }) : null;
        const glowYTo = glow ? gsap.quickTo(glow, "y", { duration: 0.4, ease: "power3.out" }) : null;

        const handleMove = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          const offsetX = event.clientX - bounds.left;
          const offsetY = event.clientY - bounds.top;
          const rotateY = ((offsetX / bounds.width) - 0.5) * 10;
          const rotateX = (0.5 - offsetY / bounds.height) * 10;

          rotateXTo(rotateX);
          rotateYTo(rotateY);
          yTo(travel - 10);

          if (media) {
            gsap.to(media, {
              scale: 1.04,
              x: rotateY * 1.6,
              y: rotateX * -1.6,
              duration: 0.4,
              ease: "power3.out"
            });
          }

          if (badge) {
            gsap.to(badge, {
              x: rotateY * 0.7,
              y: rotateX * -0.7,
              duration: 0.35,
              ease: "power3.out"
            });
          }

          glowXTo?.((offsetX - bounds.width / 2) * 0.16);
          glowYTo?.((offsetY - bounds.height / 2) * 0.16);
        };

        const handleEnter = () => {
          card.dataset.interacting = "true";
        };

        const handleLeave = () => {
          card.dataset.interacting = "false";
          rotateXTo(0);
          rotateYTo(0);
          yTo(travel);

          if (media) {
            gsap.to(media, {
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.45,
              ease: "power3.out"
            });
          }

          if (badge) {
            gsap.to(badge, {
              x: 0,
              y: 0,
              duration: 0.4,
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
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div className={styles.stage} ref={rootRef}>
      {testimonials.map((testimonial, index) => (
        <article
          className={[styles.card, cardVariants[index] ?? ""].join(" ").trim()}
          key={testimonial.name}
          data-testimonial-card
        >
          <div className={styles.glow} data-testimonial-glow></div>
          <div className={styles.mediaFrame}>
            <div className={styles.media} data-testimonial-image>
              <img src={testimonial.image} alt={`Foto de ${testimonial.name}`} loading="lazy" />
            </div>
            <span className={styles.indexTag} data-testimonial-badge>0{index + 1}</span>
          </div>

          <div className={styles.content}>
            <span className={styles.result}>{testimonial.result}</span>
            <p className={styles.quote}>{testimonial.text}</p>
            <div className={styles.footer}>
              <strong>{testimonial.name}</strong>
              <span>Aluno(a) acompanhado(a)</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
