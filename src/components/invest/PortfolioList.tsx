
import { useState } from "react";
import { Shield } from "lucide-react";
import { PortfolioCard } from "./PortfolioCard";
import { portfolioTypes } from "@/data/investment-data";
import type { Portfolio } from "@/types/investment";

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

export const PortfolioList = ({
  portfolios,
  selectedPortfolio,
  setSelectedPortfolio,
  investments
}: PortfolioListProps) => {
  const [performanceTimeRange, setPerformanceTimeRange] = useState("12m");
  const [investmentGoal, setInvestmentGoal] = useState(1000);

  const defaultPortfolioType = {
    type: "Stocks & ETFs",
    risk: "Medium Risk",
    icon: <Shield className="h-3 w-3 mr-1" />,
  };
  
  const getPortfolioTypeInfo = (portfolioId: string) => {
    return portfolioTypes[portfolioId] || defaultPortfolioType;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold mt-6">Your Investment Portfolios</h3>
      {portfolios.map((portfolio) => (
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
            investment => selectedPortfolio && investment.portfolioId === portfolio.id
          )}
          portfolioTypeInfo={getPortfolioTypeInfo(portfolio.id)}
          performanceData={generatePerformanceData(portfolio.growth, performanceTimeRange)}
        />
      ))}
    </div>
  );
};
