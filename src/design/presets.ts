// Дизайн-системы сайта. Единственный источник цветов и шрифтов: из этого файла
// собирается CSS (presetCss) и страница /design. Значения в компонентах — только var(--…).

export type FontRole = {
  family: string;
  /** CSS-переменная, которую выставляет next/font в layout.tsx */
  variable: string;
  fallback: string;
  weights: number[];
  note: string;
};

export type ColorToken = {
  name: string;
  value: string;
  role: string;
};

export type Preset = {
  id: string;
  name: string;
  mood: string;
  fits: string;
  dark: boolean;
  fonts: { display: FontRole; body: FontRole; mono: FontRole };
  /** Вес заголовков: у тонкого антиквенного и у гротеска он разный. */
  headingWeight: number;
  headingTracking: string;
  colors: ColorToken[];
  wood: string[];
  seam: string;
};

const mono: FontRole = {
  family: "JetBrains Mono",
  variable: "--ff-jetbrains",
  fallback: "ui-monospace, monospace",
  weights: [400],
  note: "Только размеры и артикулы — цифры встают в столбик",
};

export const presets: Preset[] = [
  {
    id: "stepline",
    name: "Stepline",
    mood: "Фирменный: белый салон, два коричневых из логотипа, красный только для скидок.",
    fits: "Основной сайт магазина — как в инстаграме @stepline_astana",
    dark: false,
    headingWeight: 600,
    headingTracking: "-0.02em",
    fonts: {
      display: { family: "Geologica", variable: "--ff-geologica", fallback: "ui-sans-serif, sans-serif", weights: [600, 700], note: "Заголовки, цены, логотип-набор" },
      body: { family: "Onest", variable: "--ff-onest", fallback: "ui-sans-serif, sans-serif", weights: [400, 500, 600], note: "Текст, меню, карточки, фильтры" },
      mono,
    },
    colors: [
      { name: "paper", value: "oklch(99% 0.003 70)", role: "Фон страницы" },
      { name: "paper-2", value: "oklch(96.5% 0.006 65)", role: "Фон секций, подложка фото" },
      { name: "paper-3", value: "oklch(93% 0.01 60)", role: "Нажатие, полоса меню" },
      { name: "rule", value: "oklch(89% 0.008 60)", role: "Линейки, рамки" },
      { name: "neutral", value: "oklch(56% 0.01 55)", role: "Подписи, плейсхолдеры" },
      { name: "muted", value: "oklch(43% 0.012 50)", role: "Второстепенный текст" },
      { name: "ink", value: "oklch(22% 0.015 45)", role: "Текст, тёмные кнопки" },
      { name: "accent", value: "oklch(35.5% 0.069 59)", role: "Тёмный коричневый логотипа (#563212): кнопки, активное" },
      { name: "accent-ink", value: "oklch(98% 0.004 70)", role: "Текст на коричневом" },
      { name: "focus", value: "oklch(52% 0.074 59)", role: "Кольцо фокуса — светлый коричневый логотипа" },
      { name: "error", value: "oklch(52% 0.19 27)", role: "Ошибки формы" },
      { name: "sale", value: "oklch(57% 0.2 27)", role: "Скидка, старая цена" },
    ],
    wood: ["oklch(82% 0.055 80)", "oklch(77% 0.065 74)", "oklch(72% 0.075 68)", "oklch(67% 0.08 62)", "oklch(62% 0.08 56)"],
    seam: "oklch(48% 0.05 55)",
  },
  {
    id: "oak",
    name: "Дуб и тушь",
    mood: "Образцовая книга паркетчика: тёплая бумага, антиква, терракотовый лак.",
    fits: "Паркет и инженерная доска, средний и высокий чек",
    dark: false,
    headingWeight: 600,
    headingTracking: "-0.01em",
    fonts: {
      display: { family: "Cormorant Garamond", variable: "--ff-cormorant", fallback: "ui-serif, serif", weights: [500, 600], note: "Заголовки, названия разделов" },
      body: { family: "IBM Plex Sans", variable: "--ff-plex", fallback: "ui-sans-serif, sans-serif", weights: [400, 500, 600], note: "Текст, интерфейс, таблицы" },
      mono,
    },
    colors: [
      { name: "paper", value: "oklch(96.5% 0.012 80)", role: "Фон страницы" },
      { name: "paper-2", value: "oklch(93.5% 0.016 78)", role: "Подложка формы, hover строки" },
      { name: "paper-3", value: "oklch(90% 0.02 76)", role: "Нажатие" },
      { name: "rule", value: "oklch(84% 0.014 75)", role: "Линейки, рамки полей" },
      { name: "neutral", value: "oklch(55% 0.012 70)", role: "Подписи полей, плейсхолдеры" },
      { name: "muted", value: "oklch(42% 0.014 62)", role: "Второстепенный текст" },
      { name: "ink", value: "oklch(21% 0.014 55)", role: "Текст, основные кнопки" },
      { name: "accent", value: "oklch(50% 0.13 40)", role: "Акцент: активная вкладка, hover, номера" },
      { name: "accent-ink", value: "oklch(97% 0.01 80)", role: "Текст на акценте" },
      { name: "focus", value: "oklch(55% 0.16 45)", role: "Кольцо фокуса" },
      { name: "error", value: "oklch(48% 0.16 28)", role: "Ошибки формы" },
      { name: "sale", value: "oklch(52% 0.18 28)", role: "Скидка, старая цена" },
    ],
    wood: ["oklch(82% 0.055 80)", "oklch(77% 0.065 74)", "oklch(72% 0.075 68)", "oklch(67% 0.08 62)", "oklch(62% 0.08 56)"],
    seam: "oklch(48% 0.05 55)",
  },
  {
    id: "workshop",
    name: "Мастерская",
    mood: "Технический каталог: холодный бетон, гротеск, кобальт как карандаш прораба.",
    fits: "Кварцвинил, SPC, ламинат, B2B — прорабы и дизайнеры",
    dark: false,
    headingWeight: 700,
    headingTracking: "-0.03em",
    fonts: {
      display: { family: "Geologica", variable: "--ff-geologica", fallback: "ui-sans-serif, sans-serif", weights: [600, 700], note: "Заголовки — плотный гротеск" },
      body: { family: "Golos Text", variable: "--ff-golos", fallback: "ui-sans-serif, sans-serif", weights: [400, 500, 600], note: "Текст, интерфейс, таблицы" },
      mono,
    },
    colors: [
      { name: "paper", value: "oklch(96% 0.006 250)", role: "Фон страницы" },
      { name: "paper-2", value: "oklch(92.5% 0.008 250)", role: "Подложка формы, hover строки" },
      { name: "paper-3", value: "oklch(89% 0.01 250)", role: "Нажатие" },
      { name: "rule", value: "oklch(83% 0.01 250)", role: "Линейки, рамки полей" },
      { name: "neutral", value: "oklch(54% 0.012 250)", role: "Подписи полей, плейсхолдеры" },
      { name: "muted", value: "oklch(41% 0.014 255)", role: "Второстепенный текст" },
      { name: "ink", value: "oklch(20% 0.015 260)", role: "Текст, основные кнопки" },
      { name: "accent", value: "oklch(50% 0.18 262)", role: "Акцент: активная вкладка, hover, номера" },
      { name: "accent-ink", value: "oklch(97% 0.006 250)", role: "Текст на акценте" },
      { name: "focus", value: "oklch(56% 0.19 262)", role: "Кольцо фокуса" },
      { name: "error", value: "oklch(50% 0.18 25)", role: "Ошибки формы" },
      { name: "sale", value: "oklch(54% 0.2 27)", role: "Скидка, старая цена" },
    ],
    wood: ["oklch(80% 0.04 78)", "oklch(75% 0.05 72)", "oklch(70% 0.055 66)", "oklch(64% 0.055 60)", "oklch(58% 0.05 55)"],
    seam: "oklch(42% 0.03 250)",
  },
  {
    id: "showroom",
    name: "Шоурум",
    mood: "Вечерний свет в шоуруме: тёмный фон, контрастная антиква, латунь.",
    fits: "Премиальный паркет, модульный и художественный",
    dark: true,
    headingWeight: 400,
    headingTracking: "0em",
    fonts: {
      display: { family: "Prata", variable: "--ff-prata", fallback: "ui-serif, serif", weights: [400], note: "Заголовки — дидона, только крупно" },
      body: { family: "Commissioner", variable: "--ff-commissioner", fallback: "ui-sans-serif, sans-serif", weights: [300, 400, 500], note: "Текст, интерфейс; на тёмном на ступень легче" },
      mono,
    },
    colors: [
      { name: "paper", value: "oklch(17% 0.012 60)", role: "Фон страницы" },
      { name: "paper-2", value: "oklch(21% 0.014 60)", role: "Подложка формы, hover строки" },
      { name: "paper-3", value: "oklch(25% 0.016 60)", role: "Нажатие" },
      { name: "rule", value: "oklch(33% 0.014 60)", role: "Линейки, рамки полей" },
      { name: "neutral", value: "oklch(62% 0.012 70)", role: "Подписи полей, плейсхолдеры" },
      { name: "muted", value: "oklch(76% 0.012 75)", role: "Второстепенный текст" },
      { name: "ink", value: "oklch(93% 0.012 80)", role: "Текст, основные кнопки" },
      { name: "accent", value: "oklch(77% 0.11 82)", role: "Акцент: латунь" },
      { name: "accent-ink", value: "oklch(18% 0.012 60)", role: "Текст на акценте" },
      { name: "focus", value: "oklch(80% 0.12 82)", role: "Кольцо фокуса" },
      { name: "error", value: "oklch(70% 0.15 28)", role: "Ошибки формы" },
      { name: "sale", value: "oklch(68% 0.17 28)", role: "Скидка, старая цена" },
    ],
    wood: ["oklch(58% 0.07 62)", "oklch(52% 0.075 58)", "oklch(46% 0.07 54)", "oklch(40% 0.06 50)", "oklch(34% 0.05 48)"],
    seam: "oklch(22% 0.02 50)",
  },
  {
    id: "linen",
    name: "Лён",
    mood: "Скандинавский дом: льняная бумага, книжная антиква, мох вместо лака.",
    fits: "Светлый дуб, ковролин, семейные покупатели",
    dark: false,
    headingWeight: 500,
    headingTracking: "-0.02em",
    fonts: {
      display: { family: "Literata", variable: "--ff-literata", fallback: "ui-serif, serif", weights: [400, 500, 600], note: "Заголовки — спокойная книжная антиква" },
      body: { family: "Onest", variable: "--ff-onest", fallback: "ui-sans-serif, sans-serif", weights: [400, 500, 600], note: "Текст, интерфейс, таблицы" },
      mono,
    },
    colors: [
      { name: "paper", value: "oklch(97% 0.008 110)", role: "Фон страницы" },
      { name: "paper-2", value: "oklch(94% 0.012 115)", role: "Подложка формы, hover строки" },
      { name: "paper-3", value: "oklch(91% 0.015 115)", role: "Нажатие" },
      { name: "rule", value: "oklch(86% 0.012 115)", role: "Линейки, рамки полей" },
      { name: "neutral", value: "oklch(56% 0.012 120)", role: "Подписи полей, плейсхолдеры" },
      { name: "muted", value: "oklch(43% 0.014 130)", role: "Второстепенный текст" },
      { name: "ink", value: "oklch(23% 0.016 140)", role: "Текст, основные кнопки" },
      { name: "accent", value: "oklch(47% 0.09 150)", role: "Акцент: мох" },
      { name: "accent-ink", value: "oklch(97% 0.008 110)", role: "Текст на акценте" },
      { name: "focus", value: "oklch(52% 0.11 150)", role: "Кольцо фокуса" },
      { name: "error", value: "oklch(50% 0.16 28)", role: "Ошибки формы" },
      { name: "sale", value: "oklch(53% 0.18 28)", role: "Скидка, старая цена" },
    ],
    wood: ["oklch(88% 0.035 88)", "oklch(84% 0.045 82)", "oklch(80% 0.05 78)", "oklch(75% 0.055 74)", "oklch(70% 0.055 70)"],
    seam: "oklch(55% 0.03 80)",
  },
];

