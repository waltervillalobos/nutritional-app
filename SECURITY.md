# Security — Dependency Audit Baseline

This document records the project's accepted `npm audit` baseline and the rationale
for it. Update it whenever the audit result changes.

## Current status

`npm audit` reports **30 moderate** findings (as of the last review). **All of them
are confined to development and build tooling.** None of these packages are bundled
into the shipped app binary.

> Metro bundles only your application source plus the native runtime into the
> `.ipa` / `.aab`. Test runners, coverage instrumentation, and the Expo CLI run on
> the developer's machine — they never reach a device or an app store.

## The findings

| Vulnerable package                                                                                                                                     | Pulled in by (chain)                                    | Runs only during                                       | Notes                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `js-yaml@3.x` (quadratic-complexity DoS in merge keys — [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68))                      | `babel-plugin-istanbul` → `babel-jest` → `jest`         | `jest --coverage` (local/CI)                           | `@istanbuljs/load-nyc-config` is unmaintained and hard-pins `js-yaml@^3`. js-yaml 4 removed `safeLoad`, so it cannot be force-upgraded without breaking Jest coverage. |
| `uuid@7.x` (missing buffer bounds check in v3/v5/v6 when `buf` is provided — [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)) | `xcode` → `@expo/config-plugins` → `@expo/cli` → `expo` | `expo prebuild` / native project generation (local/CI) | `xcode@3.0.1` (latest) pins `uuid@^7`. Intrinsic to the Expo toolchain.                                                                                                |

Neither is exploitable in normal use of this project:

- The js-yaml DoS requires feeding a **malicious YAML document** to the coverage
  config loader — it only parses our own `.nycrc`/istanbul config.
- The uuid bounds bug only triggers when a caller passes an undersized `buf`
  argument; `xcode` generates UUIDs without that argument.

## App Store / Play Store note

Apple App Store and Google Play review inspect the **compiled binary**, not
`node_modules`. Neither runs `npm audit`. These dev-tooling findings do not affect
store submission or the security of the shipped app.

## Policy

- **Do not run `npm audit fix --force`.** It downgrades `jest-expo` (56 → 37) and
  `expo` (56 → 46), which would revert the toolchain to broken/incompatible
  versions.
- The two chains above are **accepted** until upstream (Expo / Jest) ship patched
  transitive dependencies. No app-level action removes them today without
  abandoning Expo or Jest.

## Re-checking

```bash
npm audit
```

When reviewing a new result, confirm that any added finding is still **dev/build
tooling only** (trace it with `npm ls <package>`). A finding in a runtime
dependency — anything under `dependencies` that ships in the bundle — must be
fixed, not accepted.
