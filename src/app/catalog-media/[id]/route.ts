// Фото товара через сайт: браузер ходит на свой домен, сайт — в CRM.
// Адрес CRM бывает внутренним (http://api:8000 в docker), наружу его не светим.
// CRM отдаёт фото с Cache-Control immutable (новый файл — новый id), его и пробрасываем:
// браузер и nginx перед сайтом кэшируют картинку, сюда повторно не приходят.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function GET(_request: Request, ctx: RouteContext<"/catalog-media/[id]">) {
  const { id } = await ctx.params;
  const crm = process.env.CRM_API_URL?.replace(/\/$/, "");
  if (!crm || !UUID.test(id)) return new Response(null, { status: 404 });
  const upstream = await fetch(`${crm}/api/v1/public/catalog/images/${id}`, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) return new Response(null, { status: upstream.status === 404 ? 404 : 502 });
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": upstream.headers.get("cache-control") ?? "public, max-age=86400",
    },
  });
}
