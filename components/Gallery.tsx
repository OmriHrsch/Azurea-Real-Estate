"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useLocale, type TranslationKey } from "@/lib/i18n";
import { photo, type PhotoKey } from "@/lib/media";
import { useReveal } from "@/lib/useReveal";
import styles from "./Gallery.module.css";

const SCROLL_STEP_RATIO = 0.6;
const FIRST_INDEX = 0;
const INDEX_DIGITS = 2;
const MIN_SCROLL_RANGE = 1;
const SCROLL_EDGE_TOLERANCE_PX = 2;
const LIGHTBOX_SWIPE_THRESHOLD_PX = 48;

interface GalleryCard {
  file: PhotoKey;
  size: "landscape" | "portrait" | "square";
  labelKey: TranslationKey;
}

interface SwipeStart {
  x: number;
  y: number;
}

const CARDS: GalleryCard[] = [
  { file: "Azurea-1.JPG", size: "landscape", labelKey: "gallery.card.1" },
  { file: "Azurea-3.JPG", size: "landscape", labelKey: "gallery.card.2" },
  { file: "Azurea-5.JPG", size: "square", labelKey: "gallery.card.3" },
  { file: "Azurea-6.JPG", size: "landscape", labelKey: "gallery.card.4" },
  { file: "Azurea-10.JPG", size: "square", labelKey: "gallery.card.5" },
  { file: "Azurea-12.JPG", size: "square", labelKey: "gallery.card.6" },
  { file: "Azurea-14.JPG", size: "square", labelKey: "gallery.card.7" },
  { file: "Azurea-18.JPG", size: "portrait", labelKey: "gallery.card.8" },
  { file: "Azurea-20.JPG", size: "portrait", labelKey: "gallery.card.9" },
  { file: "Azurea-22.JPG", size: "landscape", labelKey: "gallery.card.10" },
  { file: "Azurea-23.JPG", size: "square", labelKey: "gallery.card.11" },
  { file: "Azurea-25.JPG", size: "square", labelKey: "gallery.card.12" },
  { file: "Azurea-28.JPG", size: "landscape", labelKey: "gallery.card.13" },
  { file: "Azurea-30.JPG", size: "portrait", labelKey: "gallery.card.14" },
  { file: "Azurea-31.JPG", size: "square", labelKey: "gallery.card.15" },
  { file: "Azurea-32.JPG", size: "portrait", labelKey: "gallery.card.16" },
  { file: "Azurea-34.JPG", size: "square", labelKey: "gallery.card.17" },
  { file: "Azurea-40.JPG", size: "square", labelKey: "gallery.card.18" },
  { file: "Azurea-42.JPG", size: "square", labelKey: "gallery.card.19" },
  { file: "Azurea-47.JPG", size: "landscape", labelKey: "gallery.card.20" },
  { file: "Azurea-48.JPG", size: "landscape", labelKey: "gallery.card.21" },
  { file: "Azurea-50.JPG", size: "landscape", labelKey: "gallery.card.22" },
];

function formatIndex(index: number): string {
  return String(index + 1).padStart(INDEX_DIGITS, "0");
}

