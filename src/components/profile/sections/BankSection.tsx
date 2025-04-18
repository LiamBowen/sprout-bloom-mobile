
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, CreditCard, ExternalLink } from "lucide-react";
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

  useEffect(() => {
    fetchBankConnections();

    // Check for TrueLayer auth code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleTrueLayerCallback(code);
    }
  }, []);

  const fetchBankConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_connections')
        .select('*');

      if (error) throw error;
      setBankConnections(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch bank connections",
        variant: "destructive"
      });
    }
  };

  const handleConnectBank = async () => {
    try {
      setIsConnecting(true);
      const response = await supabase.functions.invoke('truelayer', {
        body: { action: 'generateAuthLink' }
      });

      if (response.error) throw response.error;
      
      // Store the auth URL and show confirmation dialog instead of immediate redirect
      setAuthUrl(response.data.authUrl);
      setIsRedirectDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not initiate bank connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConfirmRedirect = () => {
    // Log before redirect
    console.log("Redirecting to TrueLayer:", authUrl);
    
    // Redirect to TrueLayer auth page
    window.location.href = authUrl;
  };

  const handleTrueLayerCallback = async (code: string) => {
    try {
      setIsConnecting(true);
      toast({
        title: "Processing",
        description: "Connecting your bank account..."
      });
      
      const response = await supabase.functions.invoke('truelayer', {
        body: { action: 'exchangeToken', code }
      });

      if (response.error) throw response.error;

      await fetchBankConnections();
      toast({
        title: "Success",
        description: "Bank connected successfully"
      });

      // Clean up URL
      window.history.replaceState({}, '', '/app/profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not complete bank connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
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
          {bankConnections.length === 0 ? (
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
              {bankConnections.map((connection) => (
                <div 
                  key={connection.id} 
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600">{connection.account_name}</span>
                  <span className="text-xs text-gray-500">{connection.account_type}</span>
                </div>
              ))}
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
            <Button onClick={handleConfirmRedirect} className="flex items-center gap-2">
              Continue to TrueLayer <ExternalLink size={16} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
