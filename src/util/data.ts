import type { getCollection } from "astro:content";

const baseProfile = (
    image: string,
    journalEntries: Awaited<ReturnType<typeof getCollection<"journal">>>,
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
            userInteractionCount: journalEntries.length,
        },
        description:
            "Possibly wise fox (?) who like programming, reading, and some math.",
        image,
    },
});

export const journalEntry = (
    journalEntry: Awaited<ReturnType<typeof getCollection<"journal">>>[number],
) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
        "@type": "Person",
        name: "Horo",
        sameAs: "https://horo.services",
    },
    datePublished: journalEntry.data.published,
    // todo: date modified ...?
    headline: journalEntry.data.title,
});

export const profile = (
    image: string,
    journalEntries: Awaited<ReturnType<typeof getCollection<"journal">>>,
) => ({
    ...baseProfile(image, journalEntries),
    hasPart: journalEntries
        .map((post) => journalEntry(post))
        .map((post) => ({
            ...post,
            author: {
                "@id": "#horo",
            },
        })),
});
