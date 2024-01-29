---
title: "Decoding AZW3F and AZW3R"
published: 1-29-2024
summary: "Binary format for book metadata for Amazon's AZW3 format"
quality: 3
---

Yes, I know KFX is a thing nowadays and AZW3 is dumb and old. But I have AZW3 books on my Kindle so I have to take what I'm given!

Anyways from the start, I'm assuming this is a TLV-style format. And looking at it more, it does seem that way for arrays at least:

-   `FE` is the tag for an array
-   `1` means the name is zero size, otherwise continue
-   big endian `u16` for name size
-   followed by size bytes which is the array's name
-   this is followed by any number of values, ending with a `FF` tag

String values seem to be represented as such:

-   `03` as a tag
-   `1` means stop and this is zero length, otherwise continue
-   big endian `u16` for size
-   followed by size bytes which is that string's contents

The overall file seems to consistently start with:

```
00 00 00 00 00 1A B1 26 02 00 00 00 00 00 00 00 01 01
```

Followed by a big endian `u32` which is the number of values.

Smaller integer values seem to be represented as such:

-   `01` as a tag
-   big endian `u32`

Integer values seem to be as such:

-   `02` as a tag
-   big endian `u64`

I'm pretty sure these are floats? (based on looking things up etc.)

-   `04` as tag
-   `f64`

When making a parser for this, I encounted a tag `0`:

-   `00` as tag
-   presumably `00` for false and `01` for true

I also found `7`:

-   `07` as a tag
-   single byte

Here's what an azw3r file looks like when parsed:

```
[Values("font.prefs", [String("_INVALID_,und:bookerly"), SmallInt(1), SmallInt(7), SmallInt(1), SmallInt(65), SmallInt(82), SmallInt(0), SmallInt(82), SmallInt(0), SmallInt(0), String(""), SmallInt(4294967295), String(""), Boolean(false), String("")]), Values("next.in.series.info.data", [String("")]), Values("annotation.cache.object", [SmallInt(0)]), Values("ReaderMetrics", [SmallInt(1), String("booklaunchedbefore"), String("true")])]
```

Here's what an azw3f file looks like when parsed:

```
[Values("timer.model", [Int(0), Int(16738451), Int(109283), Float(1.8871635610765867), Values("timer.average.calculator", [SmallInt(0), SmallInt(0), SmallInt(3), Values("timer.average.calculator.distribution.normal", [Int(639), Float(237857.9505740977), Float(94780047.88265847)]), Values("timer.average.calculator.distribution.normal", [Int(276), Float(150799.6752729375), Float(82640001.87330134)]), Values("timer.average.calculator.distribution.normal", [Int(262), Float(184262.58597161673), Float(131210271.94133678)]), SmallInt(1), Values("timer.average.calculator.outliers", [SmallInt(3), Float(887.2608872608872), Float(887.9093198992442), Float(888.1469115191986)])])]), Values("fpr", [String("432748"), Int(18446744073709551615), Int(18446744073709551615), String(""), String("")]), Values("book.info.store", [Int(166078), Float(2.8623188405796807)]), Values("page.history.store", [SmallInt(1), Values("page.history.record", [String("432748"), Int(1704109617639)])]), Values("whisperstore.migration.status", [Boolean(false), Boolean(false)]), Values("lpr", [Byte(2), String("432748"), Int(1704109617543)])]
```

Now I just have to interpret these blocks of data! Note: about halfway through this I found <https://www.mobileread.com/forums/showthread.php?t=322172> which I referenced for proper ways to deal with value arrays (at first I thought they were keys), bools, single bytes (supposedly they're signed. IDK), and zero length strings (the `1` after the `3` or `FE`).

<details>
<summary>Code for a parser that uses nom</summary>

```rust
use nom;
use nom::bytes::complete::{tag, take};
use nom::error;
use nom::number::complete::{f64, u16, u32, u64, u8};
use nom::number::Endianness::Big;

const HEADER: [u8; 17] = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x1A, 0xB1, 0x26, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x01,
];

fn from_bytes(bytes: &[u8]) -> nom::IResult<&[u8], Vec<Value>> {
    let (bytes, _) = tag(HEADER)(bytes)?;
    let (bytes, length) = val(bytes)?;

    let key_count = if let Value::SmallInt(num) = length {
        num
    } else {
        return Err(nom::Err::Failure(error::Error::new(
            bytes,
            error::ErrorKind::Tag,
        )));
    };

    let mut bytes = bytes;
    let mut result = Vec::new();
    for _ in 0..key_count {
        let (left, value) = val(bytes)?;
        result.push(value);
        bytes = left;
    }

    Ok((bytes, result))
}

#[derive(Debug)]
enum Value<'a> {
    EndOfValues,
    SmallInt(u32),
    Int(u64),
    Float(f64),
    String(&'a str),
    Boolean(bool),
    Values(&'a str, Vec<Value<'a>>),
    Byte(u8),
}

fn val(bytes: &[u8]) -> nom::IResult<&[u8], Value> {
    let (bytes, tag) = u8(bytes)?;

    match tag {
        1 => u32(Big)(bytes).map(|(left, right)| (left, Value::SmallInt(right))),
        3 => string(bytes).map(|(left, right)| (left, Value::String(std::str::from_utf8(right).unwrap()))),
        0 => u8(bytes)
            .map(|(left, right)| (left, Value::Boolean(if right == 0 { false } else { true }))),
        255 => Ok((bytes, Value::EndOfValues)),
        2 => u64(Big)(bytes).map(|(left, right)| (left, Value::Int(right))),
        4 => f64(Big)(bytes).map(|(left, right)| (left, Value::Float(right))),
        254 => {
            let (left, name) = string(bytes)?;
            let mut bytes = left;

            let mut result = Vec::new();
            loop {
                let (left, value) = val(bytes)?;
                bytes = left;

                match value {
                    Value::EndOfValues => {
                        break;
                    }
                    v => {
                        result.push(v);
                    }
                }
            }

            Ok((bytes, Value::Values(std::str::from_utf8(name).unwrap(), result)))
        }
        7 => u8(bytes).map(|(left, right)| (left, Value::Byte(right))),
        _ => todo!("unknown tag {}, left: {:?}", tag, bytes),
    }
}

fn string(bytes: &[u8]) -> nom::IResult<&[u8], &[u8]> {
    let (bytes, marker_byte) = u8(bytes)?;

    match marker_byte {
        0 => {
            let (bytes, size) = u16(Big)(bytes)?;
            take(size)(bytes)
        }
        1 => Ok((bytes, b"")),
        _ => Err(nom::Err::Failure(error::Error::new(
            bytes,
            error::ErrorKind::Tag,
        ))),
    }
}

fn main() {
    println!("Reading .azw3r");
    let contents = std::fs::read("Spice and Wolf 01 - Isuna Hasekura_2.azw3r").unwrap();
    let (left, values) = from_bytes(contents.as_slice()).unwrap();

    assert_eq!(left.len(), 0);

    println!("{:?}", values);

    println!("Reading .azw3f");
    let contents = std::fs::read("Spice and Wolf 01 - Isuna Hasekura_2.azw3f").unwrap();
    let (left, values) = from_bytes(contents.as_slice()).unwrap();

    assert_eq!(left.len(), 0);

    println!("{:?}", values);
}
```

</details>
