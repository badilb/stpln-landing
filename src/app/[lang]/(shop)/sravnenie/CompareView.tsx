"use client";

import Link from "next/link";
import { CartButton } from "@/components/shop/Buttons";
import { ProductImage } from "@/components/shop/ProductImage";
import { Icon } from "@/components/site/Icon";
import { attrLabel, tones } from "@/data/catalog";
import { productById, productName, sizeOf, subtypeName, unitOf, type Product } from "@/data/products";
import { fmt, money, num, type Dict } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { href, tr, type Lang } from "@/i18n/config";
import { toggleCompare, useCompare } from "@/lib/stores";
import s from "./compare.module.css";

function rows(lang: Lang, t: Dict): [string, (p: Product) => string | undefined][] {
  return [
    [t.compare.price, (p) => `${money(p.price, lang)} / ${t.units[unitOf(p)]}`],
    [t.facets.brand, (p) => (p.country ? `${p.brand} (${tr(p.country, lang)})` : p.brand)],
    [t.facets.type, (p) => subtypeName(p, lang)],
    [t.facets.color, (p) => tr(tones.find((x) => x.id === p.tone)?.name, lang)],
    [t.compare.size, (p) => sizeOf(p, lang)],
    [t.facets.class, (p) => p.cls],
    [t.facets.chamfer, (p) => tr(attrLabel("chamfer", p.chamfer), lang) || undefined],
    [t.facets.connection, (p) => tr(attrLabel("connection", p.connection), lang) || undefined],
    [t.facets.finish, (p) => tr(attrLabel("finish", p.finish), lang) || undefined],
    [t.facets.warm, (p) => (p.warmFloor ? t.facets.yes : "—")],
    [t.facets.water, (p) => (p.waterproof ? t.facets.yes : "—")],
    [t.compare.pack, (p) => (p.packM2 ? `${num(p.packM2, lang, 3)} ${t.units.m2}` : undefined)],
    [t.compare.stock, (p) => (p.stock ? `${p.stock} ${t.units[unitOf(p)]}` : t.compare.onOrder)],
  ];
}

export function CompareView() {
  const { lang, t } = useI18n();
  const ids = useCompare();
  const items = ids.map((id) => productById[id]).filter(Boolean);

  if (!items.length) {
    return (
      <div className={s.empty}>
        <p>{t.compare.emptyTitle}</p>
        <p>{t.compare.emptyText}</p>
        <Link href={href(lang, "/catalog")}>{t.cart.toCatalog}</Link>
      </div>
    );
  }

  return (
    <div className={s.scroller}>
      <table className={s.table}>
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">{t.compare.param}</span>
            </th>
            {items.map((p) => {
              const name = productName(p, lang);
              return (
                <th key={p.id} scope="col" className={s.product}>
                  <button type="button" className={s.remove} onClick={() => toggleCompare(p.id)} aria-label={fmt(t.compare.remove, { name })}>
                    <Icon name="close" size={16} />
                  </button>
                  <Link href={href(lang, `/product/${p.id}`)} className={s.thumb}>
                    <ProductImage product={p} width={200} height={150} className={s.img} />
                  </Link>
                  <Link href={href(lang, `/product/${p.id}`)} className={s.name}>
                    {name}
                  </Link>
                  <CartButton id={p.id} qty={1} />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows(lang, t).map(([label, get]) => {
            const values = items.map((p) => get(p) ?? "—");
            const differs = new Set(values).size > 1;
            return (
              <tr key={label} data-differs={differs || undefined}>
                <th scope="row">{label}</th>
                {values.map((v, i) => (
                  <td key={items[i].id}>{v}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
