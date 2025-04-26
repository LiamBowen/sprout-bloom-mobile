
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      });
      
      // Reset form state after successful password reset request
      setIsForgotPassword(false);
      setEmail("");
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Create a basic user object for the auth context
          setUser({
            id: data.user.id,
            name: email.split('@')[0], // Use part of email as temporary name
            email: email,
            dateOfBirth: "",
            referralCode: `USER${Math.floor(1000 + Math.random() * 9000)}`,
            friendsReferred: 0,
            rewardsEarned: 0,
            portfolioThemes: [], // Add empty array for portfolioThemes
            riskLevel: "Medium" // Default risk level
          });
          
          toast({
            title: "Account created!",
            description: "Please complete your profile setup.",
          });
          
          navigate("/onboarding");
        }
      } else {
        // Sign in flow
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Fetch user profile or create basic user info
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          // Set user in auth context with the newly required properties
          setUser({
            id: data.user.id,
            name: profileData?.display_name || email.split('@')[0],
            email: data.user.email || "",
            dateOfBirth: "",
            // Generate a referral code as it doesn't exist in the profiles table
            referralCode: `USER${Math.floor(1000 + Math.random() * 9000)}`,
            friendsReferred: 0,
            rewardsEarned: 0,
            avatar_url: profileData?.avatar_url,
            mobile_number: profileData?.mobile_number,
            portfolioThemes: profileData?.portfolio_themes || [], // Get themes from profile or use empty array
            riskLevel: profileData?.risk_level || "Medium" // Get risk level from profile or use default
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

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-sprout-green/20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center flex flex-col items-center">
            <Logo size="lg" className="mb-4" />
            <h2 className="text-2xl font-bold">Reset your password</h2>
            <p className="mt-2 text-gray-600">
              Enter your email to receive a password reset link
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </Card>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsForgotPassword(false)}
              className="text-sm"
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isSignUp && (
              <div className="text-center">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Forgot password?
                </Button>
              </div>
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

export default Auth;
