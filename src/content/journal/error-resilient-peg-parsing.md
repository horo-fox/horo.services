---
title: "Is error-resilient PEG parsing possible?"
published: 1-10-2024
summary: "Recent thoughts about adding error resilience to a PEG parser."
quality: 2
---

I've been reading matklad's [Resilient LL Parsing](https://matklad.github.io/2023/05/21/resilient-ll-parsing-tutorial.html) and looking at [swift-syntax](https://github.com/apple/swift-syntax) but both seem to... IDK, approach error resilience by trying as hard as possible to fill in the current object, preventing parsing failures.

However, PEG parsing relies on parsing failures to parse things. I don't immediately see how this can be applied given that. Maybe to special case PEG parsers that are more LL(1)? But that's not satisfying to me.

I don't have a solution. Here's some ideas I've been considering:

1. Parse without error resilience, then if all paths fail then take the one that went the "furthest" with error resilience. If there's a tie then probably just go with the first parse option. This seems to be a good idea for prefix-related mistakes (so like, `def () -> None print("haiii")` or `[3, 4 a = 4`), especially when combined with swift-syntax style token precedence (e.g. you cannot parse past punctuation looking for an identifier). But this doesn't seem like a very good idea for suffix-related mistakes (`b = 5, 6]`). I think this might be an acceptable tradeoff for programming where we mostly write left-to-right.
2. Just skip the current token instead.

I think 1. is an acceptable approach for my application. But I haven't implemented it so maybe I'll come back here talking about how it's a bad idea.
