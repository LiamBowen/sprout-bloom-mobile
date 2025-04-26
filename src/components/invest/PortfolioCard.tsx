
import { Shield, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { PortfolioPerformance } from "@/components/invest/PortfolioPerformance";
import { InvestmentGoal } from "@/components/invest/InvestmentGoal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Portfolio, Investment } from "@/types/investment";
import { useState } from "react";

interface PortfolioCardProps {
  portfolio: Portfolio;
  isSelected: boolean;
  onSelect: (portfolio: Portfolio) => void;
  performanceTimeRange: string;
  onTimeRangeChange: (range: string) => void;
  investmentGoal: number;
  onGoalChange: (goal: number) => void;
  portfolioInvestments: Investment[];
  portfolioTypeInfo: {
    type: string;
    risk: string;
    icon: JSX.Element;
  };
  performanceData: Array<{ period: string; value: number }>;
}

export const PortfolioCard = ({
  portfolio,
  isSelected,
  onSelect,
  performanceTimeRange,
  onTimeRangeChange,
  investmentGoal,
  onGoalChange,
  portfolioInvestments,
  portfolioTypeInfo,
  performanceData,
}: PortfolioCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    onSelect(portfolio);
    setIsOpen(!isOpen);
  };

  return (
    <Collapsible open={isSelected && isOpen} onOpenChange={setIsOpen}>
      <Card 
        key={portfolio.id}
        className={`p-4 cursor-pointer transition-all ${
          isSelected
            ? `border-2 border-${portfolio.color} bg-${portfolio.color}/5`
            : ""
        }`}
      >
        <CollapsibleTrigger className="w-full text-left" onClick={handleClick}>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`text-xl mr-2 ${portfolio.color === "bg-sprout-green" ? "bg-sprout-green/10" : portfolio.color === "bg-sprout-blue" ? "bg-sprout-blue/10" : portfolio.color === "bg-sprout-lavender" ? "bg-sprout-lavender/10" : "bg-sprout-pink/10"} p-2 rounded-full`}>
                  <span>{portfolio.emoji}</span>
                </div>
                <h3 className="font-bold">{portfolio.name}</h3>
              </div>
              <div className={`text-sm font-semibold ${portfolio.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                {portfolio.growth >= 0 ? "+" : ""}{portfolio.growth.toFixed(2)}%
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
                        {portfolioTypeInfo.icon}
                        {portfolioTypeInfo.type}
                      </div>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-medium">
                      {portfolioTypeInfo.risk}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CollapsibleTrigger>
      
        <CollapsibleContent>
          <PortfolioPerformance
            data={performanceData}
            color={portfolio.color}
            timeRange={performanceTimeRange}
            onTimeRangeChange={onTimeRangeChange}
          />
          
          <InvestmentGoal
            currentValue={portfolio.value}
            goalValue={investmentGoal}
            onGoalChange={onGoalChange}
            portfolioColor={portfolio.color}
          />

          {portfolioInvestments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Recent Investments</h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {portfolioInvestments.map((investment) => (
                    <Card key={investment.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{investment.asset}</h4>
                            <Badge variant="outline" className="text-xs">{investment.riskLevel}</Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {investment.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">£{investment.amount.toFixed(2)}</div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock size={10} className="mr-1" />
                            {new Date(investment.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
