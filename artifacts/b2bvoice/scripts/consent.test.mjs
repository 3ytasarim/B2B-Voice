// Run: node --test scripts/consent.test.mjs   (Node 22.6+: strips the TypeScript types itself)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ACCEPT_ALL, CONSENT_KEY, CONSENT_VERSION, REJECT_ALL,
  allowedCategories, makeConsent, needsReload, parseConsent, showsBannerOn,
} from "../src/lib/consent.ts";

const NOW = new Date("2026-11-24T10:00:00.000Z");

test("without a decision nothing may run", () => {
  assert.deepEqual(allowedCategories(null), []);
});

test("'necessary only' allows nothing, 'accept all' everything, a custom choice exactly what was ticked", () => {
  assert.deepEqual(allowedCategories(makeConsent(REJECT_ALL, NOW)), []);
  assert.deepEqual(allowedCategories(makeConsent(ACCEPT_ALL, NOW)), ["statistics", "replay", "marketing"]);
  assert.deepEqual(allowedCategories(makeConsent({ statistics: true, replay: false, marketing: false }, NOW)), ["statistics"]);
  assert.deepEqual(allowedCategories(makeConsent({ statistics: false, replay: false, marketing: true }, NOW)), ["marketing"]);
});

test("stored values round-trip; broken, foreign or outdated values count as 'not decided'", () => {
  const c = makeConsent(ACCEPT_ALL, NOW);
  assert.deepEqual(parseConsent(JSON.stringify(c)), c);
  for (const bad of [null, undefined, "", "nope", "{}", "[]", "null", JSON.stringify({ ...c, v: CONSENT_VERSION + 1 }), JSON.stringify({ ...c, marketing: "yes" }), JSON.stringify({ v: CONSENT_VERSION, statistics: true, replay: true })]) {
    assert.equal(parseConsent(bad), null, String(bad));
  }
});

test("a reload is needed only when something that was allowed is withdrawn", () => {
  const all = makeConsent(ACCEPT_ALL, NOW);
  assert.equal(needsReload(null, REJECT_ALL), false);
  assert.equal(needsReload(makeConsent(REJECT_ALL, NOW), ACCEPT_ALL), false);
  assert.equal(needsReload(all, ACCEPT_ALL), false);
  assert.equal(needsReload(all, { ...ACCEPT_ALL, marketing: false }), true);
  assert.equal(needsReload(all, REJECT_ALL), true);
});

test("the popup is shown on the public site, not in the admin area", () => {
  assert.equal(showsBannerOn("/"), true);
  assert.equal(showsBannerOn("/blog"), true);
  assert.equal(showsBannerOn("/cookie-policy"), true);
  assert.equal(showsBannerOn("/admin"), false);
  assert.equal(showsBannerOn("/admin/login"), false);
  assert.equal(showsBannerOn("/administration-blog"), true);
});

test("index.html's inline loader uses the same storage key and version as consent.ts", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.ok(html.includes(`var KEY = "${CONSENT_KEY}", VERSION = ${CONSENT_VERSION};`));
});

test("index.html no longer loads any tracker unconditionally", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.ok(!/<script[^>]*analytics\.bleibsichtbar\.com/.test(html), "Umami script tag must not be static");
  assert.ok(!/<noscript>[\s\S]*googletagmanager/.test(html), "GTM noscript iframe must be gone");
  assert.ok(!/<script[^>]*src="https:\/\/www\.googletagmanager\.com/.test(html), "no static GTM/gtag script tag");
});
