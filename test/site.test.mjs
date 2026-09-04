import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const siteOrigin = "https://vibe-agi.github.io";

const expectedPages = [
  "404.html",
  "index.html",
  "products/hideout/index.html",
  "products/vibermate/index.html",
  "zh/index.html",
  "zh/products/hideout/index.html",
  "zh/products/vibermate/index.html",
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(directory, path.join(entry.parentPath, entry.name)))
    .sort();
}

async function read(relativePath) {
  return readFile(path.join(dist, relativePath), "utf8");
}

function matches(html, expression) {
  return [...html.matchAll(expression)].map((match) => match[1]);
}

function localTarget(reference) {
  const url = new URL(reference, `${siteOrigin}/`);
  if (url.origin !== siteOrigin) return undefined;
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) return `${pathname.slice(1)}index.html`;
  return pathname.slice(1);
}

test("the build publishes exactly the intended bilingual pages", async () => {
  const htmlFiles = (await filesUnder(dist)).filter((file) => file.endsWith(".html"));
  assert.deepEqual(htmlFiles, expectedPages);

  const allHtml = await Promise.all(htmlFiles.map(read));
  const output = allHtml.join("\n");
  assert.doesNotMatch(output, /\/products\/(?:human|s3disk)\//i);
  assert.doesNotMatch(output, />\s*(?:Human|s3disk)\s*</);
});

test("every page has complete language, metadata, and document landmarks", async () => {
  for (const relativePath of expectedPages) {
    const html = await read(relativePath);
    const expectedLanguage = relativePath.startsWith("zh/") ? "zh-CN" : "en";

    assert.match(html, new RegExp(`<html lang="${expectedLanguage}"`), relativePath);
    assert.match(html, /<title>[^<]+<\/title>/, relativePath);
    assert.match(html, /<meta name="description" content="[^"]+">/, relativePath);
    if (relativePath === "404.html") {
      assert.match(html, /<meta name="robots" content="noindex, nofollow">/, relativePath);
      assert.doesNotMatch(html, /<link rel="canonical"/, relativePath);
    } else {
      assert.match(html, /<link rel="canonical" href="https:\/\/vibe-agi\.github\.io\/[^"]*">/, relativePath);
    }
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, relativePath);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, relativePath);
    assert.doesNotMatch(html, /undefined|\[object Object\]/, relativePath);
  }
});

test("all generated internal links and document assets resolve", async () => {
  const generated = new Set(await filesUnder(dist));

  for (const relativePath of expectedPages) {
    const html = await read(relativePath);
    const references = matches(html, /<(?:a|img|script|link)\b[^>]*(?:href|src)="([^"]+)"/g);

    for (const reference of references) {
      if (reference.startsWith("#") || reference.startsWith("mailto:")) continue;
      const target = localTarget(reference);
      if (target === undefined) continue;
      assert.ok(generated.has(target), `${relativePath}: ${reference} -> ${target}`);
    }
  }
});

test("the site loads no third-party executable, style, font, or image resources", async () => {
  const generated = await filesUnder(dist);
  const inspectable = generated.filter((file) => /\.(?:html|css|js)$/.test(file));
  const output = (await Promise.all(inspectable.map(read))).join("\n");

  assert.doesNotMatch(output, /<script\b[^>]*src="https?:/i);
  assert.doesNotMatch(output, /<img\b[^>]*src="https?:/i);
  assert.doesNotMatch(output, /<link\b[^>]*rel="stylesheet"[^>]*href="https?:/i);
  assert.doesNotMatch(output, /url\(["']?https?:/i);
  assert.doesNotMatch(output, /(?:fetch|XMLHttpRequest|sendBeacon)\s*\(/);
});

test("the home hero is a restrained code-native motion field", async () => {
  const homePages = await Promise.all([read("index.html"), read("zh/index.html")]);
  const homeOutput = homePages.join("\n");
  const generated = await filesUnder(dist);
  const styles = (
    await Promise.all(
      generated.filter((file) => file.endsWith(".css")).map(read),
    )
  ).join("\n");

  for (const html of homePages) {
    assert.equal((html.match(/<canvas\b/g) ?? []).length, 1);
    assert.match(html, /data-matrix-field/);
    assert.match(html, /requestAnimationFrame/);
    assert.match(html, /IntersectionObserver/);
    assert.match(html, /document\.hidden/);
    assert.match(html, /Math\.min\(window\.devicePixelRatio\|\|1,1\.5\)/);
  }

  assert.doesNotMatch(homeOutput, /generated_images|hero\.(?:png|jpe?g|webp)/i);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test("product pages expose the supported install and release paths", async () => {
  const expectations = [
    [
      "products/vibermate/index.html",
      "brew install --cask vibe-agi/tap/vibermate",
      "https://github.com/vibe-agi/vibermate/releases/tag/v0.1.0",
    ],
    [
      "products/hideout/index.html",
      "brew install vibe-agi/tap/hideout",
      "https://github.com/vibe-agi/hideout/releases/tag/v0.1.0-alpha.3",
    ],
  ];

  for (const [relativePath, command, release] of expectations) {
    const html = await read(relativePath);
    assert.ok(html.includes(command), relativePath);
    assert.ok(html.includes(release), relativePath);
  }
});

test("ViberMate's gallery uses five valid, full-resolution preview screenshots", async () => {
  const screenshotNames = [
    "capture-timeline.png",
    "raw-evidence.png",
    "traffic-policies.png",
    "script-library.png",
    "team-insights.png",
  ];

  for (const name of screenshotNames) {
    const relativePath = `images/vibermate/${name}`;
    const filePath = path.join(dist, relativePath);
    const image = await readFile(filePath);
    const details = await stat(filePath);

    assert.deepEqual(image.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), name);
    assert.equal(image.readUInt32BE(16), 4018, `${name} width`);
    assert.equal(image.readUInt32BE(20), 2244, `${name} height`);
    assert.ok(details.size > 500_000, `${name} should retain the supplied screenshot detail`);
  }

  for (const relativePath of [
    "products/vibermate/index.html",
    "zh/products/vibermate/index.html",
  ]) {
    const html = await read(relativePath);
    assert.equal((html.match(/<img\b[^>]*\/images\/vibermate\//g) ?? []).length, 5, relativePath);
    assert.equal((html.match(/loading="lazy"/g) ?? []).length, 5, relativePath);
    assert.match(html, /Deterministic preview data|确定性预览数据/, relativePath);
  }
});

test("the sitemap contains all public pages and no 404 or parked products", async () => {
  const sitemap = await read("sitemap-0.xml");
  const locations = matches(sitemap, /<loc>([^<]+)<\/loc>/g).sort();

  assert.deepEqual(locations, [
    `${siteOrigin}/`,
    `${siteOrigin}/products/hideout/`,
    `${siteOrigin}/products/vibermate/`,
    `${siteOrigin}/zh/`,
    `${siteOrigin}/zh/products/hideout/`,
    `${siteOrigin}/zh/products/vibermate/`,
  ]);
  assert.doesNotMatch(sitemap, /404|human|s3disk/i);
});
