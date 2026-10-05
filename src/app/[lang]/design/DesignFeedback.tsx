"use client";

import { useEffect, useState, type FormEvent } from "react";
import { setPreset } from "@/components/PresetBadge";
import { whatsappLink } from "@/content/site";
import { presetById, presets, presetVars, type Preset } from "@/design/presets";
import { downloadJson, hasSendChannel, sendForm } from "@/lib/send";
import s from "./design.module.css";

// «Ваш выбор» на /design: заказчик выбирает пресет и пишет, что поменять.
// Ответ уходит письмом через Web3Forms (без сервера) — в письме JSON с токенами пресета,
// его можно сразу вставить в src/design/presets.ts. Черновик ответа хранится в браузере,
// чтобы не потерялся при перезагрузке.

const AREAS = [
  { id: "fonts", label: "Шрифты" },
  { id: "colors", label: "Цвета" },
  { id: "wood", label: "Дерево и раскладки" },
  { id: "components", label: "Кнопки, карточки, фильтры" },
] as const;

type Mark = "ok" | "change" | null;
type Draft = { name: string; marks: Record<string, Mark>; notes: Record<string, string>; comment: string };

const KEY = "stepline-design-answer";
const empty: Draft = { name: "", marks: {}, notes: {}, comment: "" };

/** То, что приходит в письме и скачивается файлом */
export function buildAnswer(p: Preset, d: Draft) {
  return {
    type: "stepline-design-answer",
    version: 1,
    sentAt: new Date().toISOString(),
    from: d.name || null,
    preset: { id: p.id, name: p.name },
    feedback: AREAS.map((a) => ({ area: a.label, verdict: d.marks[a.id] ?? null, note: d.notes[a.id] || null })),
    comment: d.comment || null,
    tokens: {
      css: presetVars(p),
      fonts: { display: p.fonts.display.family, body: p.fonts.body.family, mono: p.fonts.mono.family },
      colors: Object.fromEntries(p.colors.map((c) => [c.name, c.value])),
      wood: p.wood,
      seam: p.seam,
      headingWeight: p.headingWeight,
      headingTracking: p.headingTracking,
    },
  };
}

export function DesignFeedback({ active }: { active: string }) {
  const p = presetById[active] ?? presets[0];
  const [d, setD] = useState<Draft>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const channel = hasSendChannel();

  // Черновик — из браузера, чтобы ответ не пропал при перезагрузке
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- однократное чтение черновика после гидрации
      if (raw) setD({ ...empty, ...(JSON.parse(raw) as Draft) });
    } catch {}
  }, []);
  function update(next: Draft) {
    setD(next);
    setStatus("idle");
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }

  const answer = buildAnswer(p, d);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await sendForm(
      `Дизайн STEPLINE: выбран пресет «${p.name}»${d.name ? ` — ${d.name}` : ""}`,
      {
        "Пресет": `${p.name} (${p.id})`,
        "От кого": d.name,
        "Отзыв": AREAS.map((a) => `${a.label}: ${d.marks[a.id] === "ok" ? "нравится" : d.marks[a.id] === "change" ? "поменять" : "—"}${d.notes[a.id] ? ` — ${d.notes[a.id]}` : ""}`).join("\n"),
        "Комментарий": d.comment,
        "JSON (токены и ответ)": answer,
      },
      { fromName: d.name || "Заказчик STEPLINE" },
    );
    if (res.ok) setStatus("sent");
    else {
      setStatus("error");
      setError(res.reason === "no-channel" ? "Отправка не настроена — скачайте файл или отправьте в WhatsApp." : (res.message ?? "Письмо не ушло."));
    }
  }

  const waText = `Дизайн STEPLINE: выбираю «${p.name}».\n${answer.feedback.map((f) => `${f.area}: ${f.verdict === "ok" ? "нравится" : f.verdict === "change" ? "поменять" : "—"}${f.note ? ` — ${f.note}` : ""}`).join("\n")}${d.comment ? `\n${d.comment}` : ""}`;

  return (
    <section className={`wrap ${s.section}`} id="otvet" aria-labelledby="otvet-t">
      <div className={s.sectionHead}>
        <h2 id="otvet-t" className={s.h2}>
          Ваш выбор
        </h2>
        <p className={s.note}>
          Выберите пресет и отметьте, что оставить и что поменять. Ответ придёт нам письмом вместе с токенами дизайна — по ним и соберём сайт.
        </p>
      </div>

      <form className={s.answer} onSubmit={submit}>
        <fieldset className={s.answerGroup}>
          <legend>Пресет</legend>
          <div className={s.answerPresets}>
            {presets.map((x) => (
              <label key={x.id} className={s.answerPreset} data-preset={x.id}>
                <input type="radio" name="preset" value={x.id} checked={x.id === p.id} onChange={() => setPreset(x.id)} />
                <span className={s.answerGlyph}>Аа</span>
                <span>{x.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={s.answerGroup}>
          <legend>Что оставить, что поменять</legend>
          {AREAS.map((a) => (
            <div key={a.id} className={s.answerRow}>
              <span className={s.answerLabel}>{a.label}</span>
              <div className={s.answerMarks} role="radiogroup" aria-label={a.label}>
                {(
                  [
                    ["ok", "Нравится"],
                    ["change", "Поменять"],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={d.marks[a.id] === v}
                    onClick={() => update({ ...d, marks: { ...d.marks, [a.id]: d.marks[a.id] === v ? null : v } })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                className={s.answerInput}
                placeholder="Что именно (необязательно)"
                value={d.notes[a.id] ?? ""}
                onChange={(e) => update({ ...d, notes: { ...d.notes, [a.id]: e.target.value } })}
                aria-label={`${a.label}: комментарий`}
              />
            </div>
          ))}
        </fieldset>

        <div className={s.answerGrid}>
          <label className={s.answerField}>
            <span>Общий комментарий</span>
            <textarea rows={3} value={d.comment} onChange={(e) => update({ ...d, comment: e.target.value })} maxLength={2000} />
          </label>
          <label className={s.answerField}>
            <span>Ваше имя</span>
            <input value={d.name} onChange={(e) => update({ ...d, name: e.target.value })} maxLength={80} autoComplete="name" />
          </label>
        </div>

        <div className={s.answerActions}>
          {channel ? (
            <button type="submit" className={s.answerSubmit} disabled={status === "sending"}>
              {status === "sending" ? "Отправляем…" : `Отправить выбор: «${p.name}»`}
            </button>
          ) : null}
          <a className={channel ? s.textBtn : s.answerSubmit} href={whatsappLink(waText)} target="_blank" rel="noreferrer">
            Отправить в WhatsApp
          </a>
          <button type="button" className={s.textBtn} onClick={() => downloadJson(`stepline-design-${p.id}.json`, answer)}>
            Скачать JSON
          </button>
        </div>
        <p className={s.answerStatus} role="status">
          {status === "sent" ? "Готово — ответ у нас. Можно поменять и отправить ещё раз." : null}
          {status === "error" ? <span className={s.errorText}>{error}</span> : null}
        </p>
      </form>
    </section>
  );
}
