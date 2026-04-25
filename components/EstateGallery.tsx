"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { photo } from "@/lib/media";
import styles from "./EstateGallery.module.css";

const PANELS = [
  { file: "Azurea-2.JPG",  captionKey: "estate.panel1.caption" as const },
  { file: "Azurea-12.JPG", captionKey: "estate.panel2.caption" as const },
  { file: "Azurea-20.JPG", captionKey: "estate.panel3.caption" as const },
  { file: "Azurea-30.JPG", captionKey: "estate.panel4.caption" as const },
  { file: "Azurea-46.JPG", captionKey: "estate.panel5.caption" as const },
  { file: "Azurea-49.JPG", captionKey: "estate.panel6.caption" as const },
] as const;

export default function EstateGallery() {
  const { t } = useLocale();

  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const isScheduled = useRef(false);

  const [activePanel, setActivePanel] = useState(0);
  const [inView, setInView] = useState(false);

  const updateParallax = useCallback(() => {
    isScheduled.current = false;
    const scrollY = window.scrollY;
    const overflowPx = window.innerHeight * 0.2;

    panelRefs.current.forEach((panel, i) => {
      const img = imageRefs.current[i];
      if (!panel || !img) return;
      const panelTop = panel.getBoundingClientRect().top + scrollY;
      const relPos = scrollY - panelTop;
      const translateY = relPos * 0.35 - overflowPx;
      img.style.transform = `translateY(${translateY}px)`;
    });
  }, []);

  const onScroll = useCallback(() => {
    if (isScheduled.current) return;
    isScheduled.current = true;
    rafRef.current = requestAnimationFrame(updateParallax);
  }, [updateParallax]);

  // Parallax engine
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateParallax());
    if (sectionRef.current) ro.observe(sectionRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll, updateParallax]);

  // Active panel tracker
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActivePanel(i);
        },
        { threshold: 0.5 }
      );
      obs.observe(panel);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Section visibility (for fixed overlays)
  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="estate" ref={sectionRef} className={styles.estateGallery}>
      {inView && (
        <div className={styles.progressBar} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ height: `${((activePanel + 1) / PANELS.length) * 100}%` }}
          />
        </div>
      )}

      {inView && (
        <div className={styles.panelCounter} aria-hidden="true">
          <span className={styles.panelCurrent}>
            {String(activePanel + 1).padStart(2, "0")}
          </span>
          <span className={styles.panelSep}>/</span>
          <span className={styles.panelTotal}>
            {String(PANELS.length).padStart(2, "0")}
          </span>
        </div>
      )}

      <div className={styles.sectionLabel} aria-hidden="true">
        <span className={styles.sectionLabelText}>{t("estate.label")}</span>
      </div>

      {PANELS.map(({ file, captionKey }, i) => (
        <div
          key={file}
          className={styles.panel}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
        >
          <div
            className={styles.imageWrapper}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
          >
            <Image
              src={photo(file)}
              alt={t(captionKey)}
              fill
              sizes="100vw"
              className={styles.panelImage}
              priority={i === 0}
            />
          </div>

          <div className={styles.panelOverlay} />

          <p className={styles.panelCaption}>{t(captionKey)}</p>
        </div>
      ))}
    </section>
  );
}
