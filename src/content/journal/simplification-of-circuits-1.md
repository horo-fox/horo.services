---
title: "Minimizing boolean expressions using e-graphs"
published: 1-23-2024
summary: "Decreasing transistor counts by turning expressions into their equivalents."
---

I've been thinking about superoptimizers recently. I really wanted a use case for [egg](https://egraphs-good.github.io/) and then in class today we covered making a circuit from a truth table (turning it into sum-of-product form) and then simplifying it down to minimize transistor counts (and depth). I remember seeing some talk about minimizers elsewhere but I wanted to try making my own!

... Anyways, that seemingly worked. It only has a few rules it knows about (nand, nor definition, double negation, and demorgan's) but it seemingly works well for those. It's not exactly useful due to my laziness and not implementing n-ary or.

Here's usage and the output:

```rust
fn main() {
    let original = "(not (not (not a)))";
    let (final_cost, final_expr) = simplify(original);
    println!("{} -> {} (transistor cost became {})", original, final_expr, final_cost);
}
```

```
(not (not (not a))) -> (not a) (transistor cost became 2)
```

Anyways, I won't post the code now because it doesn't work for most things and IDK if this might be a project assigned eventually.

Future improvements for a future journal entry:

- multiple outputs? (IDK how this would work)
- n-ary `and` and `or` -- I have the basics set up but the searches and appliers would require a custom trait impl and I was just kinda lazy.
