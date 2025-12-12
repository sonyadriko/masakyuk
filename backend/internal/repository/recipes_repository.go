package repository

import (
	"context"
	"database/sql"

	"github.com/sonyadriko/masakyuk/internal/db"
)

// RecipesRepository defines the interface for recipe data operations
type RecipesRepository interface {
	GetRecipeByID(ctx context.Context, id int32) (db.GetRecipeByIDRow, error)
	ListRecipes(ctx context.Context, params ListRecipesParams) ([]db.ListRecipesRow, error)
	CountRecipes(ctx context.Context, params CountRecipesParams) (int64, error)
	GetRandomRecipe(ctx context.Context, params GetRandomRecipeParams) (db.GetRandomRecipeRow, error)
	CreateRecipe(ctx context.Context, params CreateRecipeParams) (int64, error)
	UpdateRecipe(ctx context.Context, params UpdateRecipeParams) error
	DeleteRecipe(ctx context.Context, id int32) error
	ListCategories(ctx context.Context) ([]db.Category, error)
	ListVariants(ctx context.Context) ([]db.Variant, error)
}

// ListRecipesParams holds parameters for listing recipes
type ListRecipesParams struct {
	Search         *string
	SkillLevel     *string
	VariantID      *int32
	CategoryID     *int32
	MaxCookingTime *int32
	Limit          int32
	Offset         int32
}

// CountRecipesParams holds parameters for counting recipes
type CountRecipesParams struct {
	Search         *string
	SkillLevel     *string
	VariantID      *int32
	CategoryID     *int32
	MaxCookingTime *int32
}

// GetRandomRecipeParams holds parameters for getting a random recipe
type GetRandomRecipeParams struct {
	Search         *string
	SkillLevel     *string
	VariantID      *int32
	CategoryID     *int32
	MaxCookingTime *int32
}

// CreateRecipeParams holds parameters for creating a recipe
type CreateRecipeParams struct {
	Title        string
	Description  string
	Ingredients  string
	Instructions string
	CookingTime  int32
	SkillLevel   string
	CategoryID   int32
	VariantID    int32
	ImageURL     *string
	Servings     int32
}

// UpdateRecipeParams holds parameters for updating a recipe
type UpdateRecipeParams struct {
	ID           int32
	Title        string
	Description  string
	Ingredients  string
	Instructions string
	CookingTime  int32
	SkillLevel   string
	CategoryID   int32
	VariantID    int32
	ImageURL     *string
	Servings     int32
}

// recipesRepository implements RecipesRepository
type recipesRepository struct {
	queries *db.Queries
}

// NewRecipesRepository creates a new recipes repository
func NewRecipesRepository(queries *db.Queries) RecipesRepository {
	return &recipesRepository{
		queries: queries,
	}
}

func (r *recipesRepository) GetRecipeByID(ctx context.Context, id int32) (db.GetRecipeByIDRow, error) {
	return r.queries.GetRecipeByID(ctx, id)
}

func (r *recipesRepository) ListRecipes(ctx context.Context, params ListRecipesParams) ([]db.ListRecipesRow, error) {
	// MySQL requires duplicating nullable parameters for NULL checks
	return r.queries.ListRecipes(ctx, db.ListRecipesParams{
		Column1:     params.Search,
		CONCAT:      params.Search,
		Column3:     params.SkillLevel,
		SkillLevel:  stringOrEmpty(params.SkillLevel),
		Column5:     params.VariantID,
		VariantID:   int32OrZero(params.VariantID),
		Column7:     params.CategoryID,
		CategoryID:  int32OrZero(params.CategoryID),
		Column9:     params.MaxCookingTime,
		CookingTime: int32OrZero(params.MaxCookingTime),
		Limit:       params.Limit,
		Offset:      params.Offset,
	})
}

func (r *recipesRepository) CountRecipes(ctx context.Context, params CountRecipesParams) (int64, error) {
	// MySQL requires duplicating nullable parameters for NULL checks
	return r.queries.CountRecipes(ctx, db.CountRecipesParams{
		Column1:     params.Search,
		CONCAT:      params.Search,
		Column3:     params.SkillLevel,
		SkillLevel:  stringOrEmpty(params.SkillLevel),
		Column5:     params.VariantID,
		VariantID:   int32OrZero(params.VariantID),
		Column7:     params.CategoryID,
		CategoryID:  int32OrZero(params.CategoryID),
		Column9:     params.MaxCookingTime,
		CookingTime: int32OrZero(params.MaxCookingTime),
	})
}

// Helper functions to convert pointers to values
func stringOrEmpty(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func int32OrZero(i *int32) int32 {
	if i == nil {
		return 0
	}
	return *i
}

func (r *recipesRepository) GetRandomRecipe(ctx context.Context, params GetRandomRecipeParams) (db.GetRandomRecipeRow, error) {
	// MySQL requires duplicating nullable parameters for NULL checks
	return r.queries.GetRandomRecipe(ctx, db.GetRandomRecipeParams{
		Column1:     params.Search,
		CONCAT:      params.Search,
		Column3:     params.SkillLevel,
		SkillLevel:  stringOrEmpty(params.SkillLevel),
		Column5:     params.VariantID,
		VariantID:   int32OrZero(params.VariantID),
		Column7:     params.CategoryID,
		CategoryID:  int32OrZero(params.CategoryID),
		Column9:     params.MaxCookingTime,
		CookingTime: int32OrZero(params.MaxCookingTime),
	})
}

func (r *recipesRepository) ListCategories(ctx context.Context) ([]db.Category, error) {
	return r.queries.ListCategories(ctx)
}

func (r *recipesRepository) ListVariants(ctx context.Context) ([]db.Variant, error) {
	return r.queries.ListVariants(ctx)
}

func (r *recipesRepository) CreateRecipe(ctx context.Context, params CreateRecipeParams) (int64, error) {
	var imageURL sql.NullString
	if params.ImageURL != nil {
		imageURL = sql.NullString{String: *params.ImageURL, Valid: true}
	}

	result, err := r.queries.CreateRecipe(ctx, db.CreateRecipeParams{
		Title:        params.Title,
		Description:  params.Description,
		Ingredients:  params.Ingredients,
		Instructions: params.Instructions,
		CookingTime:  params.CookingTime,
		SkillLevel:   params.SkillLevel,
		CategoryID:   params.CategoryID,
		VariantID:    params.VariantID,
		ImageUrl:     imageURL,
		Servings:     params.Servings,
	})
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func (r *recipesRepository) UpdateRecipe(ctx context.Context, params UpdateRecipeParams) error {
	var imageURL sql.NullString
	if params.ImageURL != nil {
		imageURL = sql.NullString{String: *params.ImageURL, Valid: true}
	}

	return r.queries.UpdateRecipe(ctx, db.UpdateRecipeParams{
		Title:        params.Title,
		Description:  params.Description,
		Ingredients:  params.Ingredients,
		Instructions: params.Instructions,
		CookingTime:  params.CookingTime,
		SkillLevel:   params.SkillLevel,
		CategoryID:   params.CategoryID,
		VariantID:    params.VariantID,
		ImageUrl:     imageURL,
		Servings:     params.Servings,
		ID:           params.ID,
	})
}

func (r *recipesRepository) DeleteRecipe(ctx context.Context, id int32) error {
	return r.queries.DeleteRecipe(ctx, id)
}
