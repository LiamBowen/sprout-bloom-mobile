
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BankConnection {
  id: string;
  account_name: string;
  account_type: string;
  provider: string;
  account_id: string;
  currency: string;
  created_at: string;
  user_id: string;
}

export function useBankConnections() {
  const { toast } = useToast();
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchBankConnections();
  }, []);

  const fetchBankConnections = async () => {
    setIsLoading(true);
    try {
      console.log("useBankConnections: Fetching bank connections");
      const { data, error } = await supabase
        .from('bank_connections')
        .select('*');

      if (error) throw error;
      
      console.log("useBankConnections: Bank connections fetched", { count: data?.length || 0 });
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

  return {
    bankConnections,
    isLoading,
    isConnecting,
    setIsConnecting,
    fetchBankConnections
  };
}
