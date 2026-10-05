"use client";

import { useSyncExternalStore } from "react";

// Согласие на cookies: "all" — можно аналитику, "necessary" — только корзина/язык.
// null — человек ещё не выбрал, показываем баннер.
export type Consent = "all" | "necessary" | null;

const KEY = "stepline-consent";
const listeners = new Set<() => void>();

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "necessary" ? v : null;
  } catch {
    return "necessary";
  }
}

export function setConsent(v: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  listeners.forEach((l) => l());
}

export function useConsent(): Consent | "unknown" {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    read,
    () => "unknown",
  );
}
