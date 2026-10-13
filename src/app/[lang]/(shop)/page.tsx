import { AboutText, CategoryTiles, MediaStrip, Perks, Salon, SectionHead } from "@/components/home/HomeBlocks";
import { Promo, type PromoSlide } from "@/components/home/Promo";
import { Tabs } from "@/components/home/Recommended";
import { ProductGrid } from "@/components/shop/ProductCard";
import { SITE_URL, site } from "@/content/site";
import { discount, type Product } from "@/data/products";
import { chosen, getCatalog } from "@/lib/catalog-source";
import { tr, type L } from "@/i18n/config";
import { categoryById } from "@/data/catalog";
import { getI18n } from "@/i18n/server";
import { sortProducts } from "@/lib/shop";
import s from "./shop.module.css";

const pick = (products: Product[], cat: string) =>
  sortProducts(products.filter((p) => p.category === cat), "popular").slice(0, 8);

export default async function Home() {
  const { lang, t } = await getI18n();
  const { products, byId, blocks } = await getCatalog();
  const home = blocks?.home;
  // Что выбрано в CRM («Страницы сайта → Главная»), добитое автоматикой — как было до CRM.
  const sale = chosen(home?.sale, byId, [...products].filter((p) => p.oldPrice).sort((a, b) => discount(b) - discount(a)), 4);
  const fresh = chosen(home?.new, byId, products.filter((p) => p.isNew), 4);
  const tabs = (home?.recommend.length ? home.recommend : ["parket", "laminat", "kvarcvinil"].map((category) => ({ category, products: [] as string[] })))
    .filter((r) => categoryById[r.category])
    .map((r) => ({ id: r.category, items: chosen(r.products, byId, pick(products, r.category), 8) }));
  const slides: PromoSlide[] | undefined = home?.slides.map((sl) => ({
    kicker: sl.kicker ? tr(sl.kicker as L, lang) : undefined,
    title: tr(sl.title as L, lang),
    text: sl.text ? tr(sl.text as L, lang) : undefined,
    cta: sl.cta ? tr(sl.cta as L, lang) : undefined,
    href: sl.href,
    sale: sl.sale,
    pattern: sl.pattern,
    tone: sl.tone,
    product: sl.product ? byId[sl.product] : undefined,
  }));

  // Карточка магазина для поисковиков: адрес, часы, телефон
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: site.name,
    url: `${SITE_URL}/${lang}`,
    telephone: site.phone,
    address: { "@type": "PostalAddress", streetAddress: t.site.address, addressLocality: t.site.city, addressCountry: "KZ" },
    geo: { "@type": "GeoCoordinates", latitude: site.coords.lat, longitude: site.coords.lon },
    openingHours: `Mo-Su ${site.opens}-${site.closes}`,
    sameAs: [site.instagram, site.map],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Promo slides={slides} />
      <CategoryTiles />
      <Perks />

      <section className={`wrap ${s.block}`} aria-labelledby="rec-t">
        <SectionHead id="rec-t" title={t.home.recommend} href="/catalog" more={t.home.allCatalog} />
        <Tabs
          tabs={tabs.map(({ id, items }) => ({
            id,
            label: tr(categoryById[id].menu, lang),
            content: <ProductGrid products={items} />,
          }))}
        />
      </section>

      <section className={`wrap ${s.block}`} aria-labelledby="sale-t">
        <SectionHead id="sale-t" title={t.home.sale} href="/akcii" more={t.home.allSale} />
        <ProductGrid products={sale} />
      </section>

      <section className={`wrap ${s.block}`} aria-labelledby="new-t">
        <SectionHead id="new-t" title={t.home.news} href="/novinki" more={t.home.allNews} />
        <ProductGrid products={fresh} />
      </section>

      <MediaStrip />
      <Salon />
      <AboutText />
    </>
  );
}
