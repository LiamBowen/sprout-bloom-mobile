
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Friend {
  id: number;
  name: string;
  portfolioType: string;
  mutualFriends: number;
  joinDate: string;
  investmentPreferences: string[];
  totalInvestments: number;
}

interface FriendDetailsDialogProps {
  friend: Friend | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FriendDetailsDialog = ({ friend, isOpen, onClose }: FriendDetailsDialogProps) => {
  if (!friend) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Friend Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{friend.name}</h3>
              <Badge variant="lavender" className="mt-1">
                {friend.portfolioType}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">{friend.joinDate}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Investment Preferences</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {friend.investmentPreferences.map((pref, index) => (
                  <Badge key={index} variant="outline">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Portfolio Stats</p>
              <div className="mt-1">
                <p className="font-medium">{friend.totalInvestments} Active Investments</p>
                <p className="text-sm text-gray-600">{friend.mutualFriends} mutual friends</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
