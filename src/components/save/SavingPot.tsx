
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import SavingPotDetails from "./savingPot/SavingPotDetails";

interface SavingPotProps {
  pot: {
    id: string;
    name: string;
    amount: number;
    target: number;
    apy: number;
  };
}

const SavingPot = ({ pot }: SavingPotProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold">{pot.name}</h3>
        <div className="inline-block bg-sprout-blue/10 px-2 py-0.5 rounded text-xs font-medium text-sprout-blue">
          {pot.apy}% APY
        </div>
      </div>
      
      <div className="flex justify-between mb-1 text-sm">
        <span>Progress</span>
        <span>
          £{pot.amount.toFixed(2)} / £{pot.target.toFixed(2)}
        </span>
      </div>
      
      <div className="progress-bar mb-4">
        <div
          className="progress-fill bg-sprout-blue"
          style={{ width: `${Math.min(100, (pot.amount / pot.target) * 100)}%` }}
        ></div>
      </div>
      
      <div className="flex space-x-2">
        <DialogTrigger asChild>
          <Button className="flex-1 btn-action btn-outline" onClick={() => setIsDetailsOpen(true)}>
            View Details
          </Button>
        </DialogTrigger>
        
        <Button className="flex-1 btn-action btn-primary">
          <PlusCircle size={16} className="mr-1" /> Add Money
        </Button>
      </div>
      
      <SavingPotDetails 
        isOpen={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        pot={pot} 
      />
    </Card>
  );
};

export default SavingPot;
