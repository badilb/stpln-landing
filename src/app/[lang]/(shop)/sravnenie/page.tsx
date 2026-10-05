import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { CompareView } from "./CompareView";
import s from "../shop.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/sravnenie">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? getDict(lang).compare.title : undefined, robots: { index: false } };
}

export default async function ComparePage() {
  const { t } = await getI18n();
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: t.compare.title }]} />
      <h1 className={s.pageTitle}>{t.compare.title}</h1>
      <CompareView />
    </div>
  );
}
