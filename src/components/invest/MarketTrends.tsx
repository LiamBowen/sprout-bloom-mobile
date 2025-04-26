
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export const MarketTrends = () => {
  return (
    <Card className="p-4 bg-gray-50 text-center text-gray-700 animate-fade-in">
      <div className="flex items-center justify-center mb-1">
        <TrendingUp size={16} className="text-sprout-green mr-1" />
        <span className="text-sm font-medium">Market Trends</span>
      </div>
      <p className="text-sm">
        🌱 <strong>42%</strong> of Sprout users invested in <span className="text-green-600">Clean Energy</span> this week.
      </p>
    </Card>
  );
};
