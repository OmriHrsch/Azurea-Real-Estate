"use client";

import { useRef } from "react";
import { useLocale } from "@/lib/i18n";
import { BROCHURE_DOWNLOAD_FILENAME, photo } from "@/lib/media";
import { useReveal } from "@/lib/useReveal";
import styles from "./Contact.module.css";

const BROCHURE_DOWNLOAD_PATH = "/api/brochure";

const AGENTS = [
  {
    name: "Bérangère Calabria",
    phoneDisplay: "+33 6 58 71 44 80",
    phoneTel: "+33658714480",
  },
  {
    name: "Caroline Raoux",
    phoneDisplay: "+33 6 83 38 50 56",
    phoneTel: "+33683385056",
  },
];

const WHATSAPP_API_URL = "https://wa.me";
const NON_DIGIT_PATTERN = /\D/g;

function createWhatsAppUrl(phoneNumber: string, message: string): string {
  const whatsappNumber = phoneNumber.replace(NON_DIGIT_PATTERN, "");
  const params = new URLSearchParams({ text: message });

  return `${WHATSAPP_API_URL}/${whatsappNumber}?${params.toString()}`;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.34 4.95L2.05 22l5.28-1.38a9.9 9.9 0 0 0 4.71 1.2h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.13.82.84-3.05-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.53 3.69-8.22 8.23-8.22a8.2 8.2 0 0 1 8.22 8.22c0 4.53-3.69 8.22-8.23 8.22Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.74 2.66 4.22 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.17.21-.58.21-1.07.14-1.17-.06-.1-.22-.16-.47-.29Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3v11.2m0 0 4.2-4.2M12 14.2 7.8 10M5 19h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function Contact() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const whatsappMessage = t("contact.whatsapp.message");

  useReveal(sectionRef);

  return (
    <section id="contact" ref={sectionRef} className={styles.contact}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${photo("Azurea-50.JPG")})` }}
        aria-hidden="true"
      />
      <div className={styles.inner}>
        <p className={`${styles.eyebrow} reveal`}>{t("contact.eyebrow")}</p>
        <h2 className={`${styles.title} reveal`}>{t("contact.title")}</h2>
        <div className={`${styles.rule} reveal`} />
        <p className={`${styles.lede} reveal`}>{t("contact.lede")}</p>

        <div className={`${styles.agents} reveal`}>
          {AGENTS.map((agent) => (
            <article key={agent.phoneTel} className={styles.agent}>
              <p className={styles.role}>{t("contact.agent.role")}</p>
              <h3 className={styles.name}>{agent.name}</h3>
              <div className={styles.actions}>
                <a className={styles.primaryAction} href={`tel:${agent.phoneTel}`}>
                  <PhoneIcon />
                  <span>{t("contact.call")}</span>
                  <strong>{agent.phoneDisplay}</strong>
                </a>
                <a
                  className={styles.secondaryAction}
                  href={createWhatsAppUrl(agent.phoneTel, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  <span>{t("contact.whatsapp")}</span>
                  <strong>{agent.phoneDisplay}</strong>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className={`${styles.secondaryRow} reveal`}>
          <a href="mailto:private.viewings@azurea.fr" className={styles.email}>
            private.viewings@azurea.fr
          </a>
          <span className={styles.divider} aria-hidden="true" />
          <a
            href={BROCHURE_DOWNLOAD_PATH}
            className={styles.brochure}
            download={BROCHURE_DOWNLOAD_FILENAME}
          >
            <DownloadIcon />
            {t("contact.brochure")}
          </a>
        </div>
      </div>
    </section>
  );
}
