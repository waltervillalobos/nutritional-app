# Nutrition App

An offline-first mobile app for iOS and Android that helps users follow a nutritionist-prescribed meal plan based on the exchange-list (intercambio) diet system.

Users set their daily portion targets per food category, receive recipe suggestions for each meal slot, and can browse a pre-loaded food exchange database — all without an internet connection.

> **Not a meal-logging app.** It plans and suggests; it does not track what the user ate.

---

## Tech Stack

React Native · Expo · TypeScript · expo-sqlite · Zustand · iOS + Android

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
