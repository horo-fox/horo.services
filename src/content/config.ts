import { defineCollection, z } from "astro:content";

const journalCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        published: z.preprocess(
            (arg) => (typeof arg === "string" ? new Date(arg) : undefined),
            z.date(),
        ),
        summary: z.string(),
    }),
});

const projectCollection = defineCollection({
    type: "content",
    schema: z.object({
        // todo: decide on these when making a project
        // title: z.string(),
        // published: z.preprocess(arg => typeof arg === "string" ? new Date(arg) : undefined, z.date()),
        // summary: z.string(),
    }),
});

export const collections = {
    journal: journalCollection,
    projects: projectCollection,
};
