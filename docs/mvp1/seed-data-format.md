# Seed Data Format — Nutrition App MVP1

> Source: exchange list (~150 items) + recipe catalog (24 recipes) · Target: bundled JSON → SQLite import on first launch · Derived from: Data Schema (mvp1-data-schema.md)

---

## 1. Design Principles

- **JSON mirrors schema tables 1:1** — no transformation logic needed between seed file and SQLite insert
- **Human-readable, hand-editable IDs** — deterministic slugs (e.g., `"grain-rice-white"`, `"gallo-pinto"`), not random UUIDs, so the catalog can be updated by editing JSON directly without tooling
- **Two independent files** — `food-items.json` and `recipes.json` — since they update on different cadences (food DB is stable; recipes will grow first)
- **Beans dual-count and multi-slot tagging are explicit in the file**, not inferred at import time — keeps import logic trivial (straight insert, no business rules at load time)

---

## 2. File: `food-items.json`

```json
{
  "version": "1.0.0",
  "items": [
    {
      "id": "grain-rice-white",
      "name": "Arroz cocido blanco",
      "category": "GRAIN",
      "portionQuantity": "1/3",
      "portionUnit": "taza",
      "caloriesPerPortion": 80
    },
    {
      "id": "grain-tortilla-corn",
      "name": "Tortilla de maíz (15cm)",
      "category": "GRAIN",
      "portionQuantity": "1",
      "portionUnit": "unidad",
      "caloriesPerPortion": 80
    },
    {
      "id": "protein-beans-cooked",
      "name": "Frijoles cocidos",
      "category": "PROTEIN",
      "portionQuantity": "1/2",
      "portionUnit": "taza",
      "caloriesPerPortion": 55
    },
    {
      "id": "fruit-papaya",
      "name": "Papaya",
      "category": "FRUIT",
      "portionQuantity": "1",
      "portionUnit": "taza",
      "caloriesPerPortion": 60
    },
    {
      "id": "vegetable-chayote",
      "name": "Chayote",
      "category": "VEGETABLE",
      "portionQuantity": "1/2",
      "portionUnit": "taza cocido",
      "caloriesPerPortion": 25
    },
    {
      "id": "dairy-milk-skim",
      "name": "Leche descremada",
      "category": "DAIRY",
      "portionQuantity": "1",
      "portionUnit": "taza",
      "caloriesPerPortion": 90
    },
    {
      "id": "fat-oil-olive",
      "name": "Aceite de oliva",
      "category": "FAT",
      "portionQuantity": "1",
      "portionUnit": "cdta",
      "caloriesPerPortion": 45
    }
  ]
}
```

**Field rules:**

- `id` pattern: `{category-lowercase}-{short-name}-{qualifier?}` — guarantees uniqueness and readability
- `category` must be one of the 6 enum values exactly (validated at import)
- `caloriesPerPortion` is denormalized from `food_category` but stored per-item for display speed — **must match** the category's fixed value (validation rule, not a free value)

---

## 3. File: `recipes.json`

