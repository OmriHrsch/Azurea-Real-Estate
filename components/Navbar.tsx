"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import { useLocale, type Locale } from "@/lib/i18n";
import styles from "./Navbar.module.css";

const SCROLLED_THRESHOLD_PX = 60;
const MIN_SCROLL_DURATION_MS = 720;
const MAX_SCROLL_DURATION_MS = 1300;
const SCROLL_DURATION_DISTANCE_RATIO = 1.7;
const NAVBAR_SCROLL_GAP_PX = 18;
const TOP_OF_PAGE_Y = 0;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const NAV_LINK_KEYS = [
  { key: "nav.estate" as const, href: "#about" },
  { key: "nav.location" as const, href: "#location" },
  { key: "nav.gallery" as const, href: "#gallery" },
];

const LOCALES: Locale[] = ["en", "fr"];

function easeOutQuint(progress: number): number {
  return 1 - Math.pow(1 - progress, 5);
}

function focusSectionTarget(target: HTMLElement): void {
  const hadTabIndex = target.hasAttribute("tabindex");

  if (!hadTabIndex) {
    target.setAttribute("tabindex", "-1");
  }

  target.focus({ preventScroll: true });

  if (!hadTabIndex) {
    target.addEventListener(
      "blur",
      () => {
        target.removeAttribute("tabindex");
      },
      { once: true },
    );
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  const rafRef = useRef<number>(0);
  const isScheduled = useRef(false);
  const scrollAnimationRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isScheduled.current) return;
      isScheduled.current = true;
      rafRef.current = requestAnimationFrame(() => {
        isScheduled.current = false;
        setScrolled(window.scrollY > SCROLLED_THRESHOLD_PX);
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(scrollAnimationRef.current);
    };
  }, []);

  const scrollToPosition = (targetY: number, onComplete?: () => void): void => {
    setMenuOpen(false);
    cancelAnimationFrame(scrollAnimationRef.current);

    const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      onComplete?.();
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(
      MAX_SCROLL_DURATION_MS,
      Math.max(MIN_SCROLL_DURATION_MS, Math.abs(distance) / SCROLL_DURATION_DISTANCE_RATIO),
    );
    let startedAt: number | null = null;

    const scrollFrame = (timestamp: number) => {
      startedAt ??= timestamp;
      const elapsed = timestamp - startedAt;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, startY + distance * easeOutQuint(progress));

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(scrollFrame);
        return;
      }

      onComplete?.();
    };

    scrollAnimationRef.current = requestAnimationFrame(scrollFrame);
  };

  const handleTopLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const pageUrl = `${window.location.pathname}${window.location.search}`;
    scrollToPosition(TOP_OF_PAGE_Y, () => window.history.pushState(null, "", pageUrl));
  };

  const handleSectionLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.getElementById(href.slice(1));
    if (!target) {
      setMenuOpen(false);
      return;
    }

    event.preventDefault();

    const navbarHeight = event.currentTarget.closest("header")?.getBoundingClientRect().height ?? 0;
    const targetY = Math.max(
      target.getBoundingClientRect().top + window.scrollY - navbarHeight - NAVBAR_SCROLL_GAP_PX,
      TOP_OF_PAGE_Y,
    );

    scrollToPosition(targetY, () => {
      window.history.pushState(null, "", href);
      focusSectionTarget(target);
    });
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navInner}>
        <a href="#" className={styles.logo} aria-label={t("nav.aria.home")} onClick={handleTopLinkClick}>
          AZURÉA
        </a>

        <nav
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}
          aria-label={t("nav.aria.primary")}
        >
          {NAV_LINK_KEYS.map(({ key, href }) => (
            <a
              key={href}
              href={href}
              className={styles.navLink}
              onClick={(event) => handleSectionLinkClick(event, href)}
            >
              {t(key)}
            </a>
          ))}
          <a
            href="#contact"
            className={`${styles.navLink} ${styles.mobileCta}`}
            onClick={(event) => handleSectionLinkClick(event, "#contact")}
          >
            {t("nav.cta")}
          </a>
        </nav>

        <div className={styles.navRight}>
          <div className={styles.localeSwitcher}>
            {LOCALES.map((l, i) => (
              <span key={l} className={styles.localePair}>
                {i > 0 && <span className={styles.localeSep}>|</span>}
                <button
                  className={`${styles.localeBtn} ${locale === l ? styles.localeBtnActive : ""}`}
                  onClick={() => setLocale(l)}
                >
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>

          <a
            href="#contact"
            className={styles.ctaButton}
            onClick={(event) => handleSectionLinkClick(event, "#contact")}
          >
            {t("nav.cta")}
          </a>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={t("nav.aria.toggle")}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
