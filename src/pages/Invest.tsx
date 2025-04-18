import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, BarChart2, Bitcoin, PieChart, PlusCircle, Shield, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";
import AddInvestment from "@/components/AddInvestment";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    merchant: "Coffee Shop",
    amount: 3.50,
    date: "Today",
    roundUp: 0.50,
  },
  {
    id: "tx2",
    merchant: "Grocery Store",
    amount: 24.75,
    date: "Yesterday",
    roundUp: 0.25,
  },
  {
    id: "tx3",
    merchant: "Transport",
    amount: 2.40,
    date: "Yesterday",
    roundUp: 0.60,
  },
  {
    id: "tx4",
    merchant: "Restaurant",
    amount: 18.20,
    date: "2 days ago",
    roundUp: 0.80,
  },
];

// Investment category details with risk levels
const investmentCategories = [
  {
    id: "stocks-etfs",
    name: "Stocks & ETFs",
    icon: <BarChart2 className="h-5 w-5" />,
    description: "Invest in individual stocks or exchange-traded funds (ETFs)",
    riskLevels: [
      {
        level: "Low Risk",
        icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
        description: "Stable, long-term growth with minimal volatility.",
        assets: ['S&P 500 ETFs', 'Dividend Stocks', 'Bonds'],
      },
      {
        level: "Medium Risk",
        icon: <Shield className="h-4 w-4 text-yellow-500" />,
        description: "Diversified growth with moderate risk.",
        assets: ['Growth ETFs', 'Large-cap stocks', 'Balanced funds'],
      },
      {
        level: "High Risk",
        icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
        description: "Aggressive growth with higher risk.",
        assets: ['Emerging tech stocks', 'Disruptive growth ETFs'],
      }
    ]
  },
  {
    id: "crypto",
    name: "Cryptocurrencies",
    icon: <Bitcoin className="h-5 w-5" />,
    description: "Invest in various cryptocurrencies",
    riskLevels: [
      {
        level: "Low Risk",
        icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
        description: "Focus on stablecoins and well-established cryptos.",
        assets: ['Stablecoins (USDT, USDC)'],
      },
      {
        level: "Medium Risk",
        icon: <Shield className="h-4 w-4 text-yellow-500" />,
        description: "A mix of established and emerging cryptos.",
        assets: ['Bitcoin (BTC)', 'Ethereum (ETH)'],
      },
      {
        level: "High Risk",
        icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
        description: "High volatility, potential for large returns.",
        assets: ['Ethereum (ETH)', 'Solana (SOL)', 'Smaller Altcoins'],
      }
    ]
  },
  {
    id: "fractional",
    name: "Fractional Shares",
    icon: <PieChart className="h-5 w-5" />,
    description: "Buy portions of expensive stocks",
    riskLevels: [
      {
        level: "Low Risk",
        icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
        description: "Low-risk, well-known stocks.",
        assets: ['Blue-chip stocks', 'Low-risk ETFs'],
      },
      {
        level: "Medium Risk",
        icon: <Shield className="h-4 w-4 text-yellow-500" />,
        description: "Growth-focused stocks with moderate volatility.",
        assets: ['Growth stocks', 'Tech stocks'],
      },
      {
        level: "High Risk",
        icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
        description: "Highly volatile, high-reward stocks.",
        assets: ['Small-cap stocks', 'Volatile tech stocks'],
      }
    ]
  }
];

// Define portfolio investment types map
const portfolioTypes = {
  "green-growth": {
    type: "Stocks & ETFs",
    risk: "Low Risk",
    icon: <ShieldCheck className="h-3 w-3 mr-1" />,
  },
  "future-tech": {
    type: "Stocks & ETFs",
    risk: "High Risk",
    icon: <ShieldAlert className="h-3 w-3 mr-1" />,
  },
  "travel-freedom": {
    type: "Stocks & ETFs",
    risk: "Medium Risk",
    icon: <Shield className="h-3 w-3 mr-1" />,
  },
  "ethical-brands": {
    type: "Fractional Shares",
    risk: "Low Risk",
    icon: <ShieldCheck className="h-3 w-3 mr-1" />,
  },
};

