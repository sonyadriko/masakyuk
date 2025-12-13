-- Seed data for MasakYuk Recipe Database
-- Indonesian Recipes Collection

-- Insert Categories (already exists from schema, but ensuring data)
INSERT INTO categories (id, name, description) VALUES
(1, 'Indonesian', 'Traditional Indonesian cuisine'),
(2, 'Western', 'Western style dishes'),
(3, 'Asian', 'Asian fusion and traditional'),
(4, 'Dessert', 'Sweet treats and desserts'),
(5, 'Appetizer', 'Starters and snacks')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Variants (already exists from schema, but ensuring data)
INSERT INTO variants (id, name, description) VALUES
(1, 'Regular', 'Standard recipe'),
(2, 'Vegetarian', 'No meat products'),
(3, 'Vegan', 'No animal products'),
(4, 'Halal', 'Halal certified ingredients'),
(5, 'Gluten-Free', 'No gluten ingredients')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Indonesian Recipes
INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, skill_level, category_id, variant_id, servings) VALUES
-- Beginner Level Recipes
('Nasi Goreng', 'Classic Indonesian fried rice with aromatic spices and vegetables', 
'2 cups cooked rice (day-old), 2 eggs, 1 cup mixed vegetables (carrots, peas, cabbage), 3 cloves garlic (minced), 2 shallots (sliced), 2 tbsp sweet soy sauce (kecap manis), 1 tbsp soy sauce, 1 tsp shrimp paste, 2 tbsp cooking oil, Salt and pepper to taste, Green onions for garnish',
'1. Heat oil in a wok over medium-high heat
2. Scramble the eggs and set aside
3. Sauté garlic and shallots until fragrant
4. Add shrimp paste and stir for 30 seconds
5. Add vegetables and stir-fry for 2 minutes
6. Add rice, breaking up any clumps
7. Pour in sweet soy sauce and soy sauce
8. Mix well and stir-fry for 3-4 minutes
9. Add scrambled eggs back in
10. Season with salt and pepper
11. Garnish with green onions and serve hot',
20, 'beginner', 1, 4, 2),

('Mie Goreng', 'Savory Indonesian stir-fried noodles with vegetables and protein',
'300g egg noodles, 200g chicken breast (sliced), 1 cup cabbage (shredded), 1 carrot (julienned), 3 cloves garlic (minced), 2 shallots (sliced), 2 tbsp sweet soy sauce, 1 tbsp soy sauce, 1 tsp oyster sauce, 2 eggs, 3 tbsp cooking oil, Salt and pepper, Fried shallots for topping',
'1. Boil noodles according to package instructions, drain
2. Heat oil in wok, scramble eggs and set aside
3. Sauté garlic and shallots until golden
4. Add chicken, cook until no longer pink
5. Add vegetables, stir-fry for 2 minutes
6. Add noodles and all sauces
7. Toss everything together for 3 minutes
8. Add scrambled eggs back in
9. Season to taste
10. Serve topped with fried shallots',
25, 'beginner', 1, 4, 3),

('Soto Ayam', 'Traditional Indonesian chicken soup with turmeric and aromatic spices',
'500g chicken pieces, 2 liters water, 3 stalks lemongrass (bruised), 4 kaffir lime leaves, 3 cm galangal (sliced), 5 cloves garlic, 6 shallots, 2 tsp turmeric powder, 1 tsp coriander powder, 200g bean sprouts, 100g glass noodles, 2 hard-boiled eggs (halved), Fried shallots, Lime wedges, Salt to taste',
'1. Boil chicken in water until cooked, remove and shred
2. Blend garlic, shallots, turmeric, and coriander with water
3. Heat oil, sauté spice paste until fragrant
4. Add to chicken broth with lemongrass, lime leaves, galangal
5. Simmer for 20 minutes
6. Season with salt
7. Soak glass noodles in hot water until soft
8. Prepare bowls with noodles, bean sprouts, shredded chicken
9. Pour hot soup over
10. Top with eggs, fried shallots, and serve with lime',
45, 'beginner', 1, 4, 4),

