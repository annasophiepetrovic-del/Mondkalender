import { redeemLoginToken, recordLead, startSession, balance } from "../../../../lib/store";
import { syncToGetResponse } from "../../../../lib/getresponse";

export const runtime = "nodejs";

// Wird von der Seite aufgerufen, wenn jemand auf den Link in der E-Mail klickt.
// Der Link wird erst hier (per POST) eingelöst, damit Mail-Scanner ihn nicht verbrauchen.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Die Anfrage war ungültig." }, { status: 400 }); }
  try {
    const data = await redeemLoginToken(body.token);
    if (!data || !data.email) {
      return Response.json({ error: "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere einen neuen an." }, { status: 400 });
    }
    await recordLead(data.email, data.newsletter, data.consentText, data.requestedAt);
    if (data.newsletter) await syncToGetResponse(data.email); // erst nach dem Klick auf den Bestätigungslink
    await startSession(data.email);
    return Response.json({ email: data.email, tokens: await balance(data.email) });
  } catch (err) {
    console.error("login verify", err);
    return Response.json({ error: "Die Anmeldung hat gerade nicht geklappt. Fordere einen neuen Link an." }, { status: 500 });
  }
}
