import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { InvestmentCategory } from "@/components/invest/InvestmentCategory";
import { PortfolioPerformance } from "@/components/invest/PortfolioPerformance";
import { RoundUps } from "@/components/invest/RoundUps";
import { InvestmentGoal } from "@/components/invest/InvestmentGoal";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { investmentCategories, mockTransactions, portfolioTypes } from "@/data/investment-data";

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

const Invest = () => {
  const { portfolios, selectedPortfolio, setSelectedPortfolio } = usePortfolio();
  const [activeTab, setActiveTab] = useState("portfolios");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  const [investmentGoal, setInvestmentGoal] = useState(1000);
  const [roundUpAmount, setRoundUpAmount] = useState(1);
  const [performanceTimeRange, setPerformanceTimeRange] = useState("12m");

  const handlePortfolioSelect = (portfolio: any) => {
    setSelectedPortfolio(portfolio);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSelectedRiskLevel(null);
  };

  const handleRiskLevelSelect = (level: string) => {
    setSelectedRiskLevel(level);
  };

  const defaultPortfolioType = {
    type: "Stocks & ETFs",
    risk: "Medium Risk",
    icon: <Shield className="h-3 w-3 mr-1" />,
  };
  
  const getPortfolioTypeInfo = (portfolioId: string) => {
    return portfolioTypes[portfolioId] || defaultPortfolioType;
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Invest 📈</h1>
        <p className="text-gray-600">Grow your money with round-ups</p>
      </div>
      
      <Card className="p-4 bg-gray-50 text-center text-gray-700 animate-fade-in">
        <div className="flex items-center justify-center mb-1">
          <TrendingUp size={16} className="text-sprout-green mr-1" />
          <span className="text-sm font-medium">Market Trends</span>
        </div>
        <p className="text-sm">
          🌱 <strong>42%</strong> of Sprout users invested in <span className="text-green-600">Clean Energy</span> this week.
        </p>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="round-ups">Round-ups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolios" className="space-y-4">
          <div className="space-y-4">
            {investmentCategories.map((category) => (
              <InvestmentCategory
                key={category.id}
                {...category}
                selectedCategory={selectedCategory}
                selectedRiskLevel={selectedRiskLevel}
                onCategorySelect={handleCategorySelect}
                onRiskLevelSelect={handleRiskLevelSelect}
              />
            ))}
          </div>
          
          <h3 className="font-semibold mt-6">Your Investment Portfolios</h3>
          {portfolios.map((portfolio) => (
            <Card 
              key={portfolio.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedPortfolio?.id === portfolio.id
                  ? `border-2 border-${portfolio.color} bg-${portfolio.color}/5`
                  : ""
              }`}
              onClick={() => handlePortfolioSelect(portfolio)}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`text-xl mr-2 ${portfolio.color === "bg-sprout-green" ? "bg-sprout-green/10" : portfolio.color === "bg-sprout-blue" ? "bg-sprout-blue/10" : portfolio.color === "bg-sprout-lavender" ? "bg-sprout-lavender/10" : "bg-sprout-pink/10"} p-2 rounded-full`}>
                      <span>{portfolio.emoji}</span>
                    </div>
                    <h3 className="font-bold">{portfolio.name}</h3>
                  </div>
                  <div className={`text-sm font-semibold ${portfolio.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {portfolio.growth >= 0 ? "+" : ""}{portfolio.growth}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">£{portfolio.value.toFixed(2)}</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge 
                          variant={
                            portfolio.color === "bg-sprout-green" ? "green" :
                            portfolio.color === "bg-sprout-blue" ? "blue" :
                            portfolio.color === "bg-sprout-lavender" ? "lavender" : "pink"
                          }
                          className="cursor-pointer"
                        >
                          <div className="flex items-center">
                            {getPortfolioTypeInfo(portfolio.id).icon}
                            {getPortfolioTypeInfo(portfolio.id).type}
                          </div>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs font-medium">
                          {getPortfolioTypeInfo(portfolio.id).risk}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {selectedPortfolio?.id === portfolio.id && (
                <>
                  <PortfolioPerformance
                    data={generatePerformanceData(portfolio.growth, performanceTimeRange)}
                    color={portfolio.color}
                    timeRange={performanceTimeRange}
                    onTimeRangeChange={setPerformanceTimeRange}
                  />
                  
                  <InvestmentGoal
                    currentValue={portfolio.value}
                    goalValue={investmentGoal}
                    onGoalChange={setInvestmentGoal}
                    portfolioColor={portfolio.color}
                  />
                </>
              )}
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="round-ups" className="space-y-4">
          <RoundUps
            transactions={mockTransactions}
            roundUpAmount={roundUpAmount}
            onRoundUpChange={setRoundUpAmount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invest;
