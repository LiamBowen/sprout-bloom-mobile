
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import GroupFundsList from "./GroupFundsList";
import GroupFundDetails from "./GroupFundDetails";
import NewGroupFundDialog from "./NewGroupFundDialog";
import { GroupFund } from "./types";

interface GroupFundsProps {
  groupFunds: GroupFund[];
  onCreateGroupFund: (name: string, emoji: string, target: string) => void;
  onSendMessage: (fundId: string, message: string) => void;
  onDeleteFund: (fundId: string) => void;
}

const GroupFunds = ({ groupFunds, onCreateGroupFund, onSendMessage, onDeleteFund }: GroupFundsProps) => {
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  
  const fund = selectedFund ? groupFunds.find(f => f.id === selectedFund) : null;

  return (
    <div className="space-y-4">
      {selectedFund && fund ? (
        <GroupFundDetails 
          fund={fund} 
          onBack={() => setSelectedFund(null)} 
          onSendMessage={onSendMessage}
          onDeleteFund={(fundId) => {
            onDeleteFund(fundId);
            setSelectedFund(null);
          }}
        />
      ) : (
        <>
          <Card className="p-4 bg-sprout-lavender/10 border-sprout-lavender/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-base md:text-lg">Group Savings</h3>
                <p className="text-sm text-gray-600 mb-1">Save together, achieve more</p>
                <div className="inline-block bg-sprout-lavender/20 px-2 py-0.5 rounded text-sm font-medium">
                  Split costs with friends
                </div>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </Card>

          <GroupFundsList 
            groupFunds={groupFunds} 
            onSelectFund={(fundId) => setSelectedFund(fundId)} 
          />
          <NewGroupFundDialog onCreateGroupFund={onCreateGroupFund} />
        </>
      )}
    </div>
  );
};

export default GroupFunds;
