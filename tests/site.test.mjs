import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../css/style.css", import.meta.url), "utf8");

test("uses the production canonical domain and social image", () => {
  assert.match(html, /https:\/\/hawaii\.rangeway\.co\//);
  assert.match(html, /rangeway-hawaii-social\.jpg/);
});

test("labels every concept image as conceptual", () => {
  assert.match(html, /Concept vision · No site announced/);
  assert.match(html, /Concept visualization · Long-term design study/);
  assert.match(html, /Concept only · Final location, format, and scope remain open/);
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
    "/images/hawaii-basecamp-phase1.webp",
    "/images/hawaii-basecamp-hospitality.webp",
    "/images/hawaii-basecamp-long-view.webp"
  ]);
});
