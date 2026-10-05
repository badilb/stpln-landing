"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { useI18n } from "@/i18n/client";
import { Icon } from "./Icon";
import s from "./MapEmbed.module.css";

// Карта 2ГИС грузится по клику: до этого — заглушка без запросов к 2gis.kz,
// чтобы сторонние cookies не ставились без действия посетителя.
export function MapEmbed() {
  const { lang, t } = useI18n();
  const [on, setOn] = useState(false);
  const options = {
    pos: { lat: site.coords.lat, lon: site.coords.lon, zoom: 16 },
    opt: { city: "astana", lang: lang === "en" ? "en" : "ru" },
    org: site.firmId,
  };
  const src = `https://widgets.2gis.com/widget?type=firmsonmap&options=${encodeURIComponent(JSON.stringify(options))}`;

  return (
    <div className={s.map}>
      {on ? (
        <iframe src={src} title={t.map.title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className={s.facade}>
          <span className={s.pin} aria-hidden>
            <Icon name="pin" size={28} />
          </span>
          <p className={s.addr}>
            {t.site.city}, {t.site.address}
            <span>{t.site.district}</span>
          </p>
          <button type="button" className={s.load} onClick={() => setOn(true)}>
            {t.map.load}
          </button>
          <p className={s.note}>{t.map.loadNote}</p>
        </div>
      )}
      <a className={s.open} href={site.map} target="_blank" rel="noreferrer">
        {t.map.open} ↗
      </a>
    </div>
  );
}
