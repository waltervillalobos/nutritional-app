#!/usr/bin/env node
// Validates that seed JSON files contain all required fields.
// Catches missing data before it silently corrupts the SQLite DB at first launch.

const fs = require('fs');
const path = require('path');

const SEED_DIRS = ['docs/mvp1', 'src/data/seed'];

const FOOD_ITEM_REQUIRED = ['id', 'name', 'category', 'portionQuantity', 'portionUnit', 'caloriesPerPortion'];
const RECIPE_REQUIRED = ['id', 'nameEs', 'slots', 'ingredients', 'composition'];
const VALID_CATEGORIES = ['GRAIN', 'FRUIT', 'VEGETABLE', 'DAIRY', 'PROTEIN', 'FAT'];
const VALID_SLOTS = ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER'];

let errors = [];

function validateFoodItems(filePath, items) {
  if (!Array.isArray(items)) {
    errors.push(`${filePath}: root must be an array`);
    return;
  }
  items.forEach((item, i) => {
    const ref = `${filePath}[${i}] id=${item.id ?? '?'}`;
    FOOD_ITEM_REQUIRED.forEach((field) => {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        errors.push(`${ref}: missing required field "${field}"`);
      }
    });
    if (item.category && !VALID_CATEGORIES.includes(item.category)) {
      errors.push(`${ref}: invalid category "${item.category}" — must be one of ${VALID_CATEGORIES.join(', ')}`);
    }
  });
}

function validateRecipes(filePath, items) {
  if (!Array.isArray(items)) {
    errors.push(`${filePath}: root must be an array`);
    return;
  }
  items.forEach((item, i) => {
    const ref = `${filePath}[${i}] id=${item.id ?? '?'}`;
    RECIPE_REQUIRED.forEach((field) => {
      if (item[field] === undefined || item[field] === null) {
        errors.push(`${ref}: missing required field "${field}"`);
      }
    });
    if (Array.isArray(item.slots)) {
      item.slots.forEach((tag) => {
        if (!VALID_SLOTS.includes(tag)) {
          errors.push(`${ref}: invalid slot "${tag}" — must be one of ${VALID_SLOTS.join(', ')}`);
        }
      });
    }
  });
}

SEED_DIRS.forEach((dir) => {
  const foodFile = path.join(dir, 'food-items.json');
  const recipeFile = path.join(dir, 'recipes.json');

  if (fs.existsSync(foodFile)) {
    try {
      const raw = JSON.parse(fs.readFileSync(foodFile, 'utf8'));
      // Support both bare array and wrapped object ({ items: [...] })
      const data = Array.isArray(raw) ? raw : raw.items;
      validateFoodItems(foodFile, data);
    } catch (e) {
      errors.push(`${foodFile}: JSON parse error — ${e.message}`);
    }
  }

  if (fs.existsSync(recipeFile)) {
    try {
      const raw = JSON.parse(fs.readFileSync(recipeFile, 'utf8'));
      // Support both bare array and wrapped object ({ recipes: [...] })
      const data = Array.isArray(raw) ? raw : raw.recipes;
      validateRecipes(recipeFile, data);
    } catch (e) {
      errors.push(`${recipeFile}: JSON parse error — ${e.message}`);
    }
  }
});

if (errors.length > 0) {
  console.error('\nSeed JSON validation failed:\n');
  errors.forEach((e) => console.error(' ', e));
  console.error('');
  process.exit(1);
}

process.exit(0);
