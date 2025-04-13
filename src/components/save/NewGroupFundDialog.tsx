
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface NewGroupFundDialogProps {
  onCreateGroupFund: (name: string, emoji: string, target: string) => void;
}

const NewGroupFundDialog = ({ onCreateGroupFund }: NewGroupFundDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupEmoji, setNewGroupEmoji] = useState("🏝️");
  const [newGroupTarget, setNewGroupTarget] = useState("");
  
  const availableEmojis = ["🏝️", "🏠", "🚗", "💻", "✈️", "🎓", "🎁", "🎪"];

  const handleCreateNewGroup = () => {
    if (newGroupName && newGroupTarget) {
      onCreateGroupFund(newGroupName, newGroupEmoji, newGroupTarget);
      setNewGroupName("");
      setNewGroupEmoji("🏝️");
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
            <label className="text-sm font-medium">Choose an Emoji</label>
            <div className="flex flex-wrap gap-2">
              {availableEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewGroupEmoji(emoji)}
                  className={`w-10 h-10 text-xl flex items-center justify-center rounded ${
                    newGroupEmoji === emoji
                      ? "bg-sprout-lavender/20 border border-sprout-lavender"
                      : "bg-gray-100"
                  }`}
                >
                  {emoji}
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
