package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sonyadriko/masakyuk/internal/service"
)

type RecipesHandler struct {
	service service.RecipesService
}

func NewRecipesHandler(service service.RecipesService) *RecipesHandler {
	return &RecipesHandler{
		service: service,
	}
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// SpinRequest represents the request body for spin endpoint
type SpinRequest struct {
	Search         *string `json:"search,omitempty"`
	SkillLevel     *string `json:"skill_level,omitempty"`
	VariantID      *int32  `json:"variant_id,omitempty"`
	CategoryID     *int32  `json:"category_id,omitempty"`
	MaxCookingTime *int32  `json:"max_cooking_time,omitempty"`
}

// SpinResponse represents the response for spin endpoint
type SpinResponse struct {
	Recipe *service.Recipe `json:"recipe"`
}

// ListRecipes handles GET /api/recipes
func (h *RecipesHandler) ListRecipes(c *gin.Context) {
	// Parse query parameters
	filters := service.RecipeFilters{
		Page:    1,
		PerPage: 10,
	}

	// Parse search
	if search := c.Query("search"); search != "" {
		filters.Search = &search
	}

	// Parse skill_level
	if skillLevel := c.Query("skill_level"); skillLevel != "" {
		filters.SkillLevel = &skillLevel
	}

	// Parse variant_id
	if variantIDStr := c.Query("variant_id"); variantIDStr != "" {
		variantID, err := strconv.ParseInt(variantIDStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid variant_id"})
			return
		}
		variantID32 := int32(variantID)
		filters.VariantID = &variantID32
	}

	// Parse category_id
	if categoryIDStr := c.Query("category_id"); categoryIDStr != "" {
		categoryID, err := strconv.ParseInt(categoryIDStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid category_id"})
			return
		}
		categoryID32 := int32(categoryID)
		filters.CategoryID = &categoryID32
	}

	// Parse max_cooking_time
	if maxTimeStr := c.Query("max_cooking_time"); maxTimeStr != "" {
		maxTime, err := strconv.ParseInt(maxTimeStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid max_cooking_time"})
			return
		}
		maxTime32 := int32(maxTime)
		filters.MaxCookingTime = &maxTime32
	}

	// Parse page
	if pageStr := c.Query("page"); pageStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid page"})
			return
		}
		filters.Page = page
	}

	// Parse per_page
	if perPageStr := c.Query("per_page"); perPageStr != "" {
		perPage, err := strconv.Atoi(perPageStr)
		if err != nil || perPage < 1 || perPage > 100 {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid per_page (must be 1-100)"})
			return
		}
		filters.PerPage = perPage
	}

	// Call service
	result, err := h.service.ListRecipes(c.Request.Context(), filters)
	if err != nil {
		if errors.Is(err, service.ErrInvalidParams) {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to fetch recipes"})
		return
	}

	c.JSON(http.StatusOK, result)
}

// Spin handles POST /api/spin
func (h *RecipesHandler) Spin(c *gin.Context) {
	var req SpinRequest

	// Parse request body (optional filters)
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request body"})
		return
	}

	// Build filters
	filters := service.RecipeFilters{
		Search:         req.Search,
		SkillLevel:     req.SkillLevel,
		VariantID:      req.VariantID,
		CategoryID:     req.CategoryID,
		MaxCookingTime: req.MaxCookingTime,
	}

	// Get random recipe
	recipe, err := h.service.GetRandomRecipe(c.Request.Context(), filters)
	if err != nil {
		if errors.Is(err, service.ErrRecipeNotFound) {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "no recipes match the criteria"})
			return
		}
		if errors.Is(err, service.ErrInvalidParams) {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to spin wheel"})
		return
	}

	c.JSON(http.StatusOK, SpinResponse{Recipe: recipe})
}

// GetRecipeByID handles GET /api/recipes/:id
func (h *RecipesHandler) GetRecipeByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil || id < 1 {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid recipe ID"})
		return
	}

	recipe, err := h.service.GetRecipeByID(c.Request.Context(), int32(id))
	if err != nil {
		if errors.Is(err, service.ErrRecipeNotFound) {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "recipe not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to fetch recipe"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recipe})
}

// CreateRecipe handles POST /api/recipes
func (h *RecipesHandler) CreateRecipe(c *gin.Context) {
	var req service.CreateRecipeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request body"})
		return
	}

	recipe, err := h.service.CreateRecipe(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidParams) {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to create recipe"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": recipe})
}

// UpdateRecipe handles PUT /api/recipes/:id
func (h *RecipesHandler) UpdateRecipe(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil || id < 1 {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid recipe ID"})
		return
	}

	var req service.UpdateRecipeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request body"})
		return
	}

	recipe, err := h.service.UpdateRecipe(c.Request.Context(), int32(id), req)
	if err != nil {
		if errors.Is(err, service.ErrRecipeNotFound) {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "recipe not found"})
			return
		}
		if errors.Is(err, service.ErrInvalidParams) {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to update recipe"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recipe})
}

// DeleteRecipe handles DELETE /api/recipes/:id
func (h *RecipesHandler) DeleteRecipe(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil || id < 1 {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid recipe ID"})
		return
	}

	err = h.service.DeleteRecipe(c.Request.Context(), int32(id))
	if err != nil {
		if errors.Is(err, service.ErrRecipeNotFound) {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "recipe not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to delete recipe"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "recipe deleted successfully"})
}
