import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import {
  Sprout,
  Bot,
  ChevronsUp,
  TrendingUp,
  User,
  Wallet,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "@/components/Confetti";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const { user, portfolios, savingPots } = useApp();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  // Extract first name, handling different name formats
  const firstName = user.name.split(' ')[0];
  
  const totalPortfolioValue = portfolios.reduce((acc, portfolio) => acc + portfolio.value, 0);
  const totalSavingsValue = savingPots.reduce((acc, pot) => acc + pot.amount, 0);
  const totalValue = totalPortfolioValue + totalSavingsValue;
  
  return (
    <div className="space-y-6">
      <Confetti />
      
      <div className="animate-fade-in flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
          Hi, {firstName} <span className="wave">👋</span>
        </h1>
        <p className="text-gray-600">Welcome back to your money garden</p>
      </div>
      
      <Card className="p-6 bg-gradient-to-br from-sprout-green/30 to-sprout-green/10 animate-slide-up">
        <h2 className="font-semibold text-sm text-gray-600 mb-1">Your total balance</h2>
        <div className="text-2xl font-bold mb-3">£{totalValue.toFixed(2)}</div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <TrendingUp size={16} className="mr-1 text-gray-600" />
              <span className="text-xs text-gray-600">Investments</span>
            </div>
            <div className="font-semibold">£{totalPortfolioValue.toFixed(2)}</div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <ChevronsUp size={16} className="mr-1 text-gray-600" />
              <span className="text-xs text-gray-600">Savings</span>
            </div>
            <div className="font-semibold">£{totalSavingsValue.toFixed(2)}</div>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <h2 className="text-xl font-semibold">What your friends are investing in <Wallet className="inline w-5 h-5" /></h2>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <p>
              <strong>Jess</strong> rounded up <span className="font-medium">£1.20</span> into <span className="text-green-600">Tech I Use</span>
            </p>
            <Badge variant="green">ETF</Badge>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <p>
              <strong>Sam</strong> invested <span className="font-medium">£10</span> in <span className="text-green-600">Crypto Growth</span>
            </p>
            <Badge variant="blue">Crypto</Badge>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <p>
              <strong>You</strong> invested <span className="font-medium">£5</span> in <span className="text-green-600">Sustainable Future</span>
            </p>
            <Badge variant="lavender">ESG</Badge>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.25s" }}>
        <h3 className="font-semibold">Quick Links</h3>
        
        <Card className="p-4" onClick={() => navigate("/app/save")}>
          <div className="flex items-center">
            <div className="bg-sprout-lavender/20 rounded-full p-2 mr-3">
              <MessageSquare size={18} className="text-sprout-lavender" />
            </div>
            <div>
              <h4 className="font-medium">Start a group fund</h4>
              <p className="text-sm text-gray-600">Save together with friends</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4" onClick={() => navigate("/app/invest")}>
          <div className="flex items-center">
            <div className="bg-sprout-green/20 rounded-full p-2 mr-3">
              <Sprout size={18} className="text-sprout-green" />
            </div>
            <div>
              <h4 className="font-medium">Explore new portfolios</h4>
              <p className="text-sm text-gray-600">Find investments that match your values</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4" onClick={() => navigate("/app/coach")}>
          <div className="flex items-center">
            <div className="bg-sprout-blue/20 rounded-full p-2 mr-3">
              <Bot size={18} className="text-sprout-blue" />
            </div>
            <div>
              <h4 className="font-medium">Ask the Coach anything</h4>
              <p className="text-sm text-gray-600">Get friendly financial advice</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
