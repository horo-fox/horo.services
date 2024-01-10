---
title: "Notes on connecting to my Kindle Oasis over USB"
published: 1-9-2024
summary: "You can connect to your Kindle over USB to get books and put books in."
---

This post is mostly for my past self who didn't realize this, but Calibre's `ebook-device` seems equivalent to just... plugging in my Kindle and then using the USB connection.

This means you can probably make a thing that syncs between a Kindle and local state pretty easily. Also, the reading states are stored nearby (I think), in files I don't yet know how to parse.

My kindle has a weird `amazon-cover-bug` folder on the top level that seems to contain covers for books. It appears that Amazon tries to fetch (unsuccessfully) the cover for your book and replaces it with a bad cover. If you reset the cover after this it seems the Kindle keeps your custom cover. So, Calibre just does that for you. I'm curious whether it's possible to set a cover that doesn't get replaced in an easier fashion -- sounds like a fun experiment!
