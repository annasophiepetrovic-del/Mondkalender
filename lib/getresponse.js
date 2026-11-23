import { getLead, setLeadFields } from "./store";

// Trägt bestätigte Newsletter-Kontakte in deine GetResponse-Liste ein.
// Fehlen die Zugangsdaten, wird still übersprungen. Ein Fehler hier blockiert nie die Anmeldung.
export async function syncToGetResponse(email) {
  const key = process.env.GETRESPONSE_API_KEY;
  const campaignId = process.env.GETRESPONSE_CAMPAIGN_ID;
  if (!key || !campaignId) return;
  try {
    const lead = await getLead(email);
    if (lead && lead.getresponse === "ja") return;
    const headers = { "X-Auth-Token": "api-key " + key, "Content-Type": "application/json" };
    // Nur für GetResponse MAX / 360 nötig:
    if (process.env.GETRESPONSE_DOMAIN) headers["X-Domain"] = process.env.GETRESPONSE_DOMAIN;
    const base = (process.env.GETRESPONSE_API_URL || "https://api.getresponse.com/v3").replace(/\/$/, "");
    const res = await fetch(base + "/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({ email, campaign: { campaignId } }),
      signal: AbortSignal.timeout(6000),
    });
    // 202 = angenommen, 409 = steht schon in der Liste
    if (res.status === 202 || res.status === 200 || res.status === 201 || res.status === 409) {
      await setLeadFields(email, { getresponse: "ja", getresponseAt: new Date().toISOString() });
    } else {
      console.error("GetResponse", res.status, await res.text());
      await setLeadFields(email, { getresponse: "Fehler " + res.status });
    }
  } catch (err) {
    console.error("GetResponse nicht erreichbar", err);
    try { await setLeadFields(email, { getresponse: "Fehler" }); } catch {}
  }
}
