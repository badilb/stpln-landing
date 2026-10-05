"use client";

import Link from "next/link";
import { useState } from "react";
import { FloorPattern } from "../FloorPattern";
import { Icon } from "../site/Icon";
import { tonePalette, type PatternKind, type Tone } from "@/data/catalog";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import s from "./Promo.module.css";

// Баннеры главной — акции из постов @stepline_astana (02.10.2026).
// Без автопрокрутки: листают стрелками или точками (Hallmark: карусели без паузы — нельзя).
const art: { href: string; pattern: PatternKind; tone: Tone; sale?: string }[] = [
  { href: "/akcii", pattern: "deck", tone: "brown", sale: "−40%" },
  { href: "/catalog/laminat?brand=BlackBerry&sale=1", pattern: "deck", tone: "beige", sale: "−35%" },
  { href: "/na-zakaz", pattern: "chevron", tone: "grey" },
];

export function Promo() {
  const { lang, t } = useI18n();
  const slides = t.promo.slides.map((s, k) => ({ ...s, ...art[k] }));
  const [i, setI] = useState(0);
  const sl = slides[i];
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);

  return (
    <section className={`wrap ${s.promo}`} aria-label={t.promo.label}>
      <div className={s.slide} aria-live="polite">
        <div className={s.text}>
          <p className={s.kicker}>{sl.kicker}</p>
          <h1 className={s.title}>{sl.title}</h1>
          <p className={s.lead}>{sl.text}</p>
          <Link href={href(lang, sl.href)} className={s.cta}>
            {sl.cta}
          </Link>
        </div>
        <div className={s.art}>
          <FloorPattern
            key={i}
            kind={sl.pattern}
            variant="wood"
            width={720}
            height={440}
            palette={tonePalette(sl.tone)}
            seam="var(--tone-seam)"
            seed={i * 11}
            className={s.floor}
          />
          {sl.sale ? <span className={s.sale}>{sl.sale}</span> : null}
        </div>
      </div>

      <div className={s.controls}>
        <button type="button" onClick={() => go(-1)} aria-label={t.promo.prev}>
          <Icon name="arrowLeft" />
        </button>
        <div className={s.dots}>
          {slides.map((x, k) => (
            <button key={x.title} type="button" aria-label={`${k + 1}: ${x.title}`} aria-current={k === i} onClick={() => setI(k)} />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label={t.promo.next}>
          <Icon name="chevron" />
        </button>
      </div>
    </section>
  );
}
