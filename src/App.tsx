
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
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
import AppLayout from './layouts/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/sonner";
import BankCallback from './pages/BankCallback';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/auth', { replace: true, state: { from: location } });
    }
  }, [isLoggedIn, isLoading, navigate, location]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>;
  }

  return isLoggedIn ? <>{children}</> : null;
}

function App() {
  const { initializeAuth, isLoggedIn, isLoading, isOnboarded } = useAuth();
  
  // Run initializeAuth only once when the component mounts
  useEffect(() => {
    initializeAuth();
  }, []); // Empty dependency array ensures this runs only once
  
  // Wait for auth to initialize before rendering routes
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>;
  }
  
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Public routes that redirect logged in users to app */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/app" /> : <Index />} />
            <Route path="/auth" element={isLoggedIn ? <Navigate to="/app" /> : <Auth />} />
            
            {/* Onboarding route - accessible when logged in but not onboarded */}
            <Route 
              path="/onboarding" 
              element={
                isLoggedIn 
                ? (isOnboarded ? <Navigate to="/app" /> : <Onboarding />)
                : <Navigate to="/auth" />
              } 
            />
            
            {/* Protected routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  {isOnboarded ? <AppLayout /> : <Navigate to="/onboarding" />}
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
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
