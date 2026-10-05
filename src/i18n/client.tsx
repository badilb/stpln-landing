"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Lang } from "./config";
import { getDict, type Dict } from "./index";

const Ctx = createContext<Lang>("ru");

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useI18n(): { lang: Lang; t: Dict } {
  const lang = useContext(Ctx);
  return { lang, t: getDict(lang) };
}
