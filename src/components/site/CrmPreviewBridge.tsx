"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/** Only public navigation is sent to the parent preview, never catalog or user data. */
export function CrmPreviewBridge() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parentOrigin = useRef<string | null>(null);

  useEffect(() => {
    if (window.parent === window) return;
    const notify = () => {
      if (parentOrigin.current) window.parent.postMessage({ type: "stepline-preview:location", url: window.location.href }, parentOrigin.current);
    };
    // В превью CRM сайт сам никуда не уходит: клик по ссылке отдаётся CRM, а она решает —
    // переключить вкладку (Главная / Акции / Новинки) или оставить как есть.
    const intercept = (event: MouseEvent) => {
      if (!parentOrigin.current) return;
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      event.preventDefault();
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin) {
        window.parent.postMessage({ type: "stepline-preview:navigate", url: url.href }, parentOrigin.current);
      }
    };
    const receive = (event: MessageEvent) => {
      if (event.source !== window.parent || event.data?.type !== "stepline-preview:init" || !/^https?:\/\//.test(event.origin)) return;
      parentOrigin.current = event.origin;
      notify();
    };
    window.addEventListener("click", intercept, true);
    window.addEventListener("message", receive);
    window.addEventListener("hashchange", notify);
    window.parent.postMessage({ type: "stepline-preview:ready" }, "*");
    return () => {
      window.removeEventListener("click", intercept, true);
      window.removeEventListener("message", receive);
      window.removeEventListener("hashchange", notify);
    };
  }, []);

  useEffect(() => {
    if (parentOrigin.current) window.parent.postMessage({ type: "stepline-preview:location", url: window.location.href }, parentOrigin.current);
  }, [pathname, searchParams]);

  return null;
}
