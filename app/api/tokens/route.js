import { currentUser, balance } from "../../../lib/store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const email = await currentUser();
    if (!email) return Response.json({ email: null, tokens: null });
    return Response.json({ email, tokens: await balance(email) });
  } catch (err) {
    console.error("tokens", err);
    return Response.json({ error: "Der Token-Stand ist gerade nicht erreichbar." }, { status: 500 });
  }
}
