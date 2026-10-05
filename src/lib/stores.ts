"use client";

import { useSyncExternalStore } from "react";

// Корзина и сравнение — в localStorage, без аккаунта. Заказ уходит заявкой
// менеджеру письмом (src/lib/send.ts), как «оформить заказ → менеджер перезвонит» у mirparketa.

function createStore<T>(key: string, fallback: T) {
  let value: T = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded) return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {}
  }

  function set(next: T) {
    value = next;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
    listeners.forEach((l) => l());
  }

  function subscribe(fn: () => void) {
    load();
    listeners.add(fn);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      loaded = false;
      load();
      fn();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(fn);
      window.removeEventListener("storage", onStorage);
    };
  }

  function use() {
    return useSyncExternalStore(subscribe, () => value, () => fallback);
  }

  return { use, set, get: () => value };
}

export type CartLine = { id: string; qty: number };

const cart = createStore<CartLine[]>("stepline-cart", []);
const compare = createStore<string[]>("stepline-compare", []);

export const useCart = cart.use;
export const useCompare = compare.use;

export function addToCart(id: string, qty: number) {
  const lines = cart.get();
  const found = lines.find((l) => l.id === id);
  cart.set(
    found
      ? lines.map((l) => (l.id === id ? { ...l, qty: Math.round((l.qty + qty) * 1000) / 1000 } : l))
      : [...lines, { id, qty }],
  );
}

export function setCartQty(id: string, qty: number) {
  cart.set(qty > 0 ? cart.get().map((l) => (l.id === id ? { ...l, qty } : l)) : cart.get().filter((l) => l.id !== id));
}

export function clearCart() {
  cart.set([]);
}

export const COMPARE_LIMIT = 4;

export function toggleCompare(id: string) {
  const ids = compare.get();
  if (ids.includes(id)) compare.set(ids.filter((x) => x !== id));
  else compare.set([...ids, id].slice(-COMPARE_LIMIT));
}
