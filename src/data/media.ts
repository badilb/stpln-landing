import type { L } from "@/i18n/config";
import type { PatternKind, Tone } from "./catalog";

// Медиа по образцу parket-greenline.ru/gallery: фото объектов, видео, соцсети.
// Видео — настоящие публикации @stepline_astana (собраны 02.10.2026), встраиваются по клику.
// Фото объектов — пока структура: положите файлы в public/media/objects/ и заполните photo.

export type MediaVideo = {
  code: string;
  kind: "reel" | "p";
  title: L;
  /** Для обложки до загрузки — раскладка в тоне покрытия из ролика */
  pattern: PatternKind;
  tone: Tone;
};

export const videos: MediaVideo[] = [
  {
    code: "DcxryuqiIN_",
    kind: "p",
    title: { ru: "Паркет в квартире нашей заказчицы", kk: "Тапсырыс берушіміздің пәтеріндегі паркет", en: "Parquet in a customer's apartment" },
    pattern: "deck",
    tone: "natural",
  },
  {
    code: "Dd3f9tOoMFJ",
    kind: "reel",
    title: { ru: "Инженерная доска «английская ёлка»", kk: "«Ағылшын шыршасы» инженерлік тақтасы", en: "Engineered herringbone board" },
    pattern: "herringbone",
    tone: "brown",
  },
  {
    code: "Dbi_qfAMkFn",
    kind: "reel",
    title: { ru: "−35% на ламинат BlackBerry, Германия", kk: "BlackBerry ламинатына −35%, Германия", en: "35% off BlackBerry laminate, Germany" },
    pattern: "deck",
    tone: "beige",
  },
  {
    code: "Dbcx_ODiG9L",
    kind: "p",
    title: { ru: "Французская ёлка Metric Lam Chevron — 7 оттенков", kk: "Metric Lam Chevron француз шыршасы — 7 реңк", en: "Metric Lam Chevron — 7 shades" },
    pattern: "chevron",
    tone: "light",
  },
  {
    code: "DcHohWSoIqS",
    kind: "reel",
    title: { ru: "Ламинат с защитой от влаги", kk: "Ылғалдан қорғалған ламинат", en: "Water-resistant laminate" },
    pattern: "deck",
    tone: "grey",
  },
  {
    code: "DdbDPbOCP0N",
    kind: "p",
    title: { ru: "Кварцвинил SPC: оттенки и форматы", kk: "SPC кварцвинилі: реңктер мен форматтар", en: "SPC vinyl: shades and formats" },
    pattern: "deck",
    tone: "beige",
  },
  {
    code: "DdDquRyoDZK",
    kind: "reel",
    title: { ru: "Ламинат, SPC, паркет, LVT — в одном салоне", kk: "Ламинат, SPC, паркет, LVT — бір салонда", en: "Laminate, SPC, parquet, LVT — one showroom" },
    pattern: "herringbone",
    tone: "natural",
  },
  {
    code: "Db-ZTlFIIUU",
    kind: "reel",
    title: { ru: "Паркет 24 000 ₸ вместо 40 000 ₸", kk: "Паркет 40 000 ₸ орнына 24 000 ₸", en: "Parquet 24,000 ₸ instead of 40,000 ₸" },
    pattern: "deck",
    tone: "brown",
  },
];

export type MediaPhoto = {
  id: string;
  title: L;
  /** Путь в public/, когда будет фото объекта; пока нет — показываем раскладку и пометку */
  photo?: string;
  pattern: PatternKind;
  tone: Tone;
};

export const photos: MediaPhoto[] = [
  { id: "obj-1", title: { ru: "Квартира, французская ёлка", kk: "Пәтер, француз шыршасы", en: "Apartment, chevron" }, pattern: "chevron", tone: "natural" },
  { id: "obj-2", title: { ru: "Гостиная, английская ёлка", kk: "Қонақ бөлме, ағылшын шыршасы", en: "Living room, herringbone" }, pattern: "herringbone", tone: "brown" },
  { id: "obj-3", title: { ru: "Кухня, кварцвинил SPC", kk: "Ас үй, SPC кварцвинилі", en: "Kitchen, SPC vinyl" }, pattern: "deck", tone: "grey" },
  { id: "obj-4", title: { ru: "Спальня, ламинат палуба", kk: "Жатын бөлме, палуба ламинаты", en: "Bedroom, plank laminate" }, pattern: "deck", tone: "beige" },
  { id: "obj-5", title: { ru: "Салон STEPLINE", kk: "STEPLINE салоны", en: "STEPLINE showroom" }, pattern: "herringbone", tone: "light" },
  { id: "obj-6", title: { ru: "Офис, модульный паркет", kk: "Кеңсе, модульдік паркет", en: "Office, modular parquet" }, pattern: "geometric", tone: "dark" },
];

export function igUrl(v: MediaVideo) {
  return `https://www.instagram.com/${v.kind}/${v.code}/`;
}

export function igEmbed(v: MediaVideo) {
  return `https://www.instagram.com/${v.kind}/${v.code}/embed/`;
}
