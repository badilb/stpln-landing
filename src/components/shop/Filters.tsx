"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "@/i18n/client";
import { Icon } from "../site/Icon";
import s from "./Filters.module.css";

export type FacetView = {
  key: string;
  title: string;
  options: { value: string; label: string; count: number }[];
  swatch?: boolean;
};

// Фильтры пишут в query-строку (?color=grey,beige&class=33). Страница каталога —
// серверная, она сама отфильтрует. Ссылку с фильтрами можно переслать клиенту.

function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();

  function update(mut: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mut(next);
    const qs = next.toString();
    start(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  return { params, update, pending };
}

export function Filters({ facets, priceRange }: { facets: FacetView[]; priceRange: [number, number] }) {
  const { t } = useI18n();
  const { params, update, pending } = useQueryState();

  const selected = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean);

  function toggle(key: string, value: string) {
    update((p) => {
      const cur = selected(key);
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      if (next.length) p.set(key, next.join(","));
      else p.delete(key);
    });
  }

  function flag(key: string, on: boolean) {
    update((p) => (on ? p.set(key, "1") : p.delete(key)));
  }

  function price(form: HTMLFormElement) {
    const data = new FormData(form);
    update((p) => {
      for (const k of ["min", "max"]) {
        const v = String(data.get(k) ?? "").replace(/\D/g, "");
        if (v) p.set(k, v);
        else p.delete(k);
      }
    });
  }

  const active = [...params.keys()].some((k) => k !== "sort" && k !== "q" && k !== "cat");

  return (
    <div className={s.filters} data-pending={pending || undefined}>
      <div className={s.top}>
        <p className={s.title}>{t.catalog.filters}</p>
        {active ? (
          <button type="button" className={s.reset} onClick={() => update((p) => [...p.keys()].filter((k) => k !== "q" && k !== "sort" && k !== "cat").forEach((k) => p.delete(k)))}>
            {t.catalog.reset}
          </button>
        ) : null}
      </div>

      <fieldset className={s.group}>
        <legend>{t.catalog.price}</legend>
        <form
          key={`${params.get("min")}-${params.get("max")}`}
          className={s.price}
          onSubmit={(e) => {
            e.preventDefault();
            price(e.currentTarget);
          }}
        >
          <input name="min" inputMode="numeric" placeholder={`${t.catalog.from} ${priceRange[0]}`} defaultValue={params.get("min") ?? ""} aria-label={`${t.catalog.price}: ${t.catalog.from}`} />
          <input name="max" inputMode="numeric" placeholder={`${t.catalog.to} ${priceRange[1]}`} defaultValue={params.get("max") ?? ""} aria-label={`${t.catalog.price}: ${t.catalog.to}`} />
          <button type="submit">{t.catalog.ok}</button>
        </form>
      </fieldset>

      <fieldset className={s.group}>
        <legend>{t.catalog.stock}</legend>
        <label className={s.check}>
          <input type="checkbox" checked={params.get("stock") === "1"} onChange={(e) => flag("stock", e.target.checked)} />
          <span>{t.catalog.onlyStock}</span>
        </label>
        <label className={s.check}>
          <input type="checkbox" checked={params.get("sale") === "1"} onChange={(e) => flag("sale", e.target.checked)} />
          <span>{t.catalog.onlySale}</span>
        </label>
      </fieldset>

      {facets.map((f) => {
        const sel = selected(f.key);
        return (
          <details key={f.key} className={s.group} open={sel.length > 0 || f.options.length <= 6}>
            <summary>
              {f.title}
              {sel.length ? <span className={s.count}>{sel.length}</span> : null}
              <Icon name="chevron" size={14} className={s.chev} />
            </summary>
            <div className={s.options}>
              {f.options.map((o) => (
                <label key={o.value} className={s.check} data-empty={o.count === 0 && !sel.includes(o.value) ? true : undefined}>
                  <input type="checkbox" checked={sel.includes(o.value)} onChange={() => toggle(f.key, o.value)} />
                  {f.swatch ? <i className={s.swatch} style={{ background: `var(--tone-${o.value}-3)` }} /> : null}
                  <span>{o.label}</span>
                  <span className={s.n}>{o.count}</span>
                </label>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}

export function SortSelect({ sorts }: { sorts: { id: string; name: string }[] }) {
  const { t } = useI18n();
  const { params, update } = useQueryState();
  return (
    <label className={s.sort}>
      <span className="visually-hidden">{t.catalog.sort}</span>
      <select value={params.get("sort") ?? "popular"} onChange={(e) => update((p) => (e.target.value === "popular" ? p.delete("sort") : p.set("sort", e.target.value)))}>
        {sorts.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
