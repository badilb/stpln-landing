// Реквизиты STEPLINE — из профиля @stepline_astana и карточки 2ГИС (02.10.2026).
// Тексты на трёх языках — в src/i18n/*.ts (site.address, site.hours…).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://stepline.kz").replace(/\/$/, "");

export const site = {
  name: "STEPLINE",
  /** Номер из ссылки wa.me в профиле и карточки 2ГИС; если для звонков другой — заменить */
  phone: "+7 771 271 75 75",
  whatsapp: "77712717575",
  instagram: "https://www.instagram.com/stepline_astana/",
  instagramHandle: "@stepline_astana",
  email: null as string | null, // TODO: почта для заказов
  /** Карточка фирмы в 2ГИС (короткая ссылка от клиента: go.2gis.com/I4X3W) */
  map: "https://2gis.kz/astana/firm/70000001110927997",
  firmId: "70000001110927997",
  coords: { lat: 51.129872, lon: 71.40242 },
  /** Ежедневно 10:00–19:00 — по 2ГИС; для schema.org */
  opens: "10:00",
  closes: "19:00",
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
