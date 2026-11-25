import { createHmac, timingSafeEqual } from "node:crypto";
import { HINWEIS_CHECKOUT, RECHNUNG_FUSS } from "./config";

const API = "https://api.stripe.com/v1";

function secret() {
  const k = process.env.STRIPE_SECRET_KEY;
  if (!k) throw new Error("STRIPE_NOT_CONFIGURED");
  return k;
}

export async function createCheckoutSession({ paket, email, origin }) {
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("locale", "de");
  p.set("success_url", origin + "/?bezahlt=1&session_id={CHECKOUT_SESSION_ID}");
  p.set("cancel_url", origin + "/");
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "eur");
  p.set("line_items[0][price_data][unit_amount]", String(paket.cents));
  p.set("line_items[0][price_data][product_data][name]", `${paket.tokens} Token Mondkalender & Ritual-Planer`);
  p.set("customer_email", email);
  p.set("metadata[email]", email);
  p.set("metadata[tokens]", String(paket.tokens));
  p.set("metadata[paket]", paket.id);
  if (HINWEIS_CHECKOUT) p.set("custom_text[submit][message]", HINWEIS_CHECKOUT);
  // Stripe erstellt nach der Zahlung automatisch eine Rechnung mit § 19-Hinweis im Fuß.
  p.set("invoice_creation[enabled]", "true");
  if (RECHNUNG_FUSS) p.set("invoice_creation[invoice_data][footer]", RECHNUNG_FUSS);
  const res = await fetch(API + "/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + secret(), "Content-Type": "application/x-www-form-urlencoded" },
    body: p,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("STRIPE_ERROR " + res.status + " " + (data.error && data.error.message));
  return data;
}

export async function retrieveSession(id) {
  const res = await fetch(API + "/checkout/sessions/" + encodeURIComponent(id), {
    headers: { Authorization: "Bearer " + secret() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("STRIPE_ERROR " + res.status);
  return data;
}

// Prüft die Signatur, mit der Stripe die Webhook-Nachricht unterschreibt.
export function verifyWebhook(rawBody, header) {
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whsec || !header) return false;
  const parts = Object.fromEntries(header.split(",").map((s) => s.split("=")));
  const t = parts.t;
  const sigs = header.split(",").filter((s) => s.startsWith("v1=")).map((s) => s.slice(3));
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = createHmac("sha256", whsec).update(`${t}.${rawBody}`).digest("hex");
  return sigs.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}
