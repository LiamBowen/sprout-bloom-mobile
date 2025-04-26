import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        if (data.user) {
          setUser({
            id: data.user.id,
            name: email.split('@')[0],
            email: email,
            dateOfBirth: "",
            referralCode: `USER${Math.floor(1000 + Math.random() * 9000)}`,
            friendsReferred: 0,
            rewardsEarned: 0,
            portfolioThemes: [],
            riskLevel: "Medium"
          });
          
          toast({
            title: "Account created!",
            description: "Please complete your profile setup.",
          });
          
          navigate("/onboarding");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Fetch user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile data:", profileError);
            throw profileError;
          }
          
          // We need to create a properly shaped User object with default values for missing fields
          setUser({
            id: data.user.id,
            name: profileData?.display_name || email.split('@')[0],
            email: data.user.email || "",
            dateOfBirth: "", // Not available in profiles table, using default value
            referralCode: `USER${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random referral code
            friendsReferred: 0, // Not available in profiles table, using default value
            rewardsEarned: 0, // Not available in profiles table, using default value
            avatar_url: profileData?.avatar_url,
            mobile_number: profileData?.mobile_number,
            portfolioThemes: profileData?.portfolio_themes || [],
            riskLevel: profileData?.risk_level || "Medium"
          });
          
          toast({
            title: "Welcome back!",
            description: "You've been successfully logged in.",
          });
          
          navigate("/app");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-sprout-green/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h2 className="text-2xl font-bold">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp 
              ? "Start your investment journey today" 
              : "Sign in to continue to Sprout"}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => window.location.href = "/auth/forgot-password"}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot password?
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading 
                ? "Loading..." 
                : (isSignUp ? "Create account" : "Sign in")}
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"}
          </Button>
        </div>
      </div>
    </div>
  );
};
