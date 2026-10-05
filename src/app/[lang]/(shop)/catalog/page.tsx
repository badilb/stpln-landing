import type { Metadata } from "next";
import { CatalogView } from "@/components/shop/CatalogView";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/catalog">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? getDict(lang).nav.catalog : undefined };
}

export default async function CatalogPage({ params }: PageProps<"/[lang]/catalog">) {
  const { lang } = await params;
  const t = getDict(isLang(lang) ? lang : "ru");
  return <CatalogView title={t.catalog.all} scope={{ kind: "all" }} crumbs={[{ label: t.nav.catalog }]} basePath="/catalog" />;
}
