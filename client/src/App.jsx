import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy load components
const Home = lazy(() => import('./component/Home'));
const Login = lazy(() => import('./component/Login'));
const Appoint = lazy(() => import('./component/Appoint'));
const AddPerson = lazy(() => import('./component/AddPerson'));
const AddSlots = lazy(() => import('./component/AddSlots'));

// PersonDetail component with memoization
const PersonDetail = lazy(() => import('./component/PersonDetail').then(module => ({ default: memo(module.default) })));

const queryClient = new QueryClient();

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-xl">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="mt-4 text-lg font-semibold text-gray-700">Loading page...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/appoint" element={isAuthenticated ? <Appoint /> : <Navigate to="/login" />} />
            <Route path="/addPerson" element={isAuthenticated ? <AddPerson /> : <Navigate to="/login" />} />
            <Route path="/personDetail/:id" element={isAuthenticated ? <PersonDetail /> : <Navigate to="/login" />} />
            <Route path="/addSlots" element={isAuthenticated ? <AddSlots /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}
