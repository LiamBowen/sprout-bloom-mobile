
import { createContext, useState, useContext, ReactNode } from "react";
import { SavingPot } from "@/components/save/types";

interface AppContextProps {
  savingPots: SavingPot[];
  addSavingPot: (pot: SavingPot) => void;
  updateSavingPot: (id: string, pot: Partial<SavingPot>) => void;
  removeSavingPot: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [savingPots, setSavingPots] = useState<SavingPot[]>([
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
  ]);

  const addSavingPot = (pot: SavingPot) => {
    setSavingPots(prevPots => [...prevPots, pot]);
  };

  const updateSavingPot = (id: string, updates: Partial<SavingPot>) => {
    setSavingPots(prevPots => 
      prevPots.map(pot => 
        pot.id === id ? { ...pot, ...updates } : pot
      )
    );
  };
  
  const removeSavingPot = (id: string) => {
    setSavingPots(prevPots => prevPots.filter(pot => pot.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      savingPots,
      addSavingPot,
      updateSavingPot,
      removeSavingPot
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
