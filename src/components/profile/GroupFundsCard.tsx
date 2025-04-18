
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight } from "lucide-react";

export const GroupFundsCard = () => {
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
          onClick={() => {}}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        You're part of 1 group fund. Track progress and chat with members.
      </p>
    </Card>
  );
};