/** Тема страницы «На заказ»: другой формат и другие цвета, не переключается пресетами. */
export const orderTheme: Preset = {
  id: "order",
  name: "На заказ",
  mood: "Лукбук коллекций: тёмная хвоя, песок, крупная антиква.",
  fits: "Страница /na-zakaz",
  dark: true,
  headingWeight: 500,
  headingTracking: "-0.02em",
  fonts: {
    display: { family: "Literata", variable: "--ff-literata", fallback: "ui-serif, serif", weights: [400, 500, 600], note: "Заголовки лукбука" },
    body: { family: "Onest", variable: "--ff-onest", fallback: "ui-sans-serif, sans-serif", weights: [400, 500, 600], note: "Текст" },
    mono,
  },
  colors: [
    { name: "paper", value: "oklch(20% 0.02 165)", role: "Фон" },
    { name: "paper-2", value: "oklch(24% 0.022 165)", role: "Секции" },
    { name: "paper-3", value: "oklch(28% 0.024 165)", role: "Нажатие" },
    { name: "rule", value: "oklch(35% 0.02 165)", role: "Линейки" },
    { name: "neutral", value: "oklch(66% 0.015 150)", role: "Подписи" },
    { name: "muted", value: "oklch(80% 0.012 130)", role: "Второстепенный текст" },
    { name: "ink", value: "oklch(95% 0.012 95)", role: "Текст" },
    { name: "accent", value: "oklch(84% 0.08 85)", role: "Песок" },
    { name: "accent-ink", value: "oklch(20% 0.02 165)", role: "Текст на песке" },
    { name: "focus", value: "oklch(86% 0.1 85)", role: "Фокус" },
    { name: "error", value: "oklch(72% 0.15 28)", role: "Ошибки" },
    { name: "sale", value: "oklch(72% 0.15 28)", role: "Скидка" },
  ],
  wood: ["oklch(70% 0.06 75)", "oklch(64% 0.065 70)", "oklch(58% 0.065 64)", "oklch(52% 0.06 58)", "oklch(46% 0.055 52)"],
  seam: "oklch(26% 0.02 60)",
};

