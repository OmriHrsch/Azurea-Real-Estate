"use client";

import { useState } from "react";
import { useLocale, type Locale } from "@/lib/i18n";
import styles from "./Navbar.module.css";

const NAV_LINK_KEYS = [
  { key: "nav.estate" as const, href: "#estate" },
  { key: "nav.poi" as const, href: "#poi" },
  { key: "nav.location" as const, href: "#location" },
  { key: "nav.vault" as const, href: "#vault" },
];

const LOCALES: Locale[] = ["en", "fr"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <span className={styles.logo}>Villa Azurea</span>

        <nav
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}
          aria-label={t("nav.aria.primary")}
        >
          {NAV_LINK_KEYS.map(({ key, href }) => (
            <a key={href} href={href} className={styles.navLink}>
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
