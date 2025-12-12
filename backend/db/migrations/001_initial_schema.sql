-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Variants table (e.g., vegetarian, vegan, halal, etc.)
CREATE TABLE variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INT NOT NULL,
    skill_level VARCHAR(50) NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    category_id INT NOT NULL,
    variant_id INT NOT NULL,
    image_url VARCHAR(500),
    servings INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE RESTRICT
);

-- Indexes for efficient filtering
CREATE INDEX idx_recipes_skill_level ON recipes(skill_level);
CREATE INDEX idx_recipes_category_id ON recipes(category_id);
CREATE INDEX idx_recipes_variant_id ON recipes(variant_id);
CREATE INDEX idx_recipes_cooking_time ON recipes(cooking_time);
CREATE FULLTEXT INDEX idx_recipes_title ON recipes(title);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
    ('Indonesian', 'Traditional Indonesian cuisine'),
    ('Western', 'Western-style dishes'),
    ('Asian', 'Asian fusion and traditional'),
    ('Dessert', 'Sweet treats and desserts'),
    ('Appetizer', 'Starters and snacks');

-- Insert sample variants
INSERT INTO variants (name, description) VALUES
    ('Regular', 'Standard recipe with no dietary restrictions'),
    ('Vegetarian', 'No meat or fish'),
    ('Vegan', 'No animal products'),
    ('Halal', 'Prepared according to Islamic law'),
    ('Gluten-Free', 'No gluten-containing ingredients');

-- Insert sample recipes
INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, skill_level, category_id, variant_id, servings) VALUES
    ('Nasi Goreng', 'Classic Indonesian fried rice', 'Rice, eggs, vegetables, soy sauce, garlic, shallots', '1. Heat oil in wok\n2. Fry garlic and shallots\n3. Add rice and vegetables\n4. Season with soy sauce\n5. Add scrambled eggs', 20, 'beginner', 1, 1, 2),
    ('Rendang', 'Slow-cooked beef in coconut milk and spices', 'Beef, coconut milk, lemongrass, galangal, chilies, spices', '1. Prepare spice paste\n2. Cook beef with spices\n3. Add coconut milk\n4. Simmer until tender', 180, 'advanced', 1, 4, 4),
    ('Gado-Gado', 'Indonesian vegetable salad with peanut sauce', 'Mixed vegetables, tofu, tempeh, peanut sauce, rice cakes', '1. Blanch vegetables\n2. Prepare peanut sauce\n3. Arrange on plate\n4. Pour sauce over', 30, 'beginner', 1, 2, 2),
    ('Spaghetti Carbonara', 'Creamy pasta with bacon and eggs', 'Spaghetti, bacon, eggs, parmesan, black pepper', '1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all ingredients', 25, 'intermediate', 2, 1, 2),
    ('Vegan Buddha Bowl', 'Nutritious grain and vegetable bowl', 'Quinoa, chickpeas, avocado, vegetables, tahini dressing', '1. Cook quinoa\n2. Roast chickpeas\n3. Prepare vegetables\n4. Assemble bowl with dressing', 35, 'beginner', 2, 3, 1),
    ('Pad Thai', 'Thai stir-fried noodles', 'Rice noodles, shrimp, tofu, bean sprouts, peanuts, tamarind', '1. Soak noodles\n2. Prepare sauce\n3. Stir-fry ingredients\n4. Toss with noodles', 30, 'intermediate', 3, 1, 2),
    ('Chocolate Lava Cake', 'Decadent molten chocolate dessert', 'Dark chocolate, butter, eggs, sugar, flour', '1. Melt chocolate and butter\n2. Mix with eggs and sugar\n3. Add flour\n4. Bake until edges set', 15, 'intermediate', 4, 2, 4),
    ('Spring Rolls', 'Fresh Vietnamese spring rolls', 'Rice paper, shrimp, vegetables, herbs, dipping sauce', '1. Prepare filling\n2. Soak rice paper\n3. Roll ingredients\n4. Serve with sauce', 25, 'beginner', 5, 4, 4);
