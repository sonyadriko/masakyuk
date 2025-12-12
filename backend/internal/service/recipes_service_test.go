package service

import (
	"context"
	"errors"
	"testing"

	"github.com/sonyadriko/masakyuk/internal/db"
	"github.com/sonyadriko/masakyuk/internal/repository"
)

// Mock repository for testing
type mockRecipesRepository struct {
	listRecipesFunc     func(ctx context.Context, params repository.ListRecipesParams) ([]db.ListRecipesRow, error)
	countRecipesFunc    func(ctx context.Context, params repository.CountRecipesParams) (int64, error)
	getRecipeByIDFunc   func(ctx context.Context, id int32) (db.GetRecipeByIDRow, error)
	getRandomRecipeFunc func(ctx context.Context, params repository.GetRandomRecipeParams) (db.GetRandomRecipeRow, error)
}

func (m *mockRecipesRepository) ListRecipes(ctx context.Context, params repository.ListRecipesParams) ([]db.ListRecipesRow, error) {
	if m.listRecipesFunc != nil {
		return m.listRecipesFunc(ctx, params)
	}
	return nil, nil
}

func (m *mockRecipesRepository) CountRecipes(ctx context.Context, params repository.CountRecipesParams) (int64, error) {
	if m.countRecipesFunc != nil {
		return m.countRecipesFunc(ctx, params)
	}
	return 0, nil
}

func (m *mockRecipesRepository) GetRecipeByID(ctx context.Context, id int32) (db.GetRecipeByIDRow, error) {
	if m.getRecipeByIDFunc != nil {
		return m.getRecipeByIDFunc(ctx, id)
	}
	return db.GetRecipeByIDRow{}, nil
}

func (m *mockRecipesRepository) GetRandomRecipe(ctx context.Context, params repository.GetRandomRecipeParams) (db.GetRandomRecipeRow, error) {
	if m.getRandomRecipeFunc != nil {
		return m.getRandomRecipeFunc(ctx, params)
	}
	return db.GetRandomRecipeRow{}, nil
}

func (m *mockRecipesRepository) ListCategories(ctx context.Context) ([]db.Category, error) {
	return nil, nil
}

func (m *mockRecipesRepository) ListVariants(ctx context.Context) ([]db.Variant, error) {
	return nil, nil
}

func TestListRecipes_Success(t *testing.T) {
	mockRepo := &mockRecipesRepository{
		countRecipesFunc: func(ctx context.Context, params repository.CountRecipesParams) (int64, error) {
			return 25, nil
		},
		listRecipesFunc: func(ctx context.Context, params repository.ListRecipesParams) ([]db.ListRecipesRow, error) {
			return []db.ListRecipesRow{
				{
					ID:           1,
					Title:        "Nasi Goreng",
					Description:  "Indonesian fried rice",
					Ingredients:  "Rice, eggs, vegetables",
					Instructions: "Fry everything",
					CookingTime:  20,
					SkillLevel:   "beginner",
					CategoryID:   1,
					CategoryName: "Indonesian",
					VariantID:    1,
					VariantName:  "Regular",
					Servings:     2,
				},
			}, nil
		},
	}

	service := NewRecipesService(mockRepo)

	filters := RecipeFilters{
		Page:    1,
		PerPage: 10,
	}

	result, err := service.ListRecipes(context.Background(), filters)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if len(result.Data) != 1 {
		t.Fatalf("Expected 1 recipe, got %d", len(result.Data))
	}

	if result.Data[0].Title != "Nasi Goreng" {
		t.Errorf("Expected title 'Nasi Goreng', got '%s'", result.Data[0].Title)
	}

	if result.Meta.Total != 25 {
		t.Errorf("Expected total 25, got %d", result.Meta.Total)
	}

	if result.Meta.TotalPages != 3 {
		t.Errorf("Expected 3 total pages, got %d", result.Meta.TotalPages)
	}
}

func TestListRecipes_WithFilters(t *testing.T) {
	skillLevel := "beginner"
	variantID := int32(1)

	mockRepo := &mockRecipesRepository{
		countRecipesFunc: func(ctx context.Context, params repository.CountRecipesParams) (int64, error) {
			if params.SkillLevel == nil || *params.SkillLevel != skillLevel {
				t.Error("Expected skill_level filter to be passed")
			}
			if params.VariantID == nil || *params.VariantID != variantID {
				t.Error("Expected variant_id filter to be passed")
			}
			return 5, nil
		},
		listRecipesFunc: func(ctx context.Context, params repository.ListRecipesParams) ([]db.ListRecipesRow, error) {
			return []db.ListRecipesRow{}, nil
		},
	}

	service := NewRecipesService(mockRepo)

	filters := RecipeFilters{
		SkillLevel: &skillLevel,
		VariantID:  &variantID,
		Page:       1,
		PerPage:    10,
	}

	_, err := service.ListRecipes(context.Background(), filters)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
}

