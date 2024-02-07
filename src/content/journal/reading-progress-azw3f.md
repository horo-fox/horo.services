---
title: "Finding reading progress in AZW3F"
published: 1-30-2024
summary: "Where is reading progress stored? And in what units? I investigate."
---

This is a followup to [Decoding AZW3F and AZW3R](/journal/decoding-azw3f-azw3r/).

The reason I wanted to parse these files was to find the current reading progress for books. It looks like that's in the AZW3F file. Here's a copy of what I parsed last time:

```
[Values("timer.model", [Int(0), Int(16738451), Int(109283), Float(1.8871635610765867), Values("timer.average.calculator", [SmallInt(0), SmallInt(0), SmallInt(3), Values("timer.average.calculator.distribution.normal", [Int(639), Float(237857.9505740977), Float(94780047.88265847)]), Values("timer.average.calculator.distribution.normal", [Int(276), Float(150799.6752729375), Float(82640001.87330134)]), Values("timer.average.calculator.distribution.normal", [Int(262), Float(184262.58597161673), Float(131210271.94133678)]), SmallInt(1), Values("timer.average.calculator.outliers", [SmallInt(3), Float(887.2608872608872), Float(887.9093198992442), Float(888.1469115191986)])])]), Values("fpr", [String("432748"), Int(18446744073709551615), Int(18446744073709551615), String(""), String("")]), Values("book.info.store", [Int(166078), Float(2.8623188405796807)]), Values("page.history.store", [SmallInt(1), Values("page.history.record", [String("432748"), Int(1704109617639)])]), Values("whisperstore.migration.status", [Boolean(false), Boolean(false)]), Values("lpr", [Byte(2), String("432748"), Int(1704109617543)])]
```

Making that more legible:

1. `timer.model`
2. `fpr`

    - location?
    - the rest are weird

3. `book.info.store`
4. `page.history.store`

    - some integer
    - `page.history.record` with:
        - location?
        - unix timestamp in milliseconds

5. `whisperstore.migration.status`
6. `lpr`
    - some byte
    - location?
    - unix timestamp in milliseconds

```
[Values("timer.model", [Int(0), Int(16738451), Int(109283), Float(1.8871635610765867), Values("timer.average.calculator", [SmallInt(0), SmallInt(0), SmallInt(3), Values("timer.average.calculator.distribution.normal", [Int(639), Float(237857.9505740977), Float(94780047.88265847)]), Values("timer.average.calculator.distribution.normal", [Int(276), Float(150799.6752729375), Float(82640001.87330134)]), Values("timer.average.calculator.distribution.normal", [Int(265), Float(186925.90309029608), Float(133574691.72020479)]), SmallInt(0)])]), Values("fpr", [String("432748"), Int(18446744073709551615), Int(18446744073709551615), String(""), String("")]), Values("book.info.store", [Int(166098), Float(2.8647342995168787)]), Values("page.history.store", [SmallInt(1), Values("page.history.record", [String("432748"), Int(1706679607926)])]), Values("whisperstore.migration.status", [Boolean(false), Boolean(false)]), Values("lpr", [Byte(2), String("431264"), Int(1706679660866)])]
```

Now, if I open up my book and go one page back, the location under `lpr` changes to become 431264. The location under `fpr` stays the same ("furthest page read"?) and the location under `page.history.record` stays the same. Also the timestamp under `lpr` becomes when I change the page (give or take a bit: it's about 4 minutes ago but it took some time to get the file over and parse it and everything, so close enough).

The difference of about 1500 is hard to explain as the page I moved back to is about 120 characters (I counted quickly, so give or take a few) including spaces. ... OH! According to [the MobileRead wiki](https://wiki.mobileread.com/wiki/Page_numbers#Implementation):

> The Kindle uses an absolute position system named locations which are actually every 150 bytes in the file.

Given that the location marker on the page advances 9 when I advance the page I went back on, this works out to roughly 9 \* 150 which is roughly 1500. Looks like the location is the number of bytes!
