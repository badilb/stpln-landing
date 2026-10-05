"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FloorPattern } from "@/components/FloorPattern";
import { setPreset, usePreset } from "@/components/PresetBadge";
import { categories, tones, type PatternKind } from "@/data/catalog";
import { contrast, grade, toHex } from "@/design/color";
import { presetById, presets, presetVars, type FontRole, type Preset } from "@/design/presets";
import { ProductCard } from "@/components/shop/ProductCard";
import { products } from "@/data/products";
import btn from "@/components/shop/Buttons.module.css";
import hb from "@/components/home/HomeBlocks.module.css";
import hd from "@/components/site/Header.module.css";
import rc from "@/components/home/Recommended.module.css";
import cv from "@/components/shop/CatalogView.module.css";
import ft from "@/components/shop/Filters.module.css";
import ct from "@/app/[lang]/(shop)/cart/cart.module.css";
import { useI18n } from "@/i18n/client";
import { href, tr, withBase } from "@/i18n/config";
import { DesignFeedback } from "./DesignFeedback";
import s from "./design.module.css";

const sections = [
  { id: "ekran", label: "Экран" },
  { id: "shrifty", label: "Шрифты" },
  { id: "cveta", label: "Цвета" },
  { id: "derevo", label: "Дерево" },
  { id: "komponenty", label: "Компоненты" },
  { id: "otstupy", label: "Отступы" },
  { id: "otvet", label: "Ответ" },
  { id: "eksport", label: "Экспорт" },
];

const TEXT_TOKENS = new Set(["neutral", "muted", "ink", "accent", "focus", "error"]);

/** Доля каждого цвета на типичном экране — показывает, сколько места у акцента. */
const USAGE: [string, number][] = [
  ["paper", 64],
  ["paper-2", 12],
  ["rule", 6],
  ["neutral", 3],
  ["muted", 6],
  ["ink", 7],
  ["accent", 2],
];

const PATTERN_NAMES: Record<PatternKind, string> = {
  deck: "Палуба",
  herringbone: "Английская ёлка",
  chevron: "Французская ёлка",
  geometric: "Геометрический",
  modular: "Модульный",
  click: "Замковый",
  glue: "Клеевой",
  carpet: "Ковролин",
  adhesive: "Клей",
  underlay: "Подложка",
  skirting: "Плинтус",
};

const SCALE = [
  { label: "Первый экран", spec: "display · 44–92 px", cls: "s1", text: "Пол целиком" },
  { label: "Раздел", spec: "display · 36–60 px", cls: "s2", text: "Подбор покрытия" },
  { label: "Строка каталога", spec: "display · 28–40 px", cls: "s3", text: "Французская ёлка" },
  { label: "Подзаголовок", spec: "display · 30 px", cls: "s4", text: "Заявка на замер и расчёт" },
  { label: "Лид", spec: "body · 18 / 1.55", cls: "s5", text: "Подберём покрытие под комнату и посчитаем расход на вашу площадь." },
  { label: "Текст", spec: "body · 16 / 1.55", cls: "s6", text: "Плавающий пол на замке кладётся на подложку 2–3 мм, плинтус — МДФ или шпон." },
  { label: "Подпись", spec: "body · 13", cls: "s7", text: "Позиции в таблице — образец структуры" },
  { label: "Размер", spec: "mono · 13, tabular", cls: "s8", text: "600 × 100 × 15 мм · 1380 × 193 × 8 мм" },
];

const SPACES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ n, px: [4, 8, 12, 16, 24, 32, 48, 64, 96, 144][n - 1] }));

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
    } catch {
      setCopied(null);
    }
  }
  return { copied, copy };
}

function axes(p: Preset) {
  const accent = p.colors.find((c) => c.name === "accent")!.value;
  const hue = Number(accent.match(/([\d.]+)\s*\)$/)![1]);
  const hueName = hue < 70 ? "тёплый" : hue < 110 ? "латунный" : hue < 200 ? "зелёный" : "холодный";
  const serif = p.fonts.display.fallback.includes("serif") && !p.fonts.display.fallback.includes("sans");
  return [
    `Бумага: ${p.dark ? "тёмная" : "светлая"}`,
    `Заголовки: ${serif ? "антиква" : "гротеск"}`,
    `Акцент: ${hueName}`,
  ];
}

