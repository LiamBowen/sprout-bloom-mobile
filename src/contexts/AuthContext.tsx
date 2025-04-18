
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  referralCode: string;
  friendsReferred: number;
  rewardsEarned: number;
  avatar_url?: string;
  mobile_number?: string;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const initializeAuth = () => {
    setIsLoading(true);
    const storedUser = localStorage.getItem("sprout_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("sprout_user");
    const storedOnboarded = localStorage.getItem("sprout_onboarded");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedOnboarded) {
      setIsOnboarded(JSON.parse(storedOnboarded));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("sprout_user", JSON.stringify(user));
    }
    localStorage.setItem("sprout_onboarded", JSON.stringify(isOnboarded));
  }, [user, isOnboarded]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn: !!user,
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
