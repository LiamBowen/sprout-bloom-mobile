import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { logAnalyticsEvent } from "@/utils/analytics";
import { logError } from "@/utils/error-logging";

enum ConnectionStatus {
  PROCESSING = "Processing your bank connection...",
  CONNECTING = "Establishing secure connection with your bank...",
  SUCCESS = "Connection successful! Redirecting...",
  FAILED = "Connection failed. Redirecting back..."
}

const BankCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.PROCESSING);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        console.log("BankCallback: Starting callback processing", { 
          code: code ? "present" : "missing",
          error,
          errorDescription,
          fullSearch: location.search
        });
        
        if (error || errorDescription) {
          const errorMsg = errorDescription || error || "Bank connection failed";
          await logAnalyticsEvent('bank_connect_failed', {
            error: errorMsg,
            timestamp: new Date().toISOString()
          });
          throw new Error(errorMsg);
        }
        
        if (!code) {
          throw new Error("No authorization code was received from your bank");
        }
        
        setStatus(ConnectionStatus.CONNECTING);
        
        // Use the updated callback URL
        const callbackUrl = "https://app.getsproutapp.com/bank-callback";
        
        console.log("BankCallback: Exchanging token with code", { 
          codeLength: code.length,
          callbackUrl 
        });
        
        const response = await supabase.functions.invoke('truelayer', {
          body: { 
            action: 'exchangeToken', 
            code,
            redirectUri: callbackUrl
          }
        });
        
        if (response.error) {
          throw new Error(response.error.message || "Failed to connect bank account");
        }
        
        await logAnalyticsEvent('bank_connect_successful', {
          timestamp: new Date().toISOString()
        });
        
        console.log("Token exchange successful:", response.data ? "Data received" : "No data");
        
        setStatus(ConnectionStatus.SUCCESS);
        
        toast({
          title: "Success",
          description: "Your bank account was connected successfully"
        });
        
        setTimeout(() => navigate("/app/profile"), 1500);
      } catch (error: any) {
        await logError(error, {
          component: 'BankCallback',
          action: 'handleCallback'
        });
        setStatus(ConnectionStatus.FAILED);
        
        toast({
          title: "Connection Failed",
          description: error.message || "Unable to complete bank connection",
          variant: "destructive"
        });
        
        setTimeout(() => navigate("/app/profile"), 3000);
      }
    };
    
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
