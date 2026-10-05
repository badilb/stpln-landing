"use client";

import { useState } from "react";
import { whatsappLink } from "@/content/site";
import { productById, productName } from "@/data/products";
import { fmt, money, num } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { addToCart } from "@/lib/stores";
import { Icon } from "../site/Icon";
import { CompareButton } from "./Buttons";
import s from "./BuyBox.module.css";

// Калькулятор «площадь → упаковки»: продают упаковками, как у mirparketa
// («Реализация продукции производится упаковками»). Запас на подрезку зависит от укладки.

const RESERVE: Record<string, number> = { deck: 7, herringbone: 12, chevron: 15, geometric: 10, modular: 10 };

export function BuyBox({ id }: { id: string }) {
  const { lang, t } = useI18n();
  const p = productById[id];
  const byArea = Boolean(p.packM2);
  const [area, setArea] = useState("");
  const [reserve, setReserve] = useState(RESERVE[p.pattern] ?? 5);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const a = parseFloat(area.replace(",", "."));
  const packsFromArea = byArea && a > 0 ? Math.ceil((a * (1 + reserve / 100)) / p.packM2!) : null;
  const packs = packsFromArea ?? qty;
  const total = p.price * (p.packM2 ?? 1) * packs;

  function add() {
    addToCart(p.id, packs);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  const askText = fmt(t.buy.askText, {
    name: productName(p, lang),
    qty: byArea ? fmt(t.buy.askQtyArea, { n: packs, m: num(packs * p.packM2!, lang) }) : fmt(t.buy.askQtyPcs, { n: packs }),
  });

  return (
    <div className={s.box}>
      {byArea ? (
        <div className={s.calc}>
          <p className={s.label}>{t.buy.calcTitle}</p>
          <div className={s.calcRow}>
            <label className={s.field}>
              <span>{t.buy.area}</span>
              <input inputMode="decimal" placeholder={t.buy.areaPh} value={area} onChange={(e) => setArea(e.target.value)} />
            </label>
            <label className={s.field}>
              <span>{t.buy.reserve}</span>
              <select value={reserve} onChange={(e) => setReserve(Number(e.target.value))}>
                {[0, 5, 7, 10, 12, 15].map((r) => (
                  <option key={r} value={r}>
                    {r}%
                  </option>
                ))}
              </select>
            </label>
          </div>
          {packsFromArea ? (
            <p className={s.result}>
              {fmt(t.buy.packs, { n: packsFromArea, m: num(packsFromArea * p.packM2!, lang, 3) })}
            </p>
          ) : (
            <p className={s.hint}>{fmt(t.buy.inPack, { m: num(p.packM2!, lang, 3), pcs: p.packPcs ? `, ${p.packPcs} ${t.units.pcs}` : "" })}</p>
          )}
        </div>
      ) : null}

      <div className={s.buyRow}>
        {packsFromArea ? null : (
          <div className={s.stepper} aria-label={t.buy.qty}>
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t.buy.less}>
              <Icon name="minus" size={16} />
            </button>
            <input inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))} aria-label={t.buy.qty} />
            <button type="button" onClick={() => setQty((q) => q + 1)} aria-label={t.buy.more}>
              <Icon name="plus" size={16} />
            </button>
            <span className={s.unit}>{byArea ? t.units.packShort : t.units.pcs}</span>
          </div>
        )}
        <p className={s.total}>
          <span>{t.buy.total}</span>
          {money(Math.round(total), lang)}
        </p>
      </div>

      <div className={s.actions}>
        <button type="button" className={s.cart} onClick={add}>
          <Icon name={added ? "check" : "cart"} />
          {added ? t.buy.added : t.buy.toCart}
        </button>
        <a className={s.ask} href={whatsappLink(askText)} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" />
          {t.buy.ask}
        </a>
      </div>
      <CompareButton id={p.id} withLabel />
    </div>
  );
}
