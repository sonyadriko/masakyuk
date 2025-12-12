import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/api/recipes';
import styles from './RecipeDetail.module.css';

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: recipe, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => recipesApi.getRecipeById(Number(id)),
    });

    const deleteMutation = useMutation({
        mutationFn: recipesApi.deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            navigate('/');
        },
    });

    const handleDelete = () => {
        if (recipe && window.confirm(`Hapus resep "${recipe.title}"?`)) {
            deleteMutation.mutate(recipe.id);
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error || !recipe) return <div className={styles.error}>Recipe not found</div>;

    const ingredientsList = recipe.ingredients.split(',').map(i => i.trim());
    const instructionsList = recipe.instructions.split('\n').filter(i => i.trim());

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    ← Kembali
                </button>
                <div className={styles.actions}>
                    <Link to={`/recipes/${id}/edit`} className={styles.editButton}>
                        ✏️ Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className={styles.deleteButton}
                        disabled={deleteMutation.isPending}
                    >
                        🗑️ Hapus
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.titleSection}>
                    <h1>{recipe.title}</h1>
                    <div className={styles.badges}>
                        <span className={`${styles.badge} ${styles[recipe.skill_level]}`}>
                            {recipe.skill_level}
                        </span>
                        <span className={styles.badge}>{recipe.category_name}</span>
                        <span className={styles.badge}>{recipe.variant_name}</span>
                    </div>
                </div>

                <p className={styles.description}>{recipe.description}</p>

                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaIcon}>⏱️</span>
                        <div>
                            <div className={styles.metaLabel}>Waktu Masak</div>
                            <div className={styles.metaValue}>{recipe.cooking_time} menit</div>
                        </div>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaIcon}>🍽️</span>
                        <div>
                            <div className={styles.metaLabel}>Porsi</div>
                            <div className={styles.metaValue}>{recipe.servings} orang</div>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Bahan-bahan</h2>
                    <ul className={styles.ingredientsList}>
                        {ingredientsList.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.section}>
                    <h2>Cara Membuat</h2>
                    <ol className={styles.instructionsList}>
                        {instructionsList.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