('Gado-Gado', 'Indonesian vegetable salad with peanut sauce',
'200g cabbage (boiled), 150g bean sprouts (blanched), 2 potatoes (boiled, cubed), 2 eggs (hard-boiled, halved), 100g green beans (blanched), 1 cucumber (sliced), 2 tomatoes (sliced), Fried tofu and tempeh, Prawn crackers, For peanut sauce: 200g roasted peanuts, 3 cloves garlic, 2 red chilies, 2 tbsp palm sugar, 1 tbsp tamarind paste, 200ml water, Salt to taste',
'1. Blend peanuts, garlic, chilies until smooth
2. Cook peanut mixture with water, palm sugar, tamarind
3. Simmer until thick, season with salt
4. Arrange all vegetables on a plate
5. Add tofu, tempeh, and eggs
6. Pour peanut sauce generously over vegetables
7. Serve with prawn crackers on the side',
30, 'beginner', 1, 2, 4),

-- Intermediate Level Recipes
('Rendang Daging', 'Rich and tender beef slow-cooked in coconut milk and spices',
'1kg beef chuck (cubed), 800ml coconut milk, 4 kaffir lime leaves, 2 turmeric leaves, 2 stalks lemongrass (bruised), 3 cm galangal (sliced), For spice paste: 10 shallots, 6 cloves garlic, 5 red chilies, 3 cm ginger, 3 cm turmeric, 2 tsp coriander powder, 1 tsp cumin, Salt and sugar to taste',
'1. Blend all spice paste ingredients until smooth
2. Heat oil, sauté spice paste until fragrant (10 mins)
3. Add beef, coat with spices
4. Pour in coconut milk, add lime leaves, turmeric leaves, lemongrass, galangal
5. Bring to boil, then reduce to low heat
6. Simmer uncovered for 2-3 hours, stirring occasionally
7. Cook until sauce is thick and oil separates
8. Season with salt and sugar
9. Continue cooking until beef is very tender
10. Serve with steamed rice',
180, 'intermediate', 1, 4, 6),

('Ayam Bakar Taliwang', 'Grilled spicy chicken from Lombok with special sambal',
'1 whole chicken (cut into pieces), 4 tbsp lime juice, Salt, For spice paste: 10 red chilies, 5 bird\'s eye chilies, 6 shallots, 4 cloves garlic, 2 tomatoes, 1 tsp shrimp paste, 2 tbsp palm sugar, 3 tbsp cooking oil',
'1. Marinate chicken with lime juice and salt for 30 minutes
2. Blend all spice paste ingredients
3. Heat oil, cook spice paste until fragrant
4. Coat chicken pieces with half of the spice paste
5. Grill chicken over charcoal until half-cooked
6. Brush with remaining spice paste
7. Continue grilling until fully cooked and slightly charred
8. Baste occasionally with spice paste
9. Serve hot with plecing kangkung',
60, 'intermediate', 1, 4, 4),

('Sate Ayam', 'Indonesian chicken satay with peanut sauce',
'500g chicken thigh (cubed), 20 bamboo skewers (soaked), For marinade: 3 cloves garlic (minced), 2 tbsp sweet soy sauce, 1 tbsp cooking oil, 1 tsp coriander powder, For peanut sauce: 200g roasted peanuts, 3 cloves garlic, 3 red chilies, 2 tbsp sweet soy sauce, 1 tbsp tamarind paste, 100ml water, Salt and sugar',
'1. Mix marinade ingredients, coat chicken
2. Marinate for at least 2 hours
3. Thread chicken onto skewers
4. For sauce: blend peanuts, garlic, chilies
5. Cook peanut mixture with water, soy sauce, tamarind
6. Simmer until thick, season to taste
7. Grill satay over charcoal, basting with oil
8. Cook until charred and cooked through
9. Serve with peanut sauce, rice cakes, and pickles',
40, 'intermediate', 1, 4, 4),

('Nasi Uduk', 'Fragrant coconut rice cooked with aromatic spices',
'2 cups jasmine rice, 400ml coconut milk, 200ml water, 2 pandan leaves (knotted), 2 stalks lemongrass (bruised), 3 kaffir lime leaves, 2 cm galangal (sliced), 1 tsp salt, Accompaniments: fried chicken, sambal, fried shallots, cucumber, omelet',
'1. Rinse rice until water runs clear
2. Combine rice, coconut milk, water in rice cooker
3. Add pandan leaves, lemongrass, lime leaves, galangal, salt
4. Cook rice as normal
5. Once done, let it steam for 10 minutes
6. Remove aromatics before serving
7. Fluff rice gently
8. Serve with fried chicken, sambal, and accompaniments',
35, 'intermediate', 1, 4, 4),

