// Serverseitige Route: Der API-Key wird nur hier aus der Umgebung gelesen.
import { currentUser, balance, consume, refund } from "../../../lib/store";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "claude-sonnet-4-5";

const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v, maxItems, maxLen) =>
  Array.isArray(v)
    ? v.slice(0, maxItems).map((x) => text(String(x), maxLen)).filter(Boolean)
    : [];

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Der Server ist noch nicht eingerichtet: ANTHROPIC_API_KEY fehlt." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Die Anfrage war ungültig." }, { status: 400 });
  }

  // Das Frontend schickt nur strukturierte Felder. Den Prompt baut der Server,
  // damit die Route nicht als freier Zugang zur API missbraucht werden kann.
  const datum = text(body.datum, 80);
  const phase = text(body.phase, 40);
  const zeichen = text(body.zeichen, 20);
  if (!datum || !phase || !zeichen) {
    return Response.json({ error: "Es fehlen Angaben zum Tag." }, { status: 400 });
  }
  const element = text(body.element, 20);
  const thema = text(body.thema, 120);
  const beleuchtung = Number.isFinite(+body.beleuchtung) ? Math.round(+body.beleuchtung) : null;
  const ereignisse = list(body.ereignisse, 6, 60);
  const name = text(body.name, 40) || "unbekannt";
  const themen = list(body.themen, 8, 40);
  const praxen = list(body.praxen, 8, 40);
  const minuten = [10, 20, 45].includes(+body.minuten) ? +body.minuten : 20;

  // Ab hier kostet es einen Token. Der Stand liegt auf dem Server, nicht im Browser.
  let id;
  try {
    id = await currentUser();
    if (!id) {
      return Response.json({ error: "Bitte melde dich zuerst an.", needLogin: true }, { status: 401 });
    }
    if (!(await consume(id))) {
      return Response.json(
        { error: "Deine Token sind aufgebraucht.", needTokens: true, tokens: 0 },
        { status: 402 }
      );
    }
  } catch (err) {
    console.error("Token-Speicher", err);
    return Response.json({ error: "Der Token-Speicher ist noch nicht eingerichtet." }, { status: 500 });
  }

  const prompt =
    "Du bist eine warme, klare Begleiterin für Mondrituale. Schreibe auf Deutsch, in der Du-Form, " +
    "persönlich und direkt, ohne Verkaufsdruck, ohne Emojis, ohne Markdown und ohne Sternchen. " +
    "Keine Floskeln, bleib konkret. Behandle Mond- und Energiearbeit respektvoll.\n\n" +
    `Datum: ${datum}\n` +
    `Mondphase: ${phase}${beleuchtung !== null ? ` (${beleuchtung} % beleuchtet)` : ""}\n` +
    `Mond im Zeichen: ${zeichen}${element ? ` (${element}` : ""}${thema ? `, Thema: ${thema}` : ""}${element ? ")" : ""}\n` +
    (ereignisse.length ? `Besonderes: ${ereignisse.join(", ")}\n` : "") +
    `Name: ${name}\n` +
    `Themen der Person: ${themen.length ? themen.join(", ") : "keine angegeben"}\n` +
    `Praktiken, die sie mag: ${praxen.length ? praxen.join(", ") : "keine angegeben"}\n` +
    `Zeit für das Ritual: etwa ${minuten} Minuten\n\n` +
    "Gib genau diese vier Abschnitte aus. Jede Überschrift steht allein in einer Zeile, " +
    "in Großbuchstaben, genau so geschrieben:\n" +
    "RITUAL\n(erste Zeile: ein kurzer Titel, danach 3 bis 5 nummerierte Schritte, passend zum Zeitbudget und zu den Praktiken)\n" +
    "WARUM JETZT\n(2 Sätze, die Phase und Mondzeichen mit den Themen der Person verbinden)\n" +
    "AFFIRMATION\n(ein Satz in der Ich-Form)\n" +
    "JOURNAL-FRAGE\n(eine einzige Frage)";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error("Anthropic API Fehler", res.status, await res.text());
      await refund(id).catch(() => {});
      const msg =
        res.status === 429
          ? "Gerade sind zu viele Anfragen unterwegs. Versuch es in einer Minute nochmal."
          : "Der Vorschlag konnte gerade nicht erstellt werden. Versuch es gleich nochmal.";
      return Response.json({ error: msg }, { status: 502 });
    }

    const data = await res.json();
    const out = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!out) {
      await refund(id).catch(() => {});
      return Response.json({ error: "Es kam keine Antwort an. Dein Token ist zurückgebucht." }, { status: 502 });
    }
    return Response.json({ text: out, tokens: await balance(id) });
  } catch (err) {
    console.error("Anthropic API nicht erreichbar", err);
    await refund(id).catch(() => {});
    return Response.json(
      { error: "Der Vorschlag konnte gerade nicht erstellt werden. Versuch es gleich nochmal." },
      { status: 502 }
    );
  }
}
