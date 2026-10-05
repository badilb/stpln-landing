"use client";

import Link from "next/link";
import { productById } from "@/data/products";
import { money } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { useCart, useCompare } from "@/lib/stores";
import { Icon } from "./Icon";
import s from "./Header.module.css";

export function HeaderCounters() {
  const { lang, t } = useI18n();
  const cart = useCart();
  const compare = useCompare();
  const total = cart.reduce((sum, l) => {
    const p = productById[l.id];
    return p ? sum + p.price * (p.packM2 ?? 1) * l.qty : sum;
  }, 0);

  return (
    <div className={s.counters}>
      <Link href={href(lang, "/sravnenie")} className={s.counter} aria-label={`${t.nav.compare}: ${compare.length}`}>
        <Icon name="compare" size={22} />
        {compare.length ? <span className={s.badge}>{compare.length}</span> : null}
      </Link>
      <Link href={href(lang, "/cart")} className={s.counter} aria-label={`${t.nav.cart}: ${cart.length}`}>
        <Icon name="cart" size={22} />
        {cart.length ? <span className={s.badge}>{cart.length}</span> : null}
        <span className={s.sum}>{cart.length ? money(Math.round(total), lang) : t.nav.cart}</span>
      </Link>
    </div>
  );
}
