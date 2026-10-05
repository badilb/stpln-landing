// Языки сайта. Русский — основной (по нему пишутся тексты, остальные — переводы).
// Казахский — требует вычитки носителем перед запуском (см. docs/questions-for-client.md).

export const LANGS = ["ru", "kk", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "ru";

export const LANG_LABEL: Record<Lang, string> = { ru: "Рус", kk: "Қаз", en: "Eng" };
export const LANG_HTML: Record<Lang, string> = { ru: "ru", kk: "kk", en: "en" };
export const LANG_LOCALE: Record<Lang, string> = { ru: "ru-RU", kk: "kk-KZ", en: "en-US" };

export function isLang(v: string | undefined | null): v is Lang {
  return Boolean(v && (LANGS as readonly string[]).includes(v));
}

/** Строка на трёх языках — для данных каталога (разделы, тона, характеристики). */
export type L = Record<Lang, string>;

export function tr(v: L | string | undefined, lang: Lang): string {
  if (v === undefined) return "";
  return typeof v === "string" ? v : v[lang] || v.ru;
}

/** Подпапка сайта на GitHub Pages ("/stepline-floors") или "" на своём домене */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Для обычных <a>, <form action> и location: <Link> добавляет basePath сам, а они — нет */
export function withBase(path: string) {
  return /^(https?:|mailto:|tel:|#)/.test(path) ? path : `${BASE_PATH}${path}`;
}

/** Ссылка с языком для <Link>: href("kk", "/catalog/parket") → "/kk/catalog/parket" */
export function href(lang: Lang, path: string) {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `/${lang}${path === "/" ? "" : path}`;
}