func TestListRecipes_InvalidSkillLevel(t *testing.T) {
	mockRepo := &mockRecipesRepository{}
	service := NewRecipesService(mockRepo)

	invalidSkillLevel := "expert"
	filters := RecipeFilters{
		SkillLevel: &invalidSkillLevel,
		Page:       1,
		PerPage:    10,
	}

	_, err := service.ListRecipes(context.Background(), filters)

	if err == nil {
		t.Fatal("Expected error for invalid skill level")
	}

	if !errors.Is(err, ErrInvalidParams) {
		t.Errorf("Expected ErrInvalidParams, got %v", err)
	}
}

func TestListRecipes_Pagination(t *testing.T) {
	mockRepo := &mockRecipesRepository{
		countRecipesFunc: func(ctx context.Context, params repository.CountRecipesParams) (int64, error) {
			return 100, nil
		},
		listRecipesFunc: func(ctx context.Context, params repository.ListRecipesParams) ([]db.ListRecipesRow, error) {
			// Verify offset calculation
			expectedOffset := int32(20) // (page 3 - 1) * 10
			if params.Offset != expectedOffset {
				t.Errorf("Expected offset %d, got %d", expectedOffset, params.Offset)
			}
			return []db.ListRecipesRow{}, nil
		},
	}

	service := NewRecipesService(mockRepo)

	filters := RecipeFilters{
		Page:    3,
		PerPage: 10,
	}

	result, err := service.ListRecipes(context.Background(), filters)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if result.Meta.TotalPages != 10 {
		t.Errorf("Expected 10 total pages, got %d", result.Meta.TotalPages)
	}
}

func TestGetRecipeByID_Success(t *testing.T) {
	mockRepo := &mockRecipesRepository{
		getRecipeByIDFunc: func(ctx context.Context, id int32) (db.GetRecipeByIDRow, error) {
			return db.GetRecipeByIDRow{
				ID:           id,
				Title:        "Test Recipe",
				Description:  "Test Description",
				Ingredients:  "Test Ingredients",
				Instructions: "Test Instructions",
				CookingTime:  30,
				SkillLevel:   "intermediate",
				CategoryID:   1,
				CategoryName: "Test Category",
				VariantID:    1,
				VariantName:  "Test Variant",
				Servings:     2,
			}, nil
		},
	}

	service := NewRecipesService(mockRepo)

	recipe, err := service.GetRecipeByID(context.Background(), 1)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if recipe.Title != "Test Recipe" {
		t.Errorf("Expected title 'Test Recipe', got '%s'", recipe.Title)
	}
}

func TestGetRecipeByID_InvalidID(t *testing.T) {
	mockRepo := &mockRecipesRepository{}
	service := NewRecipesService(mockRepo)

	_, err := service.GetRecipeByID(context.Background(), 0)

	if err == nil {
		t.Fatal("Expected error for invalid ID")
	}

	if !errors.Is(err, ErrInvalidParams) {
		t.Errorf("Expected ErrInvalidParams, got %v", err)
	}
}

func TestGetRandomRecipe_Success(t *testing.T) {
	mockRepo := &mockRecipesRepository{
		getRandomRecipeFunc: func(ctx context.Context, params repository.GetRandomRecipeParams) (db.GetRandomRecipeRow, error) {
			return db.GetRandomRecipeRow{
				ID:           1,
				Title:        "Random Recipe",
				Description:  "Random Description",
				Ingredients:  "Random Ingredients",
				Instructions: "Random Instructions",
				CookingTime:  25,
				SkillLevel:   "beginner",
				CategoryID:   1,
				CategoryName: "Random Category",
				VariantID:    1,
				VariantName:  "Random Variant",
				Servings:     2,
			}, nil
		},
	}

	service := NewRecipesService(mockRepo)

	recipe, err := service.GetRandomRecipe(context.Background(), RecipeFilters{})

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if recipe.Title != "Random Recipe" {
		t.Errorf("Expected title 'Random Recipe', got '%s'", recipe.Title)
	}
}

func TestGetRandomRecipe_NoResults(t *testing.T) {
	mockRepo := &mockRecipesRepository{
		getRandomRecipeFunc: func(ctx context.Context, params repository.GetRandomRecipeParams) (db.GetRandomRecipeRow, error) {
			return db.GetRandomRecipeRow{}, errors.New("no rows")
		},
	}

	service := NewRecipesService(mockRepo)

	_, err := service.GetRandomRecipe(context.Background(), RecipeFilters{})

	if err == nil {
		t.Fatal("Expected error when no recipes match")
	}

	if !errors.Is(err, ErrRecipeNotFound) {
		t.Errorf("Expected ErrRecipeNotFound, got %v", err)
	}
}
