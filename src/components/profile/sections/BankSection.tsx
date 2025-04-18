
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BankSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const BankSection = ({ isOpen, onOpenChange }: BankSectionProps) => {
  const { toast } = useToast();
  const [bankConnections, setBankConnections] = useState([]);

  useEffect(() => {
    fetchBankConnections();
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

  const handleConnectBank = () => {
    toast({
      title: "Coming Soon",
      description: "TrueLayer bank connection feature is being implemented"
    });
  };

  return (
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
            >
              Connect Bank
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
  );
};
