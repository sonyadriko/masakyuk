import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import SpinPage from './pages/SpinPage';
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

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

                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/recipes" element={<RecipeList />} />
                        <Route path="/recipes/new" element={<RecipeForm />} />
                        <Route path="/recipes/:id" element={<RecipeDetail />} />
                        <Route path="/recipes/:id/edit" element={<RecipeForm />} />
                        <Route path="/spin" element={<SpinPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
