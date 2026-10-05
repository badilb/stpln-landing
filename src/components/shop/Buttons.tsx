"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { addToCart, toggleCompare, useCart, useCompare } from "@/lib/stores";
import { Icon } from "../site/Icon";
import s from "./Buttons.module.css";

export function CartButton({ id, qty, compact = false }: { id: string; qty: number; compact?: boolean }) {
  const { t } = useI18n();
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const inCart = cart.some((l) => l.id === id);

  function onClick() {
    addToCart(id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  if (compact) {
    return (
      <button
        type="button"
        className={`${s.icon} ${inCart ? s.iconActive : ""}`}
        onClick={onClick}
        aria-label={inCart ? t.card.addMore : t.card.toCart}
        title={inCart ? t.card.inCartAddMore : t.card.toCart}
      >
        <Icon name={added ? "check" : "cart"} />
      </button>
    );
  }

  return (
    <button type="button" className={s.primary} onClick={onClick}>
      <Icon name={added ? "check" : "cart"} />
      {added ? t.card.added : inCart ? t.card.addMore : t.card.toCart}
    </button>
  );
}

export function CompareButton({ id, className, withLabel = false }: { id: string; className?: string; withLabel?: boolean }) {
  const { t } = useI18n();
  const ids = useCompare();
  const on = ids.includes(id);
  return (
    <button
      type="button"
      className={`${withLabel ? s.text : s.compare} ${on ? s.on : ""} ${className ?? ""}`}
      aria-pressed={on}
      onClick={() => toggleCompare(id)}
      title={on ? t.card.compareRemove : t.card.compareAdd}
    >
      <Icon name="compare" size={18} />
      {withLabel ? (on ? t.card.inCompare : t.card.compare) : <span className="visually-hidden">{t.card.compare}</span>}
    </button>
  );
}
