
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BankConnection } from "@/hooks/use-bank-connections";
import { useState } from "react";

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
  const [roundUpsEnabled, setRoundUpsEnabled] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-gray-500">Loading bank connections...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Link Bank Account</span>
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
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Round-ups</span>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={roundUpsEnabled}
            onCheckedChange={setRoundUpsEnabled}
          />
          <span className="text-xs text-gray-500">{roundUpsEnabled ? 'On' : 'Off'}</span>
        </div>
      </div>

      {connections.length > 0 && (
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
          <div className="flex justify-between items-center">
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
      )}
    </div>
  );
};
