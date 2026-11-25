"use client";

import { useEffect, useMemo, useState } from "react";
import { PAKETE, FREE_TOKENS, PREIS_HINWEIS, DATENSCHUTZ_URL, IMPRESSUM_URL, NEWSLETTER_PFLICHT, NEWSLETTER_TEXT } from "../lib/config";

/* ================= Styles (inline, ohne Tailwind) ================= */
const CSS = `
:root{
  --bg:#faf8fd;--surface:#ffffff;--ink:#2a2140;--muted:#6f6786;
  --purple:#6b3fa0;--purple-deep:#4a2a78;--purple-soft:#f1eaf9;--line:#e6def2;
  --gold:#d4af5f;--gold-text:#8f6b1f;
  --font-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
  --font-body:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
  color-scheme:light;
}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:16px;line-height:1.55}
button{font:inherit;color:inherit;cursor:pointer}
button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
.wrap{max-width:1120px;margin:0 auto;padding:24px 16px 56px}
header.top{display:flex;flex-direction:column;gap:6px;margin-bottom:20px}
h1{font-family:var(--font-display);font-weight:600;font-size:clamp(2rem,5vw,2.8rem);line-height:1.1;margin:0;color:var(--purple-deep);text-wrap:balance}
h1 span{color:var(--gold-text)}
.lead{color:var(--muted);margin:0;max-width:60ch}
h2{font-family:var(--font-display);font-weight:600;font-size:1.6rem;margin:0;color:var(--purple-deep);text-wrap:balance}
h3{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--gold-text);margin:0 0 6px;font-weight:600}
.card{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:20px;box-shadow:0 2px 14px rgba(74,42,120,.05)}
.grid{display:grid;gap:16px;grid-template-columns:1fr}
@media(min-width:900px){.grid{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);align-items:start}}
.stack{display:flex;flex-direction:column;gap:16px}
.btn{border:1px solid var(--purple);background:var(--purple);color:#fff;border-radius:999px;padding:10px 18px;font-weight:500;transition:background .15s}
.btn:hover{background:var(--purple-deep)}
.btn.ghost{background:#fff;color:var(--purple-deep);border-color:var(--line)}
.btn.ghost:hover{background:var(--purple-soft)}
.btn.small{padding:6px 12px;font-size:.88rem}
.btn[disabled]{opacity:.6;cursor:default}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 14px;font-size:.92rem}
.chip[aria-pressed="true"]{background:var(--purple);border-color:var(--purple);color:#fff}
label.f{display:flex;flex-direction:column;gap:6px;font-weight:500;font-size:.92rem}
input[type=text],input[type=time],select{border:1px solid var(--line);border-radius:12px;padding:9px 12px;font:inherit;background:#fff;color:var(--ink)}
.today{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.today .info{flex:1;min-width:200px}
.today .meta{color:var(--muted);font-size:.92rem;margin:4px 0 0}
.next{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.next div{background:var(--purple-soft);border-radius:14px;padding:8px 12px;font-size:.88rem}
.next b{display:block;color:var(--purple-deep)}
.cal-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}
.cal-head h2{text-transform:capitalize}
.dow,.days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.dow span{text-align:center;font-size:.75rem;color:var(--muted);font-weight:600;padding-bottom:4px}
.day{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 8px;border:1px solid transparent;border-radius:14px;background:#fff;min-height:64px}
.day:hover{background:var(--purple-soft)}
.day .n{font-size:.82rem;font-weight:500}
.day.today-c{border-color:var(--gold)}
.day.sel{background:var(--purple);color:#fff}
.day.sel .n{color:#fff}
.day.empty{visibility:hidden}
.day .dots{display:flex;gap:3px;height:6px}
.dot{width:6px;height:6px;border-radius:50%;background:var(--gold)}
.dot.p{background:var(--purple)}
.day.sel .dot.p{background:#fff}
.legend{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:.82rem;color:var(--muted)}
.legend i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:var(--gold)}
.legend i.p{background:var(--purple)}
.dayhead{display:flex;gap:16px;align-items:center;margin-bottom:14px}
.sub{color:var(--muted);font-size:.92rem;margin:2px 0 0}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0}
.tag{font-size:.8rem;background:var(--purple-soft);color:var(--purple-deep);border-radius:999px;padding:3px 10px}
.tag.gold{background:#f8f0dc;color:var(--gold-text)}
.sec{border-top:1px solid var(--line);padding-top:14px;margin-top:14px}
.sec p{margin:0 0 8px}
ul.plain,ol.plain{margin:0;padding-left:1.1rem}
ul.plain li,ol.plain li{margin:2px 0}
.affirm{font-family:var(--font-display);font-size:1.35rem;line-height:1.3;color:var(--purple-deep);margin:0}
.ai-box{background:#fdfbf5;border:1px solid #efe3c3;border-radius:16px;padding:14px;margin-top:12px;white-space:pre-wrap}
.ai-box h3{margin-top:10px}
.ai-box h3:first-child{margin-top:0}
.ai-box p{margin:0}
.loading{display:flex;gap:12px;align-items:center;color:var(--purple-deep);font-weight:500;padding:6px 0}
.spin{width:22px;height:22px;border-radius:50%;border:3px solid var(--purple-soft);border-top-color:var(--gold);animation:sp .9s linear infinite;flex:none}
@keyframes sp{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.spin{animation-duration:2.5s}}
.note{font-size:.85rem;color:var(--muted)}
.msg{font-size:.9rem;margin-top:8px;color:var(--purple-deep)}
.plan-item{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--line)}
.plan-item:first-child{border-top:0}
.plan-item .t{flex:1}
.plan-item .t b{display:block}
.plan-item.done .t{opacity:.55;text-decoration:line-through}
.plan-item input[type=checkbox]{width:20px;height:20px;margin-top:3px;accent-color:var(--purple)}
.empty-note{color:var(--muted);margin:0}
.onb{border-color:var(--gold);background:linear-gradient(180deg,#fff,#fdfaf2)}
footer{margin-top:28px;font-size:.82rem;color:var(--muted);max-width:70ch}
.tokenbar{position:sticky;top:0;z-index:20;display:flex;justify-content:flex-end;padding:0 0 12px}
.tokenpill{display:flex;align-items:center;gap:12px;background:var(--purple-deep);color:#fff;border-radius:999px;padding:6px 6px 6px 16px;font-size:.9rem;box-shadow:0 4px 16px rgba(74,42,120,.25)}
.tokenpill button{border:0;background:var(--gold);color:#2a2140;border-radius:999px;padding:7px 14px;font-weight:600;font-size:.88rem}
.tokenpill button:hover{background:#e3c273}
.overlay{position:fixed;inset:0;z-index:50;background:rgba(42,33,64,.45);display:flex;align-items:center;justify-content:center;padding:16px}
.modal{background:#fff;border-radius:22px;padding:24px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(42,33,64,.3)}
.modal h2{text-align:center}
.modal .sub{text-align:center;margin:6px 0 16px}
.pack{display:flex;justify-content:space-between;align-items:center;width:100%;border:1px solid var(--line);background:#fff;border-radius:16px;padding:14px 16px;margin-bottom:10px;font-weight:600}
.pack:hover:not([disabled]){background:var(--purple-soft);border-color:var(--purple)}
.pack[disabled]{opacity:.6;cursor:default}
.pack .price{color:var(--purple);white-space:nowrap}
.pack .price small{font-weight:400;color:var(--muted)}
.cancel{display:block;margin:6px auto 0;border:0;background:none;color:var(--muted);padding:8px 14px}
.tokenbar{flex-direction:column;align-items:flex-end;gap:4px}
.who{font-size:.78rem;color:var(--muted);background:rgba(250,248,253,.9);border-radius:999px;padding:0 8px}
.who button{border:0;background:none;color:var(--purple);text-decoration:underline;padding:0 0 0 6px;font-size:.78rem}
.check{display:flex;gap:10px;align-items:flex-start;font-size:.88rem;margin:12px 0}
.check input{width:18px;height:18px;margin-top:2px;accent-color:var(--purple);flex:none}
.banner{background:var(--purple-soft);border:1px solid var(--line);border-radius:14px;padding:10px 14px;color:var(--purple-deep);margin-bottom:16px}
`;

