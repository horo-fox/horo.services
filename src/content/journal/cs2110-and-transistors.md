---
title: "Interesting bits from CS2110's lab"
published: 1-22-2024
summary: "Making and, nand, and not gates from transistors"
---

Making a not gate takes two transistors. A P-type transistor next to power and an N-type transistor next to on ground. Both of then take in the signal we want to not. The other side pins (I don't know terminology) are connected and go out to the output.

An and gate, interestingly, consists of a not gate attached to a nand gate.

A nand gate is like the not gate except there's an equal amount of N-type and P-type transistors to the input. All the P-type transistors are put in parallel and all the N-type transistors are put in series. Each input gets their own respective N-type and P-type transistor.

This doesn't really have much information but I though this was cool so I wanted to write about it.
