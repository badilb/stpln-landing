import type { Metadata } from "next";
import { CatalogView } from "@/components/shop/CatalogView";
import { getDict } from "@/i18n";
import { isLang, tr, type L } from "@/i18n/config";
import { getCatalog } from "@/lib/catalog-source";

export async function generateMetadata({ params }: PageProps<"/[lang]/novinki">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const block = (await getCatalog()).blocks?.new;
  return { title: block?.title ? tr(block.title as L, lang) : getDict(lang).news.title };
}

// Новинки — тот же список, без отдельного оформления: акциям нужна витрина, новинкам хватает метки NEW.
export default async function NewPage({ params }: PageProps<"/[lang]/novinki">) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "ru";
  const t = getDict(lang);
  // Заголовок и вступление — из CRM («Страницы сайта»); без CRM — свои тексты сайта.
  const block = (await getCatalog()).blocks?.new;
  const title = block?.title ? tr(block.title as L, lang) : t.news.title;
  const intro = block?.intro ? tr(block.intro as L, lang) : t.news.lead;
  return (
    <CatalogView
      title={title}
      intro={<p>{intro}</p>}
      scope={{ kind: "new" }}
      crumbs={[{ label: title }]}
      basePath="/novinki"
    />
  );
}
