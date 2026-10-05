import { BASE_PATH } from "@/i18n/config";

// «/» на статике: выбираем язык в браузере — сохранённый выбор, затем язык браузера,
// иначе русский. Без JS сработает meta refresh на /ru/.
const script = `(function(){var ls=["ru","kk","en"],l=null;try{l=localStorage.getItem("lang")}catch(e){}
if(ls.indexOf(l)<0){var n=(navigator.languages||[navigator.language||"ru"]);for(var i=0;i<n.length;i++){var c=String(n[i]).slice(0,2).toLowerCase();if(c==="kz")c="kk";if(ls.indexOf(c)>-1){l=c;break}}}
location.replace(${JSON.stringify(BASE_PATH)}+"/"+(ls.indexOf(l)>-1?l:"ru")+"/"+location.search+location.hash)})();`;

export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${BASE_PATH}/ru/`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p style={{ fontFamily: "sans-serif", padding: 24 }}>
        <a href={`${BASE_PATH}/ru/`}>STEPLINE — Русский</a> · <a href={`${BASE_PATH}/kk/`}>Қазақша</a> · <a href={`${BASE_PATH}/en/`}>English</a>
      </p>
    </>
  );
}
