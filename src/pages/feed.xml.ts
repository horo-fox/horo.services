import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
    if (!site) {
        console.error("missing site key");
        return new Response("missing site key");
    }

    const journal = await getCollection("journal");

    return rss({
        site,
        title: "Horo&#8217;s journal",
        description: "Horo explores stuff",
        items: await Promise.all(
            journal
                .sort(
                    (a, b) =>
                        b.data.published.getTime() - a.data.published.getTime(),
                )
                .map(async (post) => ({
                    title: post.data.title,
                    pubDate: post.data.published,
                    description: post.data.summary,
                    link: `/journal/${post.slug}/`,
                    // TODO: use Astro's Container API to render the post and then add it as `content` here.
                })),
        ),
    });
};
