import apiClient from './client';
import type { RecipeFilters, RecipesListResponse, SpinRequest, SpinResponse, Recipe } from '@/types/recipe';

export const recipesApi = {
    /**
     * Get list of recipes with filters and pagination
     */
    getRecipes: async (filters: RecipeFilters = {}): Promise<RecipesListResponse> => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.skill_level) params.append('skill_level', filters.skill_level);
        if (filters.variant_id) params.append('variant_id', filters.variant_id.toString());
        if (filters.category_id) params.append('category_id', filters.category_id.toString());
        if (filters.max_cooking_time) params.append('max_cooking_time', filters.max_cooking_time.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.per_page) params.append('per_page', filters.per_page.toString());

        const response = await apiClient.get<RecipesListResponse>('/recipes', { params });
        return response.data;
    },

    /**
     * Get a single recipe by ID
     */
    getRecipeById: async (id: number): Promise<Recipe> => {
        const response = await apiClient.get(`/recipes/${id}`);
        return response.data.data;
    },

    /**
     * Create a new recipe
     */
    createRecipe: async (data: Omit<Recipe, 'id' | 'category_name' | 'variant_name'>): Promise<Recipe> => {
        const response = await apiClient.post('/recipes', data);
        return response.data.data;
    },

    /**
     * Update an existing recipe
     */
    updateRecipe: async (id: number, data: Omit<Recipe, 'id' | 'category_name' | 'variant_name'>): Promise<Recipe> => {
        const response = await apiClient.put(`/recipes/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete a recipe
     */
    deleteRecipe: async (id: number): Promise<void> => {
        await apiClient.delete(`/recipes/${id}`);
    },

    /**
     * Spin the wheel to get a random recipe
     */
    spinWheel: async (filters: SpinRequest = {}): Promise<SpinResponse> => {
        const response = await apiClient.post<SpinResponse>('/spin', filters);
        return response.data;
    },
};
