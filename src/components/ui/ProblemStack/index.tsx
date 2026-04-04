import { useRef } from "react";
import { pains } from "../../../data/pains";
import { useTiltedStackAnimation } from "../../../hooks/useTiltedStackAnimation";
import styles from "./ProblemStack.module.scss";

const variants = [styles.cardVariant1, styles.cardVariant2, styles.cardVariant3];

export default function ProblemStack() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useTiltedStackAnimation({
    root: rootRef,
    cardSelector: "[data-problem-card]",
    glowSelector: "[data-problem-glow]",
    numberSelector: "[data-problem-number]",
    contentSelector: "[data-problem-content]",
    travelByIndex: (index) => (index === 1 ? -38 : index === 2 ? -24 : -30)
  });

  return (
    <div className={styles.stack} ref={rootRef}>
      {pains.map((pain, index) => (
        <article
          className={[styles.card, variants[index] ?? ""].join(" ").trim()}
          key={pain.number}
          data-problem-card
        >
          <div className={styles.glow} data-problem-glow></div>
          <span className={styles.number} data-problem-number>{pain.number}</span>
          <div className={styles.cardContent} data-problem-content>
            <h3>{pain.title}</h3>
            <p>{pain.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
