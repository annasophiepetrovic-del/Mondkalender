import { normEmail, rateLimit, createLoginToken } from "../../../lib/store";
import { sendLoginMail } from "../../../lib/mail";
import { NEWSLETTER_PFLICHT, NEWSLETTER_TEXT } from "../../../lib/config";

export const runtime = "nodejs";

// Schickt der Person einen Login-Link per E-Mail.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Die Anfrage war ungültig." }, { status: 400 }); }
  const email = normEmail(body.email);
  if (!email) return Response.json({ error: "Bitte gib eine gültige E-Mail-Adresse ein." }, { status: 400 });
  if (NEWSLETTER_PFLICHT && !body.newsletter) {
    return Response.json({ error: "Für die Anmeldung brauche ich dein Häkchen beim Newsletter." }, { status: 400 });
  }
  try {
    const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unbekannt";
    const okIp = await rateLimit("rl:ip:" + ip, 10, 3600);
    const okMail = await rateLimit("rl:mail:" + email, 3, 900);
    if (!okIp || !okMail) {
      return Response.json({ error: "Das waren gerade zu viele Anfragen. Warte ein paar Minuten und versuch es nochmal." }, { status: 429 });
    }
    const token = await createLoginToken(email, !!body.newsletter, body.newsletter ? NEWSLETTER_TEXT : "");
    const base = process.env.SITE_URL || new URL(request.url).origin;
    const link = base.replace(/\/$/, "") + "/?login=" + token;
    const r = await sendLoginMail(email, link);
    return Response.json({ ok: true, devLink: r.dev ? link : undefined });
  } catch (err) {
    console.error("login", err);
    const msg = String(err.message).startsWith("MAIL_NOT_CONFIGURED")
      ? "Der E-Mail-Versand ist noch nicht eingerichtet."
      : "Der Link konnte gerade nicht verschickt werden. Versuch es gleich nochmal.";
    return Response.json({ error: msg }, { status: 500 });
  }
}
