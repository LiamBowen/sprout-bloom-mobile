export interface SavingPot {
  id: string;
  name: string;
  amount: number;
  target: number;
  apy: number;
  provider?: string;  // Add the optional provider property
}

export interface GroupMember {
  id: string;
  name: string;
  contributed: number;
  contributionPercentage: number;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export interface GroupFund {
  id: string;
  name: string;
  emoji: string;
  currentAmount: number;
  target: number;
  members: GroupMember[];
  messages: Message[];
}

export interface FundProvider {
  id: string;
  name: string;
  apy: number;
}
