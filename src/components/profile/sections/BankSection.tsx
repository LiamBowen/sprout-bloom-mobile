
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, CreditCard } from "lucide-react";
import { useBankConnections } from "@/hooks/use-bank-connections";
import { BankConnectionsList } from "@/components/profile/bank/BankConnectionsList";
import { ConnectBankDialog } from "@/components/profile/bank/ConnectBankDialog";

interface BankSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const BankSection = ({ isOpen, onOpenChange }: BankSectionProps) => {
  const {
    bankConnections,
    isLoading,
    isConnecting,
    authUrl,
    generateAuthLink
  } = useBankConnections();
  
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);

  const handleConnectBank = async () => {
    const generatedAuthUrl = await generateAuthLink();
    if (generatedAuthUrl) {
      setIsRedirectDialogOpen(true);
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
          <BankConnectionsList 
            connections={bankConnections}
            isLoading={isLoading}
            isConnecting={isConnecting}
            onConnectBank={handleConnectBank}
          />
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
      
      <ConnectBankDialog
        open={isRedirectDialogOpen}
        authUrl={authUrl}
        onOpenChange={setIsRedirectDialogOpen}
        onConfirm={handleConfirmRedirect}
      />
    </>
  );
};
