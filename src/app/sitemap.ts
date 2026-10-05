import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { SITE_URL } from "@/content/site";
import { legalDocs } from "@/content/legal";
import { categories } from "@/data/catalog";
import { products } from "@/data/products";
import { LANGS } from "@/i18n/config";

// Все страницы на трёх языках, у каждой — ссылки на языковые версии (hreflang)
export default function sitemap(): MetadataRoute.Sitemap {
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
