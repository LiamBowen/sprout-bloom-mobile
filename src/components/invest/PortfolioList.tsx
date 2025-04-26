
import { useState, useEffect } from "react";
import { Shield, Bitcoin, PieChart } from "lucide-react";
import { PortfolioCard } from "./PortfolioCard";
import { portfolioTypes } from "@/data/investment-data";
import type { Portfolio } from "@/types/investment";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocation } from "react-router-dom";

interface PortfolioListProps {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: (portfolio: Portfolio) => void;
  investments: any[];
}

const generatePerformanceData = (growth: number, timeRange: string) => {
  const data = [];
  let value = 1000;
  let periods;

  switch (timeRange) {
    case "24h":
      periods = 24;
      break;
    case "1w":
      periods = 7;
      break;
    case "1m":
      periods = 30;
      break;
    case "1y":
      periods = 365;
      break;
    case "12m":
    default:
      periods = 12;
      break;
  }
  
  for (let i = 0; i < periods; i++) {
    const periodGrowth = growth / periods + (Math.random() * 0.5 - 0.25);
    value = value * (1 + periodGrowth / 100);
    
    data.push({
      period: `${timeRange === "24h" ? `Hour ${i + 1}` : 
                timeRange === "1w" ? `Day ${i + 1}` : 
                timeRange === "1m" ? `Day ${i + 1}` : 
                timeRange === "1y" ? `Month ${i + 1}` : 
                `Month ${i + 1}`}`,
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
};

const portfolioTypeInfoMap: Record<string, any> = {
  "stocks-etfs": {
    type: "Stocks & ETFs",
    risk: "Medium Risk",
    icon: <Shield className="h-3 w-3 mr-1" />,
  },
  "crypto": {
    type: "Crypto",
    risk: "High Risk",
    icon: <Bitcoin className="h-3 w-3 mr-1" />,
  },
  "fractional": {
    type: "Fractional Shares",
    risk: "Low-Medium Risk",
    icon: <PieChart className="h-3 w-3 mr-1" />,
  }
};

export const PortfolioList = ({
  portfolios,
  selectedPortfolio,
  setSelectedPortfolio,
  investments
}: PortfolioListProps) => {
  const [performanceTimeRange, setPerformanceTimeRange] = useState("12m");
  const [investmentGoal, setInvestmentGoal] = useState(1000);
  const location = useLocation();
  const [selectedType, setSelectedType] = useState(() => {
    console.log("Location state:", location.state);
    return (location.state as any)?.selectedType || "stocks-etfs";
  });

  // Effect to select the first portfolio of the selected type if none is selected
  useEffect(() => {
    const filtered = portfolios.filter(portfolio => portfolio.category === selectedType);
    if (filtered.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(filtered[0]);
    }
  }, [selectedType, portfolios, selectedPortfolio, setSelectedPortfolio]);

  // Effect to handle incoming navigation state changes
  useEffect(() => {
    if (location.state && (location.state as any).selectedType) {
      setSelectedType((location.state as any).selectedType);
    }
  }, [location.state]);

  const getPortfolioTypeInfo = (portfolio: Portfolio) => {
    return portfolioTypeInfoMap[portfolio.category] || portfolioTypeInfoMap["stocks-etfs"];
  };

  const filteredPortfolios = portfolios.filter(portfolio => {
    return portfolio.category === selectedType;
  });

  console.log("Selected type:", selectedType);
  console.log("Filtered portfolios:", filteredPortfolios);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold mt-6">Your Investment Portfolios</h3>
      
      <ToggleGroup 
        type="single" 
        value={selectedType}
        onValueChange={(value) => {
          if (value) {
            console.log("Setting selected type:", value);
            setSelectedType(value);
          }
        }}
        className="justify-start w-full border rounded-lg p-1 bg-muted"
      >
        <ToggleGroupItem value="stocks-etfs" className="flex-1">
          Stocks & ETFs
        </ToggleGroupItem>
        <ToggleGroupItem value="crypto" className="flex-1">
          Crypto
        </ToggleGroupItem>
        <ToggleGroupItem value="fractional" className="flex-1">
          Fractional Shares
        </ToggleGroupItem>
      </ToggleGroup>

      {filteredPortfolios.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No {selectedType.replace('-', ' ')} investments yet.</p>
        </div>
      ) : (
        filteredPortfolios.map((portfolio) => (
          <PortfolioCard
            key={portfolio.id}
            portfolio={portfolio}
            isSelected={selectedPortfolio?.id === portfolio.id}
            onSelect={setSelectedPortfolio}
            performanceTimeRange={performanceTimeRange}
            onTimeRangeChange={setPerformanceTimeRange}
            investmentGoal={investmentGoal}
            onGoalChange={setInvestmentGoal}
            portfolioInvestments={investments.filter(
              investment => investment.portfolioId === portfolio.id
            )}
            portfolioTypeInfo={getPortfolioTypeInfo(portfolio)}
            performanceData={generatePerformanceData(portfolio.growth, performanceTimeRange)}
          />
        ))
      )}
    </div>
  );
};