('Bakso', 'Indonesian meatball soup with noodles',
'For meatballs: 500g ground beef, 100g tapioca starch, 3 cloves garlic (minced), 1 egg white, Ice water, Salt and pepper, For broth: 2 liters beef stock, 3 cloves garlic (fried), 2 stalks celery, Salt and pepper, For serving: Egg noodles, Bok choy, Fried shallots, Sambal',
'1. Mix ground beef, tapioca, garlic, egg white, ice water
2. Season with salt and pepper, knead until sticky
3. Form into balls
4. Boil water, drop meatballs in
5. Cook until they float (about 10 minutes)
6. For broth: heat beef stock with fried garlic, celery
7. Season to taste
8. Cook noodles and bok choy separately
9. Assemble: noodles, bok choy, meatballs in bowl
10. Pour hot broth, top with fried shallots and sambal',
50, 'intermediate', 1, 4, 4),

-- Advanced Level Recipes
('Rawon', 'East Javanese black beef soup with keluak nuts',
'800g beef brisket, 2 liters water, 4 kaffir lime leaves, 2 stalks lemongrass, 3 cm galangal, For spice paste: 8 shallots, 5 cloves garlic, 5 candlenuts, 3 cm ginger, 2 cm turmeric, 5 keluak nuts (flesh only), 1 tsp coriander, Salt and sugar, Accompaniments: Bean sprouts, salted eggs, lime, sambal',
'1. Boil beef until tender (about 1.5 hours), reserve broth
2. Blend all spice paste ingredients until smooth
3. Heat oil, sauté spice paste until fragrant (15 minutes)
4. Add spice paste to beef broth
5. Add lime leaves, lemongrass, galangal
6. Simmer for 30 minutes
7. Add beef back in
8. Season with salt and sugar
9. Cook until flavors meld
10. Serve with rice, bean sprouts, salted eggs, and sambal',
150, 'advanced', 1, 4, 6),

('Gulai Kambing', 'Spicy goat curry with rich coconut milk gravy',
'1kg goat meat (bone-in pieces), 800ml coconut milk, 3 potatoes (cubed), For spice paste: 10 shallots, 6 cloves garlic, 5 red chilies, 3 cm ginger, 3 cm galangal, 3 cm turmeric, 2 tsp coriander, 1 tsp cumin, 4 cardamom pods, 2 star anise, 1 cinnamon stick, 4 kaffir lime leaves, 2 stalks lemongrass, Salt and sugar',
'1. Blend shallots, garlic, chilies, ginger, galangal, turmeric, coriander, cumin
2. Heat oil, sauté spice paste with cardamom, star anise, cinnamon
3. Cook until fragrant (10 minutes)
4. Add goat meat, coat with spices
5. Add coconut milk, lime leaves, lemongrass
6. Bring to boil, reduce heat
7. Simmer for 1.5 hours until meat is tender
8. Add potatoes, cook until soft
9. Season with salt and sugar
10. Serve with rice or roti',
120, 'advanced', 1, 4, 6),

('Pempek Palembang', 'South Sumatran fish cake with sweet and sour sauce',
'For pempek: 500g Spanish mackerel (ground), 200g tapioca starch, 300ml ice water, 3 cloves garlic (minced), 2 eggs, Salt and sugar, For cuko sauce: 200g palm sugar, 100ml tamarind water, 5 red chilies (blended), 3 cloves garlic (minced), 1 liter water, Salt, Accompaniments: Cucumber, yellow noodles',
'1. Mix ground fish with garlic, salt, sugar
2. Gradually add tapioca and ice water, knead well
3. Form into desired shapes (kapal selam with egg inside)
4. Boil pempek until they float
5. Let cool, then deep fry until golden
6. For cuko: boil water with palm sugar, tamarind
7. Add blended chilies and garlic
8. Simmer until thick, season with salt
9. Serve pempek with cuko sauce, cucumber, and noodles',
90, 'advanced', 1, 4, 6),

