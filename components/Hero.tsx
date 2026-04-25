"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { photo, type PhotoKey } from "@/lib/media";
import styles from "./Hero.module.css";

const HERO_IMAGE: PhotoKey = "Azurea-10.JPG";

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className={styles.hero}>
      <Image
        src={photo(HERO_IMAGE)}
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
