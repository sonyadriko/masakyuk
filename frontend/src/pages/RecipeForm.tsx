import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/api/recipes';
import styles from './RecipeForm.module.css';

const RecipeForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(id);

    const { data: existingRecipe } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => recipesApi.getRecipeById(Number(id)),
        enabled: isEdit,
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        cooking_time: 30,
        skill_level: 'beginner',
        category_id: 1,
        variant_id: 1,
        servings: 2,
    });

    React.useEffect(() => {
        if (existingRecipe) {
            setFormData({
                title: existingRecipe.title,
                description: existingRecipe.description,
                ingredients: existingRecipe.ingredients,
                instructions: existingRecipe.instructions,
                cooking_time: existingRecipe.cooking_time,
                skill_level: existingRecipe.skill_level,
                category_id: existingRecipe.category_id,
                variant_id: existingRecipe.variant_id,
                servings: existingRecipe.servings,
            });
        }
    }, [existingRecipe]);

    const createMutation = useMutation({
        mutationFn: recipesApi.createRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            navigate('/');
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => recipesApi.updateRecipe(Number(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe', id] });
            navigate(`/recipes/${id}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['cooking_time', 'category_id', 'variant_id', 'servings'].includes(name)
                ? Number(value)
                : value,
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{isEdit ? 'Edit Resep' : 'Tambah Resep Baru'}</h1>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    ← Kembali
                </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Nama Resep *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Deskripsi *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label htmlFor="cooking_time">Waktu Masak (menit) *</label>
                        <input
                            type="number"
                            id="cooking_time"
                            name="cooking_time"
                            value={formData.cooking_time}
                            onChange={handleChange}
                            required
                            min="1"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="servings">Porsi *</label>
                        <input
                            type="number"
                            id="servings"
                            name="servings"
                            value={formData.servings}
                            onChange={handleChange}
                            required
                            min="1"
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label htmlFor="skill_level">Level Kesulitan *</label>
                        <select
                            id="skill_level"
                            name="skill_level"
                            value={formData.skill_level}
                            onChange={handleChange}
                            required
                            className={styles.select}
                        >
                            <option value="beginner">Pemula</option>
                            <option value="intermediate">Menengah</option>
                            <option value="advanced">Mahir</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category_id">Kategori *</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className={styles.select}
                        >
                            <option value="1">Indonesian</option>
                            <option value="2">Western</option>
                            <option value="3">Asian</option>
                            <option value="4">Dessert</option>
                            <option value="5">Appetizer</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="variant_id">Varian *</label>
                        <select
                            id="variant_id"
                            name="variant_id"
                            value={formData.variant_id}
                            onChange={handleChange}
                            required
                            className={styles.select}
                        >
                            <option value="1">Regular</option>
                            <option value="2">Vegetarian</option>
                            <option value="3">Vegan</option>
                            <option value="4">Halal</option>
                            <option value="5">Gluten-Free</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="ingredients">Bahan-bahan *</label>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Pisahkan dengan koma, contoh: Beras 2 cup, Telur 2 butir, Bawang putih 3 siung"
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="instructions">Cara Membuat *</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                        rows={8}
                        placeholder="Pisahkan setiap langkah dengan enter/baris baru"
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={styles.cancelButton}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className={styles.submitButton}
                    >
                        {createMutation.isPending || updateMutation.isPending
                            ? 'Menyimpan...'
                            : isEdit
                                ? 'Update Resep'
                                : 'Tambah Resep'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecipeForm;
