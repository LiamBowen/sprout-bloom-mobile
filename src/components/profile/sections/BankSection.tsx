
import { useState } from "react";
import { ChevronRight, CreditCard } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
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
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnectBank = async () => {
    // Generate the authentication link
    const generatedUrl = await generateAuthLink();
    
    if (generatedUrl) {
      setIsDialogOpen(true);
    }
  };
  
  const handleConfirmBankConnect = () => {
    if (authUrl) {
      // Open in a new tab
      window.open(authUrl, "_blank", "noopener,noreferrer");
      setIsDialogOpen(false);
    }
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
          <BankConnectionsList
            connections={bankConnections}
            isLoading={isLoading}
            isConnecting={isConnecting}
            onConnectBank={handleConnectBank}
          />
          
          <ConnectBankDialog 
            open={isDialogOpen}
            authUrl={authUrl}
            onOpenChange={setIsDialogOpen}
            onConfirm={handleConfirmBankConnect}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

