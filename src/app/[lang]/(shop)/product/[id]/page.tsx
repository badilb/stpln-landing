import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { BuyBox } from "@/components/shop/BuyBox";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ProductImage } from "@/components/shop/ProductImage";
import { Icon } from "@/components/site/Icon";
import { SITE_URL } from "@/content/site";
import { attrLabel, categoryById, tones } from "@/data/catalog";
import { discount, imageUrl, productName, sizeOf, subtypeName, unitOf, type Product } from "@/data/products";
import { getCatalog } from "@/lib/catalog-source";
import { fmt, getDict, money, num, type Dict } from "@/i18n";
import { href, isLang, tr, type Lang } from "@/i18n/config";
import s from "./product.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/product/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  const p = (await getCatalog()).byId[id];
  if (!p || !isLang(lang)) return {};
  return { title: productName(p, lang), description: `${productName(p, lang)} — ${sizeOf(p, lang)}. ${getDict(lang).meta.description}` };
}

function specs(p: Product, lang: Lang, t: Dict): [string, string][] {
  const L = t.product;
  const mm = (v?: number) => (v ? `${lang === "en" ? v : String(v).replace(".", ",")} ${lang === "en" ? "mm" : "мм"}` : undefined);
  const rows: [string, string | undefined][] = [
    [L.sku, p.sku],
    [L.brand, p.country ? `${p.brand} (${tr(p.country, lang)})` : p.brand],
    [L.collection, p.collection],
    [L.type, subtypeName(p, lang)],
    [L.decor, tr(p.decor, lang)],
    [L.color, tr(tones.find((x) => x.id === p.tone)?.name, lang)],
    [L.wood, tr(attrLabel("wood", p.wood), lang) || undefined],
    [L.length, mm(p.length)],
    [L.width, mm(p.width)],
    [L.thickness, mm(p.thickness)],
    [L.format, tr(p.format, lang) || undefined],
    [L.cls, p.cls],
    [L.chamfer, tr(attrLabel("chamfer", p.chamfer), lang) || undefined],
    [L.connection, tr(attrLabel("connection", p.connection), lang) || undefined],
    [L.finish, tr(attrLabel("finish", p.finish), lang) || undefined],
    [L.warm, p.warmFloor ? t.facets.supports : undefined],
    [L.water, p.waterproof ? (p.waterNote ? `${t.facets.yes}, ${tr(p.waterNote, lang)}` : t.facets.yes) : undefined],
    [L.packM2, p.packM2 ? num(p.packM2, lang, 3) : undefined],
    [L.packPcs, p.packPcs ? String(p.packPcs) : undefined],
    // Свободные строки из CRM: гарантия, сертификат…
    ...(p.specs ?? []).map((r): [string, string] => [tr(r.name, lang), tr(r.value, lang)]),
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

export default async function ProductPage({ params }: PageProps<"/[lang]/product/[id]">) {
  const { lang, id } = await params;
  const { products, byId } = await getCatalog();
  const p = byId[id];
  if (!p || !isLang(lang)) notFound();
  const t = getDict(lang);
  const c = categoryById[p.category];
  const sub = subtypeName(p, lang);
  const off = discount(p);
  const name = productName(p, lang);
  const unit = t.units[unitOf(p)];
  const photos = p.images?.length ?? 0;
  const similar = products.filter((x) => x.id !== p.id && x.category === p.category && (x.subtype === p.subtype || x.tone === p.tone)).slice(0, 4);

  // Разметка для поисковиков: товар, цена, наличие
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: p.sku,
    ...(photos ? { image: `${SITE_URL}${imageUrl(p.images![0].id)}` } : {}),
    brand: { "@type": "Brand", name: p.brand },
    category: tr(c.name, lang),
    url: `${SITE_URL}/${lang}/product/${p.id}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "KZT",
      price: p.price,
      availability: p.stock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: "STEPLINE" },
    },
  };

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { href: "/catalog", label: t.nav.catalog },
          { href: `/catalog/${c.id}`, label: tr(c.name, lang) },
          ...(sub ? [{ href: `/catalog/${c.id}?type=${p.subtype}`, label: sub }] : []),
          { label: tr(p.decor, lang) },
        ]}
      />

      <div className={s.top}>
        <div className={s.gallery}>
          <div className={s.main}>
            <ProductImage product={p} width={720} height={720} zoom={0.6} className={s.img} alt={name} />
            <div className={s.badges}>
              {off ? <span className={s.sale}>−{off}%</span> : null}
              {p.isNew ? <span className={s.new}>{t.card.new}</span> : null}
            </div>
          </div>
          {photos > 1 ? (
            <div className={s.thumbs}>
              {p.images!.slice(1, 4).map((img, i) => (
                <div key={img.id} className={s.thumb}>
                  <ProductImage product={p} photo={i + 1} width={240} height={240} className={s.img} alt={`${name} — ${i + 2}`} />
                </div>
              ))}
            </div>
          ) : photos === 0 ? (
            <>
              <div className={s.thumbs}>
                {[1.2, 2, 0.45].map((z, i) => (
                  <div key={z} className={s.thumb}>
                    <ProductImage product={{ ...p, seed: p.seed + i + 1 }} width={240} height={240} zoom={z} className={s.img} />
                  </div>
                ))}
              </div>
              <p className={s.note}>{t.product.imageNote}</p>
            </>
          ) : null}
        </div>

        <div className={s.info}>
          <h1 className={s.title}>{name}</h1>
          <p className={s.sku}>
            {t.product.sku} {p.sku} · {p.country ? `${p.brand} (${tr(p.country, lang)})` : p.brand}
          </p>

          <p className={s.price}>
            {p.oldPrice ? <s className={s.old}>{money(p.oldPrice, lang)}</s> : null}
            <span className={p.oldPrice ? s.now : undefined}>{money(p.price, lang)}</span>
            <span className={s.unit}>/ {unit}</span>
          </p>

          <p className={p.stock ? s.stock : s.onOrder}>
            <Icon name={p.stock ? "check" : "truck"} size={18} />
            {p.stock ? fmt(t.product.inStock, { n: p.stock, u: unit }) : t.product.onOrder}
          </p>

          <BuyBox id={p.id} />

          <ul className={s.perks}>
            <li>
              <Icon name="truck" size={18} /> {t.product.perkDelivery}
            </li>
            <li>
              <Icon name="box" size={18} /> {t.product.perkStorage}
            </li>
            <li>
              <Icon name="layers" size={18} /> {t.product.perkCredit}
            </li>
            <li>
              <Icon name="pin" size={18} /> {t.product.perkSample}
            </li>
          </ul>
        </div>
      </div>

      <section className={s.details} aria-labelledby="specs-t">
        <div>
          <h2 id="specs-t" className={s.h2}>
            {t.product.specs}
          </h2>
          <dl className={s.specs}>
            {specs(p, lang, t).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={s.text}>
          {p.description ? (
            <div className={s.about}>
              <h2 className={s.h2}>{t.product.description}</h2>
              {tr(p.description, lang)
                .split(/\n{2,}/)
                .map((para) => (
                  <p key={para}>{para}</p>
                ))}
            </div>
          ) : null}
          <h2 className={s.h2}>{t.product.deliveryTitle}</h2>
          <p>{t.product.deliveryText}</p>
          <p>
            {t.product.paymentText} <Link href={href(lang, "/dostavka")}>{t.nav.delivery} →</Link>
          </p>
          <p className={s.warn}>{t.product.colorWarn}</p>
        </div>
      </section>

      {similar.length ? (
        <section className={s.similar} aria-labelledby="sim-t">
          <h2 id="sim-t" className={s.h2}>
            {t.product.similar}
          </h2>
          <ProductGrid products={similar} />
        </section>
      ) : null}
    </div>
  );
}
