
import { ReactNode } from "react";
import { AppProvider as MainAppProvider } from "./AppContext";
import { AuthProvider } from "./AuthContext";
import { PortfolioProvider } from "./PortfolioContext";
import { SavingsProvider } from "./SavingsContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <MainAppProvider>
        <PortfolioProvider>
          <SavingsProvider>
            {children}
          </SavingsProvider>
        </PortfolioProvider>
      </MainAppProvider>
    </AuthProvider>
  );
};

export { useAuth } from "./AuthContext";
export { usePortfolio } from "./PortfolioContext";
export { useSavings } from "./SavingsContext";
export { useApp } from "./AppContext";
