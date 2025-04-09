
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/contexts/AppContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, PlusCircle } from "lucide-react";

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

// Mock performance data for charts
const generatePerformanceData = (growth: number) => {
  const data = [];
  let value = 1000;
  
  for (let i = 0; i < 12; i++) {
    // Add some randomness to make the chart more realistic
    const monthGrowth = growth / 12 + (Math.random() * 0.5 - 0.25);
    value = value * (1 + monthGrowth / 100);
    
    data.push({
      month: `Month ${i + 1}`,
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
};

const Invest = () => {
  const { portfolios, selectedPortfolio, setSelectedPortfolio } = useApp();
  const [activeTab, setActiveTab] = useState("portfolios");
  const [investmentGoal, setInvestmentGoal] = useState(1000);
  const [roundUpAmount, setRoundUpAmount] = useState(1); // 1x, 2x, 3x
  
  const handlePortfolioSelect = (portfolio: any) => {
    setSelectedPortfolio(portfolio);
  };

  const totalRoundUps = mockTransactions.reduce((acc, tx) => acc + tx.roundUp * roundUpAmount, 0);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Invest 📈</h1>
        <p className="text-gray-600">Grow your money with round-ups</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="round-ups">Round-ups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolios" className="space-y-4">
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
                <div className="flex items-center">
                  <div className={`text-xl mr-2 ${portfolio.color === "bg-sprout-green" ? "bg-sprout-green/10" : portfolio.color === "bg-sprout-blue" ? "bg-sprout-blue/10" : portfolio.color === "bg-sprout-lavender" ? "bg-sprout-lavender/10" : "bg-sprout-pink/10"} p-2 rounded-full`}>
                    <span>{portfolio.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{portfolio.name}</h3>
                    <p className="text-sm text-gray-600">£{portfolio.value.toFixed(2)}</p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${portfolio.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {portfolio.growth >= 0 ? "+" : ""}{portfolio.growth}%
                </div>
              </div>
              
              {selectedPortfolio?.id === portfolio.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <h4 className="font-semibold mb-2">12 Month Performance</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={generatePerformanceData(portfolio.growth)}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <XAxis 
                          dataKey="month" 
                          hide={true}
                        />
                        <YAxis hide={true} />
                        <Tooltip
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
                    
                    <Button className="w-full btn-action btn-primary">
                      Add Investment <PlusCircle size={18} />
                    </Button>
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
