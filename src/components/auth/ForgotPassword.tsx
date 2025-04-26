
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      
      setEmail("");
      onBack();
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
          <h2 className="text-2xl font-bold">Reset your password</h2>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            onClick={onBack}
            className="text-sm"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
};
