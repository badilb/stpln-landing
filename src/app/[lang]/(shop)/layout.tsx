import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Icon } from "@/components/site/Icon";
import { whatsappLink } from "@/content/site";
import { SAMPLE_DATA } from "@/data/products";
import { getI18n } from "@/i18n/server";
import s from "./shop.module.css";

export default async function ShopLayout({ children }: LayoutProps<"/[lang]">) {
  const { t } = await getI18n();
  return (
    <>
      <Header />
      {SAMPLE_DATA ? <p className={s.demo}>{t.demo}</p> : null}
      <main className={s.main}>{children}</main>
      <Footer />
      <a className={s.wa} href={whatsappLink(t.header.waHello)} target="_blank" rel="noreferrer" aria-label={t.header.whatsapp}>
        <Icon name="whatsapp" size={26} />
      </a>
    </>
  );
}
