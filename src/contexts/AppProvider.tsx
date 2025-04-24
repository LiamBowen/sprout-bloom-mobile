
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { PortfolioProvider } from "./PortfolioContext";
import { SavingsProvider } from "./SavingsContext";
import { CoachProvider } from "./CoachContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <SavingsProvider>
          <CoachProvider>
            {children}
          </CoachProvider>
        </SavingsProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
};

export { useAuth } from "./AuthContext";
export { usePortfolio } from "./PortfolioContext";
export { useSavings } from "./SavingsContext";
export { useCoach } from "./CoachContext";
