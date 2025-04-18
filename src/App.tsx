import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import Auth from './pages/Auth';
import Index from './pages/Index';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Invest from './pages/Invest';
import Save from './pages/Save';
import Coach from './pages/Coach';
import NotFound from './pages/NotFound';
import Onboarding from './pages/Onboarding';
import FindFriends from './pages/FindFriends';
import AppLayout from './components/layout/AppLayout';
import { useApp } from './contexts/AppContext';
import { Toaster } from "@/components/ui/sonner"
import BankCallback from './pages/BankCallback';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/auth', { replace: true, state: { from: location } });
    }
  }, [isLoggedIn, isLoading, navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <>{children}</> : null;
}

function App() {
  const { initializeAuth } = useApp();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Protected routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="invest" element={<Invest />} />
              <Route path="save" element={<Save />} />
              <Route path="coach" element={<Coach />} />
              <Route path="find-friends" element={<FindFriends />} />
              <Route path="bank-callback" element={<BankCallback />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
