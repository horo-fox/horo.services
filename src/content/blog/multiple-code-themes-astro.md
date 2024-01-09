---
title: "Multiple code themes for Astro"
published: 1-8-2024
summary: "How to set up multiple color schemes in Astro"
---

As of [my PR](https://github.com/withastro/astro/pull/8903) landing in Astro, you are now able to have light/dark themes for code! This all uses [shikiji's Dual themes](https://shikiji.netlify.app/guide/dual-themes).

Here's how you do it:

1. in your `astro.config.ts`, provide the themes and their names:

```ts
export default defineConfig({
    markdown: {
        shikiConfig: {
            experimentalThemes: {
                light: "github-light",
                dark: "github-dark",
            },
        },
    },
});
```

NOTE: you need to use the name `light` for the default theme. See [shikiji's docs](https://shikiji.netlify.app/guide/dual-themes) for more information!

2. in your global CSS, make your site use the alternate theme when needed:

```css
@media (prefers-color-scheme: dark) {
    .astro-code,
    .astro-code span {
        color: var(--shiki-dark) !important;
        background-color: var(--shiki-dark-bg) !important;
    }
}
```

... And that's it! Feel free to switch to light/dark mode on this page to see what the result looks like. (You can switch via developer tools. Exactly how depends on your browser though.)
