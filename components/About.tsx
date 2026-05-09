"use client";

import { useRef } from "react";
import { useLocale } from "@/lib/i18n";
import { photo } from "@/lib/media";
import { useReveal } from "@/lib/useReveal";
import styles from "./About.module.css";

export default function About() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLElement>(null);

  useReveal(containerRef);

  return (
    <>
      <section id="about" ref={containerRef} className={styles.about}>
        <div className={styles.grid}>
          <div className="reveal">
            <p className={styles.eyebrow}>{t("about.eyebrow")}</p>
            <h2 className={styles.title}>{t("about.title")}</h2>
          </div>
          <div className="reveal">
            <p className={styles.lede}>{t("about.lede")}</p>
            <hr className={styles.rule} />
            <p className={styles.body}>{t("about.body1")}</p>
            <p className={styles.body}>{t("about.body2")}</p>
          </div>
        </div>
      </section>

      <div
        className={styles.parallaxBlock}
        style={{ backgroundImage: `url(${photo("Azurea-2.JPG")})` }}
      >
        <div className={styles.parallaxOverlay} />
        <div className={styles.quoteWrap}>
          <blockquote className={styles.quote}>{t("about.quote")}</blockquote>
          <p className={styles.quoteLocation}>{t("about.quoteLocation")}</p>
        </div>
      </div>
    </>
  );
}
