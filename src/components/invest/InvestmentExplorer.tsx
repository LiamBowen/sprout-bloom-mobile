
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LivePrice } from "@/components/LivePrice";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvestmentOption {
  title: string;
  subtitle: string;
  symbol: string;
  graph?: string;
}

const investmentOptions = {
  stocks: [
    { title: "Tesla", subtitle: "Electric Vehicles", symbol: "TSLA" },
    { title: "Vanguard S&P 500 ETF", subtitle: "Index Fund", symbol: "VOO" },
    { title: "Apple", subtitle: "Technology", symbol: "AAPL" },
    { title: "Microsoft", subtitle: "Software", symbol: "MSFT" },
    { title: "Amazon", subtitle: "E-Commerce", symbol: "AMZN" }
  ],
  crypto: [
    { title: "Bitcoin", subtitle: "Digital Gold", symbol: "BTC-USD" },
    { title: "Ethereum", subtitle: "Smart Contracts", symbol: "ETH-USD" },
    { title: "Solana", subtitle: "DeFi Platform", symbol: "SOL-USD" },
    { title: "Cardano", subtitle: "Blockchain Platform", symbol: "ADA-USD" }
  ],
  fractional: [
    { title: "Berkshire Hathaway", subtitle: "Investment Holding", symbol: "BRK.A" },
    { title: "Alphabet", subtitle: "Technology", symbol: "GOOGL" },
    { title: "Netflix", subtitle: "Streaming", symbol: "NFLX" },
    { title: "NVIDIA", subtitle: "Semiconductors", symbol: "NVDA" }
  ]
};

const InvestmentCard = ({ investment }: { investment: InvestmentOption }) => {
  return (
    <Card className="p-4 mb-3 hover:bg-accent/50 cursor-pointer transition-colors">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-medium">{investment.title}</h3>
          <p className="text-sm text-muted-foreground">{investment.subtitle}</p>
        </div>
        <div className="text-right">
          <LivePrice symbol={investment.symbol} className="font-semibold" />
          <div className="flex items-center text-xs gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-green-500">+2.45%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const InvestmentExplorer = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Explore Investments</h2>
      <p className="text-muted-foreground">
        Choose from Stocks & ETFs, Crypto, or Fractional Shares
      </p>
      
      <Tabs defaultValue="stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stocks">Stocks & ETFs</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="fractional">Fractional Shares</TabsTrigger>
        </TabsList>
        
        {Object.entries(investmentOptions).map(([key, options]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {options.map((investment, idx) => (
                <InvestmentCard key={idx} investment={investment} />
              ))}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
