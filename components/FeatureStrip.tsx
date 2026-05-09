"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { photo } from "@/lib/media";
import { useReveal } from "@/lib/useReveal";
import styles from "./FeatureStrip.module.css";

export default function FeatureStrip() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  useReveal(containerRef);

  return (
    <div ref={containerRef}>
      <div className={styles.strip}>
        <div className={styles.cell}>
          <Image
            src={photo("Azurea-10.JPG")}
            alt={t("feature.leftAlt")}
            fill
            sizes="50vw"
            className={styles.image}
          />
        </div>
        <div className={styles.cell}>
          <Image
            src={photo("Azurea-12.JPG")}
            alt={t("feature.rightAlt")}
            fill
            sizes="50vw"
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.caption}>
        <div className={`${styles.inner} reveal`}>
          <p className={styles.eyebrow}>{t("feature.eyebrow")}</p>
          <h2 className={styles.title}>{t("feature.title")}</h2>
          <p className={styles.lead}>{t("feature.lead")}</p>
        </div>
      </div>
    </div>
  );
}
