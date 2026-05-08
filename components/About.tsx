"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { photo } from "@/lib/media";
import { useReveal } from "@/lib/useReveal";
import styles from "./About.module.css";

export default function About() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLElement>(null);
  const parallaxBlockRef = useRef<HTMLDivElement>(null);
  const parallaxImgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useReveal(containerRef);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 960px)").matches;
    if (prefersReduced || isMobile) return;

    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!parallaxBlockRef.current || !parallaxImgRef.current) return;
        const rect = parallaxBlockRef.current.getBoundingClientRect();
        const ratio =
          (rect.top + rect.height / 2 - window.innerHeight / 2) /
          window.innerHeight;
        parallaxImgRef.current.style.transform = `scale(1.25) translateY(${ratio * -48}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
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

      <div ref={parallaxBlockRef} className={styles.parallaxBlock}>
        <div ref={parallaxImgRef} className={styles.parallaxImg}>
          <Image
            src={photo("Azurea-2.JPG")}
            alt={t("about.imageAlt")}
            fill
            sizes="100vw"
            priority
            className={styles.image}
          />
        </div>
        <div className={styles.parallaxOverlay} />
        <div className={styles.quoteWrap}>
          <blockquote className={styles.quote}>{t("about.quote")}</blockquote>
          <p className={styles.quoteLocation}>{t("about.quoteLocation")}</p>
        </div>
      </div>
    </section>
  );
}
