
import { UserPlus, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface FriendRequestCardProps {
  id: number;
  name: string;
  portfolioType: string;
  mutualFriends: number;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

export const FriendRequestCard = ({
  id,
  name,
  portfolioType,
  mutualFriends,
  onAccept,
  onDecline
}: FriendRequestCardProps) => {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 border border-gray-100 rounded-lg">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm sm:text-base truncate">{name}</p>
          <div className="flex flex-col items-start gap-0.5">
            <Badge variant="lavender" className="text-[10px] sm:text-xs mb-0">
              {portfolioType}
            </Badge>
            <span className="text-[10px] sm:text-xs text-gray-500">
              {mutualFriends === 1
                ? "1 mutual friend"
                : `${mutualFriends} mutual friends`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="icon"
          className="text-sprout-lavender hover:bg-sprout-lavender/10 border-sprout-lavender"
          onClick={() => onAccept(id)}
        >
          <UserPlus size={16} />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => onDecline(id)}
        >
          <UserX size={16} />
        </Button>
      </div>
    </div>
  );
};
