-- name: GetRecipeByID :one
SELECT 
    r.id,
    r.title,
    r.description,
    r.ingredients,
    r.instructions,
    r.cooking_time,
    r.skill_level,
    r.category_id,
    c.name as category_name,
    r.variant_id,
    v.name as variant_name,
    r.image_url,
    r.servings,
    r.calories,
    r.protein,
    r.carbs,
    r.fat,
    r.health_tags,
    r.created_at,
    r.updated_at
FROM recipes r
INNER JOIN categories c ON r.category_id = c.id
INNER JOIN variants v ON r.variant_id = v.id
WHERE r.id = ?;

-- name: ListRecipes :many
SELECT 
    r.id, r.title, r.description,
    r.cooking_time, r.skill_level, r.servings, r.image_url,
    r.calories, r.protein, r.carbs, r.fat, r.health_tags,
    r.category_id, c.name as category_name,
    r.variant_id, v.name as variant_name
FROM recipes r
JOIN categories c ON r.category_id = c.id
JOIN variants v ON r.variant_id = v.id
WHERE
    (? IS NULL OR CONCAT(r.title, r.description, r.ingredients) LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR r.skill_level = ?)
    AND (? IS NULL OR r.variant_id = ?)
    AND (? IS NULL OR r.category_id = ?)
    AND (? IS NULL OR r.cooking_time <= ?)
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;

-- name: CountRecipes :one
SELECT COUNT(*)
FROM recipes r
WHERE 
    (? IS NULL OR r.title LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR r.skill_level = ?)
    AND (? IS NULL OR r.variant_id = ?)
    AND (? IS NULL OR r.category_id = ?)
    AND (? IS NULL OR r.cooking_time <= ?);

-- name: GetRandomRecipe :one
SELECT 
    r.id,
    r.title,
    r.description,
    r.ingredients,
    r.instructions,
    r.cooking_time,
    r.skill_level,
    r.category_id,
    c.name as category_name,
    r.variant_id,
    v.name as variant_name,
    r.image_url,
    r.servings,
    r.calories,
    r.protein,
    r.carbs,
    r.fat,
    r.health_tags,
    r.created_at,
    r.updated_at
FROM recipes r
INNER JOIN categories c ON r.category_id = c.id
INNER JOIN variants v ON r.variant_id = v.id
WHERE 
    (? IS NULL OR r.title LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR r.skill_level = ?)
    AND (? IS NULL OR r.variant_id = ?)
    AND (? IS NULL OR r.category_id = ?)
    AND (? IS NULL OR r.cooking_time <= ?)
ORDER BY RAND()
LIMIT 1;

-- name: ListCategories :many
SELECT id, name, description, created_at, updated_at
FROM categories
ORDER BY name;

-- name: ListVariants :many
SELECT id, name, description, created_at, updated_at
FROM variants
ORDER BY name;

-- name: CreateRecipe :execresult
INSERT INTO recipes (
    title, description, ingredients, instructions, 
    cooking_time, skill_level, category_id, variant_id, 
    image_url, servings, calories, protein, carbs, fat, health_tags
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: UpdateRecipe :exec
UPDATE recipes SET
    title = ?,
    description = ?,
    ingredients = ?,
    instructions = ?,
    cooking_time = ?,
    skill_level = ?,
    category_id = ?,
    variant_id = ?,
    image_url = ?,
    servings = ?,
    calories = ?,
    protein = ?,
    carbs = ?,
    fat = ?,
    health_tags = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- name: DeleteRecipe :exec
DELETE FROM recipes WHERE id = ?;
