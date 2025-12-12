import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const RecipeList = React.lazy(() => import('./pages/RecipeList'));
const RecipeDetail = React.lazy(() => import('./pages/RecipeDetail'));
const RecipeForm = React.lazy(() => import('./pages/RecipeForm'));
const SpinPage = React.lazy(() => import('./pages/SpinPage'));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

// Loading component
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '18px',
        color: '#667eea'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
            }}></div>
            Loading...
        </div>
    </div>
);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="app">
                    <nav className="navbar">
                        <div className="nav-container">
                            <Link to="/" className="nav-logo">
                                🍳 MasakYuk
                            </Link>
                            <div className="nav-links">
                                <Link to="/" className="nav-link">Home</Link>
                                <Link to="/recipes" className="nav-link">Resep</Link>
                                <Link to="/spin" className="nav-link">Spin Wheel</Link>
                            </div>
                        </div>
                    </nav>

                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/recipes" element={<RecipeList />} />
                            <Route path="/recipes/new" element={<RecipeForm />} />
                            <Route path="/recipes/:id" element={<RecipeDetail />} />
                            <Route path="/recipes/:id/edit" element={<RecipeForm />} />
                            <Route path="/spin" element={<SpinPage />} />
                        </Routes>
                    </Suspense>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
