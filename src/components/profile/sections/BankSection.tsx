import { useState } from "react";
import { ChevronRight, CreditCard } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useBankConnections } from "@/hooks/use-bank-connections";
import { BankConnectionsList } from "@/components/profile/bank/BankConnectionsList";
import { ConnectBankDialog } from "@/components/profile/bank/ConnectBankDialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface BankSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const BankSection = ({ isOpen, onOpenChange }: BankSectionProps) => {
  const { toast } = useToast();
  const { 
    bankConnections, 
    isLoading, 
    isConnecting,
    setIsConnecting,
    fetchBankConnections
  } = useBankConnections();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roundUpsEnabled, setRoundUpsEnabled] = useState(false);
  const [authUrl, setAuthUrl] = useState("");

  const prepareConnectBank = async () => {
    try {
      setIsConnecting(true);
      
      // Use the updated redirect URL without /app prefix
      const callbackUrl = "https://app.getsproutapp.com/bank-callback";
      
      console.log("BankSection: Starting bank connection with callback:", callbackUrl);
      
      const { data, error } = await supabase.functions.invoke("truelayer", {
        body: { 
          action: "generateAuthLink",
          redirectUri: callbackUrl
        },
      });

      if (error) {
        console.error("❌ Error from supabase.functions.invoke:", error);
        toast({
          title: "Error",
          description: "Could not connect to bank",
          variant: "destructive"
        });
        return;
      }

      if (data?.authUrl) {
        console.log("✅ Received auth URL:", data.authUrl);
        setAuthUrl(data.authUrl);
        setIsDialogOpen(true);
      } else {
        console.warn("⚠️ No authUrl received from function", data);
        toast({
          title: "Error",
          description: "No authentication URL received",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error("❌ Unexpected error in prepareConnectBank:", err);
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectBank = () => {
    if (authUrl) {
      console.log("BankSection: Redirecting to:", authUrl);
      window.location.href = authUrl;
    } else {
      toast({
        title: "Error",
        description: "No authentication URL available",
        variant: "destructive"
      });
    }
  };

  const handleRoundUpsToggle = (enabled: boolean) => {
    setRoundUpsEnabled(enabled);
    
    toast({
      title: enabled ? "Round-ups Enabled" : "Round-ups Disabled",
      description: enabled 
        ? "Your purchases will be rounded up and the spare change will be invested" 
        : "Round-ups have been turned off",
      variant: enabled ? "default" : "destructive",
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="mb-4 border-b pb-2">
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <CreditCard size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Bank Connections</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4">
        <div className="space-y-4">
          {bankConnections.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
              <div>
                <h4 className="font-medium text-sm">Round-ups</h4>
                <p className="text-xs text-gray-500">Round up purchases and invest the spare change</p>
              </div>
              <Switch 
                checked={roundUpsEnabled}
                onCheckedChange={handleRoundUpsToggle}
                className="data-[state=checked]:bg-sprout-green"
              />
            </div>
          )}
          
          <BankConnectionsList
            connections={bankConnections}
            isLoading={isLoading}
            isConnecting={isConnecting}
            onConnectBank={prepareConnectBank}
          />
        </div>
        
        <ConnectBankDialog
          open={isDialogOpen}
          authUrl={authUrl}
          onOpenChange={setIsDialogOpen}
          onConfirm={handleConnectBank}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
