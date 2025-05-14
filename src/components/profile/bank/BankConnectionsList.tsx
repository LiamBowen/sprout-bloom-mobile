
import { Ban, CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type BankConnection } from "@/hooks/use-bank-connections";

interface BankConnectionsListProps {
  connections: BankConnection[];
  isLoading: boolean;
  isConnecting: boolean;
  onConnectBank: () => void;
}

export const BankConnectionsList = ({
  connections,
  isLoading,
  isConnecting,
  onConnectBank
}: BankConnectionsListProps) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="rounded-full bg-gray-200 h-4 w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-36"></div>
        </div>
      </div>
    );
  }

  // No connections yet
  if (connections.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-center">
          <CreditCard className="h-10 w-10 text-gray-400 mb-2" />
        </div>
        <h3 className="text-sm font-medium mb-1">No bank accounts connected</h3>
        <p className="text-xs text-gray-500 mb-4">
          Connect your bank account to track your spending and set up automatic investing.
        </p>
        <Button 
          variant="default" 
          className="w-full flex items-center justify-center"
          onClick={onConnectBank}
          disabled={isConnecting}
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect Bank"}
        </Button>
      </div>
    );
  }

  // Display connected banks
  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <div key={connection.id} className="border rounded-lg p-3 flex justify-between items-center">
          <div>
            <h3 className="font-medium">{connection.account_name}</h3>
            <p className="text-sm text-gray-500">{connection.account_type} · {connection.currency}</p>
          </div>
          <CreditCard className="h-5 w-5 text-gray-500" />
        </div>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center mt-4"
        onClick={onConnectBank}
        disabled={isConnecting}
        type="button"
      >
        <Plus className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Another Bank"}
      </Button>
    </div>
  );
};
