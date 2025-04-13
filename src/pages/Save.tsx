
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { Plus, PlusCircle, MessageSquare, User, Send, Users, Share2, TrendingUp, Calendar } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const Save = () => {
  const { savingPots, addSavingPot, groupFunds } = useApp();
  const [activeTab, setActiveTab] = useState("pots");
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [selectedPot, setSelectedPot] = useState<string | null>(null);
  
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
  
  // Generate growth projection data
  const generateGrowthProjection = (initialAmount: number, targetAmount: number, apy: number) => {
    const data = [];
    let currentAmount = initialAmount;
    // Assume monthly compounding over 3 years
    const months = 36;
    const monthlyRate = apy / 100 / 12;
    
    // Estimate monthly deposit needed to reach target
    const targetMonthlyDeposit = (targetAmount - initialAmount * Math.pow(1 + monthlyRate, months)) / 
                              ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    // Use a realistic monthly deposit amount (rounded to nearest £5)
    const monthlyDeposit = Math.max(5, Math.round(targetMonthlyDeposit / 5) * 5);
    
    for (let i = 0; i <= months; i++) {
      // Monthly compounding with regular deposits
      if (i > 0) {
        currentAmount = currentAmount * (1 + monthlyRate) + monthlyDeposit;
      }
      
      data.push({
        month: i,
        value: Math.round(currentAmount * 100) / 100,
      });
    }
    
    return { data, monthlyDeposit };
  };
  
  // Mock deposit history for the pots
  const getDepositHistory = (potId: string) => {
    // Mock data - in a real app, this would come from the backend
    return [
      { date: "Mar 15, 2025", amount: 50.00 },
      { date: "Feb 28, 2025", amount: 50.00 },
      { date: "Feb 15, 2025", amount: 100.00 },
      { date: "Jan 31, 2025", amount: 25.00 },
      { date: "Jan 15, 2025", amount: 50.00 },
    ];
  };
  
  // Mock bank provider for saving pots
  const getPotProvider = (potId: string) => {
    const providers = {
      "emergency-fund": "Barclays Savings",
      "vacation": "Monzo Savings Pot",
      default: "Sprout Partner Bank"
    };
    
    return providers[potId as keyof typeof providers] || providers.default;
  };
  
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
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{pot.name}</h3>
                <div className="inline-block bg-sprout-blue/10 px-2 py-0.5 rounded text-xs font-medium text-sprout-blue">
                  {pot.apy}% APY
                </div>
              </div>
              
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
                <Dialog open={selectedPot === pot.id} onOpenChange={(open) => !open && setSelectedPot(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1 btn-action btn-outline" 
                      onClick={() => setSelectedPot(pot.id)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{pot.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Provider and APY section */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Savings Account Details</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Provider:</span>
                            <span className="font-medium">{getPotProvider(pot.id)}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-600">Interest Rate:</span>
                            <span className="font-medium text-sprout-blue">{pot.apy}% APY</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-600">Current Amount:</span>
                            <span className="font-medium">£{pot.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-600">Target Amount:</span>
                            <span className="font-medium">£{pot.target.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Deposit History section */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Calendar size={16} className="mr-1" /> Deposit History
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                          {getDepositHistory(pot.id).map((deposit, index) => (
                            <div key={index} className="flex justify-between text-sm py-1 border-b last:border-0 border-gray-100">
                              <span className="text-gray-600">{deposit.date}</span>
                              <span className="font-medium">£{deposit.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Growth Projection section */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <TrendingUp size={16} className="mr-1" /> Projected Growth
                        </h4>
                        
                        {(() => {
                          const { data, monthlyDeposit } = generateGrowthProjection(pot.amount, pot.target, pot.apy);
                          return (
                            <>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="mb-2 text-xs text-gray-600">
                                  With a monthly deposit of <span className="font-medium">£{monthlyDeposit}</span>, you could reach your goal in:
                                </div>
                                <div className="h-32">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                      data={data}
                                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                                    >
                                      <XAxis 
                                        dataKey="month"
                                        tickFormatter={(value) => value % 12 === 0 ? `${value/12}yr` : ''}
                                      />
                                      <YAxis 
                                        tickFormatter={(value) => `£${value}`}
                                      />
                                      <Tooltip 
                                        formatter={(value) => [`£${value}`, 'Amount']}
                                        labelFormatter={(label) => `Month ${label}`}
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#86EFAC" 
                                        strokeWidth={2}
                                        dot={false}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={() => setSelectedPot(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
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
