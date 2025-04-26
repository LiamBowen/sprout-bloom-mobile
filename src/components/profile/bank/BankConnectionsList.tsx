
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BankConnection } from "@/hooks/use-bank-connections";

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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-gray-500">Loading bank connections...</span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 whitespace-nowrap">Link Bank Account</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={onConnectBank}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </Button>
      </div>
    );
  }

  return (
    <>
      {connections.map((connection) => (
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
          onClick={onConnectBank}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </Button>
      </div>
    </>
  );
};
