---
title: "Getting a string argument in a Zig CPython extension"
published: 1-31-2024
summary: "Weird magic dance you have to go through to parse out a string from the arguments."
---

I spent the last few hours working on my CPython extension so nothing cool to talk about. So! Here's a weird thing I had to do:

```zig
fn whatever(self: [*c]cpython.PyObject, args: [*c]cpython.PyObject) callconv(.C) ?*cpython.PyObject {
    _ = self;
    var string: [*:0]u8 = undefined;
    if (cpython.PyArg_ParseTuple(args, "s", &string) == 0) {
        return null;
    }
    // ...
    const real_string = std.mem.sliceTo(string, 0);
    // ...
}
```

That's essentially it. It kinda sucks but whatever. I was using `var string = "";` and it just wasn't working. Maybe this will help someone else out who is in my situation!
