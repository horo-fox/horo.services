---
title: "Making wheels for CPython extensions made in Zig"
published: 2-26-2024
summary: "The broad strokes of making a wheel for a CPython extension made in Zig"
---

Basically, a wheel is a zipfile containing two things:

-   the package
-   the metadata

The package is easy: just put your `example.pyd` at the top level. On the other hand, the metadata is trickier.

`example-0.1.0.dist-info/WHEEL` contains basic wheel metadata [as detailed in the spec](https://packaging.python.org/en/latest/specifications/binary-distribution-format/#file-contents), though note that `Root-Is-Purelib` is `false` as far as I know.

`example-0.1.0.dist-info/METADATA` contains metadata [detailed in another specification](https://packaging.python.org/en/latest/specifications/core-metadata/).

Finally, `example-0.1.0.dist-info/RECORD` contains a list of all files in the zip file, in the format `[relative path],sha256=[sha256 hash],[length of file]`, except for `RECORD` itself which is `[relative path],,`.

And thats it!
