"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import s from "./Breadcrumbs.module.css";

/** Пути передаются без языка: { href: "/catalog" } — язык подставится сам */
export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  const { lang, t } = useI18n();
  return (
    <nav aria-label={t.nav.home} className={s.crumbs}>
      <ol>
        <li>
          <Link href={href(lang, "/")}>{t.nav.home}</Link>
        </li>
        {items.map((it) => (
          <li key={it.label}>{it.href ? <Link href={href(lang, it.href)}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}
