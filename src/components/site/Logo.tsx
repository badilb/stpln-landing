"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import s from "./Logo.module.css";

// Знак STEPLINE перерисован в SVG по исходнику stepline-logo.png (1080×1080, сверено наложением):
// три тёмные грани и две светлые, изометрия 30°. Цвета — токены --logo-1/--logo-2,
// на тёмных темах они светлеют (globals.css). Исходник лежит в public/brand/.
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="369 308 354 230" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <g fill="var(--logo-1)">
        <polygon points="371,367 468,311 551,359 551,414 468,366 392,409 371,397" />
        <polygon points="371,423 468,478 487,467 537,496 468,535 371,479" />
        <polygon points="568,447 624,479 721,424 721,480 624,536 539,496 568,480" />
      </g>
      <g fill="var(--logo-2)">
        <polygon points="392,411 449,379 565,446 565,480 538,496" />
        <polygon points="568,326 596,310 623,326 623,478 568,446" />
      </g>
    </svg>
  );
}

export function Logo({ compact = false, tagline = true }: { compact?: boolean; tagline?: boolean }) {
  const { lang, t } = useI18n();
  return (
    <Link href={href(lang, "/")} className={s.logo} aria-label={`${site.name} — ${t.nav.home}`}>
      <LogoMark className={s.mark} />
      {compact ? null : (
        <span className={s.text}>
          <span className={s.name}>{site.name}</span>
          {tagline ? <span className={s.tag}>{t.site.tagline}</span> : null}
        </span>
      )}
    </Link>
  );
}
