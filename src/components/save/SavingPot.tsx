
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Calendar, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface SavingPotProps {
  pot: {
    id: string;
    name: string;
    amount: number;
    target: number;
    apy: number;
  };
}

const SavingPot = ({ pot }: SavingPotProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  return (
    <Card className="p-4">
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
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 btn-action btn-outline">
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
              <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button className="flex-1 btn-action btn-primary">
          <PlusCircle size={16} className="mr-1" /> Add Money
        </Button>
      </div>
    </Card>
  );
};

export default SavingPot;
