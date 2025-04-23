
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import SavingPotDetails from "./savingPot/SavingPotDetails";
import { AddMoneyDialog } from "./savingPot/AddMoneyDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface SavingPotProps {
  pot: {
    id: string;
    name: string;
    amount: number;
    target: number;
    apy: number;
  };
  onDeletePot?: (potId: string) => void;
}

const SavingPot = ({ pot, onDeletePot }: SavingPotProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleDeletePot = () => {
    if (onDeletePot) {
      onDeletePot(pot.id);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-base md:text-lg">{pot.name}</h3>
        <div className="inline-block bg-sprout-blue/10 px-2 py-0.5 rounded text-xs font-medium text-sprout-blue">
          {pot.apy}% APY
        </div>
      </div>
      
      <div className="flex justify-between mb-1 text-sm">
        <span>Progress</span>
        <span className="whitespace-nowrap">
          £{pot.amount.toFixed(2)} / £{pot.target.toFixed(2)}
        </span>
      </div>
      
      <div className="progress-bar mb-4">
        <div
          className="progress-fill bg-sprout-blue"
          style={{ width: `${Math.min(100, (pot.amount / pot.target) * 100)}%` }}
        ></div>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
        <Button 
          className={`${isMobile ? 'w-full' : 'flex-1'} btn-action btn-outline py-2 h-auto`} 
          onClick={() => setIsDetailsOpen(true)}
        >
          View Details
        </Button>
        
        <Button 
          className={`${isMobile ? 'w-full' : 'flex-1'} btn-action btn-primary py-2 h-auto`}
          onClick={() => setIsAddMoneyOpen(true)}
        >
          <PlusCircle size={16} className="mr-1" /> Add Money
        </Button>
      </div>
      
      <div className="mt-3">
        <Button 
          variant="destructive" 
          className="w-full py-2 h-auto"
          onClick={handleDeletePot}
        >
          <Trash size={16} className="mr-1" /> Close Pot
        </Button>
      </div>
      
      <SavingPotDetails 
        isOpen={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        pot={pot} 
      />
      
      <AddMoneyDialog
        isOpen={isAddMoneyOpen}
        onOpenChange={setIsAddMoneyOpen}
        potName={pot.name}
      />
    </Card>
  );
};

export default SavingPot;
