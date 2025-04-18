
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Palmtree, Home, Car, Laptop, Plane, GraduationCap, Gift, Tent } from "lucide-react";

interface NewGroupFundDialogProps {
  onCreateGroupFund: (name: string, emoji: string, target: string) => void;
}

const NewGroupFundDialog = ({ onCreateGroupFund }: NewGroupFundDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupEmoji, setNewGroupEmoji] = useState("Palmtree");
  const [newGroupTarget, setNewGroupTarget] = useState("");
  
  const availableIcons = [
    { name: "Palmtree", icon: Palmtree },
    { name: "Home", icon: Home },
    { name: "Car", icon: Car },
    { name: "Laptop", icon: Laptop },
    { name: "Plane", icon: Plane },
    { name: "GraduationCap", icon: GraduationCap },
    { name: "Gift", icon: Gift },
    { name: "Tent", icon: Tent },
  ];

  const handleCreateNewGroup = () => {
    if (newGroupName && newGroupTarget) {
      onCreateGroupFund(newGroupName, newGroupEmoji, newGroupTarget);
      setNewGroupName("");
      setNewGroupEmoji("Palmtree");
      setNewGroupTarget("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full btn-action flex items-center justify-center gap-2 btn-tertiary">
          <Plus size={18} /> Create Group Fund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group Fund</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fund Name</label>
            <Input
              placeholder="e.g., Summer Trip 2025"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose an Icon</label>
            <div className="flex flex-wrap gap-2">
              {availableIcons.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setNewGroupEmoji(name)}
                  className={`w-10 h-10 flex items-center justify-center rounded ${
                    newGroupEmoji === name
                      ? "bg-sprout-lavender/20 border border-sprout-lavender"
                      : "bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Amount (£)</label>
            <Input
              type="number"
              placeholder="1000"
              value={newGroupTarget}
              onChange={(e) => setNewGroupTarget(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateNewGroup}>
            Create Fund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupFundDialog;
