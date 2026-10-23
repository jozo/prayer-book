# Prayer Book

[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#prayer-book:matrix.org)

Mobile app with Catholic prayers.

[<img src="https://i.imgur.com/mBHhDMo.png"
     alt="Get it on F-Droid"
     height="50">](https://f-droid.org/packages/io.jozo.prayerbook/)
[<img src="https://i.imgur.com/6otF5jh.png"
     alt="Get it on Google Play"
     height="50">](https://play.google.com/store/apps/details?id=io.jozo.prayerbook)
[<img src="https://i.imgur.com/F8prrqS.png"
     alt="Download on the App Store"
     height="50">](https://apps.apple.com/us/app/prayer-book-catholic-prayers/id6759986594)

Or download the latest APK from the [Releases Section](https://codeberg.org/jozo/prayer-book/releases/latest).

<p>
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/1.png" alt="Home screen" width="180">
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/2.png" alt="Glorious Mysteries" width="180">
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/3.png" alt="Search" width="180">
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/4.png" alt="Menu with categories" width="180">
</p>

<p>
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/5.png" alt="Translations of a prayer" width="180">
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/6.png" alt="A list of morning prayers" width="180">
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/7.png" alt="A custom prayer" width="180">
  <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/8.png" alt="A litany in dark theme" width="180">
</p>

## Add prayers
Create a new file in the `src/prayers/{LANG}` directory with the following format:

```toml
title = "Prayer Title"
categories = ["basic"]  # one or more of: basic, rosary, litany, saints, other

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

Please follow the structure and formatting of the existing prayers. This is especially important for properly displaying litanies.

Create a PR and I will add it to the app.

## Translate the app
New translations are always welcome. You can add a new language by translating strings in the `src/messages.js` file and adding the language in the `src/constants.js` file.
Create a PR and I will add it to the app.

## Development
Follow the steps in: 
https://codeberg.org/jozo/prayer-book/wiki/Home

### End-to-end tests
The web app is covered by [Playwright](https://playwright.dev) tests in the `e2e/` directory.
They build the app and run it with `vite preview` in a phone-sized Chromium.

```shell
npx playwright install chromium  # first time only
npm run test:e2e
```

## Icons
https://heroicons.com
