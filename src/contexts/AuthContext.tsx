
import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  referralCode: string;
  friendsReferred: number;
  rewardsEarned: number;
  avatar_url?: string;
  mobile_number?: string;
  portfolioThemes: string[];
  riskLevel: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  initializeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const mockUser: User = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  dateOfBirth: "1990-01-01",
  referralCode: "DEMO123",
  friendsReferred: 5,
  rewardsEarned: 250,
  avatar_url: "",
  mobile_number: "+1234567890",
  portfolioThemes: ["Technology", "ESG"],
  riskLevel: "moderate"
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(true);

  const initializeAuth = () => {
    // No longer needed, but kept for compatibility
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn: true,
        isLoading,
        isOnboarded,
        setIsOnboarded,
        initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
