import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { CartView } from "./CartView";
import s from "../shop.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/cart">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? getDict(lang).cart.title : undefined, robots: { index: false } };
}

export default async function CartPage() {
  const { t } = await getI18n();
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: t.cart.title }]} />
      <h1 className={s.pageTitle}>{t.cart.title}</h1>
      <CartView />
    </div>
  );
}
