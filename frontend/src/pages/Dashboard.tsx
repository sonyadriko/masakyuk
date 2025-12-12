import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { recipesApi } from '@/api/recipes';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    const { data: recipesData } = useQuery({
        queryKey: ['recipes', { page: 1, per_page: 6 }],
        queryFn: () => recipesApi.getRecipes({ page: 1, per_page: 6 }),
    });

    const stats = [
        { icon: '📖', label: 'Total Resep', value: recipesData?.meta.total || 0 },
        { icon: '👨‍🍳', label: 'Level Pemula', value: '3+' },
        { icon: '🌟', label: 'Kategori', value: '5+' },
        { icon: '🎡', label: 'Spin Wheel', value: 'Ready' },
    ];

    const features = [
        {
            icon: '🔍',
            title: 'Cari Resep',
            description: 'Temukan resep favorit dengan mudah menggunakan fitur pencarian dan filter',
        },
        {
            icon: '➕',
            title: 'Tambah Resep',
            description: 'Bagikan resep masakan favoritmu dengan komunitas',
        },
        {
            icon: '✏️',
            title: 'Kelola Resep',
            description: 'Edit dan hapus resep yang sudah kamu buat',
        },
        {
            icon: '🎡',
            title: 'Spin Wheel',
            description: 'Bingung mau masak apa? Putar roda keberuntungan!',
        },
    ];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Selamat Datang di <span className={styles.gradient}>MasakYuk</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Platform resep masakan terlengkap untuk semua level. Temukan, bagikan, dan kelola resep favoritmu dengan mudah!
                    </p>
                    <div className={styles.heroButtons}>
                        <Link to="/recipes" className={styles.primaryButton}>
                            🍳 Lihat Semua Resep
                        </Link>
                        <Link to="/recipes/new" className={styles.secondaryButton}>
                            ➕ Tambah Resep Baru
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.statIcon}>{stat.icon}</div>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <h2 className={styles.sectionTitle}>Fitur Unggulan</h2>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Recipes Section */}
            {recipesData && recipesData.data.length > 0 && (
                <section className={styles.recentRecipes}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Resep Terbaru</h2>
                        <Link to="/recipes" className={styles.viewAllLink}>
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className={styles.recipesGrid}>
                        {recipesData.data.slice(0, 3).map((recipe) => (
                            <Link
                                key={recipe.id}
                                to={`/recipes/${recipe.id}`}
                                className={styles.recipeCard}
                            >
                                <div className={styles.recipeHeader}>
                                    <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                                    <span className={`${styles.badge} ${styles[recipe.skill_level]}`}>
                                        {recipe.skill_level}
                                    </span>
                                </div>
                                <p className={styles.recipeDescription}>{recipe.description}</p>
                                <div className={styles.recipeMeta}>
                                    <span>⏱️ {recipe.cooking_time} min</span>
                                    <span>🍽️ {recipe.servings} porsi</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className={styles.cta}>
                <h2 className={styles.ctaTitle}>Siap Mulai Memasak?</h2>
                <p className={styles.ctaSubtitle}>
                    Jelajahi ribuan resep atau bagikan resep favoritmu sekarang!
                </p>
                <div className={styles.ctaButtons}>
                    <Link to="/recipes" className={styles.ctaPrimaryButton}>
                        Jelajahi Resep
                    </Link>
                    <Link to="/spin" className={styles.ctaSecondaryButton}>
                        🎡 Coba Spin Wheel
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
