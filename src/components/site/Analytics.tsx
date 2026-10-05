"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

// Счётчики подключаются, только если (1) ID задан в env на Vercel и (2) посетитель
// нажал «Принять все». Без ID код ничего не грузит.
const YM = process.env.NEXT_PUBLIC_YM_ID;
const GA = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const consent = useConsent();
  if (consent !== "all") return null;
  return (
    <>
      {YM ? (
        <Script id="ym" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${JSON.stringify(YM)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
        </Script>
      ) : null}
      {GA ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config",${JSON.stringify(GA)});`}
          </Script>
        </>
      ) : null}
    </>
  );
}
