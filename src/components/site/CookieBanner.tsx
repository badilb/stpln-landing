"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { setConsent, useConsent } from "@/lib/consent";
import s from "./CookieBanner.module.css";

// Короткая полоса внизу, не модалка и не на пол-экрана: сайт работает и без ответа.
export function CookieBanner() {
  const { lang, t } = useI18n();
  const consent = useConsent();
  if (consent !== null) return null;

  return (
    <div className={s.banner} role="region" aria-label="Cookies">
      <p>
        {t.cookie.text} <Link href={href(lang, "/cookies")}>{t.cookie.more}</Link>
      </p>
      <div className={s.actions}>
        <button type="button" className={s.secondary} onClick={() => setConsent("necessary")}>
          {t.cookie.necessary}
        </button>
        <button type="button" className={s.primary} onClick={() => setConsent("all")}>
          {t.cookie.accept}
        </button>
      </div>
    </div>
  );
}
