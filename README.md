# Vibe AGI website

The bilingual product site for [Vibe AGI](https://github.com/vibe-agi), built
as a static Astro site and deployed to GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

Run the same checks used in CI:

```sh
npm test
```

Product names, release links, install commands, and localized copy live in
`src/data/products.ts`. Adding a public product there makes the shared product
components available to both language routes.
