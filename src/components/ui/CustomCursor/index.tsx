import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.scss";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;

    if (!cursor || !ring) {
      return;
    }

    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let currentX = mouseX;
    let currentY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const render = () => {
      currentX += (mouseX - currentX) * 0.28;
      currentY += (mouseY - currentY) * 0.28;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      rafId = window.requestAnimationFrame(render);
    };

    const setInteractiveState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target.closest<HTMLElement>("[data-cursor], a, button") : null;
      const isInteractive = Boolean(element);
      const isInverse = element?.dataset.cursor === "inverse";

      document.body.dataset.cursorMode = isInteractive ? "active" : "";
      document.body.dataset.cursorVariant = isInverse ? "inverse" : "";
    };

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setInteractiveState(event.target);
    };

    const onLeave = () => {
      document.body.dataset.cursorMode = "";
      document.body.dataset.cursorVariant = "";
    };

    const magneticElements = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const magneticCleanups = magneticElements.map((element) => {
      const onMagneticMove = (event: MouseEvent) => {
        const bounds = element.getBoundingClientRect();
        const offsetX = event.clientX - (bounds.left + bounds.width / 2);
        const offsetY = event.clientY - (bounds.top + bounds.height / 2);
        element.style.transform = `translate3d(${offsetX * 0.08}px, ${offsetY * 0.08}px, 0)`;
      };

      const onMagneticLeave = () => {
        element.style.transform = "";
      };

      element.addEventListener("mousemove", onMagneticMove);
      element.addEventListener("mouseleave", onMagneticLeave);

      return () => {
        element.removeEventListener("mousemove", onMagneticMove);
        element.removeEventListener("mouseleave", onMagneticLeave);
      };
    });

    document.body.dataset.cursorReady = "true";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    rafId = window.requestAnimationFrame(render);

    return () => {
      document.body.dataset.cursorReady = "";
      document.body.dataset.cursorMode = "";
      document.body.dataset.cursorVariant = "";
      magneticCleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={styles.cursorRoot} aria-hidden="true">
      <div className={styles.cursorRing} data-cursor-ring ref={ringRef}></div>
      <div className={styles.cursorDot} data-cursor-dot ref={cursorRef}></div>
    </div>
  );
}
