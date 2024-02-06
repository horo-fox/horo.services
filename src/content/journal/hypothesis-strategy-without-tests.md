---
title: "Generating elements using a Hypothesis strategy without running them in tests"
published: 2-5-2024
summary: "Get elements for fuzzing or look at the strategy."
---

Quick journal entry cause I had lots of homework today. Here's how to get elements from a Hypothesis strategy:

```python
>>> import hypothesis
>>> hypothesis.strategies.booleans().example()
True
>>> hypothesis.strategies.booleans().example()
False
```

Anyways that's all.
