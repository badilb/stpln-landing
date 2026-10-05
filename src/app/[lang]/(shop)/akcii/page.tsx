import type { Metadata } from "next";
import { SaleHero } from "@/components/sale/SaleHero";
import { CatalogView } from "@/components/shop/CatalogView";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/akcii">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? getDict(lang).sale.title : undefined };
}

export default async function SalePage({ params }: PageProps<"/[lang]/akcii">) {
  const { lang } = await params;
  const t = getDict(isLang(lang) ? lang : "ru");
  return (
    <CatalogView
      title={t.sale.title}
      intro={<p>{t.sale.lead}</p>}
      hero={<SaleHero />}
      scope={{ kind: "sale" }}
      defaultSort="discount"
      crumbs={[{ label: t.sale.title }]}
      basePath="/akcii"
    />
  );
}
