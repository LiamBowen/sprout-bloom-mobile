
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  roundUp: number;
}

interface RoundUpsProps {
  transactions: Transaction[];
  roundUpAmount: number;
  onRoundUpChange: (amount: number) => void;
}

export const RoundUps = ({ 
  transactions, 
  roundUpAmount, 
  onRoundUpChange 
}: RoundUpsProps) => {
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const { portfolios } = usePortfolio();
  const { toast } = useToast();
  
  const totalRoundUps = transactions.reduce((acc, tx) => acc + tx.roundUp * roundUpAmount, 0);

  const handleInvest = () => {
    if (selectedPortfolio) {
      toast({
        title: "Round-ups invested!",
        description: `Successfully invested £${totalRoundUps.toFixed(2)} into ${portfolios.find(p => p.id === selectedPortfolio)?.name}`,
      });
      setIsInvestDialogOpen(false);
      setSelectedPortfolio("");
    }
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal initiated",
      description: `Your round-ups worth £${totalRoundUps.toFixed(2)} will be withdrawn to your connected bank account.`,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-bold mb-4">Round-up Multiplier</h3>
        <p className="text-sm text-gray-600 mb-4">
          Round up your purchases and invest the spare change.
        </p>
        
        <div className="flex justify-between space-x-3 mb-6">
          {[1, 2, 3].map((multiplier) => (
            <button
              key={multiplier}
              onClick={() => onRoundUpChange(multiplier)}
              className={`flex-1 py-3 rounded-lg border ${
                roundUpAmount === multiplier
                  ? "border-sprout-green bg-sprout-green/10"
                  : "border-gray-200"
              }`}
            >
              {multiplier}x
            </button>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">This week's round-ups:</span>
            <span className="font-bold">£{totalRoundUps.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 mt-4">
          <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
            <Button className="w-full btn-action btn-primary" onClick={() => setIsInvestDialogOpen(true)}>
              Invest Round-ups <ArrowRight size={18} />
            </Button>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Investment Portfolio</DialogTitle>
                <DialogDescription>
                  Select which portfolio you'd like to invest your round-ups worth £{totalRoundUps.toFixed(2)} into.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id}>
                        <span className="flex items-center gap-2">
                          {portfolio.emoji} {portfolio.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInvestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvest} disabled={!selectedPortfolio}>
                  Confirm Investment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Withdraw Round-ups
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will withdraw £{totalRoundUps.toFixed(2)} of round-ups to your connected bank account.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleWithdraw}>
                  Confirm Withdrawal
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      <h3 className="font-semibold mt-4">Recent Transactions</h3>
      
      {transactions.map((tx) => (
        <Card key={tx.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{tx.merchant}</h4>
              <p className="text-xs text-gray-500">{tx.date}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold">£{tx.amount.toFixed(2)}</div>
              <div className="text-xs text-sprout-green">
                +£{(tx.roundUp * roundUpAmount).toFixed(2)} round-up
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
