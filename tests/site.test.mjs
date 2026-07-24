import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../css/style.css", import.meta.url), "utf8");
const socialPreview = await readFile(new URL("../tools/social-preview.html", import.meta.url), "utf8");

test("uses the production canonical domain and social image", () => {
  assert.match(html, /https:\/\/hawaii\.rangeway\.co\//);
  assert.match(html, /rangeway-hawaii-social\.jpg/);
  assert.match(html, /\/css\/style\.css\?v=20260724-2/);
  assert.match(socialPreview, /hawaii-basecamp-phase2-1\.png/);
});

test("labels every concept image as conceptual", () => {
  assert.match(html, /Phase Two concept vision · No site announced/);
  assert.match(html, /Concept visualization · Long-term design study/);
  assert.match(html, /Phase One design study · A smaller roadside stop that could evolve toward the Phase Two vision above/);
});

test("does not publish restricted project claims", () => {
  const restricted = [
    /Pahala/i,
    /Olson Trust/i,
    /Hawai[ʻ']i County/i,
    /Benson Medina/i,
    /site control/i,
    /opening in/i,
    /\b202[6-9]\b/,
    /Phase I/i,
    /Phase II/i,
    /site partner/i,
    /rollout map/i
  ];

  for (const pattern of restricted) {
    assert.doesNotMatch(html, pattern);
  }
});

test("includes baseline accessibility features", () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("uses only approved concept derivatives", () => {
  const imageSources = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(imageSources, [
    "/images/hawaii-basecamp-long-view.webp",
    "/images/hawaii-basecamp-hospitality.webp",
    "/images/hawaii-basecamp-phase1.webp"
  ]);
});

test("uses the approved cultural direction without the rejected hero treatment", () => {
  assert.match(html, /Hoʻokipa/);
  assert.match(html, /<span>Hawaiʻi<\/span>/);
  assert.doesNotMatch(html, /<span>Hawaiʻi\.<\/span>/);
  assert.doesNotMatch(css, /content:\s*"ISLAND"/);
  assert.doesNotMatch(
    css.match(/\.cover\s*\{[^}]*\}/s)?.[0] ?? "",
    /radial-gradient/
  );
});

test("centers supporting copy beside section headings", () => {
  assert.match(css, /\.section-head\s*\{[^}]*align-items:\s*center/s);
  assert.match(css, /\.updates__grid\s*\{[^}]*align-items:\s*center/s);
  assert.match(css, /\.split-copy\s*\{[^}]*align-items:\s*center/s);
  assert.match(css, /\.index-row\s*\{[^}]*align-items:\s*center/s);
});

test("centers the Hawaiʻi Island header label with the wordmark", () => {
  assert.match(css, /\.masthead__site\s*\{[^}]*align-items:\s*center/s);
  assert.match(css, /\.masthead__site\s*\{[^}]*align-self:\s*center/s);
});

test("places hospitality copy lower in its image block", () => {
  assert.match(
    css,
    /\.cinema\s*\{[^}]*padding-top:\s*clamp\(48px,\s*5vw,\s*80px\)/s
  );
  assert.match(
    css,
    /\.cinema__content\s*\{[^}]*padding-bottom:\s*clamp\(44px,\s*5vw,\s*84px\)/s
  );
});

test("links the Rangeway X account from the footer", () => {
  assert.match(
    html,
    /href="https:\/\/x\.com\/rangewayev"[^>]*>X<\/a>/
  );
});

test("orders footer social links alphabetically", () => {
  assert.match(
    html,
    /Field Notes<\/a>\s*<a[^>]*>Instagram<\/a>\s*<a[^>]*>LinkedIn<\/a>\s*<a[^>]*>X<\/a>/
  );
});
