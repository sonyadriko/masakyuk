import apiClient from './client';
import type { RecipeFilters, RecipesListResponse, SpinRequest, SpinResponse } from '@/types/recipe';

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
     * Spin the wheel to get a random recipe
     */
    spinWheel: async (filters: SpinRequest = {}): Promise<SpinResponse> => {
        const response = await apiClient.post<SpinResponse>('/spin', filters);
        return response.data;
    },

    /**
     * Get a single recipe by ID
     */
    getRecipeById: async (id: number) => {
        const response = await apiClient.get(`/recipes/${id}`);
        return response.data;
    },
};
