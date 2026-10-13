"use client";

import Link from "next/link";
import { useState } from "react";
import { FloorPattern } from "../FloorPattern";
import { Icon } from "../site/Icon";
import { tonePalette, type PatternKind, type Tone } from "@/data/catalog";
import { imageUrl, type Product } from "@/data/products";
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

/** Баннер, уже переведённый на язык страницы. product — пол на картинке (фото или раскладка). */
export type PromoSlide = {
  kicker?: string;
  title: string;
  text?: string;
  cta?: string;
  href: string;
  sale?: string | null;
  pattern: PatternKind;
  tone: Tone;
  product?: Product;
};

export function Promo({ slides: fromCrm }: { slides?: PromoSlide[] }) {
  const { lang, t } = useI18n();
  // Баннеры из CRM («Страницы сайта → Главная»); без CRM — свои тексты сайта.
  const slides: PromoSlide[] = fromCrm?.length ? fromCrm : t.promo.slides.map((s, k) => ({ ...s, ...art[k] }));
  const [i, setI] = useState(0);
  const sl = slides[Math.min(i, slides.length - 1)];
  const photo = sl.product?.images?.[0];
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);

  return (
    <section className={`wrap ${s.promo}`} aria-label={t.promo.label}>
      <div className={s.slide} aria-live="polite">
        <div className={s.text}>
          {sl.kicker ? <p className={s.kicker}>{sl.kicker}</p> : null}
          <h1 className={s.title}>{sl.title}</h1>
          {sl.text ? <p className={s.lead}>{sl.text}</p> : null}
          {sl.cta ? (
            <Link href={href(lang, sl.href)} className={s.cta}>
              {sl.cta}
            </Link>
          ) : null}
        </div>
        <div className={s.art}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- фото из CRM кэшируются навсегда, оптимизатор не нужен
            <img key={i} src={imageUrl(photo.id)} alt="" className={s.floor} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <FloorPattern
              key={i}
              kind={sl.product?.pattern ?? sl.pattern}
              variant="wood"
              width={720}
              height={440}
              palette={tonePalette(sl.product?.tone ?? sl.tone)}
              seam="var(--tone-seam)"
              seed={sl.product?.seed ?? i * 11}
              className={s.floor}
            />
          )}
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
