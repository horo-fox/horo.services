---
title: "Interesting use cases for `uv`"
published: 2-15-2024
summary: "First reaction to `uv` and uses of it"
---

So `uv` is a thing now. Better Python packaging, maybe? Personally its use as a `pip-compile` alternative is most convincing to me. While I've seen `pipgrip` already, I have more hope that `uv` is better.

Here's two use cases where it seems pretty useful:

- Generating a lockfile for an arbitrary Python version. (I sure hope it errors if it hits any sdists in this mode)
- Running tests against the minimum version of your dependencies.
