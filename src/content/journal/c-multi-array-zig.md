---
title: "Making C array pointers for C interop in Zig"
published: 1-16-2024
summary: "There's this one easy solution I've found for C array pointers in Zig."
---

`[*c]type` arrays are the death of me. I just spent way too much time figuring one out. The solution? `@intFromPtr(your array)`. It seems to work very well. At least when building the application.

I'm not quite sure this works though.

---

Future horo here! So, that didn't work. I then tried `@constCast`. That compiled but ALSO didn't work; the library I'm using tries to set an attribute and that's not guaranteed to work on a const pointer.

The future ended up being to seperate out things and then using `var` for the variables that I ended up referencing via `&`. Then, zig did some automatic magic and it all worked. No casting required!
