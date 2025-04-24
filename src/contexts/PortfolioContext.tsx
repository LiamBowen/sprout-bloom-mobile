
import { createContext, useContext, useState, ReactNode } from "react";

interface Portfolio {
  id: string;
  name: string;
  value: number;
  growth: number;
  emoji: string;
  color: string;
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: (portfolio: Portfolio | null) => void;
  showConfetti: boolean;
  triggerConfetti: () => void;
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

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [portfolios] = useState(mockPortfolios);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(mockPortfolios[0]);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        setSelectedPortfolio,
        showConfetti,
        triggerConfetti,
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
