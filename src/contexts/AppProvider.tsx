
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { PortfolioProvider } from "./PortfolioContext";
import { SavingsProvider } from "./SavingsContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <SavingsProvider>
          {children}
        </SavingsProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
};

export { useAuth } from "./AuthContext";
export { usePortfolio } from "./PortfolioContext";
export { useSavings } from "./SavingsContext";
