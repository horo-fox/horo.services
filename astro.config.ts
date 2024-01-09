import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), sitemap()],
    markdown: {
        rehypePlugins: [
            () => (tree, file) => {
                const slugger = new GithubSlugger();

                visit(tree, "element", (elem) => {
                    if (["h2", "h3", "h4", "h5", "h6"].includes(elem.tagName)) {
                        // add a <a href=id></a>
                        if (elem.children[0]?.type !== "text") {
                            file.message(
                                "element does not have text child",
                                elem,
                            );
                            return;
                        }

                        const id = slugger.slug(elem.children[0].value);
                        if (!elem.properties) {
                            elem.properties = {};
                        }

                        elem.properties.id = id;
                        elem.children.unshift({
                            type: "element",
                            tagName: "a",
                            properties: {
                                href: `#${id}`,
                            },
                            children: [
                                {
                                    type: "text",
                                    value: "# ",
                                },
                            ],
                        });
                    }
                });
            },
        ],
        shikiConfig: {
            experimentalThemes: {
                light: "github-light",
                dark: "github-dark",
            },
        },
    },
    site: "https://horo.services",
    scopedStyleStrategy: "class",
    build: {
        assets: "static",
    },
    devToolbar: {
        enabled: false,
    },
});