// Mock performance data for charts
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
  const { portfolios, selectedPortfolio, setSelectedPortfolio } = useApp();
  const [activeTab, setActiveTab] = useState("portfolios");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  const [investmentGoal, setInvestmentGoal] = useState(1000);
  const [roundUpAmount, setRoundUpAmount] = useState(1); // 1x, 2x, 3x
  const [addInvestmentOpen, setAddInvestmentOpen] = useState(false);
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

  const totalRoundUps = mockTransactions.reduce((acc, tx) => acc + tx.roundUp * roundUpAmount, 0);

  // Find the current category object
  const currentCategory = investmentCategories.find(cat => cat.id === selectedCategory);
  // Find the current risk level
  const currentRiskLevel = currentCategory?.riskLevels.find(risk => risk.level === selectedRiskLevel);
  
  // Default portfolio type info to handle any missing mappings
  const defaultPortfolioType = {
    type: "Stocks & ETFs",
    risk: "Medium Risk",
    icon: <Shield className="h-3 w-3 mr-1" />,
  };
  
  // Helper function to safely get portfolio type info
  const getPortfolioTypeInfo = (portfolioId: string) => {
    return portfolioTypes[portfolioId] || defaultPortfolioType;
  };
  
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Invest 📈</h1>
        <p className="text-gray-600">Grow your money with round-ups</p>
      </div>
      
      {/* Market Trend Card */}
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
          {/* Investment Categories */}
          <div className="space-y-4">
            {investmentCategories.map((category) => (
              <Card 
                key={category.id}
                className={`overflow-hidden`}
              >
                {/* Category Header */}
                <div 
                  className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
                    selectedCategory === category.id ? "bg-sprout-green/10" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-sprout-green/10 p-2 rounded-full">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Risk Levels */}
                {selectedCategory === category.id && (
                  <div className="border-t p-4 animate-fade-in">
                    <h4 className="text-sm font-semibold mb-3">Select Risk Tolerance</h4>
                    <div className="space-y-3">
                      {category.riskLevels.map((risk) => (
                        <div 
                          key={risk.level}
                          className={`p-3 border rounded-md cursor-pointer transition-all flex items-start gap-3 ${
                            selectedRiskLevel === risk.level ? "border-sprout-green bg-sprout-green/5" : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleRiskLevelSelect(risk.level)}
                        >
                          {risk.icon}
                          <div>
                            <h5 className="font-medium">{risk.level}</h5>
                            <p className="text-xs text-gray-600">{risk.description}</p>
                            
                            {selectedRiskLevel === risk.level && (
                              <div className="mt-2 pt-2 border-t animate-fade-in">
                                <h6 className="text-xs font-medium mb-1">Recommended Assets:</h6>
                                <ul className="text-xs space-y-1">
                                  {risk.assets.map((asset, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <span className="h-1.5 w-1.5 rounded-full bg-sprout-green"></span>
                                      {asset}
                                    </li>
                                  ))}
                                </ul>
                                
                                <Dialog open={addInvestmentOpen} onOpenChange={setAddInvestmentOpen}>
                                  <DialogTrigger asChild>
                                    <Button className="w-full btn-action btn-primary mt-3 text-xs py-1 h-auto">
                                      Add Investment <PlusCircle size={14} className="ml-1" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="p-0">
                                    <AddInvestment 
                                      onSuccess={() => setAddInvestmentOpen(false)}
                                      category={category.name}
                                      riskLevel={risk.level}
                                      recommendedAssets={risk.assets}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          {/* Portfolio Performance */}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`text-xl ${portfolio.color === "bg-sprout-green" ? "bg-sprout-green/10" : portfolio.color === "bg-sprout-blue" ? "bg-sprout-blue/10" : portfolio.color === "bg-sprout-lavender" ? "bg-sprout-lavender/10" : "bg-sprout-pink/10"} p-2 rounded-full`}>
                    <span>{portfolio.emoji}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-1">
                    <h3 className="font-bold">{portfolio.name}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant={
                              portfolio.color === "bg-sprout-green" ? "green" :
                              portfolio.color === "bg-sprout-blue" ? "blue" :
                              portfolio.color === "bg-sprout-lavender" ? "lavender" : "pink"
                            }
                            className="cursor-pointer text-xs"
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
                          <p className="text-xs">
                            {getPortfolioTypeInfo(portfolio.id).type === "Stocks & ETFs" ? 
                              "Individual stocks or ETFs with various risk levels" :
                            getPortfolioTypeInfo(portfolio.id).type === "Cryptocurrencies" ?
                              "Digital assets with high potential returns" :
                              "Portions of expensive shares from established companies"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">£{portfolio.value.toFixed(2)}</p>
                  <span className={`text-sm font-semibold ${portfolio.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {portfolio.growth >= 0 ? "+" : ""}{portfolio.growth}%
                  </span>
                </div>
              </div>
              
              {selectedPortfolio?.id === portfolio.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Performance</h4>
                    <div className="flex space-x-2">
                      {["24h", "1w", "1m", "12m"].map((range) => (
                        <button
                          key={range}
                          onClick={() => setPerformanceTimeRange(range)}
                          className={`text-xs px-2 py-1 rounded-full ${
                            performanceTimeRange === range
                              ? "bg-sprout-green text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {range === "24h" ? "24H" : 
                           range === "1w" ? "1W" : 
                           range === "1m" ? "1M" : 
                           "1Y"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={generatePerformanceData(portfolio.growth, performanceTimeRange)}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <XAxis 
                          dataKey="period" 
                          hide={true}
                        />
                        <YAxis hide={true} />
                        <RechartsTooltip
                          formatter={(value) => [`£${value}`, "Value"]}
                          labelFormatter={() => ""}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={portfolio.color === "bg-sprout-green" ? "#A8D5BA" : 
                                  portfolio.color === "bg-sprout-blue" ? "#B8D8EB" :
                                  portfolio.color === "bg-sprout-lavender" ? "#E0BBE4" : "#F8C4B4"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-4">Your Investment Goal</h4>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Current: £{portfolio.value.toFixed(2)}</span>
                      <span>Goal: £{investmentGoal}</span>
                    </div>
                    <Slider
                      value={[investmentGoal]}
                      min={500}
                      max={5000}
                      step={100}
                      onValueChange={(value) => setInvestmentGoal(value[0])}
                      className="mb-4"
                    />
                    
                    <div className="progress-bar mt-2 mb-4">
                      <div
                        className={`progress-fill ${
                          portfolio.color === "bg-sprout-green" ? "bg-sprout-green" : 
                          portfolio.color === "bg-sprout-blue" ? "bg-sprout-blue" :
                          portfolio.color === "bg-sprout-lavender" ? "bg-sprout-lavender" : "bg-sprout-pink"
                        }`}
                        style={{ width: `${Math.min(100, (portfolio.value / investmentGoal) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="round-ups" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-4">Round-up Multiplier</h3>
            <p className="text-sm text-gray-600 mb-4">
              Round up your purchases and invest the spare change.
            </p>
            
            <div className="flex justify-between space-x-3 mb-6">
              {[1, 2, 3].map((multiplier) => (
                <button
                  key={multiplier}
                  onClick={() => setRoundUpAmount(multiplier)}
                  className={`flex-1 py-3 rounded-lg border ${
                    roundUpAmount === multiplier
                      ? "border-sprout-green bg-sprout-green/10"
                      : "border-gray-200"
                  }`}
                >
                  {multiplier}x
                </button>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This week's round-ups:</span>
                <span className="font-bold">£{(totalRoundUps).toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full btn-action btn-primary">
              Invest Round-ups <ArrowRight size={18} />
            </Button>
          </Card>
          
          <h3 className="font-semibold mt-4">Recent Transactions</h3>
          
          {mockTransactions.map((tx) => (
            <Card key={tx.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{tx.merchant}</h4>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">£{tx.amount.toFixed(2)}</div>
                  <div className="text-xs text-sprout-green">
                    +£{(tx.roundUp * roundUpAmount).toFixed(2)} round-up
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invest;
