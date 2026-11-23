import { endSession } from "../../../lib/store";

export const runtime = "nodejs";

export async function POST() {
  try { await endSession(); } catch (err) { console.error("logout", err); }
  return Response.json({ ok: true });
}