-- More Beginner Recipes
('Tempe Goreng', 'Crispy fried tempeh with spiced batter',
'300g tempeh (sliced), 2 cloves garlic (minced), 1 tsp coriander powder, 1/2 tsp turmeric powder, 100ml water, Salt to taste, Oil for frying',
'1. Mix garlic, coriander, turmeric, salt with water
2. Marinate tempeh slices for 15 minutes
3. Heat oil in pan
4. Fry tempeh until golden and crispy
5. Drain on paper towels
6. Serve hot with sambal and rice',
15, 'beginner', 1, 2, 4),

('Capcay', 'Indonesian stir-fried mixed vegetables',
'200g cabbage (chopped), 1 carrot (sliced), 100g cauliflower, 100g broccoli, 50g baby corn, 3 cloves garlic (minced), 2 tbsp oyster sauce, 1 tbsp soy sauce, 200ml water, 1 tbsp cornstarch, Salt and pepper, 2 tbsp cooking oil',
'1. Heat oil, sauté garlic until fragrant
2. Add harder vegetables first (carrot, cauliflower)
3. Stir-fry for 2 minutes
4. Add remaining vegetables
5. Pour in water, oyster sauce, soy sauce
6. Mix cornstarch with water, add to thicken
7. Cook until vegetables are tender-crisp
8. Season with salt and pepper
9. Serve hot with rice',
20, 'beginner', 1, 2, 3),

('Perkedel Kentang', 'Indonesian potato fritters',
'500g potatoes (boiled, mashed), 2 eggs (1 for mixture, 1 for coating), 3 cloves garlic (minced), 2 shallots (minced), 2 stalks green onions (chopped), 1 stalk celery (chopped), Salt and pepper, Oil for frying',
'1. Mix mashed potatoes with 1 egg, garlic, shallots
2. Add green onions, celery, salt, pepper
3. Form into flat patties
4. Beat remaining egg
5. Dip patties in egg
6. Fry until golden brown on both sides
7. Drain and serve hot',
25, 'beginner', 1, 4, 4),

-- More Intermediate Recipes
('Sop Buntut', 'Oxtail soup with vegetables',
'1kg oxtail (cut into pieces), 2 liters water, 2 carrots (cubed), 2 potatoes (cubed), 1 tomato (quartered), 2 stalks celery, 3 cloves garlic (minced), 2 shallots (sliced), 2 cm ginger (bruised), 2 cloves, 1 nutmeg, Salt and pepper, Fried shallots for garnish',
'1. Boil oxtail in water until tender (2-3 hours)
2. Remove scum regularly
3. Add ginger, cloves, nutmeg
4. In separate pan, sauté garlic and shallots
5. Add to soup
6. Add carrots and potatoes
7. Cook until vegetables are tender
8. Add tomato and celery
9. Season with salt and pepper
10. Serve hot with fried shallots and rice',
180, 'intermediate', 1, 4, 4),

('Ikan Bakar Bumbu Kuning', 'Grilled fish with yellow spice paste',
'1 whole fish (snapper or mackerel), 5 tbsp lime juice, Salt, For spice paste: 5 shallots, 3 cloves garlic, 3 cm turmeric, 2 cm ginger, 3 candlenuts, 2 red chilies, 1 tsp coriander, 2 tbsp oil, Banana leaves for wrapping',
'1. Clean fish, score both sides
2. Rub with lime juice and salt
3. Blend all spice paste ingredients
4. Heat oil, cook spice paste until fragrant
5. Coat fish inside and out with spice paste
6. Wrap in banana leaves
7. Grill over charcoal for 15 minutes each side
8. Unwrap and serve with sambal',
45, 'intermediate', 1, 4, 3),

('Opor Ayam', 'Chicken in coconut milk curry',
'1kg chicken pieces, 600ml coconut milk, 3 kaffir lime leaves, 2 stalks lemongrass, 2 cm galangal, For spice paste: 6 shallots, 4 cloves garlic, 3 candlenuts, 2 cm ginger, 1 tsp coriander, 1/2 tsp cumin, 1/2 tsp white pepper, Salt and sugar',
'1. Blend all spice paste ingredients
2. Heat oil, sauté spice paste until fragrant
3. Add chicken, coat with spices
4. Pour in coconut milk
5. Add lime leaves, lemongrass, galangal
6. Simmer on low heat for 40 minutes
7. Stir occasionally to prevent coconut milk from splitting
8. Season with salt and sugar
9. Cook until chicken is tender and sauce thickens
10. Serve with rice or ketupat',
60, 'intermediate', 1, 4, 5),

