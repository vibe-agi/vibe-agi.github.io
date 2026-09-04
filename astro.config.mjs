import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://vibe-agi.github.io",
  trailingSlash: "always",
  integrations: [sitemap()],
});
