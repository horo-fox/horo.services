---
title: "Making C array pointers for C interop in Zig"
published: 1-16-2024
summary: "There's this one easy solution I've found for C array pointers in Zig."
---

`[*c]type` arrays are the death of me. I just spent way too much time figuring one out. The solution? `@intFromPtr(your array)`. It seems to work very well. At least when building the application.

I haven't actually tested this works at runtime yet.
