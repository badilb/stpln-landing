"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { href, withBase } from "@/i18n/config";
import { Icon } from "./Icon";
import s from "./Header.module.css";

// Строка поиска помнит запрос: на странице результатов он остаётся в поле,
// чтобы его можно было поправить, а не набирать заново.
export function SearchBox({ className }: { className?: string; compact?: boolean }) {
  const { lang, t } = useI18n();
  const params = useSearchParams();
  const pathname = usePathname();
  const onCatalog = pathname.includes("/catalog");
  const q = onCatalog ? (params.get("q") ?? "") : "";

  return (
    <form action={withBase(href(lang, "/catalog/"))} className={className} role="search">
      <label className="visually-hidden" htmlFor={`search-${className}`}>
        {t.header.searchLabel}
      </label>
      <input key={q} id={`search-${className}`} name="q" type="search" defaultValue={q} placeholder={t.header.searchPlaceholder} enterKeyHint="search" />
      <button type="submit" aria-label={t.header.searchSubmit} className={s.searchBtn}>
        <Icon name="search" />
      </button>
    </form>
  );
}
