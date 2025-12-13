#!/bin/bash

# Database Seed Script for MasakYuk
# This script populates the database with sample Indonesian recipes

echo "🍳 MasakYuk Database Seeder"
echo "=========================="
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found"
    exit 1
fi

# Check if database exists
echo "📊 Checking database connection..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Error: Cannot connect to database"
    echo "Please check your .env configuration"
    exit 1
fi

echo "✅ Database connection successful"
echo ""

# Run migrations first
echo "🔧 Running migrations..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < db/migrations/001_initial_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed"
else
    echo "⚠️  Migrations may have already been run (this is okay)"
fi

echo ""

# Run seed file
echo "🌱 Seeding database with recipes..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < db/seeds/001_recipes_seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📊 Summary:"
    echo "   - 25 Indonesian recipes added"
    echo "   - 5 categories (Indonesian, Western, Asian, Dessert, Appetizer)"
    echo "   - 5 variants (Regular, Vegetarian, Vegan, Halal, Gluten-Free)"
    echo "   - Difficulty levels: Beginner, Intermediate, Advanced"
    echo ""
    echo "🎉 Your database is now ready!"
    echo "   Visit http://localhost:5173 to see the recipes"
else
    echo "❌ Error seeding database"
    exit 1
fi
