
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InvestHeader = () => {
  return (
    <div className="animate-fade-in relative flex flex-col items-center">
      <div className="flex items-center space-x-4 w-full justify-center relative">
        <h1 className="text-2xl font-bold mb-2">Invest 📈</h1>
        <Link to="/app/new-investment" className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <Button variant="ghost" size="icon" className="rounded-full bg-sprout-green text-white hover:bg-sprout-green/90">
            <Plus size={20} />
          </Button>
        </Link>
      </div>
      <p className="text-gray-600 text-sm text-center">Grow your wealth, one small seed at a time</p>
    </div>
  );
};
