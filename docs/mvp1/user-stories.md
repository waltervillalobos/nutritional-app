# MVP1 User Stories — Nutrition App

> Single user · Offline-first · iOS/Android · No meal logging · Planning/suggestion only

-----

## Domain Terminology Reference

|English (domain/code)|Spanish (data/display)|
|---------------------|----------------------|
|Grain / Carbohydrate |Harina                |
|Fruit                |Fruta                 |
|Vegetable            |Vegetal               |
|Dairy                |Lácteo                |
|Protein              |Proteína              |
|Fat                  |Grasa                 |
|Exchange List        |(replaces "CNC list") |
|Exchange / Portion   |Porción / Intercambio |


> Rule: domain entities, enums, and code identifiers use English. Recipe names, ingredient names, and food item names remain in Spanish (source data).

-----

## Feature Area 1: User Profile & Portion Configuration

**US-01**
`As a user, I want to set up my daily portion targets per food category (Grains, Fruits, Vegetables, Dairy, Proteins, Fats), so that the app reflects my nutritionist's plan.`

- Acceptance criteria:
  - User can input integer/decimal portion values per category
  - Values persist locally across app restarts
  - App derives and displays approximate daily calories from portion inputs
- **Priority: MUST**

**US-02**
`As a user, I want to see my approximate daily calorie target derived from my portion targets, so that I have a reference without manually calculating it.`

- Acceptance criteria:
  - Calories shown as approximate (e.g., "~1,535 kcal")
  - Recalculates automatically when portions change
  - Uses fixed kcal-per-portion values per category (Grain=80, Fruit=60, Vegetable=25, Dairy=90, Protein=55, Fat=45)
- **Priority: MUST**

**US-03**
`As a user, I want to update my portion targets after a nutritionist appointment, so that the app stays aligned with my current plan.`

- Acceptance criteria:
  - Portion targets editable at any time from a settings/profile screen
  - No data loss on update (recipe catalog and food database unaffected)
  - Change reflected immediately in daily plan view
- **Priority: MUST**

-----

## Feature Area 2: Daily Meal Plan View

**US-04**
`As a user, I want to see a daily meal plan organized by meal slot (Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner), so that I know what to prepare at each time of day.`

- Acceptance criteria:
  - All 5 meal slots visible on one screen (scrollable)
  - Each slot shows assigned recipe name and key portion composition
  - Slots reflect a standard 5-slot daily structure (e.g., 7:30 AM, 10:30 AM, 1:00 PM, 3:00 PM, 7:00 PM)
- **Priority: MUST**

**US-05**
`As a user, I want the app to suggest a recipe for each meal slot, so that I don't have to decide what to eat from scratch every day.`

- Acceptance criteria:
  - At least one recipe suggested per slot on app open
  - Suggestions come from the recipe catalog filtered by meal slot tag
  - Suggestion does not require exact portion match (MVP1 — approximate only)
- **Priority: MUST**

**US-06**
`As a user, I want to swap a suggested recipe for another option within the same meal slot, so that I can choose something I prefer or have ingredients for.`

- Acceptance criteria:
  - "Swap" / "See other options" action visible per meal slot
  - Shows all available recipes for that slot
  - Selection replaces current suggestion for the day
  - Max 3 taps to complete a swap
- **Priority: MUST**

**US-07**
`As a user, I want to see the portion composition of each suggested recipe (e.g., 2 Grains + 3 Proteins), so that I understand how it fits my daily targets.`

- Acceptance criteria:
  - Portion breakdown shown on recipe card (compact view)
  - Categories use the domain category names (Grains, Proteins, etc.)
  - No raw macro numbers in MVP1 (portions only)
- **Priority: MUST**

-----

## Feature Area 3: Recipe Catalog

**US-08**
`As a user, I want to browse the full recipe catalog, so that I can explore all available options beyond the daily suggestions.`

- Acceptance criteria:
  - Catalog screen lists all recipes
  - Filterable by meal slot
  - Each recipe shows name, slot tags, and portion composition
- **Priority: SHOULD**

**US-09**
`As a user, I want to view the full details of a recipe (ingredients and preparation steps), so that I know how to prepare it.`

- Acceptance criteria:
  - Recipe detail screen shows: name, ingredients with quantities, method steps, portion composition, vegetarian flag
  - Accessible from daily plan and catalog
  - No more than 2 taps from daily plan to full recipe detail
- **Priority: MUST**

**US-10**
`As a user, I want to filter recipes by dietary preference (e.g., vegetarian), so that I only see options that fit my diet.`

- Acceptance criteria:
  - Vegetarian filter toggle in catalog screen
  - Filter persists during session (not necessarily across restarts in MVP1)
- **Priority: SHOULD**

-----

## Feature Area 4: Food Database

**US-11**
`As a user, I want the app to include a pre-loaded food database based on an exchange list, so that I have a reference for portion sizes per food item.`

- Acceptance criteria:
  - All exchange list items loaded at first launch (~150 items)
  - Each item shows: name, category, quantity per portion, calories per portion
  - Database browsable by category
- **Priority: MUST**

**US-12**
`As a user, I want to look up a specific food item and see its exchange category and portion size, so that I can make informed substitutions.`

- Acceptance criteria:
  - Search by food name (Spanish)
  - Result shows category, portion quantity/unit, and calories
  - Results appear within 1 second (local database, no network)
- **Priority: SHOULD**

**US-13**
`As a user, I want to see equivalent food substitutions within the same exchange category, so that I can swap ingredients when something is unavailable.`

- Acceptance criteria:
  - From any food item detail, user can view other items in the same category
  - Substitution list shows portion quantity for equivalence
  - Supports the exchange principle (e.g., swap ⅓ cup rice for ½ cup pasta — both 1 Grain exchange)
- **Priority: COULD**

-----

## Feature Area 5: Onboarding

**US-14**
`As a first-time user, I want a simple onboarding flow that asks for my portion targets, so that the app is personalized from the first session.`

- Acceptance criteria:
  - Onboarding triggered only on first launch
  - Collects portion targets per category (6 fields)
  - Shows derived calories as user inputs values
  - Skippable with defaults pre-filled (based on a standard reference plan)
  - Completes in under 2 minutes
- **Priority: MUST**

**US-15**
`As a first-time user, I want the app to explain what portions mean in the context of the exchange list system, so that I understand the plan without needing to ask my nutritionist.`

- Acceptance criteria:
  - Brief explainer shown during onboarding (1 screen, dismissible)
  - Explains the 6 food categories with a 1-line description each
  - Not shown again after first launch
- **Priority: SHOULD**

-----

## Out of Scope — MVP1 (Deferred)

|Story                              |Reason deferred                    |
|-----------------------------------|-----------------------------------|
|Log/track meals consumed           |Explicitly excluded from MVP1 scope|
|Multi-user / family profiles       |Single user per install confirmed  |
|Cloud sync / backup                |No backend in MVP1                 |
|Push notifications / meal reminders|Post-MVP1 UX enhancement           |
|Weekly meal plan generation        |MVP1 is daily only                 |
|Custom recipe creation by user     |Catalog is read-only in MVP1       |
|Nutritional analytics / charts     |No logging = no data to analyze    |
|Exercise / calorie burn tracking   |Out of nutrition planning scope    |

-----

## Story Summary

|Priority    |Count|Stories                      |
|------------|-----|-----------------------------|
|MUST        |10   |US-01–07, US-09, US-11, US-14|
|SHOULD      |4    |US-08, US-10, US-12, US-15   |
|COULD       |1    |US-13                        |
|WON'T (MVP1)|8    |See deferred table           |
