"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useLocale } from "@/lib/i18n";
import { useReveal } from "@/lib/useReveal";
import styles from "./Location.module.css";

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading} aria-hidden="true" />,
});

export default function Location() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLElement>(null);

  useReveal(containerRef);

  return (
    <section id="location" ref={containerRef} className={styles.location}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className="reveal">
            <p className={styles.eyebrow}>{t("location.eyebrow")}</p>
            <h2 className={styles.title}>{t("location.title")}</h2>
          </div>
          <p className={`${styles.intro} reveal`}>{t("location.intro")}</p>
        </div>

        <div className={`${styles.mapShell} reveal`}>
          <LocationMap />
        </div>
      </div>
    </section>
  );
}
