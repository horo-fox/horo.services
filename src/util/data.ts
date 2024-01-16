import type { getCollection } from "astro:content";

// ref: https://frodeflaten.com/posts/adding-structured-data-to-blog-posts-using-astro/
const baseProfile = (
    image: string,
    blogPosts: Awaited<ReturnType<typeof getCollection<"blog">>>,
) => ({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
        "@id": "#horo",
        "@type": "Person",
        name: "Horo",
        agentInteractionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/WriteAction",
            userInteractionCount: blogPosts.length,
        },
        description:
            "Possibly wise fox (?) who like programming, reading, and some math.",
        image,
    },
});

export const blogPost = (
    blogPost: Awaited<ReturnType<typeof getCollection<"blog">>>[number],
) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
        "@type": "Person",
        name: "Horo",
        sameAs: "https://horo.services",
    },
    datePublished: blogPost.data.published,
    // todo: date modified ...?
    headline: blogPost.data.title,
});

export const profile = (
    image: string,
    blogPosts: Awaited<ReturnType<typeof getCollection<"blog">>>,
) => ({
    ...baseProfile(image, blogPosts),
    hasPart: blogPosts
        .map((post) => blogPost(post))
        .map((post) => ({
            ...post,
            author: {
                "@id": "#horo",
            },
        })),
});