/* ================= Hilfen ================= */
const RAD = Math.PI / 180;
const norm = (x) => ((x % 360) + 360) % 360;
const jd = (t) => t / 86400000 + 2440587.5;
const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => y + "-" + pad(m + 1) + "-" + pad(d);
const fmtDate = (d, o) =>
  d.toLocaleDateString("de-DE", o || { weekday: "long", day: "numeric", month: "long" });
const fmtTime = (d) => d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

/* ================= Astronomie (Näherung nach Meeus) ================= */
function moonLon(t) {
  const T = (jd(t) - 2451545) / 36525;
  const L = 218.3164477 + 481267.88123421 * T;
  const D = (297.8501921 + 445267.1114034 * T) * RAD;
  const M = (357.5291092 + 35999.0502909 * T) * RAD;
  const Mp = (134.9633964 + 477198.8675055 * T) * RAD;
  const F = (93.272095 + 483202.0175233 * T) * RAD;
  return norm(
    L + 6.288774 * Math.sin(Mp) + 1.274027 * Math.sin(2 * D - Mp) + 0.658314 * Math.sin(2 * D) +
      0.213618 * Math.sin(2 * Mp) - 0.185116 * Math.sin(M) - 0.114332 * Math.sin(2 * F) +
      0.058793 * Math.sin(2 * D - 2 * Mp) + 0.057066 * Math.sin(2 * D - M - Mp) +
      0.053322 * Math.sin(2 * D + Mp) + 0.045758 * Math.sin(2 * D - M)
  );
}
function sunLon(t) {
  const T = (jd(t) - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * RAD;
  return norm(L0 + 1.914602 * Math.sin(M) + 0.019993 * Math.sin(2 * M));
}
const elong = (t) => norm(moonLon(t) - sunLon(t));
const fDiff = (t, target) => ((elong(t) - target + 540) % 360) - 180;
const signIdx = (t) => Math.floor(moonLon(t) / 30);

function bisect(a, b, test) {
  for (let i = 0; i < 30; i++) {
    const m = (a + b) / 2;
    if (test(m)) b = m;
    else a = m;
  }
  return (a + b) / 2;
}
function findNext(target, fromMs, spanDays) {
  const step = 3 * 3600000;
  let prev = fDiff(fromMs, target);
  for (let t = fromMs + step; t < fromMs + spanDays * 86400000; t += step) {
    const cur = fDiff(t, target);
    if (prev < 0 && cur >= 0 && cur - prev < 90) return bisect(t - step, t, (x) => fDiff(x, target) >= 0);
    prev = cur;
  }
  return null;
}

const ZEICHEN = [
  { n: "Widder", s: "♈", el: "Feuer", t: "Mut, Impuls, Neustart" },
  { n: "Stier", s: "♉", el: "Erde", t: "Körper, Genuss, Stabilität" },
  { n: "Zwillinge", s: "♊", el: "Luft", t: "Austausch, Schreiben, Neugier" },
  { n: "Krebs", s: "♋", el: "Wasser", t: "Gefühle, Zuhause, Fürsorge" },
  { n: "Löwe", s: "♌", el: "Feuer", t: "Ausdruck, Herz, Sichtbarkeit" },
  { n: "Jungfrau", s: "♍", el: "Erde", t: "Ordnung, Routinen, Details" },
  { n: "Waage", s: "♎", el: "Luft", t: "Beziehungen, Balance, Schönheit" },
  { n: "Skorpion", s: "♏", el: "Wasser", t: "Tiefe, Wandlung, Loslassen" },
  { n: "Schütze", s: "♐", el: "Feuer", t: "Vision, Weite, Vertrauen" },
  { n: "Steinbock", s: "♑", el: "Erde", t: "Struktur, Ziele, Disziplin" },
  { n: "Wassermann", s: "♒", el: "Luft", t: "Freiheit, Ideen, Gemeinschaft" },
  { n: "Fische", s: "♓", el: "Wasser", t: "Intuition, Hingabe, Träume" },
];
const zSym = (z) => z.s + "\uFE0E";

const PHASEN = [
  { n: "Neumond", gut: ["Intentionen setzen", "Neu anfangen", "Vision klären", "Stille und Rückzug"], ruhig: "Große Entscheidungen müssen heute nicht fallen. Fühl erst, was neu werden will.",
    ritual: { t: "Neumond-Intention", s: ["Zünde eine Kerze an und atme dreimal tief durch.", "Schreibe 1 bis 3 Sätze in der Gegenwartsform auf, zum Beispiel: Ich bin bereit für …", "Lies sie laut vor und leg den Zettel an einen Ort, den du täglich siehst."] },
    aff: "Ich darf neu anfangen, in meinem Tempo." },
  { n: "Zunehmende Sichel", gut: ["Ersten kleinen Schritt gehen", "Vorhaben konkretisieren", "Plan aufschreiben"], ruhig: "Noch nichts erzwingen. Kleine Schritte zählen mehr als große Sprünge.",
    ritual: { t: "Der erste Schritt", s: ["Nimm deine Neumond-Intention zur Hand.", "Frag dich: Was ist der kleinste Schritt, den ich in den nächsten 24 Stunden gehen kann?", "Schreib ihn auf und trag ihn in deinen Kalender ein."] },
    aff: "Ich gehe den ersten Schritt, auch wenn ich noch nicht alles weiß." },
  { n: "Erstes Viertel", gut: ["Handeln", "Entscheidungen treffen", "Widerstände ansehen"], ruhig: "Zweifel melden sich gern jetzt. Sie sind kein Stoppschild, sondern ein Hinweis.",
    ritual: { t: "Hindernis-Check", s: ["Schreibe auf, was dich gerade bremst.", "Markiere, was davon ein echter Fakt ist und was ein Gedanke.", "Wähle eine Handlung für heute, die dich trotzdem ein Stück weiterbringt."] },
    aff: "Ich bleibe dran, auch wenn es unbequem wird." },
  { n: "Zunehmender Mond", gut: ["Verfeinern", "Dankbarkeit üben", "Vertrauen stärken", "Energie sammeln"], ruhig: "Nicht alles auf einmal fertig bekommen wollen. Es darf noch wachsen.",
    ritual: { t: "Dankbarkeits-Runde", s: ["Nimm dir Stift und Papier.", "Schreibe fünf Dinge auf, die sich schon in Bewegung gesetzt haben, auch kleine.", "Lies sie dir langsam vor und spür, wo im Körper Weite entsteht."] },
    aff: "Ich vertraue dem, was gerade in mir wächst." },
  { n: "Vollmond", gut: ["Würdigen und feiern", "Energie klären", "Kristalle aufladen", "Ernte sichtbar machen"], ruhig: "Gefühle sind oft lauter. Du musst heute nichts lösen, nur beobachten.",
    ritual: { t: "Vollmond-Ernte", s: ["Setz dich ans Fenster oder nach draußen, wenn der Mond sichtbar ist.", "Schreibe auf, was du seit dem letzten Neumond erlebt und geschafft hast.", "Danke dir dafür, und gib bewusst frei, was zu viel geworden ist."] },
    aff: "Ich sehe, was ich bereits erschaffen habe." },
  { n: "Abnehmender Mond", gut: ["Teilen und weitergeben", "Danken", "Beginnendes Loslassen"], ruhig: "Gut, um Dinge abzuschließen, schlecht, um etwas Neues zu starten.",
    ritual: { t: "Weitergeben", s: ["Überleg, was du in den letzten Wochen gelernt hast.", "Teile eine Erkenntnis mit einem Menschen oder schreib sie für dich auf.", "Räume danach etwas Kleines auf: eine Schublade, einen Tisch, eine Notiz-App."] },
    aff: "Ich gebe weiter, was mir gutgetan hat." },
  { n: "Letztes Viertel", gut: ["Loslassen", "Glaubenssätze ansehen", "Aufräumen", "Verzeihen"], ruhig: "Kein Tag für Druck. Weniger tun, dafür ehrlicher hinschauen.",
    ritual: { t: "Glaubenssatz loslassen", s: ["Schreibe einen Satz auf, der dich klein hält, zum Beispiel: Ich bin nicht genug.", "Daneben schreibst du, was du stattdessen glauben möchtest.", "Zerreiß oder verbrenne (sicher, in einer feuerfesten Schale) den alten Satz und lies den neuen laut."] },
    aff: "Ich lasse los, was nicht mehr zu mir gehört." },
  { n: "Abnehmende Sichel", gut: ["Ausruhen", "Reinigen", "Innehalten", "Träume beachten"], ruhig: "Rückzug ist erlaubt. Neues darf in ein paar Tagen kommen.",
    ritual: { t: "Stilles Reinigen", s: ["Öffne ein Fenster und lüfte deinen Raum, gern mit Räucherwerk oder Salbei, wenn du das magst.", "Nimm ein Bad oder eine warme Dusche und stell dir vor, wie alles Schwere abfließt.", "Geh früh schlafen und notiere morgens deine Träume."] },
    aff: "Ich darf ausruhen, bevor etwas Neues beginnt." },
];
const PHASE_KEYS = { 0: 0, 90: 2, 180: 4, 270: 6 };

/* ================= Besondere Zeitpunkte ================= */
const JAHRESKREIS = { "1-2": "Imbolc (Lichtmess)", "2-20": "Frühlings-Tagundnachtgleiche", "4-1": "Beltane", "5-21": "Sommersonnenwende", "7-1": "Lughnasadh", "8-23": "Herbst-Tagundnachtgleiche", "9-31": "Samhain", "11-21": "Wintersonnenwende" };
const FINSTERNISSE = { "2026-02-17": "Ringförmige Sonnenfinsternis", "2026-03-03": "Totale Mondfinsternis", "2026-08-12": "Totale Sonnenfinsternis", "2026-08-28": "Partielle Mondfinsternis", "2027-02-06": "Ringförmige Sonnenfinsternis", "2027-08-02": "Totale Sonnenfinsternis" };
const MERKUR = [["2026-02-26", "2026-03-20"], ["2026-06-29", "2026-07-23"], ["2026-10-24", "2026-11-13"], ["2027-02-09", "2027-03-03"], ["2027-06-10", "2027-07-04"]];
function eventsFor(y, m, d) {
  const out = [];
  const k = iso(y, m, d);
  const jk = JAHRESKREIS[m + "-" + d];
  if (jk) out.push({ k: "gold", t: jk });
  if ((m === 11 && d >= 25) || (m === 0 && d <= 5)) out.push({ k: "gold", t: "Raunächte" });
  if (FINSTERNISSE[k]) out.push({ k: "gold", t: FINSTERNISSE[k] });
  MERKUR.forEach((r) => {
    if (k >= r[0] && k <= r[1]) out.push({ k: "p", t: "Merkur rückläufig (ca.)" });
  });
  return out;
}

/* ================= Tagesdaten ================= */
const dayCache = {};
function dayInfo(y, m, d) {
  const key = iso(y, m, d);
  if (dayCache[key]) return dayCache[key];
  const start = new Date(y, m, d, 0, 0).getTime();
  const end = new Date(y, m, d + 1, 0, 0).getTime();
  const noon = new Date(y, m, d, 12, 0).getTime();
  const eNoon = elong(noon);
  let main = null;
  let mainTime = null;
  [0, 90, 180, 270].forEach((tg) => {
    const a = fDiff(start, tg);
    const b = fDiff(end, tg);
    if (a < 0 && b >= 0 && b - a < 90) {
      main = tg;
      mainTime = new Date(bisect(start, end, (x) => fDiff(x, tg) >= 0));
    }
  });
  let pk;
  if (main !== null) pk = PHASE_KEYS[main];
  else if (eNoon < 90) pk = 1;
  else if (eNoon < 180) pk = 3;
  else if (eNoon < 270) pk = 5;
  else pk = 7;
  let wechsel = null;
  if (signIdx(start) !== signIdx(end)) {
    const tt = bisect(start, end, (x) => signIdx(x) === signIdx(end));
    wechsel = { zeit: new Date(tt), nach: ZEICHEN[signIdx(end)] };
  }
  const r = {
    key, y, m, d, e: eNoon,
    illum: Math.round(((1 - Math.cos(eNoon * RAD)) / 2) * 100),
    pk, phase: PHASEN[pk], main, mainTime,
    zeichen: ZEICHEN[signIdx(noon)], wechsel,
    events: eventsFor(y, m, d),
  };
  dayCache[key] = r;
  return r;
}

function Moon({ e, size }) {
  const r = size / 2 - 1;
  const c = size / 2;
  const waning = e > 180;
  const ee = waning ? 360 - e : e;
  const rx = Math.abs(Math.cos(ee * RAD)) * r;
  const sweep = ee < 90 ? 0 : 1;
  const lit = `M${c} ${c - r} A${r} ${r} 0 0 1 ${c} ${c + r} A${rx.toFixed(2)} ${r} 0 0 ${sweep} ${c} ${c - r}Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={c} cy={c} r={r} fill="#3d2a63" stroke="#d4af5f" strokeWidth="1" />
      <path d={lit} fill="#f3dc96" transform={waning ? `translate(${size} 0) scale(-1 1)` : undefined} />
    </svg>
  );
}

/* ================= Speicher (nur Browser) ================= */
function load(k, def) {
  try {
    const v = window.localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}
function save(k, v) {
  try {
    window.localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

/* ================= Export (.ics) ================= */
const icsEsc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const icsWrap = (events) =>
  "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mondkalender und Ritual-Planer//DE\r\nCALSCALE:GREGORIAN\r\n" +
  events.join("") + "END:VCALENDAR\r\n";
const icsStamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");

function planICS(plan) {
  const stamp = icsStamp();
  return icsWrap(
    plan.map((p) => {
      const dt = p.date.replace(/-/g, "") + "T" + p.time.replace(":", "") + "00";
      const endM = Math.min(1439, +p.time.slice(0, 2) * 60 + +p.time.slice(3, 5) + 30);
      const end = p.date.replace(/-/g, "") + "T" + pad(Math.floor(endM / 60)) + pad(endM % 60) + "00";
      return (
        "BEGIN:VEVENT\r\nUID:" + p.id + "@mondkalender\r\nDTSTAMP:" + stamp +
        "\r\nDTSTART:" + dt + "\r\nDTEND:" + end +
        "\r\nSUMMARY:" + icsEsc("Ritual: " + p.title) +
        "\r\nDESCRIPTION:" + icsEsc(p.phase + ". " + p.notes) +
        "\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:Dein Ritual\r\nTRIGGER:-PT10M\r\nEND:VALARM\r\nEND:VEVENT\r\n"
      );
    })
  );
}
function moonsICS() {
  const stamp = icsStamp();
  const evs = [];
  [[0, "Neumond"], [180, "Vollmond"]].forEach(([tg, name]) => {
    let from = Date.now() - 86400000;
    for (let i = 0; i < 13; i++) {
      const t = findNext(tg, from, 40);
      if (!t) break;
      const dt = new Date(t);
      const ymd = dt.getFullYear() + pad(dt.getMonth() + 1) + pad(dt.getDate());
      const nx = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1);
      const ymd2 = nx.getFullYear() + pad(nx.getMonth() + 1) + pad(nx.getDate());
      const z = ZEICHEN[signIdx(t)];
      evs.push(
        "BEGIN:VEVENT\r\nUID:" + tg + "-" + ymd + "@mondkalender\r\nDTSTAMP:" + stamp +
        "\r\nDTSTART;VALUE=DATE:" + ymd + "\r\nDTEND;VALUE=DATE:" + ymd2 +
        "\r\nSUMMARY:" + icsEsc(name + " in " + z.n) +
        "\r\nDESCRIPTION:" + icsEsc(name + " um " + fmtTime(dt) + " Uhr. " + (tg === 0 ? "Zeit für Intentionen und Neubeginn." : "Zeit zum Würdigen und Loslassen.")) +
        "\r\nEND:VEVENT\r\n"
      );
      from = t + 86400000 * 5;
    }
  });
  return icsWrap(evs);
}
function downloadFile(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ================= KI-Text auswerten ================= */
const AI_HEADS = { "RITUAL": "Dein Ritual", "WARUM JETZT": "Warum jetzt", "AFFIRMATION": "Affirmation", "JOURNAL-FRAGE": "Journal-Frage" };
function parseAI(text) {
  const out = [];
  let cur = null;
  text.split("\n").forEach((line) => {
    const key = line.trim().replace(/[*#:]/g, "").toUpperCase();
    if (AI_HEADS[key]) {
      cur = { h: AI_HEADS[key], k: key, body: [] };
      out.push(cur);
    } else if (cur) cur.body.push(line);
  });
  return out.map((s) => ({ h: s.h, k: s.k, body: s.body.join("\n").trim() }));
}

/* ================= Bausteine ================= */
const THEMEN = ["Selbstwert", "Loslassen", "Fülle & Wohlstand", "Klarheit", "Liebe & Beziehungen", "Heilung", "Intuition", "Neuanfang"];
const PRAXEN = ["Meditation", "Journaling", "Räuchern", "Tarot / Orakel", "Kristalle", "Energiearbeit", "Yoga / Bewegung", "Affirmationen"];

function Spinner({ children }) {
  return (
    <div className="loading" role="status">
      <div className="spin" />
      <span>{children}</span>
    </div>
  );
}

function Onboarding({ initial, onSave, onSkip }) {
  const [draft, setDraft] = useState(initial);
  const toggle = (grp, v) =>
    setDraft((d) => ({ ...d, [grp]: d[grp].includes(v) ? d[grp].filter((x) => x !== v) : [...d[grp], v] }));
  const chips = (list, grp) => (
    <div className="chips">
      {list.map((x) => (
        <button key={x} type="button" className="chip" aria-pressed={draft[grp].includes(x)} onClick={() => toggle(grp, x)}>
          {x}
        </button>
      ))}
    </div>
  );
  return (
    <section className="card onb" aria-labelledby="onbh">
      <div className="stack" style={{ gap: 14 }}>
        <div>
          <h2 id="onbh">Lass uns den Kalender auf dich einstellen</h2>
          <p className="sub">Drei kurze Fragen, dann passen sich die Vorschläge an dich an. Du kannst alles überspringen und später ändern.</p>
        </div>
        <label className="f" htmlFor="pname">
          Wie darf ich dich nennen?
          <input type="text" id="pname" maxLength={40} autoComplete="given-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </label>
        <div><h3>Welche Themen tragen dich gerade?</h3>{chips(THEMEN, "themen")}</div>
        <div><h3>Was praktizierst du gern?</h3>{chips(PRAXEN, "praxen")}</div>
        <label className="f" htmlFor="pmin">
          Wie viel Zeit hast du für ein Ritual?
          <select id="pmin" value={draft.minuten} onChange={(e) => setDraft({ ...draft, minuten: +e.target.value })}>
            <option value={10}>Etwa 10 Minuten</option>
            <option value={20}>Etwa 20 Minuten</option>
            <option value={45}>Etwa 45 Minuten</option>
          </select>
        </label>
        <div className="row">
          <button type="button" className="btn" onClick={() => onSave({ ...draft, name: draft.name.trim() })}>Los geht&apos;s</button>
          <button type="button" className="btn ghost" onClick={onSkip}>Überspringen</button>
        </div>
      </div>
    </section>
  );
}

function Today({ now, profil, onEdit }) {
  const t = dayInfo(now.getFullYear(), now.getMonth(), now.getDate());
  const [nextMoons, setNextMoons] = useState(null);
  useEffect(() => {
    setNextMoons({ neu: findNext(0, Date.now(), 35), voll: findNext(180, Date.now(), 35) });
  }, []);
  const rel = (ms) => {
    const dd = Math.ceil((ms - Date.now()) / 86400000);
    return dd <= 0 ? "heute" : dd === 1 ? "morgen" : "in " + dd + " Tagen";
  };
  const short = (ms) => fmtDate(new Date(ms), { day: "numeric", month: "long" });
  return (
    <section className="card" aria-label="Heute">
      <div className="today">
        <div><Moon e={t.e} size={84} /></div>
        <div className="info">
          <h3>{profil && profil.name ? "Hallo " + profil.name + "." : "Hallo."} Heute</h3>
          <h2>{t.phase.n}</h2>
          <p className="meta">{t.illum} % beleuchtet · Mond im {zSym(t.zeichen)} {t.zeichen.n} ({t.zeichen.el})</p>
          {nextMoons && (
            <div className="next">
              {nextMoons.neu && <div><b>Nächster Neumond</b>{short(nextMoons.neu)}, {rel(nextMoons.neu)}</div>}
              {nextMoons.voll && <div><b>Nächster Vollmond</b>{short(nextMoons.voll)}, {rel(nextMoons.voll)}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button type="button" className="btn ghost small" onClick={onEdit}>Meine Angaben ändern</button>
      </div>
    </section>
  );
}

function Calendar({ now, view, setView, sel, setSel, plan }) {
  const y = view.getFullYear();
  const m = view.getMonth();
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const count = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(<div key={"e" + i} className="day empty" />);
  for (let d = 1; d <= count; d++) {
    const info = dayInfo(y, m, d);
    const isSel = sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === d;
    const isToday = now.getFullYear() === y && now.getMonth() === m && now.getDate() === d;
    const special = info.main === 0 || info.main === 180 || info.events.some((e) => e.k === "gold");
    const planned = plan.some((p) => p.date === info.key);
    cells.push(
      <button
        key={d}
        type="button"
        className={"day" + (isSel ? " sel" : "") + (isToday ? " today-c" : "")}
        aria-pressed={isSel}
        aria-label={`${d}. ${info.phase.n}, Mond im ${info.zeichen.n}${planned ? ", Ritual geplant" : ""}`}
        onClick={() => setSel(new Date(y, m, d))}
      >
        <span className="n">{d}</span>
        <Moon e={info.e} size={24} />
        <span className="dots">
          {special && <span className="dot" />}
          {planned && <span className="dot p" />}
        </span>
      </button>
    );
  }
  return (
    <section className="card" aria-label="Kalender">
      <div className="cal-head">
        <button type="button" className="btn ghost small" aria-label="Vorheriger Monat" onClick={() => setView(new Date(y, m - 1, 1))}>&larr;</button>
        <h2>{view.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</h2>
        <button type="button" className="btn ghost small" aria-label="Nächster Monat" onClick={() => setView(new Date(y, m + 1, 1))}>&rarr;</button>
      </div>
      <div className="dow" aria-hidden="true">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((x) => <span key={x}>{x}</span>)}
      </div>
      <div className="days">{cells}</div>
      <div className="legend">
        <span><i />Neu-/Vollmond oder besonderer Tag</span>
        <span><i className="p" />Dein geplantes Ritual</span>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button type="button" className="btn ghost small" onClick={() => { setSel(new Date(now.getFullYear(), now.getMonth(), now.getDate())); setView(new Date(now.getFullYear(), now.getMonth(), 1)); }}>
          Zu heute
        </button>
      </div>
    </section>
  );
}

function Detail({ sel, profil, ai, setAi, onAddPlan, user, tokens, setTokens, openBuy, openLogin }) {
  const y = sel.getFullYear();
  const m = sel.getMonth();
  const d = sel.getDate();
  const info = dayInfo(y, m, d);
  const P = info.phase;
  const k = info.key;
  const st = ai[k];
  const [ptime, setPtime] = useState("20:00");
  const [added, setAdded] = useState("");
  useEffect(() => setAdded(""), [k]);

  async function generate() {
    if (!user) { openLogin(); return; }
    if (tokens === 0) { openBuy(); return; }
    setAi((a) => ({ ...a, [k]: { loading: true, text: "", error: "" } }));
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datum: fmtDate(sel, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
          phase: P.n,
          beleuchtung: info.illum,
          zeichen: info.zeichen.n,
          element: info.zeichen.el,
          thema: info.zeichen.t,
          ereignisse: info.events.map((e) => e.t),
          name: (profil && profil.name) || "",
          themen: (profil && profil.themen) || [],
          praxen: (profil && profil.praxen) || [],
          minuten: (profil && profil.minuten) || 20,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (typeof data.tokens === "number") setTokens(data.tokens);
      if (res.status === 402) {
        setAi((a) => ({ ...a, [k]: { text: "", error: "Deine Token sind aufgebraucht. Du kannst neue holen, wenn du magst." } }));
        openBuy();
        return;
      }
      if (res.status === 401) {
        setAi((a) => ({ ...a, [k]: { text: "", error: "Bitte melde dich zuerst an." } }));
        openLogin();
        return;
      }
      if (!res.ok) throw new Error(data.error || "Das hat gerade nicht geklappt. Versuch es gleich nochmal, der Standard-Vorschlag oben bleibt dir.");
      setAi((a) => ({ ...a, [k]: { text: data.text || "" } }));
    } catch (err) {
      setAi((a) => ({ ...a, [k]: { text: "", error: err.message || "Das hat gerade nicht geklappt. Versuch es gleich nochmal." } }));
    }
  }

  function add() {
    let title = P.ritual.t;
    let notes = P.ritual.s.join(" ");
    if (st && st.text) {
      const r = parseAI(st.text).find((p) => p.k === "RITUAL");
      if (r && r.body) {
        const lines = r.body.split("\n").filter(Boolean);
        title = lines[0].replace(/^(Titel:\s*)/i, "").slice(0, 80);
        notes = lines.slice(1).join(" ") || notes;
      }
    }
    onAddPlan({ id: Date.now() + "" + Math.floor(Math.random() * 1000), date: k, time: ptime || "20:00", title, notes, phase: P.n, done: false });
    setAdded("Eingetragen für " + fmtDate(sel, { day: "numeric", month: "long" }) + ".");
  }

  const parts = st && st.text ? parseAI(st.text) : [];
  const aiBody = st && st.text ? (parts.length ? parts : [{ h: "Dein Vorschlag", k: "X", body: st.text.trim() }]) : [];

  return (
    <section className="card" aria-live="polite">
      <div className="dayhead">
        <Moon e={info.e} size={68} />
        <div>
          <h3>{fmtDate(sel)}</h3>
          <h2>{P.n}</h2>
          <p className="sub">{info.illum} % beleuchtet · Mond im {zSym(info.zeichen)} {info.zeichen.n}</p>
        </div>
      </div>
      {(info.mainTime || info.wechsel || info.events.length > 0) && (
        <div className="tags">
          {info.mainTime && <span className="tag gold">{P.n} um {fmtTime(info.mainTime)} Uhr</span>}
          {info.wechsel && <span className="tag">Mond wechselt um {fmtTime(info.wechsel.zeit)} Uhr in {zSym(info.wechsel.nach)} {info.wechsel.nach.n}</span>}
          {info.events.map((e, i) => <span key={i} className={"tag" + (e.k === "gold" ? " gold" : "")}>{e.t}</span>)}
        </div>
      )}
      <div className="sec"><h3>Mond im {info.zeichen.n}</h3><p>{info.zeichen.el}-Energie: {info.zeichen.t}.</p></div>
      <div className="sec">
        <h3>Gut geeignet für</h3>
        <ul className="plain">{P.gut.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="note" style={{ marginTop: 8 }}>{P.ruhig}</p>
      </div>
      <div className="sec">
        <h3>Ritual-Vorschlag: {P.ritual.t}</h3>
        <ol className="plain">{P.ritual.s.map((x) => <li key={x}>{x}</li>)}</ol>
      </div>
      <div className="sec"><h3>Affirmation</h3><p className="affirm">{P.aff}</p></div>
      <div className="sec">
        <h3>Nur für dich</h3>
        <p className="note" style={{ margin: "0 0 10px" }}>Ich stimme einen Vorschlag auf diesen Tag, dein Zeitfenster und deine Themen ab. Ein Vorschlag kostet 1 Token. Wenn du dich mit deiner E-Mail anmeldest, schenke ich dir die ersten {FREE_TOKENS}.</p>
        <div className="row">
          <button type="button" className="btn" onClick={generate} disabled={!!(st && st.loading)}>
            {!user ? "Anmelden und Vorschlag erstellen" : tokens === 0 ? "Token nachkaufen" : st && st.text ? "Neuen Vorschlag erstellen (1 Token)" : "Persönlichen Vorschlag erstellen (1 Token)"}
          </button>
        </div>
        {st && st.loading && <Spinner>Dein Ritual entsteht, einen Moment …</Spinner>}
        {aiBody.length > 0 && (
          <div className="ai-box">
            {aiBody.map((s) => (<div key={s.k}><h3>{s.h}</h3><p>{s.body}</p></div>))}
          </div>
        )}
        {st && st.error && <p className="msg">{st.error}</p>}
      </div>
      <div className="sec">
        <h3>In meinen Plan</h3>
        <div className="row">
          <label className="f" htmlFor="ptime" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            Uhrzeit
            <input type="time" id="ptime" value={ptime} onChange={(e) => setPtime(e.target.value)} />
          </label>
          <button type="button" className="btn ghost" onClick={add}>Ritual eintragen</button>
        </div>
        <p className="msg" role="status">{added}</p>
      </div>
    </section>
  );
}

function Plan({ plan, setPlan }) {
  const [msg, setMsg] = useState("");
  const items = plan.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const update = (next) => { setPlan(next); save("mkrp_plan", next); };
  const exportPlan = () => { downloadFile("mein-ritualplan.ics", planICS(plan)); setMsg("Datei geladen: mein-ritualplan.ics. Öffne sie mit deinem Kalender, dann erinnert er dich."); };
  const exportMoons = () => { downloadFile("neu-und-vollmonde.ics", moonsICS()); setMsg("Datei geladen: neu-und-vollmonde.ics. Öffne sie mit deinem Kalender."); };
  return (
    <section className="card" aria-label="Mein Ritualplan">
      <h2>Mein Ritualplan</h2>
      {items.length === 0 ? (
        <p className="empty-note" style={{ marginTop: 8 }}>Noch nichts geplant. Wähle im Kalender einen Tag und trag dein Ritual ein.</p>
      ) : (
        <div style={{ marginTop: 8 }}>
          {items.map((p) => (
            <div key={p.id} className={"plan-item" + (p.done ? " done" : "")}>
              <input type="checkbox" aria-label={"Erledigt: " + p.title} checked={p.done} onChange={(e) => update(plan.map((x) => (x.id === p.id ? { ...x, done: e.target.checked } : x)))} />
              <div className="t">
                <b>{p.title}</b>
                <span className="note">{fmtDate(new Date(p.date + "T12:00"), { weekday: "short", day: "numeric", month: "long" })}, {p.time} Uhr · {p.phase}</span>
              </div>
              <button type="button" className="btn ghost small" aria-label={"Entfernen: " + p.title} onClick={() => update(plan.filter((x) => x.id !== p.id))}>Entfernen</button>
            </div>
          ))}
        </div>
      )}
      <div className="sec">
        <h3>Erinnerungen</h3>
        <p className="note" style={{ margin: "0 0 10px" }}>Dieses Tool schickt keine Push-Nachrichten. Mit einer Kalenderdatei erinnert dich dein Handy-Kalender stattdessen, zehn Minuten vor jedem Ritual.</p>
        <div className="row">
          <button type="button" className="btn" onClick={exportPlan} disabled={items.length === 0}>Mein Plan als Kalenderdatei</button>
          <button type="button" className="btn ghost" onClick={exportMoons}>Neu- und Vollmonde fürs nächste Jahr</button>
        </div>
        <p className="msg" role="status">{msg}</p>
      </div>
    </section>
  );
}

/* ================= Token-Anzeige und Kauf ================= */
const eur = (cents) => (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

function TokenBar({ user, tokens, onBuy, onLogin, onLogout }) {
  return (
    <div className="tokenbar">
      <div className="tokenpill">
        {user ? (
          <>
            <span aria-live="polite">{tokens === null ? "Token werden geladen …" : tokens + " Token übrig"}</span>
            <button type="button" onClick={onBuy}>Nachkaufen</button>
          </>
        ) : (
          <>
            <span>{FREE_TOKENS} Vorschläge geschenkt</span>
            <button type="button" onClick={onLogin}>Anmelden</button>
          </>
        )}
      </div>
      {user && <div className="who">{user}<button type="button" onClick={onLogout}>Abmelden</button></div>}
    </div>
  );
}

function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(null);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  async function send(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, newsletter }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Der Link konnte gerade nicht verschickt werden. Versuch es gleich nochmal.");
      setSent(data);
    } catch (e2) {
      setErr(e2.message);
    }
    setBusy(false);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="loginh" onClick={(e) => e.stopPropagation()}>
        <h2 id="loginh">Anmelden</h2>
        {sent ? (
          <>
            <p className="sub">Dein Link ist unterwegs. Schau in dein Postfach, auch im Spam-Ordner. Er gilt 15 Minuten.</p>
            {sent.devLink && <p className="note" style={{ textAlign: "center" }}><a href={sent.devLink}>Nur lokaler Test: Link direkt öffnen</a></p>}
            <button type="button" className="cancel" onClick={onClose}>Schließen</button>
          </>
        ) : (
          <form onSubmit={send}>
            <p className="sub">{NEWSLETTER_PFLICHT ? `Die ${FREE_TOKENS} persönlichen Vorschläge sind mein Geschenk für deine Anmeldung zum Newsletter. Du bekommst einen Bestätigungslink per E-Mail.` : `Du bekommst einen Link per E-Mail. Danach schenke ich dir ${FREE_TOKENS} persönliche Vorschläge.`}</p>
            <label className="f" htmlFor="lmail">
              Deine E-Mail-Adresse
              <input type="email" id="lmail" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "9px 12px", font: "inherit" }} />
            </label>
            <label className="check" htmlFor="lnews">
              <input type="checkbox" id="lnews" required={NEWSLETTER_PFLICHT} checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
              <span>{NEWSLETTER_TEXT}</span>
            </label>
            <p className="note" style={{ margin: "0 0 12px" }}>
              Deine Adresse nutze ich für den Login-Link, die Zuordnung deiner Token und, wenn du zustimmst, für den Newsletter.
              {DATENSCHUTZ_URL && <> <a href={DATENSCHUTZ_URL} target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a></>}
            </p>
            <div className="row" style={{ justifyContent: "center" }}>
              <button type="submit" className="btn" disabled={busy}>Link senden</button>
            </div>
            {busy && <Spinner>Der Link wird verschickt …</Spinner>}
            {err && <p className="msg" role="alert">{err}</p>}
            <button type="button" className="cancel" onClick={onClose}>Abbrechen</button>
          </form>
        )}
      </div>
    </div>
  );
}

function BuyModal({ onClose }) {
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  async function buy(id) {
    setBusy(id);
    setErr("");
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paket: id }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Die Bezahlung konnte gerade nicht gestartet werden. Versuch es gleich nochmal.");
      window.location.href = data.url;
    } catch (e) {
      setErr(e.message);
      setBusy("");
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="buyh" onClick={(e) => e.stopPropagation()}>
        <h2 id="buyh">Token nachkaufen</h2>
        <p className="sub">Ein Token ist ein persönlicher Vorschlag.</p>
        {PAKETE.map((p) => (
          <button key={p.id} type="button" className="pack" disabled={!!busy} onClick={() => buy(p.id)}>
            <span>{p.tokens} Token</span>
            <span className="price">{eur(p.cents)}</span>
          </button>
        ))}
        {PREIS_HINWEIS && <p className="note" style={{ textAlign: "center", margin: "8px 0 0" }}>{PREIS_HINWEIS}</p>}
        {busy && <Spinner>Du wirst zur Bezahlung weitergeleitet …</Spinner>}
        {err && <p className="msg" role="alert">{err}</p>}
        <p className="note" style={{ textAlign: "center", margin: "8px 0 0" }}>Die Bezahlung läuft sicher über Stripe.</p>
        <button type="button" className="cancel" onClick={onClose}>Abbrechen</button>
      </div>
    </div>
  );
}

/* ================= Seite ================= */
export default function Page() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(null);
  const [profil, setProfil] = useState(null);
  const [editing, setEditing] = useState(false);
  const [plan, setPlan] = useState([]);
  const [sel, setSel] = useState(null);
  const [view, setView] = useState(null);
  const [ai, setAi] = useState({});
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [notice, setNotice] = useState("");

  // Beim Start: Login-Link einlösen, Zahlung bestätigen oder einfach den Stand holen.
  useEffect(() => {
    if (!ready) return;
    let off = false;
    (async () => {
      const q = new URLSearchParams(window.location.search);
      const loginTok = q.get("login");
      const sid = q.get("session_id");
      try {
        if (loginTok) {
          const r = await fetch("/api/login/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: loginTok }) });
          const d = await r.json().catch(() => ({}));
          window.history.replaceState(null, "", window.location.pathname);
          if (off) return;
          if (r.ok) {
            setUser(d.email);
            setTokens(d.tokens);
            setNotice("Du bist angemeldet. Du hast " + d.tokens + " Token.");
          } else {
            setNotice(d.error || "Die Anmeldung hat nicht geklappt. Fordere einen neuen Link an.");
          }
          return;
        }
        if (q.get("bezahlt") === "1" && sid) {
          const r = await fetch("/api/checkout?session_id=" + encodeURIComponent(sid));
          const d = await r.json().catch(() => ({}));
          window.history.replaceState(null, "", window.location.pathname);
          if (off) return;
          setNotice(d.paid ? "Danke dir! Deine Token sind da." : "Die Zahlung ist noch nicht bestätigt. Lade die Seite in ein paar Sekunden neu.");
        }
        const r = await fetch("/api/tokens");
        const d = await r.json().catch(() => ({}));
        if (off) return;
        if (d.email) { setUser(d.email); setTokens(typeof d.tokens === "number" ? d.tokens : null); }
      } catch {}
    })();
    return () => { off = true; };
  }, [ready]);

  const logout = async () => {
    try { await fetch("/api/logout", { method: "POST" }); } catch {}
    setUser(null);
    setTokens(null);
    setAi({});
    setNotice("Du bist abgemeldet.");
  };
  const openBuy = () => { if (user) setBuyOpen(true); else setLoginOpen(true); };

  // Datum und gespeicherte Angaben erst im Browser lesen (vermeidet Abweichungen beim Server-Rendern).
  useEffect(() => {
    const n = new Date();
    setNow(n);
    setSel(new Date(n.getFullYear(), n.getMonth(), n.getDate()));
    setView(new Date(n.getFullYear(), n.getMonth(), 1));
    setProfil(load("mkrp_profil", null));
    setPlan(load("mkrp_plan", []));
    setReady(true);
  }, []);

  const saveProfil = (p) => { setProfil(p); save("mkrp_profil", p); setEditing(false); };
  const addPlan = (item) => setPlan((prev) => { const next = [...prev, item]; save("mkrp_plan", next); return next; });
  const showOnb = ready && (!profil || editing);
  const initialDraft = useMemo(
    () => ({ name: (profil && profil.name) || "", themen: [...((profil && profil.themen) || [])], praxen: [...((profil && profil.praxen) || [])], minuten: (profil && profil.minuten) || 20 }),
    [profil, editing] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        {ready && <TokenBar user={user} tokens={tokens} onBuy={openBuy} onLogin={() => setLoginOpen(true)} onLogout={logout} />}
        {notice && <p className="banner" role="status">{notice}</p>}
        <header className="top">
          <h1>Mondkalender <span>&amp;</span> Ritual-Planer</h1>
          <p className="lead">Dein Kalender für Mondphasen, besondere Zeitpunkte und die passenden Rituale. Du siehst, welche Energie ein Tag trägt, und planst deine Praxis danach.</p>
        </header>

        {!ready ? (
          <Spinner>Dein Kalender wird geladen …</Spinner>
        ) : (
          <div className="stack">
            {showOnb && (
              <Onboarding
                key={editing ? "edit" : "new"}
                initial={initialDraft}
                onSave={saveProfil}
                onSkip={() => saveProfil({ name: "", themen: [], praxen: [], minuten: 20, skipped: true })}
              />
            )}
            <div className="grid">
              <div className="stack">
                <Today now={now} profil={profil} onEdit={() => setEditing(true)} />
                <Calendar now={now} view={view} setView={setView} sel={sel} setSel={setSel} plan={plan} />
              </div>
              <div className="stack">
                <Detail sel={sel} profil={profil} ai={ai} setAi={setAi} onAddPlan={addPlan} user={user} tokens={tokens} setTokens={setTokens} openBuy={openBuy} openLogin={() => setLoginOpen(true)} />
                <Plan plan={plan} setPlan={setPlan} />
              </div>
            </div>
          </div>
        )}

        {buyOpen && <BuyModal onClose={() => setBuyOpen(false)} />}
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}

        <footer>
          Die Mondstände werden berechnet und können um wenige Minuten abweichen. Hinweise zu Merkur und Finsternissen sind ungefähre Angaben. Alles hier ist Inspiration für deine Praxis, keine Gewissheit. Deine Eingaben bleiben in deinem Browser.
          <p style={{ margin: "12px 0 0" }}>
            <a href={IMPRESSUM_URL} target="_blank" rel="noopener noreferrer">Impressum</a>
            {" · "}
            <a href={DATENSCHUTZ_URL} target="_blank" rel="noopener noreferrer">Datenschutz</a>
          </p>
        </footer>
      </div>
    </>
  );
}
