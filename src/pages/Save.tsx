
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import HighYieldPots from "@/components/save/HighYieldPots";
import GroupFunds from "@/components/save/GroupFunds";
import NewSavingPotForm from "@/components/save/NewSavingPotForm";
import { SavingPot, GroupFund } from "@/components/save/types"; // Explicitly import SavingPot type

const Save = () => {
  const { savingPots, addSavingPot, groupFunds } = useApp();
  const [activeTab, setActiveTab] = useState("pots");
  const [showNewPotForm, setShowNewPotForm] = useState(false);
  
  const handleCreateNewPot = (name: string, target: string, provider: string, apy: number) => {
    if (name && target) {
      addSavingPot({
        id: `pot_${Date.now()}`,
        name: name,
        amount: 0,
        target: parseFloat(target),
        apy: apy,
        provider: provider, // This is a required field in the SavingPot interface
      });
      setShowNewPotForm(false);
    }
  };
  
  const handleCreateGroupFund = (name: string, emoji: string, target: string) => {
    // This would typically call a function in the AppContext
    console.log("Creating group fund:", { name, emoji, target });
  };
  
  const handleSendMessage = (fundId: string, message: string) => {
    if (!message) return;
    
    const fund = groupFunds.find(f => f.id === fundId);
    if (fund) {
      fund.messages.push({
        id: `msg_${Date.now()}`,
        sender: "Alex",
        text: message,
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Save 💰</h1>
        <p className="text-gray-600">Reach your goals faster</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="pots">High-Yield Pots</TabsTrigger>
          <TabsTrigger value="groups">Group Funds</TabsTrigger>
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
