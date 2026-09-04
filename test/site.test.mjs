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
const verificationFiles = ["google7e0612a67505c1a7.html"];

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

function jsonLd(html) {
  return matches(
    html,
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  ).map((value) => JSON.parse(value));
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
  assert.deepEqual(htmlFiles, [...expectedPages, ...verificationFiles].sort());

  const allHtml = await Promise.all(htmlFiles.map(read));
  const output = allHtml.join("\n");
  assert.doesNotMatch(output, /\/products\/(?:human|s3disk)\//i);
  assert.doesNotMatch(output, />\s*(?:Human|s3disk)\s*</);
});

test("the Google Search Console ownership token is published verbatim", async () => {
  assert.equal(
    await read("google7e0612a67505c1a7.html"),
    "google-site-verification: google7e0612a67505c1a7.html\n",
  );
});

test("every page has complete language, metadata, and document landmarks", async () => {
  for (const relativePath of expectedPages) {
    const html = await read(relativePath);
    const expectedLanguage = relativePath.startsWith("zh/") ? "zh-CN" : "en";

    assert.match(html, new RegExp(`<html lang="${expectedLanguage}"`), relativePath);
    assert.match(html, /<title>[^<]+<\/title>/, relativePath);
    assert.match(html, /<meta name="description" content="[^"]+">/, relativePath);
    assert.match(html, /<link rel="sitemap" href="\/sitemap-index\.xml">/, relativePath);
    if (relativePath === "404.html") {
      assert.match(html, /<meta name="robots" content="noindex, nofollow">/, relativePath);
      assert.doesNotMatch(html, /<link rel="canonical"/, relativePath);
    } else {
      assert.match(html, /<link rel="canonical" href="https:\/\/vibe-agi\.github\.io\/[^"]*">/, relativePath);
      assert.match(
        html,
        /<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">/,
        relativePath,
      );
    }
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, relativePath);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, relativePath);
    assert.doesNotMatch(html, /undefined|\[object Object\]/, relativePath);
  }
});

test("language alternates form reciprocal canonical clusters", async () => {
  const pairs = [
    [
      "index.html",
      "zh/index.html",
      "https://vibe-agi.github.io/",
      "https://vibe-agi.github.io/zh/",
    ],
    [
      "products/vibermate/index.html",
      "zh/products/vibermate/index.html",
      "https://vibe-agi.github.io/products/vibermate/",
      "https://vibe-agi.github.io/zh/products/vibermate/",
    ],
    [
      "products/hideout/index.html",
      "zh/products/hideout/index.html",
      "https://vibe-agi.github.io/products/hideout/",
      "https://vibe-agi.github.io/zh/products/hideout/",
    ],
  ];

  for (const [englishPath, chinesePath, englishUrl, chineseUrl] of pairs) {
    const [english, chinese] = await Promise.all([
      read(englishPath),
      read(chinesePath),
    ]);
    for (const html of [english, chinese]) {
      assert.ok(html.includes('hreflang="en" href="' + englishUrl + '"'));
      assert.ok(html.includes('hreflang="zh-CN" href="' + chineseUrl + '"'));
      assert.ok(html.includes('hreflang="x-default" href="' + englishUrl + '"'));
    }
  }
});

test("the generated sitemap exposes every bilingual URL and its alternate", async () => {
  const sitemap = await read("sitemap-0.xml");
  const pairs = [
    ["https://vibe-agi.github.io/", "https://vibe-agi.github.io/zh/"],
    [
      "https://vibe-agi.github.io/products/vibermate/",
      "https://vibe-agi.github.io/zh/products/vibermate/",
    ],
    [
      "https://vibe-agi.github.io/products/hideout/",
      "https://vibe-agi.github.io/zh/products/hideout/",
    ],
  ];

  assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 6);
  assert.equal((sitemap.match(/<xhtml:link\b/g) ?? []).length, 12);
  for (const [englishUrl, chineseUrl] of pairs) {
    assert.ok(sitemap.includes(`<loc>${englishUrl}</loc>`));
    assert.ok(sitemap.includes(`<loc>${chineseUrl}</loc>`));
    assert.ok(sitemap.includes(`hreflang="en" href="${englishUrl}"`));
    assert.ok(sitemap.includes(`hreflang="zh-CN" href="${chineseUrl}"`));
  }
});

