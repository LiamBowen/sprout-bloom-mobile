
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InvestHeader = () => {
  return (
    <div className="animate-fade-in flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Invest 📈</h1>
          <p className="text-gray-600 text-sm">Grow your wealth, one small seed at a time</p>
        </div>
        <Link to="/app/new-investment">
          <Button variant="ghost" size="icon" className="rounded-full bg-sprout-green text-white hover:bg-sprout-green/90">
            <Plus size={20} />
          </Button>
        </Link>
      </div>
    </div>
  );
};
