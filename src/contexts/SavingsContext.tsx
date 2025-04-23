
import { createContext, useContext, useState, ReactNode } from "react";
import { SavingPot, GroupFund, Message } from "@/components/save/types";

interface SavingsContextType {
  savingPots: SavingPot[];
  addSavingPot: (pot: SavingPot) => void;
  updateSavingPot: (id: string, updates: Partial<SavingPot>) => void;
  groupFunds: GroupFund[];
  addGroupFund: (fund: GroupFund) => void;
  updateGroupFund: (id: string, updates: Partial<GroupFund>) => void;
  removeGroupFund: (id: string) => void;
}

const mockSavingPots: SavingPot[] = [
  {
    id: "emergency-fund",
    name: "Emergency Fund",
    amount: 520,
    target: 1000,
    apy: 4.25,
    provider: "Barclays Savings"
  },
  {
    id: "vacation",
    name: "Summer Vacation",
    amount: 350,
    target: 800,
    apy: 4.25,
    provider: "Monzo Savings Pot"
  },
];

const mockGroupFunds: GroupFund[] = [
  {
    id: "ibiza2025",
    name: "Ibiza Trip 2025",
    emoji: "🏝️",
    target: 2000,
    currentAmount: 850,
    members: [
      {
        id: "user1",
        name: "Alex",
        contributed: 300,
        contributionPercentage: 60,
      },
      {
        id: "user2",
        name: "Jordan",
        contributed: 250,
        contributionPercentage: 50,
      },
      {
        id: "user3",
        name: "Taylor",
        contributed: 300,
        contributionPercentage: 60,
      },
    ],
    messages: [
      {
        id: "msg1",
        sender: "Jordan",
        text: "Just added another £50! 🎉",
        timestamp: new Date("2025-02-15T12:30:00"),
      },
      {
        id: "msg2",
        sender: "Taylor",
        text: "We're almost halfway there!",
        timestamp: new Date("2025-02-14T09:15:00"),
      },
    ],
  },
];

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider = ({ children }: { children: ReactNode }) => {
  const [savingPots, setSavingPots] = useState(mockSavingPots);
  const [groupFunds, setGroupFunds] = useState(mockGroupFunds);

  const addSavingPot = (pot: SavingPot) => {
    setSavingPots((prev) => [...prev, pot]);
  };

  const updateSavingPot = (id: string, updates: Partial<SavingPot>) => {
    setSavingPots((prev) =>
      prev.map((pot) =>
        pot.id === id ? { ...pot, ...updates } : pot
      )
    );
  };

  const addGroupFund = (fund: GroupFund) => {
    setGroupFunds((prev) => [...prev, fund]);
  };

  const updateGroupFund = (id: string, updates: Partial<GroupFund>) => {
    setGroupFunds((prev) =>
      prev.map((fund) =>
        fund.id === id ? { ...fund, ...updates } : fund
      )
    );
  };
  
  const removeGroupFund = (id: string) => {
    setGroupFunds((prev) => prev.filter((fund) => fund.id !== id));
  };

  return (
    <SavingsContext.Provider
      value={{
        savingPots,
        addSavingPot,
        updateSavingPot,
        groupFunds,
        addGroupFund,
        updateGroupFund,
        removeGroupFund,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error("useSavings must be used within a SavingsProvider");
  }
  return context;
};
