import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CATALOG_TAG } from "@/lib/catalog-source";

// CRM дёргает этот адрес после каждой правки каталога (crm-stpln/api/app/catalog/revalidate.py).
// expire: 0 — следующий посетитель сразу получает свежие данные, а не старую страницу,
// пока новая собирается в фоне: менеджер правит цену и ждёт увидеть именно её.

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get("x-revalidate-secret") ?? "";
  // Пустой секрет на сервере не открывает ручку: иначе любой мог бы сбрасывать кэш.
  if (!secret || !same(given, secret)) {
    return Response.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
