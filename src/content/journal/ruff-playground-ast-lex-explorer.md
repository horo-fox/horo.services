---
title: "Online playground to inspect (a form of) Python AST and tokenized source"
published: 2-12-2024
summary: "Ruff's playground lets you explore the AST of some Python code"
---

[Ruff's playground](https://play.ruff.rs/) has a view for the tokenized source code for some Python and a view for the AST version of some Python.

This proved useful for me because I was having trouble making the builtin `tokenize` module do its thing (for some reason it wasn't parsing f-strings? probably my issue). It's more convenient then making sure I have the same Python version as someone else and then using `ast.parse`, ... maybe.

But it's at least something to keep in mind.
