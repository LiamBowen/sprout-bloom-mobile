
import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { usePortfolio } from "./PortfolioContext";
import { useSavings } from "./SavingsContext";
import { fetchLivePrice } from "@/integrations/finnhub/client";

// Define the message type
export type CoachMessage = {
  sender: "user" | "coach";
  text: string;
};

// Create a hook that combines all our other contexts
export const useApp = () => {
  const auth = useAuth();
  const portfolio = usePortfolio();
  const savings = useSavings();
  
  // State for coach functionality that isn't yet in modular contexts
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([
    {
      sender: "coach",
      text: "Hi there! I'm your Sprout Coach. How can I help you with your financial goals today?"
    }
  ]);
  
  const addCoachMessage = useCallback((message: CoachMessage) => {
    setCoachMessages(prev => [...prev, message]);
    
    // If the message is from a user, generate a coach response after a slight delay
    if (message.sender === "user") {
      setTimeout(() => {
        const response = generateCoachResponse(message.text);
        setCoachMessages(prev => [...prev, {
          sender: "coach",
          text: response
        }]);
      }, 1500);
    }
  }, []);
  
  // Function to generate AI coach responses based on user input
  const generateCoachResponse = (userMessage: string) => {
    // Convert message to lowercase for easier matching
    const message = userMessage.toLowerCase();
    
    // Financial definitions
    if (message.includes("what's a stock") || message.includes("what is a stock")) {
      return "A stock represents ownership in a company. When you buy a stock, you're purchasing a small piece of that company, which makes you a shareholder. As the company grows and becomes more valuable, the value of your stock may increase.";
    }
    
    if (message.includes("etf") || message.includes("exchange traded fund")) {
      return "An ETF (Exchange-Traded Fund) is a basket of securities that trades on an exchange like a stock. ETFs can contain various investments like stocks, bonds, or commodities, and they typically have lower fees than mutual funds. They're a popular way to diversify your investments.";
    }
    
    if (message.includes("mutual fund")) {
      return "A mutual fund pools money from many investors to purchase a collection of stocks, bonds, or other securities. They're managed by professional fund managers who decide what to invest in based on the fund's objectives. Unlike ETFs, mutual funds only trade once per day after the market closes.";
    }
    
    // Investment strategies
    if (message.includes("how do i choose") || message.includes("which portfolio")) {
      return "Choosing a portfolio depends on your financial goals, time horizon, and risk tolerance. In Sprout, we offer portfolios based on your values and interests. Consider starting with a diversified portfolio that matches your risk comfort level. If you're new to investing, a lower-risk option might be best while you learn more about how investments work.";
    }
    
    if (message.includes("risk") || message.includes("risky")) {
      return "Risk in investing refers to the chance of losing money or earning less than expected. Generally, investments with higher potential returns carry higher risk. It's important to consider your time horizon - the longer you can keep your money invested, the more risk you may be able to tolerate since you have time to recover from market downturns.";
    }
    
    // App-specific questions
    if (message.includes("round-up") || message.includes("roundup")) {
      return "Round-ups are a feature in Sprout that automatically invests your spare change. When you make a purchase, we round up to the nearest pound and invest the difference. For example, if you spend £3.60, we'll round up to £4 and invest 40p. It's a simple way to invest without thinking about it!";
    }
    
    if (message.includes("enough to start") || message.includes("minimum")) {
      return "You can start investing with as little as £1 in Sprout! Our platform is designed to make investing accessible to everyone. Starting small is absolutely fine - the important thing is to begin building the habit of investing regularly. You can always increase your contributions as you become more comfortable.";
    }
    
    if (message.includes("difference between saving and investing")) {
      return "Saving typically means putting money in a safe place like a savings account with minimal risk and lower returns. Investing involves putting money into assets like stocks or bonds with the goal of growing your money over time, but with higher risk. Saving is great for short-term goals and emergency funds, while investing is better suited for long-term goals like retirement.";
    }
    
    if (message.includes("group fund") || message.includes("save with friends")) {
      return "Group funds in Sprout allow you to save money together with friends or family toward a shared goal. You can create a fund for things like a vacation, special event, or gift, invite others to join, track contributions, and everyone can watch the savings grow together. It's a fun and social way to reach financial goals as a team!";
    }
    
    // Default responses for anything else
    const defaultResponses = [
      "That's a great question about personal finance. In Sprout, we focus on making investing simple and accessible. Would you like to know more about our investment options or savings features?",
      "As your financial coach, I'm here to help you understand investing and saving. Could you share a bit more about what specific aspect you're curious about?",
      "I'm happy to help with that! Sprout offers various tools to help you grow your money wisely. Would you like me to explain more about our different investment portfolios or savings features?",
      "Financial decisions are personal and depend on your goals. Sprout is designed to help you invest according to your values and interests. What kind of financial goals are you working toward?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
