"use client";

import { useRef } from "react";
import { useLocale } from "@/lib/i18n";
import { useReveal } from "@/lib/useReveal";
import styles from "./Narrative.module.css";

export default function Narrative() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLElement>(null);

  useReveal(containerRef);

  return (
    <section ref={containerRef} className={styles.narrative}>
      <div className={`${styles.inner} reveal`}>
        <p className={styles.eyebrow}>{t("narrative.eyebrow")}</p>
        <p className={styles.para}>{t("narrative.para1")}</p>
        <p className={styles.para}>{t("narrative.para2")}</p>
      </div>
    </section>
  );
}
