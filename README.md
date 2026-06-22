# Nutrition App

An offline-first mobile app for iOS and Android that helps users follow a nutritionist-prescribed meal plan based on the exchange-list (intercambio) diet system.

Users set their daily portion targets per food category, receive recipe suggestions for each meal slot, and can browse a pre-loaded food exchange database — all without an internet connection.

> **Not a meal-logging app.** It plans and suggests; it does not track what the user ate.

---

## Tech Stack

React Native · Expo · TypeScript · expo-sqlite · Zustand · iOS + Android

---

## Getting Started

You can work on the app either in a ready-made **GitHub Codespace** (zero local
setup) or **locally** on your own machine. Both paths use the same commands once
dependencies are installed.

### Option A — GitHub Codespaces (recommended)

The repo ships a security-hardened dev container (Node 20, all tooling
pre-configured). See [`.devcontainer/README.md`](.devcontainer/README.md) for details.

1. On GitHub, click **`Code` ▸ `Codespaces` ▸ `Create codespace on this branch`**.
2. Wait for the first build to finish — it runs `npm install` automatically.
3. Run the tests in the integrated terminal:
   ```bash
   npm test
   ```

> If you ever need to reinstall manually inside the codespace, just run `npm install`.

### Option B — Local machine

**Prerequisites:** [Node.js 20 LTS](https://nodejs.org/) and npm.

> **iOS simulator (macOS only):** Before running `npx expo start`, you must accept the Xcode license once:
> ```bash
> sudo xcodebuild -license
> ```
> Scroll to the end of the license and type `agree`. This is only required the first time.

```bash
# 1. Clone and enter the repo
git clone https://github.com/waltervillalobos/nutritional-app.git
cd nutritional-app

# 2. Install dependencies
npm install

# 3. Run the unit tests
npm test
```

### Available commands

| Command | What it does |
|---|---|
| `npm install` | Install all dependencies |
| `npm test` | Run the unit tests (jest-expo) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Type-check the project (`tsc --noEmit`) |
| `npm run web` | Start the Expo web preview (port **8081**) |
| `npm run tunnel` | Start Expo with a tunnel — scan the QR code with **Expo Go** on a device |

> **Note:** Standard Codespaces cannot run Android/iOS emulators (no nested
> virtualization). Use `npm run web` or `npm run tunnel` + Expo Go to preview the app.

---

## MVP1 Documents

| Document | Description |
|---|---|
| [User Stories](docs/mvp1/user-stories.md) | 15 feature stories with MUST / SHOULD / COULD priorities and acceptance criteria |
| [Domain Model](docs/mvp1/domain-model.md) | Core entities, relationships, and the 4 domain rules (beans dual-count, derived calories, etc.) |
| [Data Schema](docs/mvp1/data-schema.md) | SQLite DDL, key query patterns, and migration strategy |
| [Screen Flow](docs/mvp1/screen-flow.md) | Navigation structure, 8-screen inventory, UX constraints, and onboarding flow |
| [Project Structure](docs/mvp1/project-structure.md) | Directory layout, layer responsibilities, dependencies, and boot sequence |
| [Seed Data Format](docs/mvp1/seed-data-format.md) | JSON import spec, field rules, and idempotency strategy |
| [Food Items](docs/mvp1/food-items.json) | ~130 exchange-list food items across 6 categories (seed data) |
| [Recipes](docs/mvp1/recipes.json) | 24 Costa Rican recipes with ingredients and portion composition (seed data) |
