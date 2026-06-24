# Project Structure — Nutrition App MVP1

> React Native + Expo · TypeScript · expo-sqlite · Zustand · iOS + Android from single codebase

---

## 1. Directory Layout

```
nutrition-app/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (tabs)/                   # Bottom tab group
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Today's Plan (home)
│   │   ├── recipes.tsx           # Recipe Catalog
│   │   ├── foods.tsx             # Food Database
│   │   └── settings.tsx          # Portion Targets
│   ├── recipe/
│   │   └── [id].tsx              # Recipe Detail
│   ├── food/
│   │   └── [id].tsx              # Food Item Detail
│   ├── onboarding/
│   │   ├── welcome.tsx           # Step 1: explainer (US-15)
│   │   ├── portions.tsx          # Step 2: set targets (US-14)
│   │   └── confirm.tsx           # Step 3: confirmation
│   └── _layout.tsx                # Root layout, first-launch check
│
├── src/
│   ├── domain/                    # Domain model — pure TS, no framework deps
│   │   ├── entities/
│   │   │   ├── FoodCategory.ts    # enum + caloriesPerPortion map
│   │   │   ├── MealSlot.ts        # enum + sortOrder map
│   │   │   ├── FoodItem.ts
│   │   │   ├── PortionTarget.ts
│   │   │   ├── Recipe.ts
│   │   │   ├── RecipeIngredient.ts
│   │   │   ├── RecipeComposition.ts
│   │   │   └── DailyPlan.ts
│   │   └── rules/
│   │       ├── calculateDailyCalories.ts   # Domain Rule 2
│   │       └── deriveRecipeComposition.ts  # Domain Rule 1 (beans dual-count aware)
│   │
│   ├── data/
│   │   ├── db/
│   │   │   ├── schema.sql                 # from mvp1-data-schema.md
│   │   │   ├── client.ts                  # expo-sqlite connection singleton
│   │   │   └── migrate.ts                 # first-launch schema + seed runner
│   │   ├── seed/
│   │   │   ├── food-items.json            # from mvp1-seed-data-format.md
│   │   │   └── recipes.json
│   │   └── repositories/                  # query layer, one per aggregate
│   │       ├── foodItemRepository.ts
│   │       ├── portionTargetRepository.ts
│   │       ├── recipeRepository.ts
│   │       └── dailyPlanRepository.ts
│   │
│   ├── store/                     # Zustand stores
│   │   ├── usePortionTargetStore.ts
│   │   ├── useDailyPlanStore.ts
│   │   └── useOnboardingStore.ts
│   │
│   ├── components/                # Shared UI components
│   │   ├── MealSlotCard.tsx
│   │   ├── RecipeCard.tsx
│   │   ├── SwapBottomSheet.tsx    # US-06
│   │   ├── PortionCompositionBadge.tsx
│   │   ├── FoodItemRow.tsx
│   │   └── CalorieDisplay.tsx     # derived-value display, Domain Rule 2
│   │
│   ├── hooks/
│   │   ├── useTodaysPlan.ts
│   │   ├── useRecipesBySlot.ts
│   │   └── useFoodSubstitutes.ts  # US-13
│   │
│   └── constants/
│       └── theme.ts
│
├── assets/
│   └── (icons, fonts — no recipe images in MVP1 per screen flow doc)
│
├── docs/                          # design phase deliverables
│   └── mvp1/
│       ├── user-stories.md
│       ├── domain-model.md
│       ├── data-schema.md
│       ├── screen-flow.md
│       ├── seed-data-format.md
│       ├── food-items.json
│       ├── recipes.json
│       └── project-structure.md
│
├── app.json                       # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Layer Responsibilities

| Layer                | Responsibility                                                               | Depends on                  |
| -------------------- | ---------------------------------------------------------------------------- | --------------------------- |
| `domain/`            | Entities, enums, business rules — pure TypeScript, zero React/SQLite imports | nothing                     |
| `data/db/`           | SQLite connection, schema execution, seed import                             | `domain/` (types only)      |
| `data/repositories/` | CRUD/query functions, one per aggregate root                                 | `data/db/`, `domain/`       |
| `store/`             | App state, calls repositories, exposes state to UI                           | `data/repositories/`        |
| `components/`        | Presentational + light interaction logic                                     | `store/`, `domain/` (types) |
| `app/`               | Screens — composition of components, routing only                            | `components/`, `store/`     |

**Rule**: `domain/` never imports from `data/`, `store/`, or `app/` — this keeps business rules (beans dual-count, calorie derivation) testable in isolation, independent of SQLite or React Native.

---

## 3. Key Dependencies

```json
{
  "dependencies": {
    "expo": "~54.x",
    "expo-router": "~6.x",
    "expo-sqlite": "~16.x",
    "react-native": "0.81.x",
    "zustand": "^5.x",
    "@gorhom/bottom-sheet": "^5.x"
  },
  "devDependencies": {
    "typescript": "~5.9.x",
    "@types/react": "~19.x"
  }
}
```

- **expo-router**: file-based routing — matches the screen flow doc's structure directly (tabs + stack screens)
- **@gorhom/bottom-sheet**: industry-standard RN bottom sheet, needed for US-06 swap interaction
- No backend SDK, no auth library, no network client — confirms offline-first, zero hosting cost

---

## 4. First-Launch Boot Sequence

```
app/_layout.tsx (root)
  → check: has portion_target table been seeded? (data/db/migrate.ts)
  → NO  → run schema.sql, import seed JSON, redirect to /onboarding/welcome
  → YES → check: does portion_target have rows? (onboarding completed?)
       → NO  → redirect to /onboarding/welcome
       → YES → redirect to /(tabs) [Today's Plan]
```

This directly implements the `CheckFirst` decision node from the screen flow mermaid diagram.

---

## 5. Traceability — Design Docs → Code

| Design artifact                        | Code location                                          |
| -------------------------------------- | ------------------------------------------------------ |
| Domain entities (domain-model.md)      | `src/domain/entities/`                                 |
| Domain Rules 1–4                       | `src/domain/rules/`                                    |
| SQLite DDL (data-schema.md)            | `src/data/db/schema.sql`                               |
| Seed JSON format (seed-data-format.md) | `src/data/seed/*.json`                                 |
| Screen flow nodes (screen-flow.md)     | `app/` routes (1:1 mapping)                            |
| User stories acceptance criteria       | Component-level — enforced in `components/` + `hooks/` |

---

## 6. What's Deliberately Not Here (MVP1 scope discipline)

- No `api/` or `services/` folder for network calls — offline-first, no backend
- No `auth/` — single user per install, no login
- No `i18n/` — Spanish data is static seed content, not translated UI strings (per terminology rule)
- No state persistence library beyond SQLite — Zustand stores are runtime-only, rehydrated from SQLite on app start

---

## 7. Next Steps to Execute

1. `npx create-expo-app nutrition-app --template tabs-typescript`
2. Restructure into `app/` (router) + `src/` (logic) per layout above
3. Install dependencies (`expo-sqlite`, `zustand`, `@gorhom/bottom-sheet`)
4. Implement `domain/` layer first (testable, no UI dependency)
5. Implement `data/db/schema.sql` + migration runner
6. Transcribe full seed JSON (150 food items, 24 recipes) — flagged as open item in seed data doc
7. Build screens bottom-up: components → tab screens → onboarding flow
