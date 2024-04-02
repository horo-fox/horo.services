---
title: "Things should fail loudly!"
published: 4-1-2024
summary: "A Python user talking about how they dislike JS"
---

I really don't like JavaScript's tendency to fail quietly. I understand the rationale: broken webpages are everywhere. But something about the pervasiveness of `undefined` just hurts me.

Let's compare two possible approaches for handling external data:

-   throwing it into an unstructured blob and going through that
-   converting it via a schema

JavaScript seems to go with the first. It sucks. Special syntax for property access, conveniences for unexpected data, type coersion, etc.

I don't have much of a point beyond that, because I do have a soft spot for TypeScript. I don't hate JavaScript as much as I probably should, and I use it for projects and I am fine poking at it for frontend development. Heck, I think CSS is scarier! But I do dislike how JavaScript lets errors pass silently.
