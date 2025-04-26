
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { RoundUps } from "@/components/invest/RoundUps";
import { mockTransactions } from "@/data/investment-data";
import { InvestHeader } from "@/components/invest/InvestHeader";
import { MarketTrends } from "@/components/invest/MarketTrends";
import { PortfolioList } from "@/components/invest/PortfolioList";

const Invest = () => {
  const { portfolios, selectedPortfolio, setSelectedPortfolio, investments } = usePortfolio();
  const [activeTab, setActiveTab] = useState("portfolios");
  const [roundUpAmount, setRoundUpAmount] = useState(1);

  return (
    <div className="space-y-6">
      <InvestHeader />
      <MarketTrends />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="round-ups">Round-ups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolios">
          <PortfolioList
            portfolios={portfolios}
            selectedPortfolio={selectedPortfolio}
            setSelectedPortfolio={setSelectedPortfolio}
            investments={investments}
          />
        </TabsContent>
        
        <TabsContent value="round-ups">
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
