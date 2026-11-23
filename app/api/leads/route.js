import { timingSafeEqual } from "node:crypto";
import { listLeads } from "../../../lib/store";

export const runtime = "nodejs";

// Deine Kontaktliste als Tabelle (CSV). Aufruf: /api/leads?key=DEIN_ADMIN_KEY
export async function GET(request) {
  const admin = process.env.ADMIN_KEY;
  if (!admin) return new Response("Nicht gefunden.", { status: 404 });
  const given = new URL(request.url).searchParams.get("key") || "";
  const a = Buffer.from(given), b = Buffer.from(admin);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Nicht gefunden.", { status: 404 });
  try {
    const rows = await listLeads();
    const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
    const csv = "﻿" + ["E-Mail;Angemeldet am;Newsletter-Einwilligung;Einwilligung angefragt am;Einwilligung per Link bestätigt am;Einwilligungstext;GetResponse"]
      .concat(rows.map((r) => [q(r.email), q(r.created), q(r.newsletter), q(r.requestedAt), q(r.consentAt), q(r.consentText), q(r.getresponse)].join(";"))).join("\r\n");
    return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="kontakte.csv"', "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("leads", err);
    return new Response("Fehler beim Laden.", { status: 500 });
  }
}
