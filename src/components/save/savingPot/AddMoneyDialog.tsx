
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useBankConnections } from "@/hooks/use-bank-connections";
import { useToast } from "@/hooks/use-toast";

interface AddMoneyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  potName: string;
}

export const AddMoneyDialog = ({ isOpen, onOpenChange, potName }: AddMoneyDialogProps) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const { bankConnections } = useBankConnections();
  const { toast } = useToast();

  const handleAddMoney = () => {
    if (!selectedAccount || !amount) {
      toast({
        title: "Error",
        description: "Please select a bank account and enter an amount",
        variant: "destructive",
      });
      return;
    }

    // This is where you would implement the actual money transfer
    toast({
      title: "Money Transfer Initiated",
      description: `£${amount} will be transferred to ${potName}`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Money to {potName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">From Account</label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
              <SelectContent>
                {bankConnections.map((connection) => (
                  <SelectItem key={connection.id} value={connection.id}>
                    {connection.account_name || 'Bank Account'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMoney}>
            Add Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
