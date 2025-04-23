
import { Card } from "@/components/ui/card";
import { Users, MessageSquare } from "lucide-react";
import { GroupFund } from "./types";

interface GroupFundsListProps {
  groupFunds: GroupFund[];
  onSelectFund: (fundId: string) => void;
}

const GroupFundsList = ({ groupFunds, onSelectFund }: GroupFundsListProps) => {
  // Helper function to render emoji based on icon name
  const renderEmoji = (emoji: string) => {
    if (emoji.startsWith('🏝️')) return '🏝️';
    
    // For icon names from Lucide icons, use an appropriate emoji equivalent
    const emojiMap: Record<string, string> = {
      'Palmtree': '🌴',
      'Home': '🏠',
      'Car': '🚗',
      'Laptop': '💻',
      'Plane': '✈️',
      'GraduationCap': '🎓',
      'Gift': '🎁',
      'Tent': '⛺',
    };
    
    return emojiMap[emoji] || '🏦'; // Default emoji if not found
  };

  return (
    <>
      {groupFunds.map((fund) => (
        <Card
          key={fund.id}
          className="p-4 cursor-pointer"
          onClick={() => onSelectFund(fund.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <span className="mr-2 text-xl">{renderEmoji(fund.emoji)}</span>
                <h3 className="font-bold">{fund.name}</h3>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Users size={14} className="mr-1" />
                <span>{fund.members.length} members</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                £{fund.currentAmount.toFixed(2)} / £{fund.target.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round((fund.currentAmount / fund.target) * 100)}% complete
              </div>
            </div>
          </div>
          
          <div className="progress-bar mt-3">
            <div
              className="progress-fill bg-sprout-lavender"
              style={{
                width: `${Math.min(100, (fund.currentAmount / fund.target) * 100)}%`,
              }}
            ></div>
          </div>
          
          <div className="flex items-center mt-3 text-sm text-gray-600">
            <MessageSquare size={14} className="mr-1" />
            <span>{fund.messages.length} messages</span>
          </div>
        </Card>
      ))}
    </>
  );
};

export default GroupFundsList;
