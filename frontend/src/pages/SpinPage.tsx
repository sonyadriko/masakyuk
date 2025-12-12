import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { recipesApi } from '@/api/recipes';
import Wheel from '@/components/Wheel';
import ResultModal from '@/components/ResultModal';
import type { Recipe, SpinRequest } from '@/types/recipe';
import styles from './SpinPage.module.css';

const SpinPage: React.FC = () => {
    const [filters, setFilters] = useState<SpinRequest>({});
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    // Fetch initial recipes for the wheel
    const { data: recipesData, isLoading: isLoadingRecipes } = useQuery({
        queryKey: ['recipes', filters],
        queryFn: () => recipesApi.getRecipes({ ...filters, per_page: 8 }),
    });

    // Spin mutation
    const spinMutation = useMutation({
        mutationFn: (spinFilters: SpinRequest) => recipesApi.spinWheel(spinFilters),
        onSuccess: (data) => {
            setSelectedRecipe(data.recipe);
            setIsSpinning(true);
        },
        onError: (error) => {
            console.error('Spin failed:', error);
            alert('Failed to spin! Please try again.');
        },
    });

    const handleSpin = () => {
        if (isSpinning || spinMutation.isPending) return;

        setShowResult(false);
        spinMutation.mutate(filters);
    };

    const handleSpinComplete = () => {
        setIsSpinning(false);
        setShowResult(true);
    };

    const handleCloseModal = () => {
        setShowResult(false);
        setSelectedRecipe(null);
    };

    const handleFilterChange = (key: keyof SpinRequest, value: string | number | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>🎡 MasakYuk Recipe Wheel</h1>
                <p className={styles.subtitle}>Spin the wheel to discover your next delicious meal!</p>
            </header>

            <div className={styles.content}>
                {/* Filters Panel */}
                <div className={styles.filtersPanel}>
                    <h2 className={styles.filterTitle}>Filters</h2>

                    <div className={styles.filterGroup}>
                        <label className={styles.label}>Search</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Search recipes..."
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.label}>Skill Level</label>
                        <select
                            className={styles.select}
                            value={filters.skill_level || ''}
                            onChange={(e) => handleFilterChange('skill_level', e.target.value)}
                        >
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.label}>Variant</label>
                        <select
                            className={styles.select}
                            value={filters.variant_id || ''}
                            onChange={(e) => handleFilterChange('variant_id', e.target.value ? parseInt(e.target.value) : undefined)}
                        >
                            <option value="">All Variants</option>
                            <option value="1">Regular</option>
                            <option value="2">Vegetarian</option>
                            <option value="3">Vegan</option>
                            <option value="4">Halal</option>
                            <option value="5">Gluten-Free</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.label}>Category</label>
                        <select
                            className={styles.select}
                            value={filters.category_id || ''}
                            onChange={(e) => handleFilterChange('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
                        >
                            <option value="">All Categories</option>
                            <option value="1">Indonesian</option>
                            <option value="2">Western</option>
                            <option value="3">Asian</option>
                            <option value="4">Dessert</option>
                            <option value="5">Appetizer</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.label}>
                            Max Cooking Time: {filters.max_cooking_time || 180} min
                        </label>
                        <input
                            type="range"
                            className={styles.slider}
                            min="10"
                            max="180"
                            step="10"
                            value={filters.max_cooking_time || 180}
                            onChange={(e) => handleFilterChange('max_cooking_time', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {/* Wheel Section */}
                <div className={styles.wheelSection}>
                    {isLoadingRecipes ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading recipes...</p>
                        </div>
                    ) : recipesData && recipesData.data.length > 0 ? (
                        <>
                            <Wheel
                                recipes={recipesData.data}
                                isSpinning={isSpinning}
                                selectedRecipe={selectedRecipe}
                                onSpinComplete={handleSpinComplete}
                            />

                            <button
                                className={styles.spinButton}
                                onClick={handleSpin}
                                disabled={isSpinning || spinMutation.isPending}
                            >
                                {spinMutation.isPending ? 'Preparing...' : isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
                            </button>
                        </>
                    ) : (
                        <div className={styles.noRecipes}>
                            <p>No recipes found matching your filters.</p>
                            <p>Try adjusting your filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Result Modal */}
            <ResultModal
                recipe={selectedRecipe}
                isOpen={showResult}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default SpinPage;
