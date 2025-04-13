
interface ProviderDetailsProps {
  potId: string;
  apy: number;
  amount: number;
  target: number;
}

const ProviderDetails = ({ potId, apy, amount, target }: ProviderDetailsProps) => {
  // Mock bank provider for saving pots
  const getPotProvider = (potId: string) => {
    const providers = {
      "emergency-fund": "Barclays Savings",
      "vacation": "Monzo Savings Pot",
      default: "Sprout Partner Bank"
    };
    
    return providers[potId as keyof typeof providers] || providers.default;
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Savings Account Details</h4>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Provider:</span>
          <span className="font-medium">{getPotProvider(potId)}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Interest Rate:</span>
          <span className="font-medium text-sprout-blue">{apy}% APY</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Current Amount:</span>
          <span className="font-medium">£{amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Target Amount:</span>
          <span className="font-medium">£{target.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;
