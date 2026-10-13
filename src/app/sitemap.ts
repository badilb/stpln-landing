import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { legalDocs } from "@/content/legal";
import { categories } from "@/data/catalog";
import { getCatalog } from "@/lib/catalog-source";
import { LANGS } from "@/i18n/config";

// Все страницы на трёх языках, у каждой — ссылки на языковые версии (hreflang)
// Товары — из того же кэша каталога, что и страницы: новый товар попадает в карту сайта сам.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getCatalog();
  const paths = [
    "",
    "/catalog",
    ...categories.map((c) => `/catalog/${c.id}`),
    "/akcii",
    "/novinki",
    "/na-zakaz",
    "/media",
    "/o-nas",
    "/dostavka",
    "/uslugi",
    "/kontakty",
    ...Object.keys(legalDocs).map((d) => `/${d}`),
    ...products.map((p) => `/product/${p.id}`),
  ];
  return paths.flatMap((path) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}/`,
      changeFrequency: path.startsWith("/product") ? "weekly" : "daily",
      priority: path === "" ? 1 : path.startsWith("/catalog") ? 0.8 : 0.5,
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE_URL}/${l}${path}/`])) },
    })),
  );
}
