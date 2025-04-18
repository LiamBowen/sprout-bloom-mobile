
import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { usePortfolio } from "./PortfolioContext";
import { useSavings } from "./SavingsContext";
import { fetchLivePrice } from "@/integrations/finnhub/client";

// Create a hook that combines all our other contexts
export const useApp = () => {
  const auth = useAuth();
  const portfolio = usePortfolio();
  const savings = useSavings();
  
  // Mocked data for coach functionality that isn't yet in modular contexts
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
  
  // Function to fetch asset price
  const getAssetPrice = async (assetName: string) => {
    try {
      const price = await fetchLivePrice(assetName);
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${assetName}:`, error);
      return null;
    }
  };
  
  // Combine all the context values
  return {
    ...auth,
    ...portfolio,
    ...savings,
    coachMessages,
    addCoachMessage,
    showConfetti,
    triggerConfetti,
    getAssetPrice
  };
};

// This provider is no longer needed since we're using the individual providers
// It's kept here for backward compatibility but doesn't add any functionality
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default useApp;
