"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { DEFAULT_PRESET, PRESET_STORAGE_KEY, presetById } from "@/design/presets";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import s from "./PresetBadge.module.css";

// Пометка на сайте, когда включён не основной пресет: чтобы, показывая клиенту
// «Шоурум», никто не принял его за утверждённый дизайн.

function subscribe(fn: () => void) {
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-preset"] });
  return () => mo.disconnect();
}

export function setPreset(id: string) {
  const el = document.documentElement;
  if (id === DEFAULT_PRESET) delete el.dataset.preset;
  else el.dataset.preset = id;
  try {
    localStorage.setItem(PRESET_STORAGE_KEY, id);
  } catch {}
  const url = new URL(window.location.href);
  if (url.searchParams.has("preset")) {
    url.searchParams.delete("preset");
    window.history.replaceState(null, "", url);
  }
}

export function usePreset() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.preset ?? DEFAULT_PRESET,
    () => DEFAULT_PRESET,
  );
}

export function PresetBadge() {
  const { lang } = useI18n();
  const preset = usePreset();
  const path = usePathname();
  if (preset === DEFAULT_PRESET || path.includes("/design")) return null;

  return (
    <div className={s.badge} role="status">
      <span>
        Пресет «{presetById[preset]?.name}»
      </span>
      <button type="button" onClick={() => setPreset(DEFAULT_PRESET)}>
        Вернуть основной
      </button>
      <Link href={href(lang, "/design")}>Все пресеты</Link>
    </div>
  );
}
