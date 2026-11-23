import { currentUser, balance, credit } from "../../../lib/store";
import { createCheckoutSession, retrieveSession } from "../../../lib/stripe";
import { PAKETE } from "../../../lib/config";

export const runtime = "nodejs";

// Startet die Bezahlung bei Stripe und gibt die Adresse der Bezahlseite zurück.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Die Anfrage war ungültig." }, { status: 400 }); }
  const paket = PAKETE.find((p) => p.id === body.paket);
  if (!paket) return Response.json({ error: "Dieses Paket gibt es nicht." }, { status: 400 });
  try {
    const email = await currentUser();
    if (!email) return Response.json({ error: "Bitte melde dich zuerst an.", needLogin: true }, { status: 401 });
    const session = await createCheckoutSession({ paket, email, origin: process.env.SITE_URL || new URL(request.url).origin });
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("checkout", err);
    const msg = String(err.message).startsWith("STRIPE_NOT_CONFIGURED")
      ? "Die Bezahlung ist noch nicht eingerichtet."
      : "Die Bezahlung konnte gerade nicht gestartet werden. Versuch es gleich nochmal.";
    return Response.json({ error: msg }, { status: 500 });
  }
}

// Wird nach der Rückkehr von Stripe aufgerufen: prüft die Zahlung und schreibt die Token gut.
// Der Webhook macht dasselbe. Doppelt gutschreiben ist ausgeschlossen.
export async function GET(request) {
  const sid = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sid)) return Response.json({ error: "Ungültige Sitzung." }, { status: 400 });
  try {
    const session = await retrieveSession(sid);
    const paid = session.payment_status === "paid";
    const mail = session.metadata && session.metadata.email;
    const tokens = Number(session.metadata && session.metadata.tokens);
    let credited = false;
    if (paid && mail && tokens > 0) credited = await credit(sid, mail, tokens);
    const mine = await currentUser();
    return Response.json({ paid, credited, tokens: mine ? await balance(mine) : null });
  } catch (err) {
    console.error("checkout confirm", err);
    return Response.json({ error: "Die Zahlung konnte nicht geprüft werden." }, { status: 500 });
  }
}
