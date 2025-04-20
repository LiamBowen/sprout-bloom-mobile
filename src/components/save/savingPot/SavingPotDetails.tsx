
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProviderDetails from "./ProviderDetails";
import DepositHistory from "./DepositHistory";
import GrowthProjection from "./GrowthProjection";
import { useIsMobile } from "@/hooks/use-mobile";

interface SavingPotDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pot: {
    id: string;
    name: string;
    amount: number;
    target: number;
    apy: number;
  };
}

const SavingPotDetails = ({ isOpen, onOpenChange, pot }: SavingPotDetailsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={isMobile ? "w-[95%] p-4 rounded-lg max-w-md mx-auto" : "max-w-md"}>
        <DialogHeader>
          <DialogTitle className="text-center md:text-left">{pot.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4 overflow-y-auto max-h-[70vh]">
          {/* Provider and APY section */}
          <ProviderDetails 
            potId={pot.id} 
            apy={pot.apy} 
            amount={pot.amount} 
            target={pot.target} 
          />
          
          {/* Deposit History section */}
          <DepositHistory potId={pot.id} />
          
          {/* Growth Projection section */}
          <GrowthProjection 
            initialAmount={pot.amount} 
            targetAmount={pot.target} 
            apy={pot.apy} 
          />
        </div>
        
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className={isMobile ? "w-full" : ""}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavingPotDetails;
