
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SavingPotFormProps {
  onCreatePot: (name: string, target: string, provider: string, apy: number) => void;
}

const NewSavingPotForm = ({ onCreatePot }: SavingPotFormProps) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [target, setTarget] = useState('');
  const [interestRate, setInterestRate] = useState(4.25); // Default interest rate
  const [provider, setProvider] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && target) {
      onCreatePot(name, target, provider, interestRate);
      // Reset form
      setName('');
      setBalance(0);
      setTarget('');
      setInterestRate(4.25);
      setProvider('');
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Saving Pot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Pot Name</Label>
          <Input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Emergency Fund"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target">Target Amount (£)</Label>
          <Input 
            type="number" 
            id="target" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)}
            placeholder="1000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input 
            type="number" 
            id="interestRate" 
            value={interestRate} 
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Provider</Label>
          <Input 
            type="text" 
            id="provider" 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g., Sprout Partner Bank"
          />
        </div>

        <Button type="submit" className="w-full">Create Pot</Button>
      </form>
    </Card>
  );
};

export default NewSavingPotForm;
