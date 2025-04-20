import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  roundUp: number;
}

interface RoundUpsProps {
  transactions: Transaction[];
  roundUpAmount: number;
  onRoundUpChange: (amount: number) => void;
}

export const RoundUps = ({ 
  transactions, 
  roundUpAmount, 
  onRoundUpChange 
}: RoundUpsProps) => {
  const totalRoundUps = transactions.reduce((acc, tx) => acc + tx.roundUp * roundUpAmount, 0);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-bold mb-4">Round-up Multiplier</h3>
        <p className="text-sm text-gray-600 mb-4">
          Round up your purchases and invest the spare change.
        </p>
        
        <div className="flex justify-between space-x-3 mb-6">
          {[1, 2, 3].map((multiplier) => (
            <button
              key={multiplier}
              onClick={() => onRoundUpChange(multiplier)}
              className={`flex-1 py-3 rounded-lg border ${
                roundUpAmount === multiplier
                  ? "border-sprout-green bg-sprout-green/10"
                  : "border-gray-200"
              }`}
            >
              {multiplier}x
            </button>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">This week's round-ups:</span>
            <span className="font-bold">£{totalRoundUps.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 mt-4">
          <Button className="w-full btn-action btn-primary">
            Invest Round-ups <ArrowRight size={18} />
          </Button>
          <Button variant="outline" className="w-full">
            Withdraw Round-ups
          </Button>
        </div>
      </Card>

      <h3 className="font-semibold mt-4">Recent Transactions</h3>
      
      {transactions.map((tx) => (
        <Card key={tx.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{tx.merchant}</h4>
              <p className="text-xs text-gray-500">{tx.date}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold">£{tx.amount.toFixed(2)}</div>
              <div className="text-xs text-sprout-green">
                +£{(tx.roundUp * roundUpAmount).toFixed(2)} round-up
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
