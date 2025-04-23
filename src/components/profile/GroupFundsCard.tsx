
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSavings } from "@/contexts/SavingsContext";

export const GroupFundsCard = () => {
  const { groupFunds } = useSavings();
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/app/save", { state: { activeTab: "groups" } });
  };
  
  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-sprout-lavender/20 rounded-full flex items-center justify-center mr-2">
            <Users size={18} className="text-sprout-lavender" />
          </div>
          <h3 className="font-bold">Group Funds</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        {groupFunds.length === 0
          ? "You're not part of any group funds yet. Create one to get started!"
          : `You're part of ${groupFunds.length} group fund${groupFunds.length > 1 ? 's' : ''}. Track progress and chat with members.`}
      </p>
    </Card>
  );
};
