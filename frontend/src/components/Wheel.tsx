import React, { useEffect, useState } from 'react';
import type { Recipe } from '@/types/recipe';
import styles from './Wheel.module.css';

interface WheelProps {
    recipes: Recipe[];
    isSpinning: boolean;
    selectedRecipe: Recipe | null;
    onSpinComplete?: () => void;
}

const Wheel: React.FC<WheelProps> = ({ recipes, isSpinning, selectedRecipe, onSpinComplete }) => {
    const [rotation, setRotation] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isSpinning && selectedRecipe && recipes.length > 0) {
            setIsAnimating(true);

            // Find the index of the selected recipe
            const selectedIndex = recipes.findIndex(r => r.id === selectedRecipe.id);
            const segmentAngle = 360 / recipes.length;

            // Calculate target rotation
            // Add multiple full rotations for effect (5 full spins + position)
            const baseRotation = 360 * 5;
            const targetSegmentRotation = selectedIndex * segmentAngle;

            // Adjust to point to center of segment (add half segment angle)
            // Subtract to rotate counter-clockwise to the target
            const finalRotation = rotation + baseRotation + (360 - targetSegmentRotation) + (segmentAngle / 2);

            setRotation(finalRotation);

            // Call onSpinComplete after animation finishes
            const timer = setTimeout(() => {
                setIsAnimating(false);
                onSpinComplete?.();
            }, 4000); // Match CSS animation duration

            return () => clearTimeout(timer);
        }
    }, [isSpinning, selectedRecipe, recipes, onSpinComplete]);

    const segmentAngle = recipes.length > 0 ? 360 / recipes.length : 0;

    return (
        <div className={styles.wheelContainer}>
            <div className={styles.pointer}>▼</div>

            <div
                className={`${styles.wheel} ${isAnimating ? styles.spinning : ''}`}
                style={{
                    transform: `rotate(${rotation}deg)`,
                }}
            >
                {recipes.map((recipe, index) => {
                    const rotation = index * segmentAngle;
                    const colors = [
                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
                    ];
                    const color = colors[index % colors.length];

                    return (
                        <div
                            key={recipe.id}
                            className={styles.segment}
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                backgroundColor: color,
                            }}
                        >
                            <div className={styles.segmentContent}>
                                <span className={styles.segmentText}>{recipe.title}</span>
                            </div>
                        </div>
                    );
                })}

                {/* Center circle */}
                <div className={styles.center}>
                    <div className={styles.centerInner}>SPIN</div>
                </div>
            </div>
        </div>
    );
};

export default Wheel;