export const DEFAULT_PRESET = presets[0].id;
export const PRESET_STORAGE_KEY = "fe-preset";

export const presetById = Object.fromEntries(presets.map((p) => [p.id, p])) as Record<string, Preset>;

function fontStack(f: FontRole) {
  return `var(${f.variable}), "${f.family}", ${f.fallback}`;
}

/** Переменные одного пресета — то, что попадает в CSS и в «Скопировать токены». */
export function presetVars(p: Preset): string[] {
  return [
    ...p.colors.map((c) => `--color-${c.name}: ${c.value};`),
    ...p.wood.map((w, i) => `--wood-${i + 1}: ${w};`),
    `--wood-seam: ${p.seam};`,
    `--font-display: ${fontStack(p.fonts.display)};`,
    `--font-body: ${fontStack(p.fonts.body)};`,
    `--font-mono: ${fontStack(p.fonts.mono)};`,
    `--heading-weight: ${p.headingWeight};`,
    `--heading-tracking: ${p.headingTracking};`,
    `color-scheme: ${p.dark ? "dark" : "light"};`,
  ];
}

/** :root = пресет по умолчанию; [data-preset] переключает весь сайт или отдельный блок. */
export function presetCss() {
  const block = (sel: string, p: Preset) => `${sel}{${presetVars(p).join("")}}`;
  return [
    block(":root", presetById[DEFAULT_PRESET]),
    ...presets.map((p) => block(`[data-preset="${p.id}"]`, p)),
    block(`[data-theme="order"]`, orderTheme),
  ].join("\n");
}

/** Инлайн-скрипт до первой отрисовки: ?preset=… или сохранённый выбор. */
export const presetBootScript = `(function(){try{var k=${JSON.stringify(PRESET_STORAGE_KEY)},ids=${JSON.stringify(
  presets.map((p) => p.id),
)},q=new URLSearchParams(location.search).get("preset");if(q&&ids.indexOf(q)>-1){localStorage.setItem(k,q)}var v=q&&ids.indexOf(q)>-1?q:localStorage.getItem(k);if(v&&ids.indexOf(v)>-1&&v!==${JSON.stringify(
  DEFAULT_PRESET,
)}){document.documentElement.dataset.preset=v}}catch(e){}})();`;
