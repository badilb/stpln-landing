import Link from "next/link";
import { ProductImage } from "@/components/shop/ProductImage";
import { whatsappLink } from "@/content/site";
import { discount, productName, products, sizeOf, unitOf } from "@/data/products";
import { fmt, money } from "@/i18n";
import { href } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import s from "./SaleHero.module.css";

// Витрина акций: две главные акции крупно (они же из инстаграма), под ними — цифры по данным.
// Без таймеров и «осталось 2 штуки»: срочность только честная — «пока есть в наличии».
export async function SaleHero() {
  const { lang, t } = await getI18n();
  const onSale = products.filter((p) => p.oldPrice);
  const maxOff = Math.max(...onSale.map(discount));
  const featured = [
    products.find((p) => p.collection === "Promo"),
    products.find((p) => p.collection === "Aqua 48"),
  ].filter((p): p is NonNullable<typeof p> => Boolean(p));
  const slides = t.promo.slides;

  return (
    <section className={s.hero} aria-label={t.sale.featured}>
      <div className={s.stats}>
        <p className={s.big}>{fmt(t.sale.upTo, { n: maxOff })}</p>
        <p>{fmt(t.sale.count, { n: onSale.length })}</p>
        <p>{t.sale.until}</p>
      </div>

      <div className={s.featured}>
        {featured.map((p, i) => {
          const title = slides[i]?.title ?? productName(p, lang);
          return (
            <article key={p.id} className={s.card}>
              <Link href={href(lang, `/product/${p.id}`)} className={s.art} tabIndex={-1} aria-hidden>
                <ProductImage product={p} width={640} height={420} zoom={0.8} />
                <span className={s.off}>−{discount(p)}%</span>
              </Link>
              <div className={s.body}>
                <p className={s.kicker}>{slides[i]?.kicker}</p>
                <h2 className={s.title}>{title}</h2>
                <p className={s.text}>{slides[i]?.text}</p>
                <p className={s.meta}>
                  {productName(p, lang)} · {sizeOf(p, lang)}
                </p>
                <p className={s.price}>
                  <s>{money(p.oldPrice!, lang)}</s>
                  <b>{money(p.price, lang)}</b>
                  <span>/ {t.units[unitOf(p)]}</span>
                </p>
                <div className={s.actions}>
                  <Link href={href(lang, `/product/${p.id}`)} className={s.primary}>
                    {slides[i]?.cta}
                  </Link>
                  <a href={whatsappLink(fmt(t.sale.askText, { title }))} target="_blank" rel="noreferrer" className={s.link}>
                    {t.sale.ask}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className={s.terms}>{t.sale.terms}</p>
      <h2 className={s.allTitle}>{t.sale.all}</h2>
    </section>
  );
}
