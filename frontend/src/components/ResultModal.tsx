import React from 'react';
import type { Recipe } from '@/types/recipe';
import styles from './ResultModal.module.css';

interface ResultModalProps {
    recipe: Recipe | null;
    isOpen: boolean;
    onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ recipe, isOpen, onClose }) => {
    if (!isOpen || !recipe) return null;

    const ingredientsList = recipe.ingredients.split(',').map(i => i.trim());
    const instructionsList = recipe.instructions.split('\n').filter(i => i.trim());

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>{recipe.title}</h2>
                    <div className={styles.badges}>
                        <span className={`${styles.badge} ${styles.skillBadge}`}>
                            {recipe.skill_level}
                        </span>
                        <span className={`${styles.badge} ${styles.timeBadge}`}>
                            {recipe.cooking_time} min
                        </span>
                        <span className={`${styles.badge} ${styles.servingsBadge}`}>
                            {recipe.servings} servings
                        </span>
                    </div>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>{recipe.description}</p>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Category & Variant</h3>
                        <div className={styles.tags}>
                            <span className={styles.tag}>{recipe.category_name}</span>
                            <span className={styles.tag}>{recipe.variant_name}</span>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Ingredients</h3>
                        <ul className={styles.list}>
                            {ingredientsList.map((ingredient, index) => (
                                <li key={index} className={styles.listItem}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Instructions</h3>
                        <ol className={styles.list}>
                            {instructionsList.map((instruction, index) => (
                                <li key={index} className={styles.listItem}>{instruction}</li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.spinAgainButton} onClick={onClose}>
                        Spin Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
