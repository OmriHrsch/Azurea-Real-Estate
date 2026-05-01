"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { photo, VIDEO_URL } from "@/lib/media";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = useLocale();
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!bgRef.current) return;
        const offset = Math.min(window.scrollY * 0.35, 200);
        bgRef.current.style.transform = `scale(1.06) translateY(${offset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.hero}>
      <div ref={bgRef} className={styles.heroBg}>
        <Image
          src={photo("Azurea-6.JPG")}
          alt={t("hero.imageAlt")}
          fill
          priority
          className={styles.heroImage}
        />
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>
      <div className={styles.heroOverlay} />
      <div className={styles.scrollIndicator} aria-hidden="true" />
    </section>
  );
}
