"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import styles from "./Hero.module.css";
import manifest from "@/lib/media-manifest.json";

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className={styles.hero}>
      <Image
        src={manifest.photos["Azurea-10.JPG"]}
        alt={t("hero.imageAlt")}
        fill
        priority
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroHeading}>{t("hero.heading")}</h1>
        <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>
      </div>
    </section>
  );
}
