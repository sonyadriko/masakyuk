package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/sonyadriko/masakyuk/internal/repository"
)

var (
	ErrRecipeNotFound = errors.New("recipe not found")
	ErrInvalidParams  = errors.New("invalid parameters")
)

// Recipe represents a recipe in the response
type Recipe struct {
	ID           int32   `json:"id"`
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	Ingredients  string  `json:"ingredients"`
	Instructions string  `json:"instructions"`
	CookingTime  int32   `json:"cooking_time"`
	SkillLevel   string  `json:"skill_level"`
	CategoryID   int32   `json:"category_id"`
	CategoryName string  `json:"category_name"`
	VariantID    int32   `json:"variant_id"`
	VariantName  string  `json:"variant_name"`
	ImageURL     *string `json:"image_url,omitempty"`
	Servings     int32   `json:"servings"`
}

// RecipesListResponse represents the response for listing recipes
type RecipesListResponse struct {
	Data []Recipe       `json:"data"`
	Meta PaginationMeta `json:"meta"`
}

// PaginationMeta holds pagination metadata
type PaginationMeta struct {
	Total      int64 `json:"total"`
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	TotalPages int   `json:"total_pages"`
}

// RecipeFilters holds filter parameters
type RecipeFilters struct {
	Search         *string
	SkillLevel     *string
	VariantID      *int32
	CategoryID     *int32
	MaxCookingTime *int32
	Page           int
	PerPage        int
}

// RecipesService defines the interface for recipe business logic
type RecipesService interface {
	ListRecipes(ctx context.Context, filters RecipeFilters) (*RecipesListResponse, error)
	GetRecipeByID(ctx context.Context, id int32) (*Recipe, error)
	GetRandomRecipe(ctx context.Context, filters RecipeFilters) (*Recipe, error)
}

type recipesService struct {
	repo repository.RecipesRepository
}

// NewRecipesService creates a new recipes service
func NewRecipesService(repo repository.RecipesRepository) RecipesService {
	return &recipesService{
		repo: repo,
	}
}

func (s *recipesService) ListRecipes(ctx context.Context, filters RecipeFilters) (*RecipesListResponse, error) {
	// Validate and set defaults
	if filters.Page < 1 {
		filters.Page = 1
	}
	if filters.PerPage < 1 || filters.PerPage > 100 {
		filters.PerPage = 10
	}

	// Validate skill level if provided
	if filters.SkillLevel != nil && !isValidSkillLevel(*filters.SkillLevel) {
		return nil, fmt.Errorf("%w: invalid skill_level", ErrInvalidParams)
	}

	// Calculate offset
	offset := int32((filters.Page - 1) * filters.PerPage)
	limit := int32(filters.PerPage)

	// Get total count
	count, err := s.repo.CountRecipes(ctx, repository.CountRecipesParams{
		Search:         filters.Search,
		SkillLevel:     filters.SkillLevel,
		VariantID:      filters.VariantID,
		CategoryID:     filters.CategoryID,
		MaxCookingTime: filters.MaxCookingTime,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to count recipes: %w", err)
	}

	// Get recipes
	rows, err := s.repo.ListRecipes(ctx, repository.ListRecipesParams{
		Search:         filters.Search,
		SkillLevel:     filters.SkillLevel,
		VariantID:      filters.VariantID,
		CategoryID:     filters.CategoryID,
		MaxCookingTime: filters.MaxCookingTime,
		Limit:          limit,
		Offset:         offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to list recipes: %w", err)
	}

	// Convert to response format
	recipes := make([]Recipe, len(rows))
	for i, row := range rows {
		recipes[i] = Recipe{
			ID:           row.ID,
			Title:        row.Title,
			Description:  row.Description,
			Ingredients:  row.Ingredients,
			Instructions: row.Instructions,
			CookingTime:  row.CookingTime,
			SkillLevel:   row.SkillLevel,
			CategoryID:   row.CategoryID,
			CategoryName: row.CategoryName,
			VariantID:    row.VariantID,
			VariantName:  row.VariantName,
			ImageURL:     nullStringToPtr(row.ImageUrl),
			Servings:     row.Servings,
		}
	}

	// Calculate total pages
	totalPages := int(count) / filters.PerPage
	if int(count)%filters.PerPage > 0 {
		totalPages++
	}

	return &RecipesListResponse{
		Data: recipes,
		Meta: PaginationMeta{
			Total:      count,
			Page:       filters.Page,
			PerPage:    filters.PerPage,
			TotalPages: totalPages,
		},
	}, nil
}

func (s *recipesService) GetRecipeByID(ctx context.Context, id int32) (*Recipe, error) {
	if id < 1 {
		return nil, fmt.Errorf("%w: invalid recipe ID", ErrInvalidParams)
	}

	row, err := s.repo.GetRecipeByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrRecipeNotFound, err)
	}

	return &Recipe{
		ID:           row.ID,
		Title:        row.Title,
		Description:  row.Description,
		Ingredients:  row.Ingredients,
		Instructions: row.Instructions,
		CookingTime:  row.CookingTime,
		SkillLevel:   row.SkillLevel,
		CategoryID:   row.CategoryID,
		CategoryName: row.CategoryName,
		VariantID:    row.VariantID,
		VariantName:  row.VariantName,
		ImageURL:     nullStringToPtr(row.ImageUrl),
		Servings:     row.Servings,
	}, nil
}

func (s *recipesService) GetRandomRecipe(ctx context.Context, filters RecipeFilters) (*Recipe, error) {
	// Validate skill level if provided
	if filters.SkillLevel != nil && !isValidSkillLevel(*filters.SkillLevel) {
		return nil, fmt.Errorf("%w: invalid skill_level", ErrInvalidParams)
	}

	row, err := s.repo.GetRandomRecipe(ctx, repository.GetRandomRecipeParams{
		Search:         filters.Search,
		SkillLevel:     filters.SkillLevel,
		VariantID:      filters.VariantID,
		CategoryID:     filters.CategoryID,
		MaxCookingTime: filters.MaxCookingTime,
	})
	if err != nil {
		return nil, fmt.Errorf("%w: no recipes match the criteria", ErrRecipeNotFound)
	}

	return &Recipe{
		ID:           row.ID,
		Title:        row.Title,
		Description:  row.Description,
		Ingredients:  row.Ingredients,
		Instructions: row.Instructions,
		CookingTime:  row.CookingTime,
		SkillLevel:   row.SkillLevel,
		CategoryID:   row.CategoryID,
		CategoryName: row.CategoryName,
		VariantID:    row.VariantID,
		VariantName:  row.VariantName,
		ImageURL:     nullStringToPtr(row.ImageUrl),
		Servings:     row.Servings,
	}, nil
}

func isValidSkillLevel(level string) bool {
	validLevels := map[string]bool{
		"beginner":     true,
		"intermediate": true,
		"advanced":     true,
	}
	return validLevels[level]
}

// Helper function to convert sql.NullString to *string
func nullStringToPtr(ns sql.NullString) *string {
	if !ns.Valid {
		return nil
	}
	return &ns.String
}
