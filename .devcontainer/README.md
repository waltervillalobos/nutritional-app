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

- **Codespaces:** GitHub → `Code` ▸ `Codespaces` ▸ _Create codespace on this branch_.
- **Locally:** VS Code + Dev Containers extension ▸ _Reopen in Container_.

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

## Claude Code

Claude Code is pre-installed in the container — the `claude` CLI and VS Code extension are ready to use.

**Required secret:** Claude Code needs `ANTHROPIC_API_KEY` to authenticate. Add it before creating the Codespace:

1. Go to your repo on GitHub → **Settings** → **Secrets and variables** → **Codespaces**
2. Click **New secret**, name it `ANTHROPIC_API_KEY`, and paste your key
3. Create (or rebuild) the Codespace — the key is injected automatically at startup

Once the container is running, open a terminal and type `claude` to start.

## Secrets

Never commit tokens. Provide `EXPO_TOKEN`, `ANTHROPIC_API_KEY`, or any other secret via
**GitHub Codespaces encrypted secrets** (repo/org Settings ▸ Secrets ▸ Codespaces);
they are injected as environment variables at runtime.