test("search engines receive truthful site, software, and breadcrumb data", async () => {
  const home = await read("index.html");
  const [homeData] = jsonLd(home);
  assert.ok(homeData);
  const homeTypes = new Set(
    homeData["@graph"].map((entry) => entry["@type"]),
  );
  assert.deepEqual(homeTypes, new Set(["Organization", "WebSite"]));

  for (const [relativePath, name, version, screenshotCount] of [
    ["products/vibermate/index.html", "ViberMate", "0.1.1", 5],
    ["products/hideout/index.html", "Hideout", "0.1.0-alpha.3", 0],
  ]) {
    const html = await read(relativePath);
    const [data] = jsonLd(html);
    assert.ok(data, relativePath);
    const software = data["@graph"].find(
      (entry) => entry["@type"] === "SoftwareApplication",
    );
    const breadcrumb = data["@graph"].find(
      (entry) => entry["@type"] === "BreadcrumbList",
    );
    assert.equal(software.name, name);
    assert.equal(software.softwareVersion, version);
    assert.equal(software.offers.price, "0");
    assert.equal(software.offers.priceCurrency, "USD");
    assert.equal(software.isAccessibleForFree, true);
    assert.equal(software.screenshot?.length ?? 0, screenshotCount);
    assert.equal(breadcrumb.itemListElement.at(-1).name, name);
    assert.doesNotMatch(JSON.stringify(data), /aggregateRating|reviewCount/);
  }
});

test("ViberMate pages expose a crawlable large social preview", async () => {
  for (const relativePath of [
    "products/vibermate/index.html",
    "zh/products/vibermate/index.html",
  ]) {
    const html = await read(relativePath);
    assert.match(
      html,
      /<meta property="og:image" content="https:\/\/vibe-agi\.github\.io\/images\/vibermate\/capture-timeline-2400\.webp">/,
    );
    assert.match(html, /<meta property="og:image:width" content="2400">/);
    assert.match(html, /<meta property="og:image:height" content="1341">/);
    assert.match(
      html,
      /<meta name="twitter:card" content="summary_large_image">/,
    );
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

test("the organization mark stays distinct from the official ViberMate app icon", async () => {
  const [home, vibermate, hideout, icon] = await Promise.all([
    read("index.html"),
    read("products/vibermate/index.html"),
    read("products/hideout/index.html"),
    read("brands/vibermate-app-icon.svg"),
  ]);

  assert.equal((home.match(/\/brands\/vibermate-app-icon\.svg/g) ?? []).length, 1);
  assert.equal((vibermate.match(/\/brands\/vibermate-app-icon\.svg/g) ?? []).length, 1);
  assert.doesNotMatch(hideout, /\/brands\/vibermate-app-icon\.svg/);

  const header = home.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
  assert.doesNotMatch(header, /vibermate-app-icon|brand-mark/);
  for (const color of ["#18314B", "#0B1D30", "#62DCC7", "#70B9EE", "#FFB627"]) {
    assert.ok(icon.includes(color), `official ViberMate color ${color}`);
  }
});

test("the home page presents two standalone products above the fold", async () => {
  for (const relativePath of ["index.html", "zh/index.html"]) {
    const html = await read(relativePath);
    const hero = html.match(/<section\b[^>]*class="hero-stage"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";
    assert.equal((hero.match(/class="product-choice /g) ?? []).length, 2);
    assert.match(hero, /Standalone product|独立产品/);
    assert.match(hero, /ViberMate/);
    assert.match(hero, /Hideout/);
    assert.doesNotMatch(hero, /Two boundaries|两层边界/);
  }
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
      "https://github.com/vibe-agi/vibermate/releases/tag/v0.1.1",
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

function lossyWebPDimensions(image) {
  assert.equal(image.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(image.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(image.subarray(12, 16).toString("ascii"), "VP8 ");
  assert.deepEqual(image.subarray(23, 26), Buffer.from([0x9d, 0x01, 0x2a]));
  return {
    width: image.readUInt16LE(26) & 0x3fff,
    height: image.readUInt16LE(28) & 0x3fff,
  };
}

test("ViberMate's gallery uses responsive, bounded WebP screenshots", async () => {
  const screenshotNames = [
    "capture-timeline",
    "raw-evidence",
    "traffic-policies",
    "script-library",
    "team-insights",
  ];

  for (const name of screenshotNames) {
    for (const [suffix, width, height, maximumBytes] of [
      ["1280", 1280, 715, 80_000],
      ["2400", 2400, 1341, 180_000],
    ]) {
      const relativePath = `images/vibermate/${name}-${suffix}.webp`;
      const filePath = path.join(dist, relativePath);
      const image = await readFile(filePath);
      const details = await stat(filePath);
      assert.deepEqual(lossyWebPDimensions(image), { width, height }, relativePath);
      assert.ok(details.size > 20_000, `${relativePath} should retain UI detail`);
      assert.ok(details.size < maximumBytes, `${relativePath} should stay lightweight`);
    }
  }

  for (const relativePath of [
    "products/vibermate/index.html",
    "zh/products/vibermate/index.html",
  ]) {
    const html = await read(relativePath);
    assert.equal((html.match(/<img\b[^>]*\/images\/vibermate\/[^>]*-1280\.webp/g) ?? []).length, 5, relativePath);
    assert.equal((html.match(/srcset="[^"]*-1280\.webp 1280w, [^"]*-2400\.webp 2400w"/g) ?? []).length, 5, relativePath);
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
