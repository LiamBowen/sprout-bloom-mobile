
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronRight, Leaf } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

type PortfolioRecommendations = {
  [key: string]: {
    [key: string]: {
      description: string;
      assets: string[];
    };
  };
};

const AddInvestment = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [investmentCategory, setInvestmentCategory] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const { toast } = useToast();
  const { selectedPortfolio } = useApp();
  
  // Investment categories and risk levels
  const categories = ['Stocks & ETFs', 'Cryptocurrencies', 'Fractional Shares'];
  const riskLevels = ['Low Risk', 'Medium Risk', 'High Risk'];
  
  // Investment portfolio recommendations
  const portfolioRecommendations: PortfolioRecommendations = {
    'Low Risk': {
      'Stocks & ETFs': {
        description: 'Stable, long-term growth with minimal volatility.',
        assets: ['S&P 500 ETFs', 'Dividend Stocks', 'Bonds'],
      },
      'Cryptocurrencies': {
        description: 'Focus on stablecoins and well-established cryptos.',
        assets: ['Stablecoins (USDT, USDC)'],
      },
      'Fractional Shares': {
        description: 'Low-risk, well-known stocks.',
        assets: ['Blue-chip stocks', 'Low-risk ETFs'],
      },
    },
    'Medium Risk': {
      'Stocks & ETFs': {
        description: 'Diversified growth with moderate risk.',
        assets: ['Growth ETFs', 'Large-cap stocks', 'Balanced funds'],
      },
      'Cryptocurrencies': {
        description: 'A mix of established and emerging cryptos.',
        assets: ['Bitcoin (BTC)', 'Ethereum (ETH)'],
      },
      'Fractional Shares': {
        description: 'Growth-focused stocks with moderate volatility.',
        assets: ['Growth stocks', 'Tech stocks'],
      },
    },
    'High Risk': {
      'Stocks & ETFs': {
        description: 'Aggressive growth with higher risk.',
        assets: ['Emerging tech stocks', 'Disruptive growth ETFs'],
      },
      'Cryptocurrencies': {
        description: 'High volatility, potential for large returns.',
        assets: ['Ethereum (ETH)', 'Solana (SOL)', 'Smaller Altcoins'],
      },
      'Fractional Shares': {
        description: 'Highly volatile, high-reward stocks.',
        assets: ['Small-cap stocks', 'Volatile tech stocks'],
      },
    },
  };
  
  const handleAddInvestment = () => {
    if (!investmentCategory || !riskTolerance || !investmentAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Investment added",
      description: `£${investmentAmount} added to your ${selectedPortfolio?.name || 'portfolio'}`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="text-sprout-green h-5 w-5" />
          Add Investment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="investment-category">Investment Type</Label>
          <Select value={investmentCategory} onValueChange={setInvestmentCategory}>
            <SelectTrigger id="investment-category">
              <SelectValue placeholder="Select investment type" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
          <Select value={riskTolerance} onValueChange={setRiskTolerance}>
            <SelectTrigger id="risk-tolerance">
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              {riskLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="investment-amount">Investment Amount (£)</Label>
          <Input
            id="investment-amount"
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="Enter amount in GBP"
          />
        </div>
        
        {investmentCategory && riskTolerance && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-md font-semibold mb-2">Recommended for {riskTolerance}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {portfolioRecommendations[riskTolerance][investmentCategory].description}
            </p>
            <ul className="space-y-1">
              {portfolioRecommendations[riskTolerance][investmentCategory].assets.map((asset, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-sprout-green"></span>
                  {asset}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddInvestment} 
          className="w-full btn-action btn-primary"
          disabled={!investmentCategory || !riskTolerance || !investmentAmount}
        >
          Add Investment <ChevronRight size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddInvestment;
