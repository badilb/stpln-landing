import type { Metadata } from "next";
import { CatalogView } from "@/components/shop/CatalogView";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/novinki">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? getDict(lang).news.title : undefined };
}

// Новинки — тот же список, без отдельного оформления: акциям нужна витрина, новинкам хватает метки NEW.
export default async function NewPage({ params }: PageProps<"/[lang]/novinki">) {
  const { lang } = await params;
  const t = getDict(isLang(lang) ? lang : "ru");
  return (
    <CatalogView
      title={t.news.title}
      intro={<p>{t.news.lead}</p>}
      scope={{ kind: "new" }}
      crumbs={[{ label: t.news.title }]}
      basePath="/novinki"
    />
  );
}
