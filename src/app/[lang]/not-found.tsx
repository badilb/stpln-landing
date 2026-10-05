import Link from "next/link";
import { href } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import s from "./not-found.module.css";

export default async function NotFound() {
  const { lang, t } = await getI18n();
  return (
    <main className={`wrap ${s.nf}`}>
      <p className={s.code}>404</p>
      <h1 className={s.title}>{t.notFound.title}</h1>
      <p className={s.text}>{t.notFound.text}</p>
      <div className={s.actions}>
        <Link href={href(lang, "/catalog")} className={s.primary}>
          {t.notFound.toCatalog}
        </Link>
        <Link href={href(lang, "/")}>{t.notFound.home}</Link>
      </div>
    </main>
  );
}
