
import { Calendar } from "lucide-react";

interface DepositHistoryProps {
  potId: string;
}

const DepositHistory = ({ potId }: DepositHistoryProps) => {
  // Mock deposit history for the pots
  const getDepositHistory = (potId: string) => {
    // Mock data - in a real app, this would come from the backend
    return [
      { date: "Mar 15, 2025", amount: 50.00 },
      { date: "Feb 28, 2025", amount: 50.00 },
      { date: "Feb 15, 2025", amount: 100.00 },
      { date: "Jan 31, 2025", amount: 25.00 },
      { date: "Jan 15, 2025", amount: 50.00 },
    ];
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center">
        <Calendar size={16} className="mr-1" /> Deposit History
      </h4>
      <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
        {getDepositHistory(potId).map((deposit, index) => (
          <div key={index} className="flex justify-between text-sm py-1 border-b last:border-0 border-gray-100">
            <span className="text-gray-600">{deposit.date}</span>
            <span className="font-medium">£{deposit.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositHistory;
