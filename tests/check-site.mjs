import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const html = await readFile(resolve(root, "index.html"), "utf8");
const references = [
  ...html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)
].map((match) => match[1]);

for (const reference of references) {
  if (reference === "/") continue;
  await access(resolve(root, reference.slice(1)));
}

console.log(`Checked ${references.length} local references.`);
