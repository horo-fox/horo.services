---
title: "Representing a syntax tree"
published: 2-13-2024
summary: "A couple ways to represent syntax"
---

I've been thinking about how to represent concrete Python syntax. I've seen two approaches to this:

-   `rust-analyzer` makes an ad-hoc tree: every node consists of a type and a vec of children.
-   swift syntax makes a more structured tree. It has wrapper types around `SyntaxData` that store a number of fields. Essentially, these nodes store trivia before, trivia after, trivia before the first token, trivia after the last token, and trivia between every (fixed) token.

I personally prefer the swift syntax approach as it feels more formal to me. I don't want to fishing in a sea of attributes trying to find one that means something, though I imagine that too could work. It looks like swiftsyntax has some raw vs finished node seperation. I don't really see why.

One thing I notice is that I'm going to need a lot more nodes. For example, `(x,)` is at _least_ 3 nodes. But I can probably have some sort of higher level interface.
