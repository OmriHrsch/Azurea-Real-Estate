"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { photo } from "@/lib/media";
import styles from "./EstateGallery.module.css";

const PANELS = [
  {
    file: "Azurea-2.JPG",
    title: "estate.section1.title",
    body: "estate.section1.body",
    alt: "estate.section1.alt",
  },
  {
    file: "Azurea-12.JPG",
    title: "estate.section2.title",
    body: "estate.section2.body",
    alt: "estate.section2.alt",
  },
  {
    file: "Azurea-20.JPG",
    title: "estate.section3.title",
    body: "estate.section3.body",
    alt: "estate.section3.alt",
  },
  {
    file: "Azurea-30.JPG",
    title: "estate.section4.title",
    body: "estate.section4.body",
    alt: "estate.section4.alt",
  },
  {
    file: "Azurea-46.JPG",
    title: "estate.section5.title",
    body: "estate.section5.body",
    alt: "estate.section5.alt",
  },
  {
    file: "Azurea-49.JPG",
    title: "estate.section6.title",
    body: "estate.section6.body",
    alt: "estate.section6.alt",
  },
] as const;

// Photos are 56vh tall, placed every 36vh → 20vh overlap between consecutive images.
// Total photo spread: 5 * 36vh + 56vh = 236vh, inside a 260vh section.
const PHOTO_STEP_VH = 36;
// Zone for text: each section occupies one photo step worth of scroll depth.
const ZONE_VH = PHOTO_STEP_VH;

export default function EstateGallery() {
  const { t } = useLocale();

  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const isScheduled = useRef(false);

  const [activeSection, setActiveSection] = useState(0);

  const updateActiveSection = useCallback(() => {
    isScheduled.current = false;
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const scrolled = -rect.top;
    if (scrolled < 0) return;

    const vh = window.innerHeight;
    const zoneHeightPx = (ZONE_VH / 100) * vh;
    const idx = Math.min(
      PANELS.length - 1,
      Math.max(0, Math.floor(scrolled / zoneHeightPx))
    );
    setActiveSection(idx);
  }, []);

  const onScroll = useCallback(() => {
    if (isScheduled.current) return;
    isScheduled.current = true;
    rafRef.current = requestAnimationFrame(updateActiveSection);
  }, [updateActiveSection]);

  useEffect(() => {
    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll, updateActiveSection]);

  return (
    <section id="estate" ref={sectionRef} className={styles.estate}>
      {/* Photos — statically placed in zigzag, appearing naturally as user scrolls */}
      <div className={styles.photoStrip} aria-hidden="true">
        {PANELS.map(({ file, alt }, i) => (
          <div
            key={file}
            className={`${styles.photoSlot} ${i % 2 === 0 ? styles.photoLeft : styles.photoRight}`}
            style={{ top: `calc(${i} * ${PHOTO_STEP_VH}vh)` }}
          >
            <Image
              src={photo(file)}
              alt={t(alt)}
              fill
              sizes="50vw"
              className={styles.photo}
              priority={i < 2}
            />
          </div>
        ))}
      </div>

      {/* Sticky text column — height:0 so it sticks for the full section */}
      <div className={styles.stickyLayer}>
        <div className={styles.textStack}>
          {PANELS.map(({ title, body }, i) => (
            <div
              key={i}
              className={`${styles.textCard} ${activeSection === i ? styles.textCardActive : ""}`}
            >
              <span className={styles.cardEyebrow}>{t("estate.label")}</span>
              <h2 className={styles.cardTitle}>{t(title)}</h2>
              <p className={styles.cardBody}>{t(body)}</p>
              <span className={styles.cardCounter}>
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(PANELS.length).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
