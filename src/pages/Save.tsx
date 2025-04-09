
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { Plus, PlusCircle, MessageSquare, User, Send, Users, Share2 } from "lucide-react";

const Save = () => {
  const { savingPots, addSavingPot, groupFunds } = useApp();
  const [activeTab, setActiveTab] = useState("pots");
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  
  // New pot state
  const [isNewPotDialogOpen, setIsNewPotDialogOpen] = useState(false);
  const [newPotName, setNewPotName] = useState("");
  const [newPotTarget, setNewPotTarget] = useState("");
  
  // New group fund state
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupEmoji, setNewGroupEmoji] = useState("🏝️");
  const [newGroupTarget, setNewGroupTarget] = useState("");
  
  // Group chat message state
  const [newMessage, setNewMessage] = useState("");
  
  const handleCreateNewPot = () => {
    if (newPotName && newPotTarget) {
      addSavingPot({
        id: `pot_${Date.now()}`,
        name: newPotName,
        amount: 0,
        target: parseFloat(newPotTarget),
        apy: 4.25,
      });
      
      setNewPotName("");
      setNewPotTarget("");
      setIsNewPotDialogOpen(false);
    }
  };
  
  const handleSendMessage = (fundId: string) => {
    if (!newMessage) return;
    
    const fund = groupFunds.find(f => f.id === fundId);
    if (fund) {
      fund.messages.push({
        id: `msg_${Date.now()}`,
        sender: "Alex",
        text: newMessage,
        timestamp: new Date(),
      });
      
      setNewMessage("");
    }
  };
  
  const availableEmojis = ["🏝️", "🏠", "🚗", "💻", "✈️", "🎓", "🎁", "🎪"];

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
          <Card className="p-4 bg-sprout-blue/10 border-sprout-blue/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">High-Yield Savings</h3>
                <p className="text-sm text-gray-600 mb-1">Get more from your money</p>
                <div className="inline-block bg-sprout-blue/20 px-2 py-0.5 rounded text-sm font-medium">
                  4.25% APY
                </div>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </Card>
          
          {savingPots.map((pot) => (
            <Card key={pot.id} className="p-4">
              <h3 className="font-bold mb-2">{pot.name}</h3>
              
              <div className="flex justify-between mb-1 text-sm">
                <span>Progress</span>
                <span>
                  £{pot.amount.toFixed(2)} / £{pot.target.toFixed(2)}
                </span>
              </div>
              
              <div className="progress-bar mb-4">
                <div
                  className="progress-fill bg-sprout-blue"
                  style={{ width: `${Math.min(100, (pot.amount / pot.target) * 100)}%` }}
                ></div>
              </div>
              
              <div className="flex space-x-2">
                <Button className="flex-1 btn-action btn-outline">
                  View Details
                </Button>
                <Button className="flex-1 btn-action btn-primary">
                  <PlusCircle size={16} className="mr-1" /> Add Money
                </Button>
              </div>
            </Card>
          ))}
          
          <Dialog open={isNewPotDialogOpen} onOpenChange={setIsNewPotDialogOpen}>
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
                <Button variant="outline" onClick={() => setIsNewPotDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNewPot}>
                  Create Pot
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          {selectedFund ? (
            <>
              <div className="flex items-center mb-4">
                <Button
                  variant="ghost"
                  className="p-2 mr-2"
                  onClick={() => setSelectedFund(null)}
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
                  {groupFunds.find(f => f.id === selectedFund)?.emoji}{" "}
                  {groupFunds.find(f => f.id === selectedFund)?.name}
                </h2>
              </div>
              
              {(() => {
                const fund = groupFunds.find(f => f.id === selectedFund);
                if (!fund) return null;
                
                return (
                  <>
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
                        <Button className="flex-1 btn-action btn-outline">
                          <Share2 size={16} className="mr-1" /> Invite
                        </Button>
                        <Button className="flex-1 btn-action btn-tertiary">
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
                              handleSendMessage(selectedFund);
                            }
                          }}
                        />
                        <Button
                          size="icon"
                          onClick={() => handleSendMessage(selectedFund)}
                          disabled={!newMessage}
                        >
                          <Send size={18} />
                        </Button>
                      </div>
                    </Card>
                  </>
                );
              })()}
            </>
          ) : (
            <>
              {groupFunds.map((fund) => (
                <Card
                  key={fund.id}
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedFund(fund.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{fund.emoji}</span>
                        <h3 className="font-bold">{fund.name}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Users size={14} className="mr-1" />
                        <span>{fund.members.length} members</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        £{fund.currentAmount.toFixed(2)} / £{fund.target.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((fund.currentAmount / fund.target) * 100)}% complete
                      </div>
                    </div>
                  </div>
                  
                  <div className="progress-bar mt-3">
                    <div
                      className="progress-fill bg-sprout-lavender"
                      style={{
                        width: `${Math.min(100, (fund.currentAmount / fund.target) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center mt-3 text-sm text-gray-600">
                    <MessageSquare size={14} className="mr-1" />
                    <span>{fund.messages.length} messages</span>
                  </div>
                </Card>
              ))}
              
              <Dialog open={isNewGroupDialogOpen} onOpenChange={setIsNewGroupDialogOpen}>
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
                    <Button variant="outline" onClick={() => setIsNewGroupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsNewGroupDialogOpen(false)}>
                      Create Fund
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Save;
