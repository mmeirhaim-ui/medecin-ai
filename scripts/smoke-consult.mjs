#!/usr/bin/env node
/**
 * Local smoke: mint ticket → consult (mock) → replay rejected.
 * Usage: node scripts/smoke-consult.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const origin = base;

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

const jar = new Map();

function storeSetCookie(res) {
  const raw = res.headers.getSetCookie?.() || [];
  const single = res.headers.get("set-cookie");
  const list = raw.length ? raw : single ? [single] : [];
  for (const c of list) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function main() {
  const ticketRes = await fetch(`${base}/api/consult/ticket`, {
    method: "POST",
    headers: { Origin: origin, Referer: `${origin}/consulter` },
  });
  storeSetCookie(ticketRes);
  const ticketJson = await ticketRes.json();
  if (!ticketRes.ok || !ticketJson.ticket) {
    fail(`ticket ${ticketRes.status}: ${JSON.stringify(ticketJson)}`);
  }
  if (!jar.has("doctor_ia_consult_sid") && !jar.has("medecin_consult_sid")) {
    fail("missing doctor_ia_consult_sid cookie");
  }

  const consultRes = await fetch(`${base}/api/consult`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "X-Consult-Ticket": ticketJson.ticket,
      Cookie: cookieHeader(),
    },
    body: JSON.stringify({
      consultationId: "smoke-local",
      symptoms: "mal de gorge léger depuis 1 jour, pas de fièvre",
    }),
  });
  const consultJson = await consultRes.json();
  if (!consultRes.ok) {
    fail(`consult ${consultRes.status}: ${JSON.stringify(consultJson)}`);
  }
  if (!consultJson.assessment || !consultJson.reply) {
    fail(`consult missing assessment/reply: ${JSON.stringify(consultJson)}`);
  }

  const replay = await fetch(`${base}/api/consult`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "X-Consult-Ticket": ticketJson.ticket,
      Cookie: cookieHeader(),
    },
    body: JSON.stringify({ symptoms: "replay" }),
  });
  const replayJson = await replay.json();
  if (replay.status !== 401 || !String(replayJson.error || "").includes("utilisé")) {
    fail(`replay expected 401 utilisé, got ${replay.status}: ${JSON.stringify(replayJson)}`);
  }

  // IP spoof headers must NOT invalidate a fresh ticket (sid-only binding).
  const t2 = await fetch(`${base}/api/consult/ticket`, {
    method: "POST",
    headers: { Origin: origin, Cookie: cookieHeader() },
  });
  storeSetCookie(t2);
  const t2j = await t2.json();
  const spoof = await fetch(`${base}/api/consult`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "X-Consult-Ticket": t2j.ticket,
      Cookie: cookieHeader(),
      "X-Real-IP": "203.0.113.9",
      "X-Forwarded-For": "203.0.113.9",
    },
    body: JSON.stringify({ symptoms: "test spoof ip" }),
  });
  const spoofJson = await spoof.json();
  if (!spoof.ok) {
    fail(`spoofed-IP consult should succeed: ${spoof.status} ${JSON.stringify(spoofJson)}`);
  }

  console.log("OK: ticket → consult → replay rejected; IP spoof sticky-safe");
  console.log(`mock=${Boolean(consultJson.mock)} urgency=${consultJson.assessment?.urgency}`);
}

main().catch((e) => fail(e?.stack || String(e)));
