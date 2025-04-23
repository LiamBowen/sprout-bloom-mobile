
import { Card } from "@/components/ui/card";
import SavingPot from "./SavingPot";
import NewSavingPotDialog from "./NewSavingPotDialog";
import { SavingPot as SavingPotType } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface HighYieldPotsProps {
  savingPots: SavingPotType[];
  onAddSavingPot: (name: string, target: string, provider: string, apy: number) => void;
  onDeletePot?: (potId: string) => void;
}

const HighYieldPots = ({ savingPots, onAddSavingPot, onDeletePot }: HighYieldPotsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-sprout-blue/10 border-sprout-blue/20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-base md:text-lg">High-Yield Savings</h3>
            <p className="text-sm text-gray-600 mb-1">Get more from your money</p>
            <div className="inline-block bg-sprout-blue/20 px-2 py-0.5 rounded text-sm font-medium">
              Up to 4.25% APY
            </div>
          </div>
          <div className="text-2xl">💰</div>
        </div>
      </Card>
      
      {savingPots.map((pot) => (
        <SavingPot key={pot.id} pot={pot} onDeletePot={onDeletePot} />
      ))}
      
      <NewSavingPotDialog onCreatePot={onAddSavingPot} />
    </div>
  );
};

export default HighYieldPots;
