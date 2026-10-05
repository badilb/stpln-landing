import { FloorPattern } from "@/components/FloorPattern";
import { tonePalette } from "@/data/catalog";
import { orderCollections } from "@/data/order-collections";
import { fmt } from "@/i18n";
import { getI18n } from "@/i18n/server";
import { OrderCatalog } from "./OrderCatalog";
import s from "./order.module.css";

export default async function OrderPage() {
  const { t } = await getI18n();
  // Мозаика первого экрана — по нескольку декоров из каждой коллекции
  const mosaic = orderCollections.flatMap((c) => c.decors.slice(0, 3).map((d) => ({ ...d, pattern: c.pattern }))).slice(0, 12);
  const total = orderCollections.reduce((a, c) => a + c.decors.length, 0);

  return (
    <>
      <section className={`wrap ${s.hero}`}>
        <div className={s.heroText}>
          <p className={s.kicker}>{fmt(t.order.kicker, { c: orderCollections.length, d: total })}</p>
          <h1 className={s.heroTitle}>{t.order.title}</h1>
          <p className={s.heroLead}>{t.order.lead}</p>
          <a href="#kollekcii" className={s.heroCta}>
            {t.order.cta}
          </a>
        </div>
        <div className={s.mosaic} aria-hidden>
          {mosaic.map((m, i) => (
            <FloorPattern key={m.code} kind={m.pattern} variant="wood" width={200} height={200} palette={tonePalette(m.tone)} seam="var(--tone-seam)" seed={i * 13} className={s.tile} />
          ))}
        </div>
      </section>

      <section className={`wrap ${s.steps}`} id="kak" aria-labelledby="kak-t">
        <h2 id="kak-t" className={s.h2}>
          {t.order.howTitle}
        </h2>
        <ol className={s.stepList}>
          {t.order.steps.map((st, i) => (
            <li key={st.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <OrderCatalog collections={orderCollections} />
    </>
  );
}
