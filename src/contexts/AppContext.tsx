
// This file serves as a compatibility layer during refactoring
// It re-exports everything from the specialized contexts

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { usePortfolio } from "./PortfolioContext";

// Create a simple context
interface AppContextType {
  user: any;
  setUser: (user: any) => void;
  selectedPortfolio: any;
  triggerConfetti: () => void;
  showConfetti: boolean;
  isOnboarded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// This provider combines other providers for backward compatibility
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, isOnboarded } = useAuth();
  const { selectedPortfolio, showConfetti, triggerConfetti } = usePortfolio();
  
  return (
    <AppContext.Provider 
      value={{ 
        user, 
        setUser, 
        selectedPortfolio, 
        triggerConfetti, 
        showConfetti,
        isOnboarded
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Export the hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Re-export other context hooks
export { useAuth } from "./AuthContext";
export { usePortfolio } from "./PortfolioContext";
export { useSavings } from "./SavingsContext";
export { useCoach } from "./CoachContext";
