
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const validatePassword = (password: string) => {
    if (isSignUp && password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !validatePassword(password)) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        if (data.user) {
          const referralCode = `${email.split('@')[0].toUpperCase().substring(0, 4)}${Math.floor(1000 + Math.random() * 9000)}`;
          
          setUser({
            id: data.user.id,
            name: email.split('@')[0],
            email: email,
            dateOfBirth: "",
            referralCode: referralCode,
            friendsReferred: 0,
            rewardsEarned: 0,
            portfolioThemes: [],
            riskLevel: "Medium"
          });
          
          // Store the referral code in the profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              display_name: email.split('@')[0],
              referral_code: referralCode
            })
            .eq('id', data.user.id);
            
          if (profileError) {
            console.error("Error updating referral code:", profileError);
          }
          
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
          
          // Create a properly shaped User object with data from the profiles table
          setUser({
            id: data.user.id,
            name: profileData?.display_name || email.split('@')[0],
            email: data.user.email || "",
            dateOfBirth: profileData?.date_of_birth || "", 
            referralCode: profileData?.referral_code || `USER${Math.floor(1000 + Math.random() * 9000)}`,
            friendsReferred: profileData?.friends_referred || 0,
            rewardsEarned: profileData?.rewards_earned || 0,
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (isSignUp) validatePassword(e.target.value);
                }}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            
            {isSignUp && (
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            )}
            
            {passwordError && (
              <p className="text-xs text-destructive">{passwordError}</p>
            )}
            
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
        
        {!isSignUp && (
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
        )}

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
