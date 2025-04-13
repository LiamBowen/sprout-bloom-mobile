
export interface SavingPot {
  id: string;
  name: string;
  amount: number;
  target: number;
  apy: number;
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
