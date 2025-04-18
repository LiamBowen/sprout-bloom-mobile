
import { createContext, useContext, ReactNode, useState } from "react";
import { useAuth } from "./AuthContext";
import { usePortfolio } from "./PortfolioContext";
import { useSavings } from "./SavingsContext";

// Create an interface for AppContext that combines all our other contexts
interface AppContextType {
  user: any;
  setUser: (user: any) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  initializeAuth: () => void;
  
  // Portfolio context
  portfolios: any[];
  selectedPortfolio: any;
  setSelectedPortfolio: (portfolio: any) => void;
  
  // Savings context
  savingPots: any[];
  addSavingPot: (pot: any) => void;
  updateSavingPot: (id: string, updates: any) => void;
  groupFunds: any[];
  
  // Additional app functionality that needs to be merged
  coachMessages: any[];
  addCoachMessage: (message: any) => void;
  showConfetti: boolean;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a single Hook that combines all functionality
export const useApp = () => {
  const auth = useAuth();
  const portfolio = usePortfolio();
  const savings = useSavings();
  
  // These were in the original AppContext but not yet in our modular contexts
  const coachMessages = [
    {
      sender: "coach",
      text: "Hi there! I'm your Sprout Coach. How can I help you with your financial goals today?"
    }
  ];
  
  const addCoachMessage = (message: any) => {
    console.log("Adding coach message:", message);
    // In a real app, we would update state here
  };
  
  const showConfetti = false;
  
  const triggerConfetti = () => {
    console.log("Triggering confetti!");
    // In a real app, we would update state here
  };
  
  // Combine all the context values
  return {
    ...auth,
    ...portfolio,
    ...savings,
    coachMessages,
    addCoachMessage,
    showConfetti,
    triggerConfetti
  };
};

// This is needed so we can reuse AppContext in other files
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default AppContext;
