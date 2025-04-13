
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { FundProvider } from "./types";

interface NewSavingPotDialogProps {
  onCreatePot: (name: string, target: string, provider: string, apy: number) => void;
}

const NewSavingPotDialog = ({ onCreatePot }: NewSavingPotDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPotName, setNewPotName] = useState("");
  const [newPotTarget, setNewPotTarget] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  
  // Sample fund providers with different APY rates
  const fundProviders: FundProvider[] = [
    { id: "sprout-bank", name: "Sprout Partner Bank", apy: 4.25 },
    { id: "barclays", name: "Barclays Savings", apy: 3.95 },
    { id: "monzo", name: "Monzo Savings Pot", apy: 4.10 },
    { id: "starling", name: "Starling Bank", apy: 4.15 },
    { id: "hsbc", name: "HSBC Savings Plus", apy: 3.85 }
  ];

  const handleCreateNewPot = () => {
    if (newPotName && newPotTarget && selectedProvider) {
      const provider = fundProviders.find(p => p.id === selectedProvider);
      if (provider) {
        onCreatePot(newPotName, newPotTarget, provider.name, provider.apy);
        setNewPotName("");
        setNewPotTarget("");
        setSelectedProvider("");
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full btn-action flex items-center justify-center gap-2">
          <Plus size={18} /> Create Savings Pot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Savings Pot</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pot Name</label>
            <Input
              placeholder="e.g., Emergency Fund"
              value={newPotName}
              onChange={(e) => setNewPotName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Amount (£)</label>
            <Input
              type="number"
              placeholder="1000"
              value={newPotTarget}
              onChange={(e) => setNewPotTarget(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fund Provider</label>
            <Select 
              value={selectedProvider} 
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {fundProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex justify-between w-full">
                      <span>{provider.name}</span>
                      <span className="font-medium text-sprout-blue">{provider.apy}% APY</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProvider && (
              <p className="text-xs text-gray-500 mt-1">
                The selected provider offers {fundProviders.find(p => p.id === selectedProvider)?.apy}% APY
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateNewPot} 
            disabled={!newPotName || !newPotTarget || !selectedProvider}
          >
            Create Pot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSavingPotDialog;
