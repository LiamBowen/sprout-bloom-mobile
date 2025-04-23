
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { SavingPot } from "@/components/save/types";
import { GroupFund } from "@/components/save/types";

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  referralCode: string;
  friendsReferred: number;
  rewardsEarned: number;
  avatar_url?: string;
  mobile_number?: string;
  portfolioThemes: string[];
  riskLevel: string;
}

// Define portfolio type
interface Portfolio {
  id: string;
  name: string;
  value: number;
  growth: number;
  emoji: string;
  color: string;
}

// Define the coach message type
interface CoachMessage {
  sender: "user" | "coach";
  text: string;
}

interface AppContextProps {
  // Saving pots
  savingPots: SavingPot[];
  addSavingPot: (pot: SavingPot) => void;
  updateSavingPot: (id: string, pot: Partial<SavingPot>) => void;
  removeSavingPot: (id: string) => void;
  
  // Group funds
  groupFunds: GroupFund[];
  addGroupFund: (fund: GroupFund) => void;
  removeGroupFund: (id: string) => void;
  
  // User information
  user: User | null;
  setUser: (user: User | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  
  // Portfolio information
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: (portfolio: Portfolio | null) => void;
  
  // Coach functionality
  coachMessages: CoachMessage[];
  addCoachMessage: (message: CoachMessage) => void;
  
  // Confetti effect
  showConfetti: boolean;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Saving pots state
  const [savingPots, setSavingPots] = useState<SavingPot[]>([
    {
      id: "emergency-fund",
      name: "Emergency Fund",
      amount: 520,
      target: 1000,
      apy: 4.25,
      provider: "Barclays Savings"
    },
    {
      id: "vacation",
      name: "Summer Vacation",
      amount: 350,
      target: 800,
      apy: 4.25,
      provider: "Monzo Savings Pot"
    },
  ]);

  // Group funds state
  const [groupFunds, setGroupFunds] = useState<GroupFund[]>([
    {
      id: "house-deposit",
      name: "House Deposit",
      emoji: "🏠",
      target: 5000,
      amount: 1200,
      members: ["You", "Alex", "Sarah"],
      messages: [
        { sender: "Alex", message: "Just added £50!", timestamp: new Date().toISOString() },
        { sender: "You", message: "Great! Almost halfway there.", timestamp: new Date().toISOString() }
      ]
    },
    {
      id: "holiday-2025",
      name: "Holiday 2025",
      emoji: "✈️",
      target: 2000,
      amount: 650,
      members: ["You", "Jamie", "Chris", "Pat"],
      messages: [
        { sender: "Jamie", message: "Where should we go?", timestamp: new Date().toISOString() },
        { sender: "Chris", message: "I vote for Greece!", timestamp: new Date().toISOString() }
      ]
    }
  ]);

  // User state
  const [user, setUser] = useState<User | null>({
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    dateOfBirth: "15/06/1995",
    referralCode: "ALEXJ2025",
    friendsReferred: 3,
    rewardsEarned: 15,
    portfolioThemes: ["Tech", "Sustainable", "AI"],
    riskLevel: "Medium"
  });

  // Onboarding state
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);

  // Portfolio state
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: "green-growth",
      name: "Green Growth",
      value: 1250.75,
      growth: 5.2,
      emoji: "🌱",
      color: "bg-sprout-green",
    },
    {
      id: "future-tech",
      name: "Future Tech",
      value: 980.50,
      growth: 8.7,
      emoji: "💻",
      color: "bg-sprout-blue",
    },
    {
      id: "travel-freedom",
      name: "Travel & Freedom",
      value: 750.25,
      growth: 3.9,
      emoji: "✈️",
      color: "bg-sprout-lavender",
    },
    {
      id: "ethical-brands",
      name: "Ethical Brands",
      value: 500.00,
      growth: 2.1,
      emoji: "🛍️",
      color: "bg-sprout-pink",
    }
  ]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  // Coach messages state
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([
    {
      sender: "coach",
      text: "Hi there! I'm your financial coach. How can I help you today?"
    }
  ]);

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize selected portfolio
  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios, selectedPortfolio]);

  // Saving pot functions
  const addSavingPot = (pot: SavingPot) => {
    setSavingPots(prevPots => [...prevPots, pot]);
  };

  const updateSavingPot = (id: string, updates: Partial<SavingPot>) => {
    setSavingPots(prevPots => 
      prevPots.map(pot => 
        pot.id === id ? { ...pot, ...updates } : pot
      )
    );
  };
  
  const removeSavingPot = (id: string) => {
    setSavingPots(prevPots => prevPots.filter(pot => pot.id !== id));
  };

  // Group fund functions
  const addGroupFund = (fund: GroupFund) => {
    setGroupFunds(prevFunds => [...prevFunds, fund]);
  };

  const removeGroupFund = (id: string) => {
    setGroupFunds(prevFunds => prevFunds.filter(fund => fund.id !== id));
  };

  // Coach message functions
  const addCoachMessage = (message: CoachMessage) => {
    setCoachMessages(prevMessages => [...prevMessages, message]);

    // If this is a user message, simulate a coach response
    if (message.sender === "user") {
      // Add typing indicator by setting isTyping in the Coach component
      
      // Simulate a delay before the coach responds
      setTimeout(() => {
        const responses = [
          "That's a great question! Investing early, even small amounts, can lead to significant growth over time due to compound interest.",
          "I recommend starting with a diversified portfolio that matches your risk tolerance.",
          "Saving regularly is key to financial success. Even £5 a week can grow significantly over time!",
          "Round-ups are a great way to save without noticing. They round up your purchases to the nearest pound and invest the difference.",
          "The best investment strategy is one you can stick with consistently over time."
        ];
        
        // Pick a random response
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setCoachMessages(prevMessages => [
          ...prevMessages,
          {
            sender: "coach",
            text: randomResponse
          }
        ]);
      }, 1500);
    }
  };

  // Confetti function
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <AppContext.Provider value={{ 
      savingPots,
      addSavingPot,
      updateSavingPot,
      removeSavingPot,
      groupFunds,
      addGroupFund,
      removeGroupFund,
      user,
      setUser,
      isOnboarded,
      setIsOnboarded,
      portfolios,
      selectedPortfolio,
      setSelectedPortfolio,
      coachMessages,
      addCoachMessage,
      showConfetti,
      triggerConfetti
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