export default function Gallery() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const lightboxSwipeStartRef = useRef<SwipeStart | null>(null);
  const didSwipeLightboxRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(FIRST_INDEX);
  const [progress, setProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useReveal(sectionRef);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;

    let animationFrameId: number | null = null;

    const updateReelState = () => {
      const maxScroll = Math.max(
        reel.scrollWidth - reel.clientWidth,
        MIN_SCROLL_RANGE,
      );
      const reelCenter = reel.scrollLeft + reel.clientWidth / 2;
      const figures = Array.from(reel.querySelectorAll<HTMLElement>("figure"));
      const closestIndex = figures.reduce((closest, figure, index) => {
        const figureCenter = figure.offsetLeft + figure.offsetWidth / 2;
        const closestFigure = figures[closest];
        const closestCenter =
          closestFigure.offsetLeft + closestFigure.offsetWidth / 2;
        return Math.abs(figureCenter - reelCenter) <
          Math.abs(closestCenter - reelCenter)
          ? index
          : closest;
      }, FIRST_INDEX);

      setCurrentIndex(closestIndex);
      setProgress(reel.scrollLeft / maxScroll);
      setCanScrollPrev(reel.scrollLeft > SCROLL_EDGE_TOLERANCE_PX);
      setCanScrollNext(reel.scrollLeft < maxScroll - SCROLL_EDGE_TOLERANCE_PX);
    };

    const requestReelStateUpdate = () => {
      if (animationFrameId !== null) return;
      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = null;
        updateReelState();
      });
    };

    updateReelState();
    reel.addEventListener("scroll", requestReelStateUpdate, { passive: true });
    window.addEventListener("resize", requestReelStateUpdate);
    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      reel.removeEventListener("scroll", requestReelStateUpdate);
      window.removeEventListener("resize", requestReelStateUpdate);
    };
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) =>
          index === null ? null : (index - 1 + CARDS.length) % CARDS.length,
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) =>
          index === null ? null : (index + 1) % CARDS.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  function handleScroll(direction: -1 | 1): void {
    const reel = reelRef.current;
    if (!reel) return;
    reel.scrollBy({
      left: direction * reel.clientWidth * SCROLL_STEP_RATIO,
      behavior: "smooth",
    });
  }

  function moveLightbox(direction: -1 | 1): void {
    setLightboxIndex((index) =>
      index === null
        ? null
        : (index + direction + CARDS.length) % CARDS.length,
    );
  }

  function handleLightboxBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (didSwipeLightboxRef.current) {
      didSwipeLightboxRef.current = false;
      return;
    }

    if (event.target === event.currentTarget) {
      setLightboxIndex(null);
    }
  }

  function handleLightboxPointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== "touch") return;
    lightboxSwipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handleLightboxPointerUp(event: PointerEvent<HTMLDivElement>): void {
    const swipeStart = lightboxSwipeStartRef.current;
    lightboxSwipeStartRef.current = null;
    if (!swipeStart || event.pointerType !== "touch") return;

    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    const hasHorizontalSwipe =
      Math.abs(deltaX) >= LIGHTBOX_SWIPE_THRESHOLD_PX &&
      Math.abs(deltaX) > Math.abs(deltaY);

    if (!hasHorizontalSwipe) return;

    didSwipeLightboxRef.current = true;
    moveLightbox(deltaX > 0 ? -1 : 1);
  }

  const hasLightbox = lightboxIndex !== null;
  const activeLightboxIndex = lightboxIndex ?? FIRST_INDEX;
  const lightboxCard = hasLightbox ? CARDS[activeLightboxIndex] : null;

  return (
    <section id="gallery" ref={sectionRef} className={styles.gallery}>
      <div className={styles.header}>
        <div className="reveal">
          <p className={styles.eyebrow}>{t("gallery.eyebrow")}</p>
          <h2 className={styles.title}>{t("gallery.title")}</h2>
        </div>
        <p className={`${styles.meta} reveal`}>{t("gallery.meta")}</p>
      </div>

      <div ref={reelRef} className={`${styles.reel} reveal`}>
        {CARDS.map((card, index) => (
          <figure
            key={card.file}
            className={`${styles.card} ${styles[card.size]}`}
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={photo(card.file)}
              alt={t(card.labelKey)}
              fill
              sizes="(max-width: 960px) 86vw, 720px"
              className={styles.image}
            />
            <figcaption className={styles.caption}>
              <span className={styles.number}>{formatIndex(index)}</span>
              <span>{t(card.labelKey)}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => handleScroll(-1)}
          disabled={!canScrollPrev}
          aria-label={t("gallery.previous")}
        >
          ←
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => handleScroll(1)}
          disabled={!canScrollNext}
          aria-label={t("gallery.next")}
        >
          →
        </button>
        <div className={styles.progressTrack} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <p className={styles.counter}>
          {formatIndex(currentIndex)} / {formatIndex(CARDS.length - 1)}
        </p>
      </div>

      {lightboxCard && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          onClick={handleLightboxBackdropClick}
          onPointerDown={handleLightboxPointerDown}
          onPointerUp={handleLightboxPointerUp}
        >
          <button
            type="button"
            className={`${styles.lightboxButton} ${styles.lightboxClose}`}
            onClick={() => setLightboxIndex(null)}
            aria-label={t("gallery.close")}
          >
            ×
          </button>
          <button
            type="button"
            className={`${styles.lightboxButton} ${styles.lightboxPrev}`}
            onClick={() => moveLightbox(-1)}
            aria-label={t("gallery.previous")}
          >
            ←
          </button>
          <Image
            src={photo(lightboxCard.file)}
            alt={t(lightboxCard.labelKey)}
            width={1920}
            height={1080}
            className={styles.lightboxImage}
          />
          <button
            type="button"
            className={`${styles.lightboxButton} ${styles.lightboxNext}`}
            onClick={() => moveLightbox(1)}
            aria-label={t("gallery.next")}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
