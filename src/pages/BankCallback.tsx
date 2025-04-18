
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const BankCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState("Processing your bank connection...");
  
  useEffect(() => {
    const handleCallback = async () => {
      // Extract code from URL search params
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      
      if (!code) {
        setStatus("Error: No authorization code found");
        toast({
          title: "Connection Failed",
          description: "No authorization code was received from your bank",
          variant: "destructive"
        });
        setTimeout(() => navigate("/app/profile"), 3000);
        return;
      }
      
      try {
        setStatus("Establishing secure connection with your bank...");
        
        console.log("Exchanging token with code:", code);
        
        // Exchange the authorization code for tokens
        const response = await supabase.functions.invoke('truelayer', {
          body: { action: 'exchangeToken', code }
        });
        
        if (response.error) {
          console.error("Token exchange error:", response.error);
          throw new Error(response.error.message || "Failed to connect bank account");
        }
        
        console.log("Token exchange response:", response.data);
        
        setStatus("Connection successful! Redirecting...");
        
        toast({
          title: "Success",
          description: "Your bank account was connected successfully"
        });
        
        // Redirect back to profile page after short delay to show success message
        setTimeout(() => navigate("/app/profile"), 1500);
      } catch (error) {
        console.error("Error in bank connection callback:", error);
        setStatus("Connection failed. Redirecting back...");
        
        toast({
          title: "Connection Failed",
          description: error.message || "Unable to complete bank connection",
          variant: "destructive"
        });
        
        setTimeout(() => navigate("/app/profile"), 3000);
      }
    };
    
    console.log("BankCallback rendered with search params:", location.search);
    handleCallback();
  }, [location, navigate, toast]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-sprout-green" />
        <h1 className="text-xl font-semibold">{status}</h1>
      </div>
      <p className="text-gray-500 text-center max-w-md">
        Please don't close this window while we securely connect to your bank
      </p>
    </div>
  );
};

export default BankCallback;
