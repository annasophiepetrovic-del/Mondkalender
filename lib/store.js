import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { FREE_TOKENS } from "./config";

// Kleiner Speicher im Arbeitsspeicher, nur für lokales Testen ohne Datenbank.
class MemRedis {
  constructor() { this.m = new Map(); }
  async set(k, v, o) { if (o && o.nx && this.m.has(k)) return null; this.m.set(k, v); return "OK"; }
  async get(k) { return this.m.has(k) ? this.m.get(k) : null; }
  async getdel(k) { const v = this.m.has(k) ? this.m.get(k) : null; this.m.delete(k); return v; }
  async incrby(k, n) { const v = (Number(this.m.get(k)) || 0) + n; this.m.set(k, v); return v; }
  async incr(k) { return this.incrby(k, 1); }
  async decr(k) { return this.incrby(k, -1); }
  async del(k) { this.m.delete(k); }
  async expire() { return 1; }
  async sadd(k, v) { const s = this.m.get(k) || new Set(); s.add(v); this.m.set(k, s); }
  async smembers(k) { return [...(this.m.get(k) || [])]; }
  async hset(k, o) { this.m.set(k, { ...(this.m.get(k) || {}), ...o }); }
  async hgetall(k) { return this.m.get(k) || null; }
}

let client;
function db() {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) client = new Redis({ url, token });
  else if (process.env.NODE_ENV !== "production") client = globalThis.__memRedis || (globalThis.__memRedis = new MemRedis());
  else throw new Error("DB_NOT_CONFIGURED");
  return client;
}

/* ---------- E-Mail ---------- */
export function normEmail(v) {
  const e = String(v || "").trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null;
}

export async function rateLimit(key, max, windowSec) {
  const r = db();
  const n = await r.incr(key);
  if (n === 1) await r.expire(key, windowSec);
  return n <= max;
}

/* ---------- Login per Link ---------- */
export async function createLoginToken(email, newsletter, consentText = "") {
  const token = randomBytes(32).toString("hex");
  await db().set(`login:${token}`, { email, newsletter: !!newsletter, consentText, requestedAt: new Date().toISOString() }, { ex: 900 }); // 15 Minuten
  return token;
}

// Der Link gilt genau einmal.
export async function redeemLoginToken(token) {
  if (!/^[a-f0-9]{64}$/.test(String(token || ""))) return null;
  return (await db().getdel(`login:${token}`)) || null;
}

const COOKIE = "mk_session";
const SESSION_DAYS = 90;

export async function startSession(email) {
  const tok = randomBytes(32).toString("hex");
  await db().set(`session:${tok}`, email, { ex: 60 * 60 * 24 * SESSION_DAYS });
  const c = await cookies();
  c.set(COOKIE, tok, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

// Gibt die E-Mail der angemeldeten Person zurück, sonst null.
export async function currentUser() {
  const c = await cookies();
  const tok = c.get(COOKIE)?.value;
  if (!tok || !/^[a-f0-9]{64}$/.test(tok)) return null;
  const email = await db().get(`session:${tok}`);
  return typeof email === "string" ? email : null;
}

export async function endSession() {
  const c = await cookies();
  const tok = c.get(COOKIE)?.value;
  if (tok && /^[a-f0-9]{64}$/.test(tok)) await db().del(`session:${tok}`);
  c.delete(COOKIE);
}

/* ---------- Kontaktliste ---------- */
export async function recordLead(email, newsletter, consentText = "", requestedAt = "") {
  const r = db();
  await r.sadd("leads", email);
  const old = await r.hgetall(`lead:${email}`);
  const now = new Date().toISOString();
  if (!old) {
    await r.hset(`lead:${email}`, { created: now, newsletter: newsletter ? "ja" : "nein", consentAt: newsletter ? now : "", consentRequestedAt: newsletter ? requestedAt : "", consentText: newsletter ? consentText : "" });
  } else if (newsletter && old.newsletter !== "ja") {
    await r.hset(`lead:${email}`, { newsletter: "ja", consentAt: now, consentRequestedAt: requestedAt, consentText });
  }
}

export async function getLead(email) {
  return await db().hgetall(`lead:${email}`);
}

export async function setLeadFields(email, fields) {
  await db().hset(`lead:${email}`, fields);
}

export async function listLeads() {
  const r = db();
  const emails = await r.smembers("leads");
  const out = [];
  for (const email of emails) {
    const h = (await r.hgetall(`lead:${email}`)) || {};
    out.push({ email, created: h.created || "", newsletter: h.newsletter || "nein", consentAt: h.consentAt || "", requestedAt: h.consentRequestedAt || "", consentText: h.consentText || "", getresponse: h.getresponse || "" });
  }
  return out.sort((a, b) => String(a.created).localeCompare(String(b.created)));
}

/* ---------- Token ---------- */
const key = (email) => `tokens:${email}`;

export async function balance(email) {
  const r = db();
  await r.set(key(email), FREE_TOKENS, { nx: true }); // legt beim ersten Login die Gratis-Token an
  return Math.max(0, Number(await r.get(key(email))) || 0);
}

// Zieht atomar einen Token ab. false = keine mehr da.
export async function consume(email) {
  await balance(email);
  const r = db();
  const left = await r.decr(key(email));
  if (left < 0) {
    await r.incr(key(email));
    return false;
  }
  return true;
}

export async function refund(email) {
  await db().incr(key(email));
}

// Schreibt gekaufte Token gut. Jede Bezahl-Sitzung zählt nur einmal.
export async function credit(sessionId, email, tokens) {
  const r = db();
  await balance(email);
  const first = await r.set(`paid:${sessionId}`, email, { nx: true });
  if (!first) return false;
  try {
    await r.incrby(key(email), tokens);
  } catch (e) {
    await r.del(`paid:${sessionId}`);
    throw e;
  }
  return true;
}
