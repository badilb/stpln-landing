import { lang as rootLang } from "next/root-params";
import { notFound } from "next/navigation";
import { DEFAULT_LANG, isLang, type Lang } from "./config";
import { getDict } from "./index";

/** Язык текущего запроса для серверных компонентов — из сегмента [lang]. */
export async function getLang(): Promise<Lang> {
  const l = await rootLang();
  if (!isLang(l)) notFound();
  return l ?? DEFAULT_LANG;
}

export async function getI18n() {
  const lang = await getLang();
  return { lang, t: getDict(lang) };
}
