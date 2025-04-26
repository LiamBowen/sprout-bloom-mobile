
import { createContext, useContext, useState, ReactNode } from "react";

interface Portfolio {
  id: string;
  name: string;
  value: number;
  growth: number;
  emoji: string;
  color: string;
}

interface Investment {
  id: string;
  portfolioId: string;
  asset: string;
  amount: number;
  date: string;
  category: string;
  riskLevel: string;
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: (portfolio: Portfolio | null) => void;
  showConfetti: boolean;
  triggerConfetti: () => void;
  investments: Investment[];
  addInvestment: (investment: Omit<Investment, "id" | "date" | "portfolioId">) => void;
}

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

// Get a random emoji based on category
const getEmojiForCategory = (category: string): string => {
  const emojiMap: Record<string, string[]> = {
    "Stocks & ETFs": ["📈", "💼", "🏢", "📊"],
    "Crypto": ["₿", "🔒", "💰", "🌐"],
    "Fractional Shares": ["🧩", "🔢", "🏙️", "🛍️"]
  };
  
  const defaultEmojis = ["💸", "💵", "💹"];
  const emojis = emojiMap[category] || defaultEmojis;
  return emojis[Math.floor(Math.random() * emojis.length)];
};

// Get a random color for new portfolios
const getRandomColor = (): string => {
  const colors = ["bg-sprout-green", "bg-sprout-blue", "bg-sprout-lavender", "bg-sprout-pink"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [portfolios, setPortfolios] = useState(mockPortfolios);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(mockPortfolios[0]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const addInvestment = (investment: Omit<Investment, "id" | "date" | "portfolioId">) => {
    // Generate a new portfolio ID based on the asset name
    const portfolioId = `${investment.asset.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
    
    // Create a new portfolio for this investment
    const newPortfolio: Portfolio = {
      id: portfolioId,
      name: investment.asset,
      value: investment.amount,
      growth: Math.random() * 10 - 2, // Random growth between -2% and 8%
      emoji: getEmojiForCategory(investment.category),
      color: getRandomColor(),
    };
    
    // Add the new portfolio
    setPortfolios(prev => [...prev, newPortfolio]);
    
    // Create the investment
    const newInvestment: Investment = {
      ...investment,
      portfolioId,
      id: `inv-${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    // Add the investment
    setInvestments(prev => [...prev, newInvestment]);
    
    // Set the newly created portfolio as selected
    setSelectedPortfolio(newPortfolio);
    
    triggerConfetti();
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        setSelectedPortfolio,
        showConfetti,
        triggerConfetti,
        investments,
        addInvestment,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
