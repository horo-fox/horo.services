---
title: "How to do backtracking and array-backed ASTs?"
published: 3-6-2024
summary: "An observation that seems to make array-backed ASTs viable for backtracking grammars"
---

I've wanted to make a parser for Python that spits outs an AST backed by an array like Zig's AST. The main trouble is that Python's grammar requires backtracking. I think the solution is to split the parsing into two phases: pre-commit (which is cached) and committing (which isn't). This should also make packrat parsing more memory efficient cause I'm storing just a bit per token, though that will likely end up a bool per token rather than a bitvec. (Actually, it might be 2 bits per token? I need to think about this more.)
