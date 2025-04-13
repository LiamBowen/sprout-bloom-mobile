
import React from 'react';
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
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type PortfolioRecommendations = {
  [key: string]: {
    [key: string]: {
      description: string;
      assets: string[];
    };
  };
};

// Define form validation schema
const investmentFormSchema = z.object({
  category: z.string({
    required_error: "Please select an investment type",
  }),
  riskLevel: z.string({
    required_error: "Please select a risk tolerance level",
  }),
  amount: z.string().min(1, "Please enter an investment amount"),
});

type InvestmentFormValues = z.infer<typeof investmentFormSchema>;

const AddInvestment = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const { selectedPortfolio } = useApp();
  
  // Form definition
  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      category: "",
      riskLevel: "",
      amount: "",
    },
  });
  
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
  
  const handleAddInvestment = (data: InvestmentFormValues) => {
    toast({
      title: "Investment added",
      description: `£${data.amount} added to your ${selectedPortfolio?.name || 'portfolio'}`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  // Watch form values to show recommendations
  const selectedCategory = form.watch("category");
  const selectedRiskLevel = form.watch("riskLevel");
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="text-sprout-green h-5 w-5" />
          Add Investment
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddInvestment)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Tolerance</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {riskLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Amount (£)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount in GBP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedCategory && selectedRiskLevel && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-md font-semibold mb-2">Recommended for {selectedRiskLevel}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {portfolioRecommendations[selectedRiskLevel][selectedCategory].description}
                </p>
                <ul className="space-y-1">
                  {portfolioRecommendations[selectedRiskLevel][selectedCategory].assets.map((asset, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-sprout-green"></span>
                      {asset}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full btn-action btn-primary mt-4"
              disabled={!form.formState.isValid}
            >
              Add Investment <ChevronRight size={18} />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddInvestment;
