import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/api/recipes';
import { Link } from 'react-router-dom';
import styles from './RecipeList.module.css';

const RecipeList: React.FC = () => {
    const [search, setSearch] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['recipes', { search, skillLevel, page }],
        queryFn: () => recipesApi.getRecipes({
            search: search || undefined,
            skill_level: skillLevel || undefined,
            page,
            per_page: 12,
        }),
    });

    const deleteMutation = useMutation({
        mutationFn: recipesApi.deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });

    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Hapus resep "${title}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Resep Masakan</h1>
                <Link to="/recipes/new" className={styles.addButton}>
                    + Tambah Resep
                </Link>
            </div>

            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Cari resep..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Semua Level</option>
                    <option value="beginner">Pemula</option>
                    <option value="intermediate">Menengah</option>
                    <option value="advanced">Mahir</option>
                </select>
            </div>

            {isLoading && <div className={styles.loading}>Loading...</div>}
            {error && <div className={styles.error}>Error loading recipes</div>}

            {data && (
                <>
                    <div className={styles.grid}>
                        {data.data.map((recipe) => (
                            <div key={recipe.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h3>{recipe.title}</h3>
                                    <span className={`${styles.badge} ${styles[recipe.skill_level]}`}>
                                        {recipe.skill_level}
                                    </span>
                                </div>
                                <p className={styles.description}>{recipe.description}</p>
                                <div className={styles.meta}>
                                    <span>⏱️ {recipe.cooking_time} min</span>
                                    <span>🍽️ {recipe.servings} porsi</span>
                                </div>
                                <div className={styles.tags}>
                                    <span className={styles.tag}>{recipe.category_name}</span>
                                    <span className={styles.tag}>{recipe.variant_name}</span>
                                </div>
                                <div className={styles.actions}>
                                    <Link to={`/recipes/${recipe.id}`} className={styles.viewButton}>
                                        Lihat
                                    </Link>
                                    <Link to={`/recipes/${recipe.id}/edit`} className={styles.editButton}>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(recipe.id, recipe.title)}
                                        className={styles.deleteButton}
                                        disabled={deleteMutation.isPending}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data.meta.total_pages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={styles.pageButton}
                            >
                                ← Sebelumnya
                            </button>
                            <span className={styles.pageInfo}>
                                Halaman {page} dari {data.meta.total_pages}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= data.meta.total_pages}
                                className={styles.pageButton}
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RecipeList;