```json
{
  "version": "1.0.0",
  "recipes": [
    {
      "id": "gallo-pinto",
      "nameEs": "Gallo Pinto",
      "nameEn": "Spotted Rooster Rice and Beans",
      "isVegetarian": true,
      "isVegetarianOptional": false,
      "method": "Sauté onion, pepper and cilantro in oil. Add beans with a little broth and Salsa Lizano. Stir in day-old rice until evenly colored. Cook a few minutes.",
      "slots": ["BREAKFAST", "DINNER"],
      "ingredients": [
        {
          "foodItemId": "grain-rice-white",
          "description": "Arroz cocido blanco",
          "quantity": "2/3",
          "unit": "taza"
        },
        {
          "foodItemId": "protein-beans-cooked",
          "description": "Frijoles negros cocidos",
          "quantity": "1/3-1/2",
          "unit": "taza"
        },
        {
          "foodItemId": null,
          "description": "Salsa Lizano",
          "quantity": "1-2",
          "unit": "cdta"
        },
        {
          "foodItemId": null,
          "description": "Cebolla, chile dulce, cilantro picado",
          "quantity": "2",
          "unit": "cda c/u"
        },
        {
          "foodItemId": "fat-oil-olive",
          "description": "Aceite",
          "quantity": "1",
          "unit": "cdta"
        }
      ],
      "composition": [
        { "category": "GRAIN", "portionValue": 2 },
        { "category": "PROTEIN", "portionValue": 1 },
        { "category": "VEGETABLE", "portionValue": 0.5 },
        { "category": "FAT", "portionValue": 1 }
      ]
    },
    {
      "id": "pescado-plancha-vegetales",
      "nameEs": "Pescado a la Plancha con Vegetales",
      "nameEn": "Grilled Fish with Vegetables",
      "isVegetarian": false,
      "isVegetarianOptional": false,
      "method": "Pat fish dry, season with garlic, lemon, salt. Sear 3-4 min per side on a hot, lightly oiled pan. Serve with vegetables and rice.",
      "slots": ["LUNCH", "DINNER"],
      "ingredients": [
        {
          "foodItemId": null,
          "description": "Filete de pescado blanco (tilapia/corvina)",
          "quantity": "4",
          "unit": "oz"
        },
        {
          "foodItemId": "grain-rice-white",
          "description": "Arroz cocido",
          "quantity": "1/3-2/3",
          "unit": "taza"
        },
        {
          "foodItemId": "vegetable-chayote",
          "description": "Vegetales salteados/al vapor",
          "quantity": "1-1.5",
          "unit": "taza"
        },
        {
          "foodItemId": "fat-oil-olive",
          "description": "Aceite de oliva",
          "quantity": "1",
          "unit": "cdta"
        }
      ],
      "composition": [
        { "category": "PROTEIN", "portionValue": 4 },
        { "category": "VEGETABLE", "portionValue": 2 },
        { "category": "GRAIN", "portionValue": 1.5 },
        { "category": "FAT", "portionValue": 1 }
      ]
    }
  ]
}
```

**Field rules:**

- `slots` array — supports multi-slot recipes directly (no separate join handling needed at authoring time)
- `ingredients[].foodItemId` — `null` when ingredient isn't in the exchange list (Salsa Lizano, achiote, etc.); `description` is always required regardless
- `composition` array — **one entry per category max** (matches `UNIQUE(recipe_id, category_code)` schema constraint); beans dual-count shown explicitly as separate GRAIN + PROTEIN entries within the same array — see Gallo Pinto example above (1 PROTEIN entry already includes the beans contribution)

---

## 4. Import Process (first launch)

```
1. Run schema.sql → creates tables + seeds food_category, meal_slot (fixed reference data)
2. Parse food-items.json → bulk insert into food_item
3. Parse recipes.json:
   a. Insert into recipe (one row per recipe)
   b. Insert into recipe_ingredient (one row per ingredient; foodItemId nullable)
   c. Insert into recipe_composition (one row per composition entry)
   d. Insert into recipe_slot_tag (one row per slot in slots[] array)
4. Validate: every recipe.composition[].category must be unique within that recipe
5. Validate: every food-item.category must match a valid food_category.code
6. portion_target table remains EMPTY after seed — populated only via onboarding (US-14)
```

**Idempotency rule**: import script checks `SELECT COUNT(*) FROM food_item` before running — if seed tables already populated, skip (prevents duplicate inserts on app restart, never re-runs against user data tables `portion_target`/`daily_plan`).

---

## 5. Update/Versioning Strategy

- `version` field in both files enables future app updates to detect "seed data changed" and re-import reference tables only
- Recipe catalog growth (beyond initial 24) = append to `recipes.json`, no schema change needed
- Food database expansion (beyond vegetarian-focused ~150 items) = append to `food-items.json`, same mechanism — validates the schema decision to keep food DB generic/expandable

---

## 6. Open Items for Development Phase

| Item                            | Note                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full 150-item `food-items.json` | This doc shows format + 7 sample entries; full transcription from exchange list PDF is a data-entry task, not a design task                       |
| Full 24-recipe `recipes.json`   | This doc shows format + 2 worked examples (incl. beans dual-count); remaining 22 recipes from prior research need conversion to this exact format |
| Composition value validation    | Recommend a lightweight script to sum `composition[].portionValue` per recipe and sanity-check against ingredient quantities before shipping      |
