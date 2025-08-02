
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Invest from './pages/Invest';
import NewInvestment from './pages/NewInvestment';
import Save from './pages/Save';
import Coach from './pages/Coach';
import NotFound from './pages/NotFound';
import FindFriends from './pages/FindFriends';
import AppLayout from './layouts/AppLayout';
import { Toaster } from "@/components/ui/sonner";
import BankCallback from './pages/BankCallback';
import Confetti from './components/Confetti';
import FAQ from './pages/FAQ';

// Scroll to top component - now with behavior: smooth
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Using smooth behavior for better UX
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="invest" element={<Invest />} />
              <Route path="new-investment" element={<NewInvestment />} />
              <Route path="save" element={<Save />} />
              <Route path="coach" element={<Coach />} />
              <Route path="find-friends" element={<FindFriends />} />
              <Route path="faq" element={<FAQ />} />
            </Route>
            <Route path="/bank-callback" element={<BankCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Confetti />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
