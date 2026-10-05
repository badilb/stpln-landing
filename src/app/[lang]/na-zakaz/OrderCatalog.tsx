"use client";

import { useMemo, useState, type FormEvent } from "react";
import { FloorPattern } from "@/components/FloorPattern";
import { Icon } from "@/components/site/Icon";
import { whatsappLink } from "@/content/site";
import { sendForm } from "@/lib/send";
import { tonePalette, tones, type Tone } from "@/data/catalog";
import { KINDS, ORDER_SAMPLE, type OrderCollection } from "@/data/order-collections";
import { fmt } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { tr } from "@/i18n/config";
import s from "./order.module.css";

type Pick = { code: string; name: string; collection: string };
type Status = "idle" | "sending" | "sent" | "error";

export function OrderCatalog({ collections }: { collections: OrderCollection[] }) {
  const { lang, t } = useI18n();
  const O = t.order;
  const kinds = useMemo(() => [...new Set(collections.map((c) => c.kind))], [collections]);
  const [kind, setKind] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone | null>(null);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const shown = collections
    .filter((c) => !kind || c.kind === kind)
    .map((c) => ({ ...c, decors: c.decors.filter((d) => !tone || d.tone === tone) }))
    .filter((c) => c.decors.length);

  const picked = (code: string) => picks.some((p) => p.code === code);
  function toggle(p: Pick) {
    setPicks((list) => (list.some((x) => x.code === p.code) ? list.filter((x) => x.code !== p.code) : [...list, p]));
    setStatus("idle");
  }

  const pickText = picks.map((p) => `${p.collection} ${p.code} ${p.name}`).join(", ");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError(null);
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const res = await sendForm(
      `Запрос «На заказ»: ${picks.length ? picks.map((p) => p.code).join(", ") : "подбор декора"}`,
      {
        "Имя": d.name,
        "Телефон": d.phone,
        "Площадь, м²": d.area,
        "Декоры": picks.map((p) => `${p.collection} · ${p.code} ${p.name}`).join("\n"),
        "Комментарий": d.comment,
        "Язык сайта": lang,
      },
      { fromName: d.name },
    );
    if (res.ok) {
      setStatus("sent");
      setPicks([]);
      form.reset();
    } else if (res.reason === "no-channel") {
      // Канал не настроен — открываем WhatsApp с готовым текстом
      window.open(whatsappLink(fmt(O.waPicks, { picks: pickText || O.waNone }) + (d.area ? ` ${O.area}: ${d.area}.` : "")), "_blank", "noreferrer");
      setStatus("idle");
    } else {
      setStatus("error");
      setError(res.message ?? O.errorFallback);
    }
  }

  return (
    <>
      <section className={`wrap ${s.catalog}`} id="kollekcii" aria-labelledby="kol-t">
        <div className={s.catHead}>
          <h2 id="kol-t" className={s.h2}>
            {O.collections}
          </h2>
          <div className={s.filters}>
            <div className={s.chips} role="group" aria-label={O.kindGroup}>
              <button type="button" aria-pressed={!kind} onClick={() => setKind(null)}>
                {O.allKinds}
              </button>
              {kinds.map((k) => (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(kind === k ? null : k)}>
                  {tr(KINDS[k], lang)}
                </button>
              ))}
            </div>
            <div className={s.chips} role="group" aria-label={O.toneGroup}>
              {tones.map((tn) => (
                <button key={tn.id} type="button" aria-pressed={tone === tn.id} onClick={() => setTone(tone === tn.id ? null : tn.id)} title={tr(tn.name, lang)}>
                  <i className={s.dot} style={{ background: `var(--tone-${tn.id}-3)` }} />
                  {tr(tn.name, lang)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {shown.length ? null : <p className={s.none}>{O.noneTone}</p>}

        {shown.map((c) => (
          <article key={c.id} className={s.collection} aria-labelledby={`c-${c.id}`}>
            <div className={s.colInfo}>
              <p className={s.colKind}>{tr(KINDS[c.kind], lang)}</p>
              <h3 id={`c-${c.id}`} className={s.colName}>
                {c.name}
              </h3>
              <p className={s.colFormat}>{lang === "en" ? c.format : c.format.replace(".", ",")} {lang === "en" ? "mm" : "мм"}</p>
              <ul className={s.colSpecs}>
                {c.specs.map((x) => (
                  <li key={x.ru}>{tr(x, lang)}</li>
                ))}
              </ul>
              <p className={s.colMeta}>
                {fmt(O.decors, { n: c.decors.length })} · {fmt(O.lead_time, { t: c.leadTime ?? O.onRequest })}
              </p>
            </div>
            <ul className={s.decors}>
              {c.decors.map((d, i) => {
                const on = picked(d.code);
                return (
                  <li key={d.code}>
                    <button type="button" className={s.decor} aria-pressed={on} onClick={() => toggle({ code: d.code, name: d.name, collection: c.name })}>
                      <span className={s.decorArt}>
                        <FloorPattern kind={c.pattern} variant="wood" width={180} height={220} palette={tonePalette(d.tone)} seam="var(--tone-seam)" seed={i * 7 + c.id.length} />
                        <span className={s.decorMark} aria-hidden>
                          <Icon name={on ? "check" : "plus"} size={18} />
                        </span>
                      </span>
                      <span className={s.decorCode}>{d.code}</span>
                      <span className={s.decorName}>{d.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
        {ORDER_SAMPLE ? <p className={s.sample}>{O.sample}</p> : null}
      </section>

      <section className={`wrap ${s.request}`} id="zapros" aria-labelledby="zapros-t">
        <div className={s.reqText}>
          <h2 id="zapros-t" className={s.h2}>
            {O.requestTitle}
          </h2>
          <p className={s.reqLead}>{O.requestLead}</p>
          {picks.length ? (
            <ul className={s.picks}>
              {picks.map((p) => (
                <li key={p.code}>
                  <span>
                    {p.collection} · <b>{p.code}</b> {p.name}
                  </span>
                  <button type="button" onClick={() => toggle(p)} aria-label={fmt(O.removePick, { code: p.code })}>
                    <Icon name="close" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.reqEmpty}>{O.noPicks}</p>
          )}
        </div>

        {status === "sent" ? (
          <div className={s.sent}>
            <Icon name="check" size={28} />
            <p>{O.sent}</p>
          </div>
        ) : (
          <form className={s.form} onSubmit={submit}>
            <label className={s.field}>
              <span>{O.name}</span>
              <input name="name" required autoComplete="name" maxLength={80} />
            </label>
            <label className={s.field}>
              <span>{O.phone}</span>
              <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[\d\s()+\-]{10,20}" title={t.checkout.phoneTitle} />
            </label>
            <label className={s.field}>
              <span>{O.area}</span>
              <input name="area" inputMode="decimal" maxLength={10} />
            </label>
            <label className={`${s.field} ${s.wide}`}>
              <span>{O.comment}</span>
              <textarea name="comment" rows={3} maxLength={1000} placeholder={O.commentPh} />
            </label>
            <div className={`${s.formActions} ${s.wide}`}>
              <button type="submit" className={s.submit} disabled={status === "sending"}>
                {status === "sending" ? t.form.sending : picks.length ? fmt(O.submitN, { n: picks.length }) : O.submit}
              </button>
              <a className={s.waLink} href={whatsappLink(fmt(O.waPicks, { picks: pickText || O.waNone }))} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} />
                {O.orWa}
              </a>
            </div>
            {status === "error" ? (
              <p className={`${s.error} ${s.wide}`} role="status">
                {error} {O.errorRetry}
              </p>
            ) : null}
          </form>
        )}
      </section>

      {picks.length && status !== "sent" ? (
        <a href="#zapros" className={s.tray}>
          {fmt(O.tray, { n: picks.length })}
          <Icon name="chevron" size={16} />
        </a>
      ) : null}
    </>
  );
}
