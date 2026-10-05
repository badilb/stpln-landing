"use client";

import Link from "next/link";
import { ProductImage } from "@/components/shop/ProductImage";
import { Icon } from "@/components/site/Icon";
import { whatsappLink } from "@/content/site";
import { productById, productName, sizeOf, unitOf, type Product } from "@/data/products";
import { fmt, money, num, type Dict } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { href, type Lang } from "@/i18n/config";
import { setCartQty, useCart } from "@/lib/stores";
import s from "./cart.module.css";

export function useCartLines() {
  const cart = useCart();
  const lines = cart
    .map((l) => ({ ...l, p: productById[l.id] }))
    .filter((l): l is typeof l & { p: Product } => Boolean(l.p))
    .map((l) => ({ ...l, sum: l.p.price * (l.p.packM2 ?? 1) * l.qty }));
  return { lines, total: lines.reduce((a, l) => a + l.sum, 0) };
}

/** Текст заказа для WhatsApp — один на корзину и оформление */
export function orderText(lines: ReturnType<typeof useCartLines>["lines"], total: number, lang: Lang, t: Dict) {
  return [
    t.cart.waOrder,
    ...lines.map((l) => `• ${productName(l.p, lang)} — ${l.qty} ${l.p.packM2 ? `${t.units.packShort} (${num(l.qty * l.p.packM2, lang)} ${t.units.m2})` : t.units.pcs}`),
    fmt(t.cart.waTotal, { sum: money(Math.round(total), lang) }),
  ].join("\n");
}

export function CartView() {
  const { lang, t } = useI18n();
  const { lines, total } = useCartLines();

  if (!lines.length) {
    return (
      <div className={s.done}>
        <h2>{t.cart.emptyTitle}</h2>
        <p>{t.cart.emptyText}</p>
        <Link href={href(lang, "/catalog")}>{t.cart.toCatalog}</Link>
      </div>
    );
  }

  return (
    <div className={s.layout}>
      <ul className={s.lines}>
        {lines.map((l) => {
          const name = productName(l.p, lang);
          return (
            <li key={l.id} className={s.line}>
              <Link href={href(lang, `/product/${l.id}`)} className={s.thumb} tabIndex={-1} aria-hidden>
                <ProductImage product={l.p} width={120} height={120} className={s.img} />
              </Link>
              <div className={s.lineInfo}>
                <Link href={href(lang, `/product/${l.id}`)} className={s.name}>
                  {name}
                </Link>
                <p className={s.meta}>
                  {sizeOf(l.p, lang)}
                  {l.p.packM2 ? ` · ${fmt(t.cart.inPack, { m: num(l.p.packM2, lang, 3) })}` : ""}
                </p>
                <p className={s.meta}>{fmt(t.cart.perUnit, { price: money(l.p.price, lang), unit: t.units[unitOf(l.p)] })}</p>
              </div>
              <div className={s.qty}>
                <div className={s.stepper}>
                  <button type="button" onClick={() => setCartQty(l.id, l.qty - 1)} aria-label={t.buy.less}>
                    <Icon name="minus" size={16} />
                  </button>
                  <span aria-live="polite">{l.qty}</span>
                  <button type="button" onClick={() => setCartQty(l.id, l.qty + 1)} aria-label={t.buy.more}>
                    <Icon name="plus" size={16} />
                  </button>
                </div>
                <span className={s.meta}>{l.p.packM2 ? fmt(t.cart.packsEq, { m: num(l.qty * l.p.packM2, lang) }) : t.units.pcs}</span>
              </div>
              <p className={s.sum}>{money(Math.round(l.sum), lang)}</p>
              <button type="button" className={s.remove} onClick={() => setCartQty(l.id, 0)} aria-label={fmt(t.cart.remove, { name })}>
                <Icon name="close" size={18} />
              </button>
            </li>
          );
        })}
      </ul>

      <aside className={s.checkout}>
        <p className={s.totalRow}>
          <span>{t.cart.total}</span>
          <b>{money(Math.round(total), lang)}</b>
        </p>
        <p className={s.note}>{t.cart.note}</p>
        <Link href={href(lang, "/checkout")} className={s.submit}>
          {t.cart.checkout}
        </Link>
        <a className={s.wa} href={whatsappLink(orderText(lines, total, lang, t))} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={18} />
          {t.cart.sendWa}
        </a>
      </aside>
    </div>
  );
}
