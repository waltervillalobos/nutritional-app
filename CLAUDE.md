# Nutrition App — Developer Reference

## Project Overview

Offline-first nutritional guidance app for iOS and Android based on the Mexican exchange-list (intercambio) diet system. Users set daily portion targets per food category as prescribed by their nutritionist; the app suggests recipes for each meal slot and provides a browsable food exchange reference.

**This is NOT a meal-logging app.** It plans and suggests — it does not track what the user ate. No backend exists in MVP1; all state is local.

Current phase: MVP1 design complete, pre-code.

---

## Tech Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| Runtime      | React Native 0.85.x + Expo 56.x (managed workflow) |
| Routing      | expo-router ~56.x (file-based)                     |
| Database     | expo-sqlite ~56.x (SQLite, local-only)             |
| State        | Zustand ^5.x                                       |
| Bottom sheet | @gorhom/bottom-sheet ^5.x (US-06 swap)             |
| Platform     | iOS + Android                                      |
| Language     | TypeScript ^6.x                                    |

> Note: the repo's `.gitignore` is Xcode-origin from the initial template and will be replaced once the Expo scaffold is initialized.

---

## Repo Layout

```
docs/mvp1/
  user-stories.md      Feature requirements — 15 stories, MUST/SHOULD/COULD priorities
  domain-model.md      Entity definitions, relationships, and domain rules
  data-schema.md       SQLite DDL, key query patterns, migration notes
  screen-flow.md       Navigation structure, screen inventory, UX constraints
  project-structure.md Directory layout, layer responsibilities, boot sequence
  food-items.json      Seed data — ~130 exchange-list food items (Spanish names)
  recipes.json         Seed data — 24 Costa Rican recipes with ingredients + composition
  seed-data-format.md  Import format spec, field rules, idempotency strategy
CLAUDE.md              This file
README.md              Project stub
```

**Target source structure** (once Expo scaffold is added):

```
app/                          # Expo Router screens
  (tabs)/index.tsx            # Today's Plan
  (tabs)/recipes.tsx          # Recipe Catalog
  (tabs)/foods.tsx            # Food Database
  (tabs)/settings.tsx         # Portion Targets
  recipe/[id].tsx             # Recipe Detail
  food/[id].tsx               # Food Item Detail
  onboarding/                 # welcome → portions → confirm
src/
  domain/entities/            # Pure TS — FoodCategory, MealSlot, Recipe, etc.
  domain/rules/               # calculateDailyCalories, deriveRecipeComposition
  data/db/                    # schema.sql, client.ts, migrate.ts
  data/seed/                  # food-items.json + recipes.json (moved from docs/)
  data/repositories/          # foodItem, portionTarget, recipe, dailyPlan
  store/                      # Zustand: usePortionTargetStore, useDailyPlanStore
  components/                 # MealSlotCard, RecipeCard, SwapBottomSheet, etc.
  hooks/                      # useTodaysPlan, useRecipesBySlot, useFoodSubstitutes
```

**Layer rule**: `domain/` never imports from `data/`, `store/`, or `app/`. Business rules stay testable in isolation.

Full layout and traceability table: `docs/mvp1/project-structure.md`

---

## Domain Terminology

Code identifiers and entity names use **English**. Food names, recipe names, and ingredient names remain in **Spanish** (source data).

| English (code) | Spanish (display) | kcal/portion |
| -------------- | ----------------- | ------------ |
| `GRAIN`        | Harina            | 80           |
| `FRUIT`        | Fruta             | 60           |
| `VEGETABLE`    | Vegetal           | 25           |
| `DAIRY`        | Lácteo            | 90           |
| `PROTEIN`      | Proteína          | 55           |
| `FAT`          | Grasa             | 45           |

| Term               | Meaning                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| Exchange / Portion | One standard serving from the exchange list (Intercambio / Porción)         |
| PortionTarget      | User's daily quota per FoodCategory — the only user-editable nutrition data |
| DailyPlan          | Today's recipe assignment per MealSlot; no history in MVP1                  |
| RecipeComposition  | Per-category exchange count for a recipe (e.g., 2 GRAIN + 1 PROTEIN)        |
| RecipeSlotTag      | Tag linking a recipe to one or more MealSlots                               |
| MealSlot           | Enum: BREAKFAST · MORNING_SNACK · LUNCH · AFTERNOON_SNACK · DINNER          |

