import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { CheckoutView } from "./CheckoutView";
import s from "../shop.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/checkout">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? getDict(lang).checkout.title : undefined, robots: { index: false } };
}

export default async function CheckoutPage() {
  const { t } = await getI18n();
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ href: "/cart", label: t.cart.title }, { label: t.checkout.title }]} />
      <h1 className={s.pageTitle}>{t.checkout.title}</h1>
      <CheckoutView />
    </div>
  );
}
