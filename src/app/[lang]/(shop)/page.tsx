import { AboutText, CategoryTiles, MediaStrip, Perks, Salon, SectionHead } from "@/components/home/HomeBlocks";
import { Promo } from "@/components/home/Promo";
import { Tabs } from "@/components/home/Recommended";
import { ProductGrid } from "@/components/shop/ProductCard";
import { SITE_URL, site } from "@/content/site";
import { discount, products } from "@/data/products";
import { tr } from "@/i18n/config";
import { categoryById } from "@/data/catalog";
import { getI18n } from "@/i18n/server";
import { sortProducts } from "@/lib/shop";
import s from "./shop.module.css";

const pick = (cat: string) => sortProducts(products.filter((p) => p.category === cat), "popular").slice(0, 8);

export default async function Home() {
  const { lang, t } = await getI18n();
  const sale = [...products].filter((p) => p.oldPrice).sort((a, b) => discount(b) - discount(a)).slice(0, 4);
  const fresh = products.filter((p) => p.isNew).slice(0, 4);

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
      <Promo />
      <CategoryTiles />
      <Perks />

      <section className={`wrap ${s.block}`} aria-labelledby="rec-t">
        <SectionHead id="rec-t" title={t.home.recommend} href="/catalog" more={t.home.allCatalog} />
        <Tabs
          tabs={["parket", "laminat", "kvarcvinil"].map((id) => ({
            id,
            label: tr(categoryById[id].menu, lang),
            content: <ProductGrid products={pick(id)} />,
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
