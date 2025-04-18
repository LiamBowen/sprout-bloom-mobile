import { BarChart2, Bitcoin, PieChart, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { InvestmentCategory, Transaction, PortfolioType } from "@/types/investment";

export const investmentCategories: InvestmentCategory[] = [
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

export const mockTransactions: Transaction[] = [
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

export const portfolioTypes: Record<string, PortfolioType> = {
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
