import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SavingPot, GroupFund, GroupMember, Message } from "@/components/save/types";

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  referralCode: string;
  friendsReferred: number;
  rewardsEarned: number;
}

// Define Portfolio type
interface Portfolio {
  id: string;
  name: string;
  value: number;
  growth: number;
  emoji: string;
  color: string;
}

// Define Coach Message type
interface CoachMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

// Define the context type
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: (portfolio: Portfolio | null) => void;
  savingPots: SavingPot[];
  addSavingPot: (pot: SavingPot) => void;
  updateSavingPot: (id: string, updates: Partial<SavingPot>) => void;
  groupFunds: GroupFund[];
  addGroupFund: (fund: GroupFund) => void;
  updateGroupFund: (id: string, updates: Partial<GroupFund>) => void;
  coachMessages: CoachMessage[];
  addCoachMessage: (message: Omit<CoachMessage, "id" | "timestamp">) => void;
  showConfetti: boolean;
  triggerConfetti: () => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockUser: User = {
  id: "user1",
  name: "Alex",
  email: "alex@example.com",
  dateOfBirth: "01/01/2000",
  referralCode: "ALEXSPROUT",
  friendsReferred: 3,
  rewardsEarned: 15,
};

const mockPortfolios: Portfolio[] = [
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
  },
];

const mockSavingPots: SavingPot[] = [
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
];

const mockGroupFunds: GroupFund[] = [
  {
    id: "ibiza2025",
    name: "Ibiza Trip 2025",
    emoji: "🏝️",
    target: 2000,
    currentAmount: 850,
    members: [
      {
        id: "user1",
        name: "Alex",
        contributed: 300,
        contributionPercentage: 60,
      },
      {
        id: "user2",
        name: "Jordan",
        contributed: 250,
        contributionPercentage: 50,
      },
      {
        id: "user3",
        name: "Taylor",
        contributed: 300,
        contributionPercentage: 60,
      },
    ],
    messages: [
      {
        id: "msg1",
        sender: "Jordan",
        text: "Just added another £50! 🎉",
        timestamp: new Date("2025-02-15T12:30:00"),
      },
      {
        id: "msg2",
        sender: "Taylor",
        text: "We're almost halfway there!",
        timestamp: new Date("2025-02-14T09:15:00"),
      },
    ],
  },
];

const mockCoachMessages: CoachMessage[] = [
  {
    id: "coach1",
    sender: "coach",
    text: "👋 Hey there! I'm your Sprout Coach. Ask me anything about investing or saving!",
    timestamp: new Date("2025-02-10T10:00:00"),
  },
];

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [portfolios, setPortfolios] = useState(mockPortfolios);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(mockPortfolios[0]);
  const [savingPots, setSavingPots] = useState(mockSavingPots);
  const [groupFunds, setGroupFunds] = useState(mockGroupFunds);
  const [coachMessages, setCoachMessages] = useState(mockCoachMessages);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check localStorage for existing state on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("sprout_user");
    const storedOnboarded = localStorage.getItem("sprout_onboarded");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedOnboarded) {
      setIsOnboarded(JSON.parse(storedOnboarded));
    }
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("sprout_user", JSON.stringify(user));
    }
    
    localStorage.setItem("sprout_onboarded", JSON.stringify(isOnboarded));
  }, [user, isOnboarded]);

  // Helper functions to update state
  const addSavingPot = (pot: SavingPot) => {
    setSavingPots((prev) => [...prev, pot]);
  };

  const updateSavingPot = (id: string, updates: Partial<SavingPot>) => {
    setSavingPots((prev) =>
      prev.map((pot) =>
        pot.id === id ? { ...pot, ...updates } : pot
      )
    );
  };

  const addGroupFund = (fund: GroupFund) => {
    setGroupFunds((prev) => [...prev, fund]);
  };

  const updateGroupFund = (id: string, updates: Partial<GroupFund>) => {
    setGroupFunds((prev) =>
      prev.map((fund) =>
        fund.id === id ? { ...fund, ...updates } : fund
      )
    );
  };

  const addCoachMessage = (message: Omit<CoachMessage, "id" | "timestamp">) => {
    const newMessage: CoachMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
    
    setCoachMessages((prev) => [...prev, newMessage]);
    
    if (message.sender === "user") {
      setTimeout(() => {
        let response: CoachMessage = {
          id: `coach_${Date.now()}`,
          sender: "coach",
          text: "I'm thinking about that...",
          timestamp: new Date(),
        };
        
        const lowerCaseText = message.text.toLowerCase();
        
        if (lowerCaseText.includes("stock")) {
          response.text = "A stock is basically a small piece of ownership in a company! When you buy a stock, you own a tiny slice of that business. If the company does well, your stock usually becomes more valuable. It's like planting a seed and watching it grow! 🌱📈";
        } else if (lowerCaseText.includes("enough") || lowerCaseText.includes("£10")) {
          response.text = "Yes! £10 is absolutely enough to start investing! 🙌 The most important thing is getting started early, not how much you invest. With Sprout, you can start small and grow your investments over time. Think of it like planting seeds - even small ones can grow into something amazing! 🌱";
        } else if (lowerCaseText.includes("portfolio") || lowerCaseText.includes("choose")) {
          response.text = "Choosing a portfolio is all about what matters to you! 💭 Our Green Growth portfolio focuses on sustainable companies. Future Tech invests in innovative technology. Travel & Freedom has companies in travel and leisure. Ethical Brands supports companies with strong values. Think about what excites you most about the future! ✨";
        } else {
          response.text = "That's a great question! Investing is all about growing your money over time by putting it into different things like companies or projects. The key is to start small, be consistent, and think long-term. Is there anything specific about investing that you're curious about? 😊";
        }
        
        setCoachMessages((prev) => [...prev, response]);
      }, 1500);
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Create the value object
  const contextValue: AppContextType = {
    user,
    setUser,
    isOnboarded,
    setIsOnboarded,
    portfolios,
    selectedPortfolio,
    setSelectedPortfolio,
    savingPots,
    addSavingPot,
    updateSavingPot,
    groupFunds,
    addGroupFund,
    updateGroupFund,
    coachMessages,
    addCoachMessage,
    showConfetti,
    triggerConfetti,
  };

  // Return the provider
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
