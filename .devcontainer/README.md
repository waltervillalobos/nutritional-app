# Dev Container / GitHub Codespaces

This repo ships a security-hardened dev container so you can develop and run unit
tests for the Nutrition App in the cloud (or locally in VS Code) with the exact
toolchain defined in `docs/mvp1/project-structure.md`.

## What you get

- **Node 20 LTS** on the official Microsoft `typescript-node` image (required by
  Expo SDK 54), running as the image's built-in **non-root `node` user**.
- All project dependencies installed automatically (`npm install` on create).
- VS Code extensions: Expo Tools, ESLint, Prettier, Jest.

## Open it

- **Codespaces:** GitHub → `Code` ▸ `Codespaces` ▸ *Create codespace on this branch*.
- **Locally:** VS Code + Dev Containers extension ▸ *Reopen in Container*.

The first build runs `npm install` automatically. Wait for it to finish before
running the commands below.

## Develop & test

```bash
npm test            # run unit tests (jest-expo)
npm run test:watch  # watch mode
npm run typecheck   # tsc --noEmit
```

The pure-TypeScript `src/domain/` layer is unit-testable in isolation (no SQLite
or React Native required) — see `src/domain/rules/calculateDailyCalories.test.ts`.

## Preview the app

Standard Codespaces cannot run Android/iOS emulators (no nested virtualization).
Use one of:

```bash
npm run web      # Expo web — port 8081 auto-forwards to your browser
npm run tunnel   # then scan the QR code with Expo Go on a physical device
```

## Secrets

Never commit tokens. Provide `EXPO_TOKEN` (or any other secret) via
**GitHub Codespaces encrypted secrets** (repo/org Settings ▸ Secrets ▸ Codespaces);
they are injected as environment variables at runtime.
