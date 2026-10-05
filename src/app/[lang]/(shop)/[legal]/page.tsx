import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { LEGAL_UPDATED, legalDocs, type LegalDoc } from "@/content/legal";
import { fmt, getDict } from "@/i18n";
import { isLang, tr } from "@/i18n/config";
import s from "./legal.module.css";

// /privacy, /cookies, /oferta, /vozvrat — один шаблон для документов
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legalDocs).map((legal) => ({ legal }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[legal]">): Promise<Metadata> {
  const { lang, legal } = await params;
  const doc = legalDocs[legal as LegalDoc["slug"]];
  if (!doc || !isLang(lang)) return {};
  return { title: tr(doc.title, lang) };
}

export default async function LegalPage({ params }: PageProps<"/[lang]/[legal]">) {
  const { lang, legal } = await params;
  const doc = legalDocs[legal as LegalDoc["slug"]];
  if (!doc || !isLang(lang)) notFound();
  const t = getDict(lang);
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: tr(doc.title, lang) }]} />
      <article className={s.doc}>
        <h1 className={s.title}>{tr(doc.title, lang)}</h1>
        <p className={s.meta}>{fmt(t.legal.updated, { date: LEGAL_UPDATED })}</p>
        <p className={s.draft}>{t.legal.draft}</p>
        <p className={s.summary}>{tr(doc.summary, lang)}</p>
        <div lang="ru">
          {doc.sections.map(([h, paras]) => (
            <section key={h} className={s.section}>
              <h2>{h}</h2>
              {paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
