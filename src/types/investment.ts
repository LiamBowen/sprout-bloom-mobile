
export interface RiskLevel {
  level: string;
  icon: JSX.Element;
  description: string;
  assets: string[];
}

export interface InvestmentCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  riskLevels: RiskLevel[];
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  roundUp: number;
}

export interface Portfolio {
  id: string;
  name: string;
  value: number;
  growth: number;
  emoji: string;
  color: string;
}

export interface PortfolioType {
  type: string;
  risk: string;
  icon: JSX.Element;
}
