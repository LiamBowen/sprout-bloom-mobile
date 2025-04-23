
import { useState } from "react";
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
