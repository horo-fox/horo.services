---
title: "Being annoyed at caching"
published: 3-4-2024
summary: "Caching is useful for usability and performance. Gone wrong it's a debugging nightmare."
---

Basically the summary says my thoughts. I don't have much of an opinion here, though I did have this once where I debugged a codebase that pretty exclusively dealt in immutable objects and `tracemalloc` was so useful there. Imagine being able to find where your objects were changed! Without a `rr` for Python, this is pretty much the next best thing.

Also just make sure it isn't caching before doing some more detailed debugging.
