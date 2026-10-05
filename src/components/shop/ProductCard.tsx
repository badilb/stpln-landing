"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { categoryById } from "@/data/catalog";
import { discount, productName, sizeOf, subtypeName, unitOf, type Product } from "@/data/products";
import { money } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { href, tr } from "@/i18n/config";
import { CartButton, CompareButton } from "./Buttons";
import { ProductImage } from "./ProductImage";
import s from "./ProductCard.module.css";

export function ProductCard({ product: p }: { product: Product }) {
  const { lang, t } = useI18n();
  const off = discount(p);
  const sub = subtypeName(p, lang);
  const name = productName(p, lang);
  const link = href(lang, `/product/${p.id}`);
  return (
    <article className={s.card}>
      <Link href={link} className={s.media} tabIndex={-1} aria-hidden>
        <ProductImage product={p} width={300} height={400} className={s.img} />
      </Link>
      <div className={s.badges}>
        {off ? <span className={s.sale}>−{off}%</span> : null}
        {p.isNew ? <span className={s.new}>{t.card.new}</span> : null}
        {p.stock === 0 ? <span className={s.order}>{t.card.onOrder}</span> : null}
      </div>
      <CompareButton id={p.id} className={s.compare} />

      <div className={s.body}>
        <h3 className={s.name}>
          <Link href={link}>{name}</Link>
        </h3>
        <p className={s.meta}>
          {[sub ?? tr(categoryById[p.category].name, lang), p.country ? `${p.brand} (${tr(p.country, lang)})` : p.brand].join(" · ")}
        </p>
        <p className={s.size}>{sizeOf(p, lang)}</p>
        <div className={s.foot}>
          <p className={s.price}>
            {p.oldPrice ? <s className={s.old}>{money(p.oldPrice, lang)}</s> : null}
            <span className={p.oldPrice ? s.now : undefined}>{money(p.price, lang)}</span>
            <span className={s.unit}>/ {t.units[unitOf(p)]}</span>
          </p>
          <CartButton id={p.id} qty={1} compact />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, empty }: { products: Product[]; empty?: ReactNode }) {
  if (!products.length) return <>{empty}</>;
  return (
    <div className={s.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
