export interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    cooking_time: number;
    skill_level: 'beginner' | 'intermediate' | 'advanced';
    category_id: number;
    category_name: string;
    variant_id: number;
    variant_name: string;
    image_url?: string;
    servings: number;
}

export interface RecipeFilters {
    search?: string;
    skill_level?: string;
    variant_id?: number;
    category_id?: number;
    max_cooking_time?: number;
    page?: number;
    per_page?: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface RecipesListResponse {
    data: Recipe[];
    meta: PaginationMeta;
}

export interface SpinRequest {
    search?: string;
    skill_level?: string;
    variant_id?: number;
    category_id?: number;
    max_cooking_time?: number;
}

export interface SpinResponse {
    recipe: Recipe;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Variant {
    id: number;
    name: string;
    description?: string;
}
