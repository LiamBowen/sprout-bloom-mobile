
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, PlusCircle, User, Send, Trash } from "lucide-react";
import { GroupFund } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useSavings } from "@/contexts/SavingsContext";

interface GroupFundDetailsProps {
  fund: GroupFund;
  onBack: () => void;
  onSendMessage: (fundId: string, message: string) => void;
  onDeleteFund?: (fundId: string) => void;
}

const GroupFundDetails = ({ fund, onBack, onSendMessage, onDeleteFund }: GroupFundDetailsProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const { updateGroupFund } = useSavings();

  const handleSendMessage = () => {
    if (!newMessage) return;
    onSendMessage(fund.id, newMessage);
    setNewMessage("");
  };
  
  const handleInvite = () => {
    // Mock invitation functionality
    toast({
      title: "Invitation sent",
      description: "Your friend will receive an invitation to join this fund.",
    });
  };
  
  const handleAddMoney = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add.",
        variant: "destructive"
      });
      return;
    }
    
    // Update fund with new amount
    const newAmount = fund.currentAmount + Number(amount);
    const updatedFund = {
      ...fund,
      currentAmount: newAmount,
      members: fund.members.map(member => {
        if (member.id === "user1") { // Current user is Alex
          const newContributed = member.contributed + Number(amount);
          const newPercentage = Math.round((newContributed / fund.target) * 100);
          return {
            ...member,
            contributed: newContributed,
            contributionPercentage: newPercentage,
          };
        }
        return member;
      })
    };
    
    updateGroupFund(fund.id, updatedFund);
    
    toast({
      title: "Money added",
      description: `£${Number(amount).toFixed(2)} has been added to the fund.`,
    });
    
    setAmount("");
  };
  
  const handleDeleteFund = () => {
    if (onDeleteFund) {
      onDeleteFund(fund.id);
      toast({
        title: "Fund closed",
        description: "The group fund has been successfully closed.",
      });
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          className="p-2 mr-2"
          onClick={onBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
        <h2 className="text-xl font-bold">
          {renderEmoji(fund.emoji)}{" "}
          {fund.name}
        </h2>
      </div>
      
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Group Goal: £{fund.target}</h3>
        <div className="flex justify-between mb-1 text-sm">
          <span>Progress</span>
          <span>
            £{fund.currentAmount.toFixed(2)} / £{fund.target.toFixed(2)}
          </span>
        </div>
        <div className="progress-bar mb-4">
          <div
            className="progress-fill bg-sprout-lavender"
            style={{
              width: `${Math.min(100, (fund.currentAmount / fund.target) * 100)}%`,
            }}
          ></div>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 btn-action btn-outline" onClick={handleInvite}>
            <Share2 size={16} className="mr-1" /> Invite
          </Button>
          <Button className="flex-1 btn-action btn-tertiary" onClick={() => document.getElementById('add-money-section')?.scrollIntoView({behavior: 'smooth'})}>
            <PlusCircle size={16} className="mr-1" /> Add Money
          </Button>
        </div>
      </Card>
      
      <h3 className="font-semibold mt-6 mb-3">Group Members</h3>
      <Card className="p-4">
        {fund.members.map((member) => (
          <div key={member.id} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100">
            <div className="flex items-center">
              <User size={20} className="mr-2" />
              <span>{member.name}</span>
            </div>
            <div>
              <div className="text-sm font-medium">
                £{member.contributed.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {member.contributionPercentage}% complete
              </div>
            </div>
          </div>
        ))}
      </Card>
      
      <h3 id="add-money-section" className="font-semibold mt-6 mb-3">Add Money</h3>
      <Card className="p-4 mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount (£)</label>
            <div className="flex space-x-2">
              <Input 
                id="amount" 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="flex-1"
              />
              <Button onClick={handleAddMoney} disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <h3 className="font-semibold mt-6 mb-3">Group Chat</h3>
      <Card className="p-4 flex flex-col h-64">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {fund.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "Alex" ? "justify-end" : ""
              }`}
            >
              <div
                className={`rounded-2xl px-3 py-2 max-w-[80%] ${
                  msg.sender === "Alex"
                    ? "bg-sprout-lavender/20 text-black"
                    : "bg-gray-100"
                }`}
              >
                {msg.sender !== "Alex" && (
                  <div className="text-xs font-medium mb-1">
                    {msg.sender}
                  </div>
                )}
                <p>{msg.text}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage}
          >
            <Send size={18} />
          </Button>
        </div>
      </Card>
      
      <div className="mt-6">
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleDeleteFund}
        >
          <Trash size={16} className="mr-1" /> Close Fund
        </Button>
      </div>
    </>
  );
};

// Helper function to render emoji based on icon name
const renderEmoji = (emoji: string) => {
  if (emoji.startsWith('🏝️')) return '🏝️';
  
  // For icon names from Lucide icons, use an appropriate emoji equivalent
  const emojiMap: Record<string, string> = {
    'Palmtree': '🌴',
    'Home': '🏠',
    'Car': '🚗',
    'Laptop': '💻',
    'Plane': '✈️',
    'GraduationCap': '🎓',
    'Gift': '🎁',
    'Tent': '⛺',
  };
  
  return emojiMap[emoji] || '🏦'; // Default emoji if not found
};

export default GroupFundDetails;
