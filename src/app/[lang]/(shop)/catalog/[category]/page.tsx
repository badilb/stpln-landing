import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/shop/CatalogView";
import { categoryById } from "@/data/catalog";
import { getDict } from "@/i18n";
import { isLang, tr } from "@/i18n/config";
import { getCatalog } from "@/lib/catalog-source";

export async function generateMetadata({ params }: PageProps<"/[lang]/catalog/[category]">): Promise<Metadata> {
  const { lang, category } = await params;
  await getCatalog(); // разделы приходят из CRM вместе с каталогом
  const c = categoryById[category];
  if (!c || !isLang(lang)) return {};
  return { title: `${tr(c.name, lang)} — ${getDict(lang).site.city}`, description: tr(c.note, lang) };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/catalog/[category]">) {
  const { lang, category } = await params;
  await getCatalog();
  const c = categoryById[category];
  if (!c || !isLang(lang)) notFound();
  const t = getDict(lang);
  return (
    <CatalogView
      title={tr(c.name, lang)}
      intro={<p>{tr(c.note, lang)}</p>}
      scope={{ kind: "category", id: c.id }}
      crumbs={[{ href: "/catalog", label: t.nav.catalog }, { label: tr(c.name, lang) }]}
      basePath={`/catalog/${c.id}`}
    />
  );
}
