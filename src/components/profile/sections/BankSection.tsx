
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface BankSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const BankSection = ({ isOpen, onOpenChange }: BankSectionProps) => {
  const { toast } = useToast();
  const [bankConnections, setBankConnections] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBankConnections();
  }, []);

  const fetchBankConnections = async () => {
    setIsLoading(true);
    try {
      console.log("BankSection: Fetching bank connections");
      const { data, error } = await supabase
        .from('bank_connections')
        .select('*');

      if (error) throw error;
      
      console.log("BankSection: Bank connections fetched", { count: data?.length || 0 });
      setBankConnections(data || []);
    } catch (error) {
      console.error("Error fetching bank connections:", error);
      toast({
        title: "Error",
        description: "Could not fetch bank connections",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectBank = async () => {
    try {
      setIsConnecting(true);
      
      // Get the current origin for proper redirect
      const origin = window.location.origin;
      const callbackUrl = `${origin}/app/bank-callback`;
      
      console.log("BankSection: Initiating bank connection with callback URL:", callbackUrl);
      
      const response = await supabase.functions.invoke('truelayer', {
        body: { 
          action: 'generateAuthLink',
          redirectUri: callbackUrl 
        }
      });

      if (response.error) {
        console.error("Error generating auth link:", response.error);
        throw response.error;
      }
      
      if (!response.data?.authUrl) {
        throw new Error("No authorization URL received from server");
      }
      
      console.log("BankSection: Received auth URL from TrueLayer:", response.data.authUrl);
      
      // Store the auth URL and show confirmation dialog
      setAuthUrl(response.data.authUrl);
      setIsRedirectDialogOpen(true);
    } catch (error: any) {
      console.error("Error generating auth link:", error);
      toast({
        title: "Error",
        description: "Could not initiate bank connection: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConfirmRedirect = () => {
    // Close the dialog first
    setIsRedirectDialogOpen(false);
    
    // Log before redirect
    console.log("BankSection: Redirecting to TrueLayer auth page:", authUrl);
    
    // Use window.location.href to ensure proper navigation
    window.location.href = authUrl;
  };

  return (
    <>
      <Collapsible 
        open={isOpen} 
        onOpenChange={onOpenChange}
        className="mb-4 border-b pb-2"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
          <div className="flex items-center">
            <CreditCard size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Bank & Payment Details</span>
          </div>
          <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading bank connections...</span>
            </div>
          ) : bankConnections.length === 0 ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Connect Bank Account</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={handleConnectBank}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Bank"}
              </Button>
            </div>
          ) : (
            <>
              {bankConnections.map((connection: any) => (
                <div 
                  key={connection.id} 
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600">{connection.account_name || 'Bank Account'}</span>
                  <span className="text-xs text-gray-500">{connection.account_type || 'Connected Account'}</span>
                </div>
              ))}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Add Another Account</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleConnectBank}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Round-up Settings</span>
            <Toggle 
              aria-label="Toggle round-up"
              className="data-[state=on]:bg-sprout-green"
              defaultPressed
            >
              <span className="text-xs">Enabled</span>
            </Toggle>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Dialog open={isRedirectDialogOpen} onOpenChange={setIsRedirectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Your Bank</DialogTitle>
            <DialogDescription>
              You'll be redirected to TrueLayer to securely connect your bank account.
              No sensitive banking details will be stored in Sprout.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsRedirectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmRedirect} 
              className="flex items-center gap-2"
              disabled={!authUrl}
            >
              Continue to TrueLayer <ExternalLink size={16} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
