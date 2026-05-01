"use client";

import { useState, useEffect } from "react";
import { useLocale, type Locale } from "@/lib/i18n";
import styles from "./Navbar.module.css";

const NAV_LINK_KEYS = [
  { key: "nav.estate" as const, href: "#about" },
  { key: "nav.location" as const, href: "#location" },
  { key: "nav.gallery" as const, href: "#gallery" },
  { key: "nav.contact" as const, href: "#contact" },
];

const LOCALES: Locale[] = ["en", "fr"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navInner}>
        <span className={styles.logo}>AZURÉA</span>

        <nav
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}
          aria-label={t("nav.aria.primary")}
        >
          {NAV_LINK_KEYS.map(({ key, href }) => (
            <a
              key={href}
              href={href}
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              {t(key)}
            </a>
          ))}
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

          <a href="#contact" className={styles.ctaButton}>
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