('Sayur Asem', 'Tamarind vegetable soup',
'200g melinjo leaves, 100g long beans (cut), 1 corn (cut into pieces), 100g peanuts (boiled), 1 chayote (cubed), 2 tomatoes (quartered), 3 tbsp tamarind paste, 1 liter water, For spice paste: 5 shallots, 3 red chilies, 1 tsp shrimp paste, Palm sugar, Salt',
'1. Blend shallots, chilies, shrimp paste
2. Boil water, add spice paste
3. Add peanuts and corn, cook for 15 minutes
4. Add chayote and long beans
5. Add tamarind paste, palm sugar, salt
6. Add melinjo leaves and tomatoes
7. Cook until all vegetables are tender
8. Adjust seasoning
9. Serve hot with rice',
35, 'beginner', 1, 2, 4),

-- Desserts
('Es Cendol', 'Indonesian iced dessert with coconut milk and palm sugar syrup',
'For cendol: 100g rice flour, 50g mung bean flour, 400ml pandan juice, 1/4 tsp salt, For serving: 200ml coconut milk, 150g palm sugar, 200ml water, Ice cubes, Jackfruit (optional)',
'1. Mix rice flour, mung bean flour, pandan juice, salt
2. Cook mixture while stirring until thick
3. Press through cendol mold into ice water
4. Boil palm sugar with water until dissolved
5. Let syrup cool
6. Mix coconut milk with pinch of salt
7. Assemble: cendol, palm sugar syrup, coconut milk, ice
8. Add jackfruit if desired
9. Serve immediately',
30, 'intermediate', 4, 3, 4),

('Klepon', 'Sweet rice cake balls filled with palm sugar',
'250g glutinous rice flour, 150ml pandan juice, 100g palm sugar (chopped small), 200g grated coconut (steamed with salt), Pinch of salt',
'1. Mix glutinous rice flour with pandan juice and salt
2. Knead into smooth dough
3. Take small portion, flatten
4. Place palm sugar in center
5. Roll into ball, seal well
6. Boil water, drop klepon in
7. Cook until they float
8. Remove and roll in grated coconut
9. Serve at room temperature',
40, 'intermediate', 4, 3, 20),

('Pisang Goreng', 'Crispy fried banana fritters',
'6 ripe plantains, 100g rice flour, 50g all-purpose flour, 2 tbsp sugar, 1/4 tsp salt, 150ml water, Oil for frying',
'1. Mix rice flour, all-purpose flour, sugar, salt
2. Add water gradually to make batter
3. Heat oil in deep pan
4. Slice plantains lengthwise
5. Dip in batter
6. Fry until golden and crispy
7. Drain on paper towels
8. Serve warm',
20, 'beginner', 4, 3, 6),

-- More Indonesian Favorites
('Nasi Kuning', 'Yellow turmeric rice for celebrations',
'2 cups jasmine rice, 400ml coconut milk, 200ml water, 2 tsp turmeric powder, 2 pandan leaves, 1 stalk lemongrass, 2 kaffir lime leaves, 1 tsp salt',
'1. Rinse rice until water runs clear
2. Mix coconut milk, water, turmeric
3. Add rice, pandan, lemongrass, lime leaves, salt
4. Cook in rice cooker
5. Once done, let steam for 10 minutes
6. Remove aromatics
7. Fluff rice gently
8. Serve with various side dishes',
30, 'beginner', 1, 4, 6),

('Pecel Lele', 'Fried catfish with sambal',
'4 catfish (cleaned), 5 cloves garlic (minced), 2 cm turmeric (grated), 1 tsp coriander powder, Salt, Oil for frying, For sambal: 10 red chilies, 5 bird\'s eye chilies, 3 cloves garlic, 2 tomatoes, 1 tsp shrimp paste, Salt and sugar',
'1. Marinate catfish with garlic, turmeric, coriander, salt
2. Let sit for 30 minutes
3. Deep fry catfish until crispy
4. For sambal: grill chilies, garlic, tomatoes, shrimp paste
5. Grind into coarse paste
6. Season with salt and sugar
7. Serve catfish with sambal and fresh vegetables',
40, 'beginner', 1, 4, 4);

-- Update auto-increment for next inserts
ALTER TABLE recipes AUTO_INCREMENT = 26;
