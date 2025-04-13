
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface NewSavingPotDialogProps {
  onCreatePot: (name: string, target: string) => void;
}

const NewSavingPotDialog = ({ onCreatePot }: NewSavingPotDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPotName, setNewPotName] = useState("");
  const [newPotTarget, setNewPotTarget] = useState("");

  const handleCreateNewPot = () => {
    if (newPotName && newPotTarget) {
      onCreatePot(newPotName, newPotTarget);
      setNewPotName("");
      setNewPotTarget("");
      setIsOpen(false);
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateNewPot}>
            Create Pot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSavingPotDialog;
