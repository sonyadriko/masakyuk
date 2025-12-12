import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SpinPage from './pages/SpinPage';
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SpinPage />
        </QueryClientProvider>
    );
}

export default App;
