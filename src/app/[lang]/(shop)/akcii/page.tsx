import type { Metadata } from "next";
import { SaleHero } from "@/components/sale/SaleHero";
import { CatalogView } from "@/components/shop/CatalogView";
import { getDict } from "@/i18n";
import { isLang, tr, type L } from "@/i18n/config";
import { getCatalog } from "@/lib/catalog-source";

export async function generateMetadata({ params }: PageProps<"/[lang]/akcii">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const block = (await getCatalog()).blocks?.sale;
  return { title: block?.title ? tr(block.title as L, lang) : getDict(lang).sale.title };
}

export default async function SalePage({ params }: PageProps<"/[lang]/akcii">) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "ru";
  const t = getDict(lang);
  // Заголовок и вступление — из CRM («Страницы сайта»); без CRM — свои тексты сайта.
  const block = (await getCatalog()).blocks?.sale;
  const title = block?.title ? tr(block.title as L, lang) : t.sale.title;
  const intro = block?.intro ? tr(block.intro as L, lang) : t.sale.lead;
  return (
    <CatalogView
      title={title}
      intro={<p>{intro}</p>}
      hero={<SaleHero />}
      scope={{ kind: "sale" }}
      defaultSort="discount"
      crumbs={[{ label: title }]}
      basePath="/akcii"
    />
  );
}
