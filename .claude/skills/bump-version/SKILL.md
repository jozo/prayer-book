---
name: bump-version
description: Bump the app version across all five places a release touches (package.json, android build.gradle, fastlane changelog, CHANGELOG.md, SettingsView.vue). Usage: /bump-version 0.11.0
disable-model-invocation: true
---

Bump this project's version to `$ARGUMENTS` (a SemVer string like `0.11.0`).

If `$ARGUMENTS` is empty, ask which version to bump to. Show the current version first
(`package.json` `version` and `android/app/build.gradle` `versionCode`) so the user can choose.

## Do not build or release

Never run `./release_android.fish`, `npm run build`, or `npx cap sync`. The maintainer builds and
signs the APK manually. This skill only edits version metadata.

## The five places

Read each file before editing. `versionCode` is the current `versionCode` in
`android/app/build.gradle` **plus one** — call it `<newCode>`.

1. **`package.json`** — set `"version"` to the new version.
2. **`android/app/build.gradle`** — set `versionCode` to `<newCode>` and `versionName` to the new
   version (quoted string).
3. **`CHANGELOG.md`** — rename the `## [Unreleased]` heading to `## [<version>] - <YYYY-MM-DD>`
   using today's date, then insert a fresh empty `## [Unreleased]` section above it. Keep the
   Keep a Changelog subsection order: `### Added`, `### Changed`, `### Fixed`.
4. **`fastlane/metadata/android/en-US/changelogs/<newCode>.txt`** — new file. Content is the body of
   the section just released from `CHANGELOG.md` (the bullet lines, without the `## [x.y.z]`
   heading). Match the formatting of the existing `<code>.txt` files in that directory — read the
   most recent one first.
5. **`src/views/SettingsView.vue`** — the hardcoded version string (a `<p>` element containing the
   old version, around line 59). Update it to the new version.

## After

Report the five changed paths and the old → new `versionCode`/`versionName`. Do not commit unless
the user asks.
