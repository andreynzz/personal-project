import { motion } from "framer-motion";
import { heroBadges } from "../../../data/heroBadges";
import styles from "./HeroBadge.module.scss";

export default function HeroBadge() {
  return (
    <div className={styles.root}>
      {heroBadges.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            className={styles.card}
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
          >
            <span className={styles.icon}>
              <Icon size={18} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
