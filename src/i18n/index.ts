import { en } from "./en";
import { kk } from "./kk";
import { ru, type Dict } from "./ru";
import { LANG_LOCALE, type Lang } from "./config";

export type { Dict };

const dicts: Record<Lang, Dict> = { ru, kk, en };

export function getDict(lang: Lang): Dict {
  return dicts[lang];
}

/** Подстановка «{n} уп.» → «3 уп.» */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function money(n: number, lang: Lang) {
  return `${new Intl.NumberFormat(LANG_LOCALE[lang]).format(n).replace(/[  ,]/g, " ")} ₸`;
}

export function num(n: number, lang: Lang, digits = 2) {
  return new Intl.NumberFormat(LANG_LOCALE[lang], { maximumFractionDigits: digits }).format(n);
}
