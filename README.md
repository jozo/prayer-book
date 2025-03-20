# Prayer Book

[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#prayer-book:matrix.org)

Mobile app with Catholic prayers.

[<img src="https://i.imgur.com/mBHhDMo.png"
     alt="Get it on F-Droid"
     height="50">](https://f-droid.org/packages/io.jozo.prayerbook/)
[<img src="https://i.imgur.com/6otF5jh.png"
     alt="Get it on Google Play"
     height="50">](https://play.google.com/store/apps/details?id=io.jozo.prayerbook)

Or download the latest APK from the [Releases Section](https://codeberg.org/jozo/prayer-book/releases/latest).

![screenshot](https://codeberg.org/jozo/prayer-book/raw/branch/master/fastlane/metadata/android/en-US/images/phoneScreenshots/1.jpg)
![screenshot](https://codeberg.org/jozo/prayer-book/raw/branch/master/fastlane/metadata/android/en-US/images/phoneScreenshots/3.jpg)
![screenshot](https://codeberg.org/jozo/prayer-book/raw/branch/master/fastlane/metadata/android/en-US/images/phoneScreenshots/4.jpg)

## Add prayers
Create a new file in the `src/prayers/{LANG}` directory with the following format:

```toml
title = "Prayer Title"
categories = ["basic"]  # one or more of: basic, rosary, litany, saints

[[versions]]
name = "Traditional version"
content = """
Prayer text in **markdown** format
"""

[[versions]]
name = "Modern version"
content = """
Prayer text in **markdown** format
"""
```

Create a PR and I will add it to the app.

## Translate the app
New translations are always welcome. You can add a new language by translating strings in the `src/messages.js` file.
Create a PR and I will add it to the app.

## Development
Follow the steps in: 
https://codeberg.org/jozo/prayer-book/wiki/Home

## Icons
https://heroicons.com
