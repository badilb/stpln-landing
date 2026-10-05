"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { LANGS, LANG_LABEL, isLang, withBase, type Lang } from "@/i18n/config";
import s from "./Header.module.css";

// Переключатель языка ведёт на ту же страницу с теми же фильтрами и запоминает выбор
// в localStorage — по нему корневая «/» решает, на какой язык отправить.
export function LangSwitch() {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const params = useSearchParams();

  function to(l: Lang) {
    const parts = pathname.split("/");
    if (isLang(parts[1])) parts[1] = l;
    else parts.splice(1, 0, l);
    const qs = params.toString();
    return withBase(`${parts.join("/") || "/"}${qs ? `?${qs}` : ""}`);
  }

  return (
    <nav className={s.langs} aria-label={t.header.lang}>
      {LANGS.map((l) => (
        <a
          key={l}
          href={to(l)}
          hrefLang={l}
          aria-current={l === lang ? "true" : undefined}
          onClick={() => {
            try {
              localStorage.setItem("lang", l);
            } catch {}
          }}
        >
          {LANG_LABEL[l]}
        </a>
      ))}
    </nav>
  );
}