export function DesignBook() {
  const { lang } = useI18n();
  const active = usePreset();
  const p = presetById[active] ?? presets[0];
  const { copied, copy } = useCopy();

  // 1–5 на клавиатуре — быстрое переключение пресетов при показе клиенту.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select") || e.metaKey || e.ctrlKey || e.altKey) return;
      const i = Number(e.key) - 1;
      if (presets[i]) setPreset(presets[i].id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const color = (name: string) => p.colors.find((c) => c.name === name)!.value;
  const css = `:root {\n${presetVars(p).map((v) => `  ${v}`).join("\n")}\n}`;

  return (
    <div className={s.page}>
      <header className={s.top}>
        <div className={`wrap ${s.topRow}`}>
          <Link href={href(lang, "/")} className={s.back}>
            ← На сайт
          </Link>
          <nav className={s.anchors} aria-label="Разделы дизайн-системы">
            {sections.map((x) => (
              <a key={x.id} href={`#${x.id}`}>
                {x.label}
              </a>
            ))}
          </nav>
          <div className={s.switch} role="radiogroup" aria-label="Пресет">
            {presets.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={x.id === p.id}
                onClick={() => setPreset(x.id)}
                title={`${x.name} · клавиша ${i + 1}`}
              >
                <span className={s.switchDot} data-preset={x.id} aria-hidden />
                {x.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className={`wrap ${s.intro}`}>
        <h1 className={s.title}>Дизайн-система</h1>
        <p className={s.lead}>
          Пять пресетов одного сайта, первый — фирменный STEPLINE. Выберите — и вся страница, а&nbsp;потом и&nbsp;сайт, перекрасятся. Клавиши
          1–5 переключают пресеты.
        </p>
      </section>

      <div className={`wrap ${s.strip}`} role="radiogroup" aria-label="Пресеты">
        {presets.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="radio"
            aria-checked={x.id === p.id}
            data-preset={x.id}
            className={s.tile}
            onClick={() => setPreset(x.id)}
          >
            <span className={s.tileNum}>{i + 1}</span>
            <span className={s.tileGlyph}>Аа</span>
            <span className={s.tileName}>{x.name}</span>
            <span className={s.tileMood}>{x.mood}</span>
            <span className={s.tileChips} aria-hidden>
              {["paper", "paper-2", "rule", "muted", "ink", "accent"].map((n) => (
                <i key={n} style={{ background: `var(--color-${n})` }} />
              ))}
              {x.wood.slice(1, 4).map((_, k) => (
                <i key={k} style={{ background: `var(--wood-${k + 2})` }} />
              ))}
            </span>
            <span className={s.tileFonts}>
              {x.fonts.display.family} + {x.fonts.body.family}
            </span>
          </button>
        ))}
      </div>

      {/* Живой экран */}
      <section className={`wrap ${s.section}`} id="ekran" aria-labelledby="ekran-t">
        <div className={s.sectionHead}>
          <h2 id="ekran-t" className={s.h2}>
            {p.name}
          </h2>
          <p className={s.note}>{p.mood}</p>
          <p className={s.axes}>
            {axes(p).map((a) => (
              <span key={a}>{a}</span>
            ))}
            <span>Для чего: {p.fits}</span>
          </p>
        </div>

        <div className={s.screen}>
          <div className={s.screenText}>
            <p className={s.screenTitle}>Паркет по самой вкусной цене в&nbsp;городе</p>
            <p className={s.screenLead}>
              Палуба, английская и&nbsp;французская ёлка. 100+ вариантов в&nbsp;салоне, бесплатная доставка
              и&nbsp;хранение.
            </p>
            <div className={s.row}>
              <span className={btn.primary}>Перейти в каталог</span>
              <span className={hb.link}>Записаться в салон</span>
            </div>
          </div>
          <FloorPattern kind="herringbone" variant="wood" width={560} height={420} className={s.screenFloor} />
        </div>

        <div className={s.screenRows}>
          {categories.slice(0, 3).map((c) => (
            <div key={c.id} className={s.screenRow}>
              <span className={s.screenRowName}>{tr(c.name, lang)}</span>
              <span className={s.screenRowSubs}>{c.subtypes.map((st) => tr(st.name, lang)).join(" · ")}</span>
              <FloorPattern kind={c.pattern} width={72} height={40} className={s.screenGlyph} />
            </div>
          ))}
        </div>
        <div className={s.actions}>
          <Link className={btn.primary} href={href(lang, "/")}>
            Открыть сайт в&nbsp;этом пресете
          </Link>
          <button type="button" className={s.textBtn} onClick={() => copy("link", `${location.origin}${withBase(`/${lang}/`)}?preset=${p.id}`)}>
            {copied === "link" ? "Ссылка скопирована" : "Скопировать ссылку для клиента"}
          </button>
        </div>
      </section>

      {/* Шрифты */}
      <section className={`wrap ${s.section}`} id="shrifty" aria-labelledby="shrifty-t">
        <div className={s.sectionHead}>
          <h2 id="shrifty-t" className={s.h2}>
            Шрифты
          </h2>
          <p className={s.note}>Два семейства и&nbsp;моноширинный только для размеров. Все с&nbsp;кириллицей, все бесплатные (Google Fonts).</p>
        </div>

        {(
          [
            ["Заголовки", p.fonts.display, "var(--font-display)"],
            ["Текст", p.fonts.body, "var(--font-body)"],
            ["Размеры", p.fonts.mono, "var(--font-mono)"],
          ] as [string, FontRole, string][]
        ).map(([role, f, stack]) => (
          <div key={role} className={s.font}>
            <div className={s.fontGlyph} style={{ fontFamily: stack }}>
              Аа
            </div>
            <div className={s.fontInfo}>
              <p className={s.fontRole}>{role}</p>
              <p className={s.fontName} style={{ fontFamily: stack }}>
                {f.family}
              </p>
              <p className={s.note}>{f.note}</p>
              <div className={s.weights}>
                {f.weights.map((w) => (
                  <p key={w} style={{ fontFamily: stack, fontWeight: w }}>
                    <span className={s.weightLabel}>{w}</span>
                    Паркет ёлкой, дуб натур
                  </p>
                ))}
              </div>
              <p className={s.alphabet} style={{ fontFamily: stack }}>
                АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ
                <br />
                абвгдеёжзийклмнопрстуфхцчшщъыьэюя
                <br />
                0123456789 × — «» № м²
              </p>
            </div>
          </div>
        ))}

        <h3 className={s.h3}>Шкала</h3>
        <ol className={s.scale}>
          {SCALE.map((x) => (
            <li key={x.label}>
              <span className={s.scaleLabel}>
                {x.label}
                <span>{x.spec}</span>
              </span>
              <span className={`${s.scaleText} ${s[x.cls]}`}>{x.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Цвета */}
      <section className={`wrap ${s.section}`} id="cveta" aria-labelledby="cveta-t">
        <div className={s.sectionHead}>
          <h2 id="cveta-t" className={s.h2}>
            Цвета
          </h2>
          <p className={s.note}>
            Полоса ниже — сколько места цвет занимает на&nbsp;экране. Акцент — не&nbsp;больше 3%. Нажмите на&nbsp;значение,
            чтобы скопировать.
          </p>
        </div>

        <div className={s.usage} aria-hidden>
          {USAGE.map(([n, w]) => (
            <span key={n} style={{ flexGrow: w, background: `var(--color-${n})` }}>
              <em>{w}%</em>
            </span>
          ))}
        </div>

        <table className={s.colors}>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Образец</span>
              </th>
              <th scope="col">Токен</th>
              <th scope="col">Роль</th>
              <th scope="col">OKLCH</th>
              <th scope="col">HEX</th>
              <th scope="col">На фоне</th>
            </tr>
          </thead>
          <tbody>
            {p.colors.map((c) => {
              const hex = toHex(c.value);
              const ratio = TEXT_TOKENS.has(c.name) ? contrast(c.value, color("paper")) : null;
              return (
                <tr key={c.name}>
                  <td>
                    <span className={s.swatch} style={{ background: `var(--color-${c.name})` }} />
                  </td>
                  <td className={s.mono}>--color-{c.name}</td>
                  <td className={s.role}>{c.role}</td>
                  <td>
                    <button type="button" className={s.copy} onClick={() => copy(`o-${c.name}`, c.value)}>
                      {copied === `o-${c.name}` ? "Скопировано" : c.value}
                    </button>
                  </td>
                  <td>
                    <button type="button" className={s.copy} onClick={() => copy(`h-${c.name}`, hex)}>
                      {copied === `h-${c.name}` ? "Скопировано" : hex}
                    </button>
                  </td>
                  <td>
                    {ratio ? (
                      <span className={s.contrast}>
                        <span className={s.contrastSample} style={{ color: `var(--color-${c.name})` }}>
                          Аа
                        </span>
                        <span className={s.mono}>{ratio.toFixed(1)}:1</span>
                        <span className={ratio >= 4.5 ? s.pass : ratio >= 3 ? s.weak : s.fail}>{grade(ratio)}</span>
                      </span>
                    ) : (
                      <span className={s.dim}>фон</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Дерево и раскладки */}
      <section className={`wrap ${s.section}`} id="derevo" aria-labelledby="derevo-t">
        <div className={s.sectionHead}>
          <h2 id="derevo-t" className={s.h2}>
            Дерево и&nbsp;раскладки
          </h2>
          <p className={s.note}>
            Пять древесных тонов и&nbsp;цвет шва — только для рисунков укладки. Раскладки строятся кодом, без фото.
          </p>
        </div>

        <div className={s.wood}>
          {p.wood.map((w, i) => (
            <button key={i} type="button" className={s.woodTone} style={{ background: `var(--wood-${i + 1})` }} onClick={() => copy(`w-${i}`, w)}>
              <span>{copied === `w-${i}` ? "Скопировано" : `--wood-${i + 1}`}</span>
            </button>
          ))}
          <button type="button" className={s.woodTone} style={{ background: "var(--wood-seam)" }} onClick={() => copy("seam", p.seam)}>
            <span>{copied === "seam" ? "Скопировано" : "--wood-seam"}</span>
          </button>
        </div>

        <div className={s.bigPatterns}>
          {(["herringbone", "chevron", "deck", "geometric"] as PatternKind[]).map((k) => (
            <figure key={k}>
              <FloorPattern kind={k} variant="wood" width={320} height={240} />
              <figcaption>{PATTERN_NAMES[k]}</figcaption>
            </figure>
          ))}
        </div>

        <div className={s.glyphs}>
          {(Object.keys(PATTERN_NAMES) as PatternKind[]).map((k) => (
            <figure key={k}>
              <FloorPattern kind={k} width={96} height={56} />
              <figcaption>{PATTERN_NAMES[k]}</figcaption>
            </figure>
          ))}
        </div>

        <h3 className={s.h3}>Тона в подборе</h3>
        <p className={s.note}>Одинаковы во&nbsp;всех пресетах: это цвет товара, а&nbsp;не&nbsp;сайта.</p>
        <div className={s.tones}>
          {tones.map((t) => (
            <span key={t.id}>
              <i style={{ background: `var(--tone-${t.id}-3)` }} />
              {tr(t.name, lang)}
            </span>
          ))}
        </div>
      </section>

      {/* Компоненты — на настоящих CSS-модулях сайта */}
      <section className={`wrap ${s.section}`} id="komponenty" aria-labelledby="komponenty-t">
        <div className={s.sectionHead}>
          <h2 id="komponenty-t" className={s.h2}>
            Компоненты
          </h2>
          <p className={s.note}>Те&nbsp;же стили, что на&nbsp;сайте: правка здесь видна там и&nbsp;наоборот.</p>
        </div>

        <dl className={s.specimens}>
          <div>
            <dt>Кнопки</dt>
            <dd className={s.row}>
              <span className={btn.primary}>В корзину</span>
              <button type="button" className={ct.submit} disabled>
                Отправляем…
              </button>
              <span className={hb.btn}>Построить маршрут</span>
              <span className={hd.order}>На заказ</span>
              <span className={hb.link}>Записаться в WhatsApp</span>
            </dd>
          </div>

          <div>
            <dt>Плашки</dt>
            <dd className={s.row}>
              <span className={hd.tagNew}>NEW</span>
              <span className={hd.tagSale}>SALE</span>
              <span className={s.badgeSale}>−35%</span>
              <span className={s.badgeOrder}>под заказ</span>
            </dd>
          </div>

          <div>
            <dt>Вкладки</dt>
            <dd>
              <div className={rc.tabs} role="tablist" aria-label="Пример вкладок">
                {["Паркет", "Ламинат", "Кварцвинил SPC/LVT"].map((x, i) => (
                  <button key={x} type="button" role="tab" aria-selected={i === 0} tabIndex={-1}>
                    {x}
                  </button>
                ))}
              </div>
            </dd>
          </div>

          <div>
            <dt>Виды и фильтры</dt>
            <dd className={s.stack}>
              <nav className={cv.chips} aria-label="Пример видов">
                <a aria-current="true">Все</a>
                <a>Палуба</a>
                <a>Английская ёлка</a>
                <a>Французская ёлка</a>
              </nav>
              <div className={s.filterDemo}>
                {tones.slice(0, 4).map((x, i) => (
                  <label key={x.id} className={ft.check}>
                    <input type="checkbox" defaultChecked={i === 1} />
                    <i className={ft.swatch} style={{ background: `var(--tone-${x.id}-3)` }} />
                    <span>{tr(x.name, lang)}</span>
                    <span className={ft.n}>{[4, 12, 9, 3][i]}</span>
                  </label>
                ))}
              </div>
            </dd>
          </div>

          <div>
            <dt>Поля</dt>
            <dd className={s.fields}>
              <label className={ct.field}>
                <span>Имя</span>
                <input defaultValue="Айгерим" />
              </label>
              <label className={ct.field}>
                <span>Получение</span>
                <select defaultValue="delivery">
                  <option value="delivery">Доставка по Астане</option>
                  <option value="pickup">Самовывоз из салона</option>
                </select>
              </label>
              <label className={`${ct.field} ${s.invalid}`}>
                <span>Телефон</span>
                <input defaultValue="123" aria-invalid="true" />
                <span className={s.errorText}>Телефон короче 10 цифр.</span>
              </label>
            </dd>
          </div>

          <div>
            <dt>Карточки товара</dt>
            <dd className={s.cards}>
              {[products.find((x) => x.oldPrice && x.category === "parket"), products.find((x) => x.category === "laminat" && x.isNew), products.find((x) => x.stock === 0 && x.category === "kvarcvinil")]
                .filter((x): x is NonNullable<typeof x> => Boolean(x))
                .map((x) => (
                  <ProductCard key={x.id} product={x} />
                ))}
            </dd>
          </div>
        </dl>
      </section>

      {/* Отступы */}
      <section className={`wrap ${s.section}`} id="otstupy" aria-labelledby="otstupy-t">
        <div className={s.sectionHead}>
          <h2 id="otstupy-t" className={s.h2}>
            Отступы
          </h2>
          <p className={s.note}>Шкала на&nbsp;4&nbsp;px. Между разделами — 96&nbsp;px, внутри строки — 16–32&nbsp;px. Общая для всех пресетов.</p>
        </div>
        <ol className={s.spaces}>
          {SPACES.map((x) => (
            <li key={x.n}>
              <span className={s.mono}>--space-{x.n}</span>
              <span className={s.mono}>{x.px} px</span>
              <span className={s.bar} style={{ width: `var(--space-${x.n})` }} />
            </li>
          ))}
        </ol>
      </section>

      <DesignFeedback active={p.id} />

      {/* Экспорт */}
      <section className={`wrap ${s.section}`} id="eksport" aria-labelledby="eksport-t">
        <div className={s.sectionHead}>
          <h2 id="eksport-t" className={s.h2}>
            Экспорт
          </h2>
          <p className={s.note}>
            Токены пресета «{p.name}» — для Figma, другого проекта или чтобы сделать пресет основным
            (<code className={s.mono}>DEFAULT_PRESET</code> в&nbsp;<code className={s.mono}>src/design/presets.ts</code>).
          </p>
        </div>
        <div className={s.exportBar}>
          <button type="button" className={btn.primary} onClick={() => copy("css", css)}>
            {copied === "css" ? "Скопировано" : "Скопировать CSS"}
          </button>
        </div>
        <pre className={s.code}>{css}</pre>
      </section>
    </div>
  );
}
