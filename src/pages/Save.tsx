
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import HighYieldPots from "@/components/save/HighYieldPots";
import GroupFunds from "@/components/save/GroupFunds";
import NewSavingPotForm from "@/components/save/NewSavingPotForm";
import { SavingPot, GroupFund, GroupMember, Message } from "@/components/save/types"; 
import { useIsMobile } from "@/hooks/use-mobile";
import { useSavings } from "@/contexts/SavingsContext";
import { useToast } from "@/hooks/use-toast";

const Save = () => {
  const { savingPots, addSavingPot } = useApp();
  const { groupFunds, addGroupFund, updateGroupFund } = useSavings();
  const [activeTab, setActiveTab] = useState("pots");
  const [showNewPotForm, setShowNewPotForm] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleCreateNewPot = (name: string, target: string, provider: string, apy: number) => {
    if (name && target) {
      addSavingPot({
        id: `pot_${Date.now()}`,
        name: name,
        amount: 0,
        target: parseFloat(target),
        apy: apy,
        provider: provider,
      });
      setShowNewPotForm(false);
    }
  };
  
  const handleCreateGroupFund = (name: string, emoji: string, target: string) => {
    if (!name || !emoji || !target) return;
    
    const newFund: GroupFund = {
      id: `fund_${Date.now()}`,
      name,
      emoji,
      currentAmount: 0,
      target: parseFloat(target),
      members: [
        {
          id: "user1",
          name: "Alex",
          contributed: 0,
          contributionPercentage: 0,
        }
      ],
      messages: [],
    };
    
    addGroupFund(newFund);
    
    toast({
      title: "Group Fund Created",
      description: `${name} has been created successfully!`,
    });
  };
  
  const handleSendMessage = (fundId: string, message: string) => {
    if (!message) return;
    
    const fund = groupFunds.find(f => f.id === fundId);
    if (fund) {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        sender: "Alex",
        text: message,
        timestamp: new Date(),
      };
      
      const updatedFund = {
        ...fund,
        messages: [...fund.messages, newMessage]
      };
      
      updateGroupFund(fundId, updatedFund);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4">
      <div className="animate-fade-in">
        <h1 className="text-xl md:text-2xl font-bold">Save</h1>
        <p className="text-sm md:text-base text-gray-600">Reach your goals faster</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
        <TabsList className="grid grid-cols-2 mb-4 w-full">
          <TabsTrigger value="pots" className="text-sm md:text-base py-2">High-Yield Pots</TabsTrigger>
          <TabsTrigger value="groups" className="text-sm md:text-base py-2">Group Funds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pots" className="space-y-4">
          {showNewPotForm ? (
            <NewSavingPotForm onCreatePot={handleCreateNewPot} />
          ) : (
            <HighYieldPots 
              savingPots={savingPots} 
              onAddSavingPot={handleCreateNewPot} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          <GroupFunds 
            groupFunds={groupFunds}
            onCreateGroupFund={handleCreateGroupFund}
            onSendMessage={handleSendMessage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Save;
