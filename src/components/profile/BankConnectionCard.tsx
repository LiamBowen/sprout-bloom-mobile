
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const BankConnectionCard = () => {
  const [bankConnections, setBankConnections] = useState([]);
  const { toast } = useToast();

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
    // TODO: Implement TrueLayer OAuth flow
    toast({
      title: "Coming Soon",
      description: "TrueLayer bank connection feature is being implemented"
    });
  };

  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-sprout-blue/20 rounded-full flex items-center justify-center mr-2">
          <CreditCard size={18} className="text-sprout-blue" />
        </div>
        <h2 className="text-xl font-semibold">Bank Connections 🏦</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Connect your bank accounts to track finances seamlessly.
      </p>

      {bankConnections.length === 0 ? (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            No bank accounts connected yet
          </p>
          <Button onClick={handleConnectBank}>
            Connect Bank Account
          </Button>
        </div>
      ) : (
        <div>
          {bankConnections.map((connection) => (
            <div 
              key={connection.id} 
              className="flex justify-between items-center border-b py-2 last:border-b-0"
            >
              <span>{connection.account_name}</span>
              <span className="text-sm text-gray-500">
                {connection.account_type}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
