import { credit } from "../../../lib/store";
import { verifyWebhook } from "../../../lib/stripe";

export const runtime = "nodejs";

// Stripe meldet hier jede abgeschlossene Zahlung, auch wenn die Kundin das Fenster schon geschlossen hat.
export async function POST(request) {
  const raw = await request.text();
  if (!verifyWebhook(raw, request.headers.get("stripe-signature"))) {
    return Response.json({ error: "Ungültige Signatur." }, { status: 400 });
  }
  let event;
  try { event = JSON.parse(raw); } catch { return Response.json({ error: "Ungültige Daten." }, { status: 400 }); }
  const okTypes = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (okTypes.includes(event.type)) {
    const s = event.data && event.data.object;
    const mail = s && s.metadata && s.metadata.email;
    const tokens = Number(s && s.metadata && s.metadata.tokens);
    if (s && s.payment_status === "paid" && mail && tokens > 0) {
      try { await credit(s.id, mail, tokens); }
      catch (err) { console.error("webhook credit", err); return Response.json({ error: "Gutschrift fehlgeschlagen." }, { status: 500 }); }
    }
  }
  return Response.json({ received: true });
}