---

## Key Domain Rules

These are the decisions most likely to be implemented incorrectly:

1. **Calories are always derived, never stored.** Compute as `Σ (dailyPortions × kcal/portion)` across all 6 categories. There is no `calories` column to write.

2. **Beans dual-count.** ½ cup cooked beans = 1 GRAIN exchange + 1 PROTEIN exchange simultaneously. In `recipe_composition` this means two rows for the same recipe — one for GRAIN, one for PROTEIN. This applies to every bean-based dish (gallo pinto, casado, sopa negra). Skipping this under-reports protein by ~1 exchange per dish.

3. **Recipe matching is non-strict in MVP1.** A recipe is eligible for a slot if it has a matching `RecipeSlotTag`. `RecipeComposition` is informational only and does NOT filter suggestions. Query: `SELECT recipes WHERE slotTag = :slot ORDER BY RANDOM() LIMIT 1`.

4. **Seed tables are immutable at runtime.** Never write to `food_item`, `recipe`, `recipe_ingredient`, `recipe_composition`, or `recipe_slot_tag` from app code. Only `portion_target` and `daily_plan` accept writes.

5. **Food and recipe names stay in Spanish.** Do not translate `nameEs`, `name`, `description`, or any ingredient display field.

---

## Data Layer

- **Database**: expo-sqlite, single SQLite file opened at app start.
- **Schema**: defined in `docs/mvp1/data-schema.md` — run as a single `schema.sql` on first launch via `src/data/db/migrate.ts`.
- **Seed import**: `food-items.json` + `recipes.json` loaded immediately after schema creation — see `docs/mvp1/seed-data-format.md` for the import sequence and idempotency rules.
- **No ORM in MVP1.** Use raw expo-sqlite (`execAsync` / `getFirstAsync` / `getAllAsync`). All DB access lives in `src/data/repositories/`.
- `food-items.json` and `recipes.json` in `docs/mvp1/` are design artifacts; they will move to `src/data/seed/` when the Expo scaffold is initialized.

**First-launch boot sequence** (implemented in `app/_layout.tsx`):

```
→ Has schema been run?  NO  → run schema.sql + import seed → /onboarding/welcome
                        YES → Does portion_target have rows?
                                NO  → /onboarding/welcome
                                YES → /(tabs) Today's Plan
```

---

## Screen Structure

```
Bottom tab bar: Today | Recipes | Foods | Settings

Today tab
  TodayScreen          5 meal slot cards, recipe name + composition per card
  SwapSheet            Bottom sheet — swap recipe for a slot (2 taps max)

Recipes tab
  RecipeListScreen     Filterable catalog (meal slot chips + vegetarian toggle)
  RecipeDetailScreen   Ingredients, method steps, composition, vegetarian badge

Foods tab
  FoodListScreen       Exchange-list items grouped by category + search bar
  FoodItemDetailScreen Portion size, calories, substitutions within category

Settings tab
  SettingsScreen       6 numeric portion-target inputs, live calorie total

Onboarding (first launch only — 3 steps, blocks Today until complete)
  Step 1: exchange list explainer
  Step 2: portion target entry (same UI as SettingsScreen)
  Step 3: confirmation with derived calories → Today
```

Full navigation diagram: `docs/mvp1/screen-flow.md`

---

## MVP1 Scope Boundaries

Do not generate code for any of the following — they are explicitly deferred:

- Meal logging / food diary
- Network requests or API calls
- User authentication or multi-user support
- Push notifications or meal reminders
- Weekly meal plan generation
- User-created or user-edited food items / recipes
- Nutritional analytics or charts
- Exercise or calorie-burn tracking

---

## Development Conventions

- **Bilingual rule**: English for all TypeScript identifiers, enum values, column names, and file names. Spanish for all user-facing strings and seed data content.
- **Seed data IDs** use deterministic slugs: `grain-arroz-blanco`, `gallo-pinto`, etc. — not random UUIDs.
- When adding a new screen, update the Screen Structure section above and `docs/mvp1/screen-flow.md`.
- When changing entities or the schema, update `docs/mvp1/domain-model.md` and `docs/mvp1/data-schema.md` in the same commit.
