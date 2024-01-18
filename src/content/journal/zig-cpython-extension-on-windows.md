---
title: "CPython extension module made in Zig, on Windows"
published: 1-18-2024
summary: "Making a sample CPython extension in Zig that works on Windows"
quality: 3
---

Making a CPython extension in Zig is a combination of both a special `build.zig` and some annoying picky code in whatever file you want. This is a followup to [Making C array pointers for C interop in Zig](/posts/c-multi-array-zig/).

```zig
const std = @import("std");
const relative_path = std.Build.LazyPath.relative;

pub fn build(b: *std.Build) !void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    if (b.option([]const u8, "python-exe", "Python executable to build for")) |python| {
        const libexample = b.addSharedLibrary(.{
            .name = "example",
            .root_source_file = relative_path("src/example.zig"),
            .target = target,
            .optimize = optimize,
        });

        var res = try std.process.Child.run(.{
            .allocator = b.allocator,
            .argv = &.{ python, "-c", "import sysconfig; print(sysconfig.get_path('include'), end='')"}
        });

        libexample.root_module.addIncludePath(.{.cwd_relative = res.stdout});
        libexample.linkLibC();
        b.allocator.free(res.stdout);
        b.allocator.free(res.stderr);

        res = try std.process.Child.run(.{
            .allocator = b.allocator,
            .argv = &.{ python, "-c", "import sysconfig; print(sysconfig.get_path('data'), end='')"}
        });

        // possibly windows-only
        libexample.root_module.addObjectFile(.{.cwd_relative = b.pathJoin(&.{res.stdout, "libs", "python3.lib"})});
        b.installArtifact(libexample);
        b.allocator.free(res.stdout);
        b.allocator.free(res.stderr);
    } else {
        @panic("snipped");
    }
}
```

Here's a couple choice points:

-   `addIncludePath` to allow us to see Python's header files
-   `addObjectFile` because we need to link against `<python>/libs/python3.lib` to make a DLL. This seems to be just required on Windows, but I haven't made an extension on Linux yet so not entirely sure.
-   Note that this explicitly references `src/example.zig` -- that's what determines the name for the next step.

Then, you have this file as `example.zig` in your `src` folder:

```zig
const py = @cImport({
    @cDefine("PY_SSIZE_T_CLEAN", {});
    @cInclude("Python.h");
});

const module_base = py.PyModuleDef_Base{ .ob_base = py.PyObject{ .ob_refcnt = 1, .ob_type = null } };

var methods = [_:py.PyMethodDef{}]py.PyMethodDef{};

var module = py.PyModuleDef{
    .m_base = module_base,
    .m_name = "example",
    .m_doc = null,
    .m_size = -1,
    .m_methods = &methods,
};

export fn PyInit_example() callconv(.C) *py.PyObject {
    return py.PyModule_Create(&module);
}
```

More choice points:

-   `var` is required because otherwise Zig will put these structs in some read-only memory as far as I can tell. This is a problem because CPython tries to set `ob_refcnt` to `1` (in case you messed up, I guess).
-   This will probably only build against CPython 3.11. While it can be imported on CPython 3.12, building against CPython 3.12 requires replacing `.ob_refcnt = 1` with `.unnamed_0 = { .ob_refcnt = 1 }`. I assume there's been other changes in building against earlier versions too. You can find `cimport.zig` in your `zig-cache/` folder to look at the structure so you can fix things up.

Now, to build it:

```sh
$ mkdir empty
$ ./zig build -Dpython-exe=python ; cp ./zig-out/lib/example.dll empty/example.pyd
$ cd empty
$ python -c "import example; print(dir(example))"
['__doc__', '__file__', '__loader__', '__name__', '__package__', '__spec__']
```

Hopefully that works! That's what worked for me at least.

Next steps:

-   Making it build on Unix
-   Making a wheel and sdist
    -   Wheel should be cross-compiled for all systems
    -   sdist should be able to pull in Zig and build for local system
