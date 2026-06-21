/**
 * Executable form of the SQLite DDL defined in `docs/mvp1/data-schema.md`.
 *
 * Shipped as a TypeScript string constant (rather than a raw `schema.sql` asset)
 * so it can be passed straight to `execAsync` without a Metro raw-SQL transformer.
 * The SQL content is kept identical to the design doc — update both together.
 *
 * Run exactly once on first launch (see `migrate.ts`). The `food_category` and
 * `meal_slot` reference rows are fixed constants; `portion_target` is left empty
 * and populated only through the Settings screen (US-01/US-03) or onboarding (US-14).
 */
export const SCHEMA_SQL = /* sql */ `
-- ============================================
-- Reference table: FoodCategory constants
-- ============================================
CREATE TABLE food_category (
    code TEXT PRIMARY KEY CHECK (code IN ('GRAIN','FRUIT','VEGETABLE','DAIRY','PROTEIN','FAT')),
    calories_per_portion INTEGER NOT NULL
);

INSERT INTO food_category (code, calories_per_portion) VALUES
    ('GRAIN', 80),
    ('FRUIT', 60),
    ('VEGETABLE', 25),
    ('DAIRY', 90),
    ('PROTEIN', 55),
    ('FAT', 45);

-- ============================================
-- Reference table: MealSlot constants
-- ============================================
CREATE TABLE meal_slot (
    code TEXT PRIMARY KEY CHECK (code IN ('BREAKFAST','MORNING_SNACK','LUNCH','AFTERNOON_SNACK','DINNER')),
    sort_order INTEGER NOT NULL
);

INSERT INTO meal_slot (code, sort_order) VALUES
    ('BREAKFAST', 1),
    ('MORNING_SNACK', 2),
    ('LUNCH', 3),
    ('AFTERNOON_SNACK', 4),
    ('DINNER', 5);

-- ============================================
-- FoodItem — exchange list seed data (~150 rows)
-- ============================================
CREATE TABLE food_item (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_code TEXT NOT NULL REFERENCES food_category(code),
    portion_quantity TEXT NOT NULL,
    portion_unit TEXT NOT NULL,
    calories_per_portion INTEGER NOT NULL
);

CREATE INDEX idx_food_item_category ON food_item(category_code);
CREATE INDEX idx_food_item_name ON food_item(name);

-- ============================================
-- PortionTarget — user's active nutrition plan (6 rows, mutable)
-- ============================================
CREATE TABLE portion_target (
    id TEXT PRIMARY KEY,
    category_code TEXT NOT NULL UNIQUE REFERENCES food_category(code),
    daily_portions REAL NOT NULL CHECK (daily_portions >= 0),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================
-- Recipe — catalog seed data (~24 rows)
-- ============================================
CREATE TABLE recipe (
    id TEXT PRIMARY KEY,
    name_es TEXT NOT NULL,
    name_en TEXT NOT NULL,
    method TEXT NOT NULL,
    is_vegetarian INTEGER NOT NULL DEFAULT 0 CHECK (is_vegetarian IN (0,1)),
    is_vegetarian_optional INTEGER NOT NULL DEFAULT 0 CHECK (is_vegetarian_optional IN (0,1))
);

CREATE INDEX idx_recipe_vegetarian ON recipe(is_vegetarian);

-- ============================================
-- RecipeIngredient — nullable FoodItem FK + free-text fallback
-- ============================================
CREATE TABLE recipe_ingredient (
    id TEXT PRIMARY KEY,
    recipe_id TEXT NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    food_item_id TEXT REFERENCES food_item(id),
    description TEXT NOT NULL,
    quantity TEXT NOT NULL,
    unit TEXT NOT NULL
);

CREATE INDEX idx_recipe_ingredient_recipe ON recipe_ingredient(recipe_id);
CREATE INDEX idx_recipe_ingredient_fooditem ON recipe_ingredient(food_item_id);

-- ============================================
-- RecipeComposition — portion breakdown per recipe
-- (beans dual-count = two rows, same recipe, GRAIN + PROTEIN)
-- ============================================
CREATE TABLE recipe_composition (
    id TEXT PRIMARY KEY,
    recipe_id TEXT NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    category_code TEXT NOT NULL REFERENCES food_category(code),
    portion_value REAL NOT NULL CHECK (portion_value > 0),
    UNIQUE (recipe_id, category_code)
);

CREATE INDEX idx_recipe_composition_recipe ON recipe_composition(recipe_id);

-- ============================================
-- RecipeSlotTag — which meal slots a recipe applies to (multi-slot support)
-- ============================================
CREATE TABLE recipe_slot_tag (
    id TEXT PRIMARY KEY,
    recipe_id TEXT NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    meal_slot_code TEXT NOT NULL REFERENCES meal_slot(code),
    UNIQUE (recipe_id, meal_slot_code)
);

CREATE INDEX idx_recipe_slot_tag_slot ON recipe_slot_tag(meal_slot_code);
CREATE INDEX idx_recipe_slot_tag_recipe ON recipe_slot_tag(recipe_id);

-- ============================================
-- DailyPlan — today's suggested/swapped recipe per slot
-- ============================================
CREATE TABLE daily_plan (
    id TEXT PRIMARY KEY,
    plan_date TEXT NOT NULL,
    meal_slot_code TEXT NOT NULL REFERENCES meal_slot(code),
    recipe_id TEXT NOT NULL REFERENCES recipe(id),
    is_swapped INTEGER NOT NULL DEFAULT 0 CHECK (is_swapped IN (0,1)),
    UNIQUE (plan_date, meal_slot_code)
);

CREATE INDEX idx_daily_plan_date ON daily_plan(plan_date);
`;
