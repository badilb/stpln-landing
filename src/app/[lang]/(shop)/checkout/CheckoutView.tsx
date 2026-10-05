"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/site/Icon";
import { whatsappLink } from "@/content/site";
import { productName } from "@/data/products";
import { fmt, money } from "@/i18n";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { orderId as makeOrderId, sendForm } from "@/lib/send";
import { clearCart } from "@/lib/stores";
import { orderText, useCartLines } from "../cart/CartView";
import s from "./checkout.module.css";

// Поля — по образцу оформления mirparketa, но обязательных минимум: имя, телефон, согласие.
// ИИН частных лиц не спрашиваем (для заказа не нужен, а это лишние персональные данные);
// БИН и название — только когда покупает компания, адрес — только при доставке.

type Status = "idle" | "sending" | "sent" | "wa" | "error";

export function CheckoutView() {
  const { lang, t } = useI18n();
  const T = t.checkout;
  const { lines, total } = useCartLines();
  const [buyer, setBuyer] = useState<"person" | "company">("person");
  const [receive, setReceive] = useState<"delivery" | "pickup" | "storage">("delivery");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError(null);
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const id = makeOrderId();
    const address = [d.street, d.house && `д. ${d.house}`, d.flat && `кв. ${d.flat}`, d.floor && `этаж ${d.floor}`, d.lift === "yes" && "есть грузовой лифт"].filter(Boolean).join(", ");
    // Письмо менеджеру — по-русски, независимо от языка сайта покупателя
    const res = await sendForm(
      `Заказ ${id} — ${Math.round(total).toLocaleString("ru-RU")} ₸`,
      {
        "Номер заказа": id,
        "Покупатель": d.buyerType === "company" ? `Компания: ${d.company}, БИН ${d.bin}` : "Частное лицо",
        "Имя": d.name,
        "Телефон": d.phone,
        email: d.email,
        "Получение": { delivery: "Доставка по Астане", pickup: "Самовывоз", storage: "Хранение" }[d.receive] ?? d.receive,
        "Адрес": d.receive === "delivery" ? address : undefined,
        "Оплата": { kaspi: "По QR-коду", card: "Карта / наличные", invoice: "По счёту", credit: "Рассрочка 12 мес" }[d.payment] ?? d.payment,
        "Товары": lines.map((l) => `${productName(l.p, "ru")} [${l.p.sku}] × ${l.qty}${l.p.packM2 ? " уп." : " шт"} = ${Math.round(l.sum).toLocaleString("ru-RU")} ₸`).join("\n"),
        "Итого": `${Math.round(total).toLocaleString("ru-RU")} ₸`,
        "Комментарий": d.comment,
        "Язык сайта": lang,
      },
      { replyTo: d.email || undefined, fromName: d.name },
    );
    setOrderId(id);
    if (res.ok) {
      setStatus("sent");
      clearCart();
    } else if (res.reason === "no-channel") {
      // Канал отправки не настроен — заказ уходит через WhatsApp, корзину не трогаем
      setStatus("wa");
    } else {
      setStatus("error");
      setError(res.message ?? T.errorFallback);
    }
  }

  const stepsBar = (
    <ol className={s.steps}>
      {T.steps.map((st, i) => (
        <li key={st} aria-current={(status === "sent" || status === "wa" ? 2 : 1) === i ? "step" : undefined} data-done={(status === "sent" || status === "wa" ? 2 : 1) > i || undefined}>
          {i === 0 ? <Link href={href(lang, "/cart")}>{st}</Link> : st}
        </li>
      ))}
    </ol>
  );

  if (status === "wa") {
    return (
      <>
        {stepsBar}
        <div className={s.done}>
          <h2>{fmt(T.waOnlyTitle, { id: orderId ?? "" })}</h2>
          <p>{T.waOnlyText}</p>
          <a href={whatsappLink(`${fmt(T.waOnlyTitle, { id: orderId ?? "" })}\n${orderText(lines, total, lang, t)}`)} target="_blank" rel="noreferrer" className={s.submitLink}>
            <Icon name="whatsapp" size={18} /> {t.cart.sendWa}
          </a>
          <Link href={href(lang, "/cart")}>{T.back}</Link>
        </div>
      </>
    );
  }

  if (status === "sent") {
    return (
      <>
        {stepsBar}
        <div className={s.done}>
          <Icon name="check" size={36} />
          <h2>{T.doneTitle}</h2>
          <p>{fmt(T.doneText, { id: orderId ?? "—" })}</p>
          <a href={whatsappLink(`${T.doneTitle}: ${orderId ?? ""}`)} target="_blank" rel="noreferrer" className={s.secondaryBtn}>
            <Icon name="whatsapp" size={18} /> {T.doneWa}
          </a>
          <Link href={href(lang, "/catalog")}>{t.cart.toCatalog}</Link>
        </div>
      </>
    );
  }

  if (!lines.length) {
    return (
      <div className={s.done}>
        <h2>{t.cart.emptyTitle}</h2>
        <p>{t.cart.emptyText}</p>
        <Link href={href(lang, "/catalog")}>{t.cart.toCatalog}</Link>
      </div>
    );
  }

  const req = <span className={s.req} aria-hidden>*</span>;
  const policy = (
    <Link href={href(lang, "/privacy")} target="_blank">
      {T.policyLink}
    </Link>
  );
  const offer = (
    <Link href={href(lang, "/oferta")} target="_blank">
      {T.offerLink}
    </Link>
  );
  const [c1, rest] = T.consent.split("{policy}");
  const [c2, c3] = rest.split("{offer}");

  return (
    <>
      {stepsBar}
      <form className={s.layout} onSubmit={submit}>
        <div className={s.main}>
          <fieldset className={s.block}>
            <legend>{T.contact}</legend>
            <div className={s.seg} role="radiogroup" aria-label={T.buyerType}>
              {(["person", "company"] as const).map((b) => (
                <label key={b} className={s.segItem}>
                  <input type="radio" name="buyerType" value={b} checked={buyer === b} onChange={() => setBuyer(b)} />
                  <span>{b === "person" ? T.person : T.company}</span>
                </label>
              ))}
            </div>
            <div className={s.grid2}>
              <label className={s.field}>
                <span>
                  {T.name} {req}
                </span>
                <input name="name" required autoComplete="name" maxLength={120} />
              </label>
              <label className={s.field}>
                <span>
                  {T.phone} {req}
                </span>
                <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[\d\s()+\-]{10,20}" title={T.phoneTitle} placeholder="+7 7__ ___ __ __" />
              </label>
              <label className={`${s.field} ${s.wide}`}>
                <span>
                  {T.email} {buyer === "company" ? req : null}
                </span>
                <input name="email" type="email" autoComplete="email" required={buyer === "company"} maxLength={120} />
              </label>
              {buyer === "company" ? (
                <>
                  <label className={s.field}>
                    <span>
                      {T.companyName} {req}
                    </span>
                    <input name="company" required autoComplete="organization" maxLength={160} />
                  </label>
                  <label className={s.field}>
                    <span>
                      {T.bin} {req}
                    </span>
                    <input name="bin" required inputMode="numeric" pattern="\d{12}" title={T.binHint} maxLength={12} />
                    <small>{T.binHint}</small>
                  </label>
                </>
              ) : null}
            </div>
          </fieldset>

          <fieldset className={s.block}>
            <legend>{T.receive}</legend>
            <div className={s.options}>
              {(
                [
                  ["delivery", T.delivery, T.deliveryNote],
                  ["pickup", T.pickup, T.pickupNote],
                  ["storage", T.storage, T.storageNote],
                ] as const
              ).map(([v, title, note]) => (
                <label key={v} className={s.option}>
                  <input type="radio" name="receive" value={v} checked={receive === v} onChange={() => setReceive(v)} />
                  <span>
                    <b>{title}</b>
                    <small>{note}</small>
                  </span>
                </label>
              ))}
            </div>
            {receive === "delivery" ? (
              <div className={s.grid4}>
                <label className={`${s.field} ${s.span3}`}>
                  <span>
                    {T.street} {req}
                  </span>
                  <input name="street" required autoComplete="address-line1" maxLength={160} />
                </label>
                <label className={s.field}>
                  <span>
                    {T.house} {req}
                  </span>
                  <input name="house" required maxLength={20} />
                </label>
                <label className={s.field}>
                  <span>{T.flat}</span>
                  <input name="flat" autoComplete="address-line2" maxLength={20} />
                </label>
                <label className={s.field}>
                  <span>{T.floor}</span>
                  <input name="floor" inputMode="numeric" maxLength={3} />
                </label>
                <label className={`${s.check} ${s.span2}`}>
                  <input type="checkbox" name="lift" value="yes" />
                  <span>{T.lift}</span>
                </label>
              </div>
            ) : null}
          </fieldset>

          <fieldset className={s.block}>
            <legend>{T.payment}</legend>
            <div className={s.options} key={buyer}>
              {(
                [
                  ["kaspi", T.payKaspi],
                  ["card", T.payCard],
                  ["invoice", T.payInvoice],
                  ["credit", T.payCredit],
                ] as const
              ).map(([v, title], i) => (
                <label key={v} className={s.option}>
                  <input type="radio" name="payment" value={v} defaultChecked={buyer === "company" ? v === "invoice" : i === 0} />
                  <span>
                    <b>{title}</b>
                  </span>
                </label>
              ))}
            </div>
            <p className={s.hint}>{T.payNote}</p>
          </fieldset>

          <fieldset className={s.block}>
            <legend>{T.comment}</legend>
            <label className={s.field}>
              <span className="visually-hidden">{T.comment}</span>
              <textarea name="comment" rows={3} maxLength={1000} placeholder={T.commentPh} />
            </label>
          </fieldset>
        </div>

        <aside className={s.summary}>
          <h2 className={s.sumTitle}>{T.summary}</h2>
          <ul className={s.sumLines}>
            {lines.map((l) => (
              <li key={l.id}>
                <span>
                  {productName(l.p, lang)} <b>× {l.qty}</b>
                </span>
                <span>{money(Math.round(l.sum), lang)}</span>
              </li>
            ))}
          </ul>
          <dl className={s.totals}>
            <div>
              <dt>{T.subtotal}</dt>
              <dd>{money(Math.round(total), lang)}</dd>
            </div>
            <div>
              <dt>{T.deliveryCost}</dt>
              <dd>{T.free}</dd>
            </div>
            <div className={s.grand}>
              <dt>{T.total}</dt>
              <dd>{money(Math.round(total), lang)}</dd>
            </div>
          </dl>
          <label className={s.consent}>
            <input type="checkbox" name="consent" value="yes" required />
            <span>
              {c1}
              {policy}
              {c2}
              {offer}
              {c3}
            </span>
          </label>
          <button type="submit" className={s.submit} disabled={status === "sending"}>
            {status === "sending" ? T.sending : T.submit}
          </button>
          <a className={s.secondaryBtn} href={whatsappLink(orderText(lines, total, lang, t))} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} /> {t.cart.sendWa}
          </a>
          <Link href={href(lang, "/cart")} className={s.back}>
            ← {T.back}
          </Link>
          {status === "error" ? (
            <p className={s.error} role="alert">
              {error} {T.errorRetry}
            </p>
          ) : null}
        </aside>
      </form>
    </>
  );
}
