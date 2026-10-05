// Отправка форм со статического сайта — без своего сервера.
//
// Канал — Web3Forms (https://web3forms.com): форма уходит письмом на почту,
// к которой привязан ключ. Ключ ПУБЛИЧНЫЙ по замыслу сервиса — он только разрешает
// слать письма на одну заранее заданную почту, прочитать или поменять что-то им нельзя.
// Худшее, что можно сделать с ключом, — заспамить ящик; от этого — honeypot-поле
// и лимиты сервиса. Ключ задаётся в env: NEXT_PUBLIC_WEB3FORMS_KEY (вшивается при сборке).
//
// Чего НЕ делаем: не кладём в браузер токен Telegram-бота или SMTP-пароль —
// их видно в коде страницы, а с ними можно читать переписку бота / слать почту от вашего имени.
//
// Если ключа нет — sendForm возвращает { ok: false, reason: "no-channel" },
// и интерфейс предлагает WhatsApp / скачать JSON, ничего не теряется.

const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export type SendResult = { ok: true } | { ok: false; reason: "no-channel" | "network" | "rejected"; message?: string };

export function hasSendChannel() {
  return Boolean(KEY);
}

export async function sendForm(subject: string, fields: Record<string, unknown>, opts: { replyTo?: string; fromName?: string } = {}): Promise<SendResult> {
  if (!KEY) return { ok: false, reason: "no-channel" };
  // Web3Forms принимает плоские поля; вложенное (позиции заказа, токены дизайна) — строкой JSON
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null || v === "") continue;
    flat[k] = typeof v === "string" ? v : JSON.stringify(v, null, 2);
  }
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: KEY,
        subject,
        from_name: opts.fromName ?? "Сайт STEPLINE",
        ...(opts.replyTo ? { replyto: opts.replyTo } : {}),
        botcheck: "",
        ...flat,
      }),
    });
    const body = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (res.ok && body?.success) return { ok: true };
    return { ok: false, reason: "rejected", message: body?.message };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/** Номер заказа без сервера: дата + 4 случайных символа — достаточно, чтобы сослаться в переписке */
export function orderId() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `SL-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Скачать JSON файлом — запасной путь, если канала отправки нет */
export function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
