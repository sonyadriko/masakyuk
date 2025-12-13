-- Migration: Add nutrition information to recipes table
-- Created: 2025-12-12

USE masakyuk;

ALTER TABLE recipes
ADD COLUMN calories INT DEFAULT NULL COMMENT 'Calories per serving',
ADD COLUMN protein DECIMAL(5,1) DEFAULT NULL COMMENT 'Protein in grams per serving',
ADD COLUMN carbs DECIMAL(5,1) DEFAULT NULL COMMENT 'Carbohydrates in grams per serving',
ADD COLUMN fat DECIMAL(5,1) DEFAULT NULL COMMENT 'Fat in grams per serving',
ADD COLUMN health_tags VARCHAR(255) DEFAULT NULL COMMENT 'Comma-separated health tags (low-carb, high-protein, etc)';

-- Add index for health tags filtering
CREATE INDEX idx_health_tags ON recipes(health_tags);
