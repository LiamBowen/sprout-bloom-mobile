
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SuggestedFriendCardProps {
  id: number;
  name: string;
  portfolioType: string;
  mutualFriends: number;
  isFollowing: boolean;
  onFollow: (id: number) => void;
}

export const SuggestedFriendCard = ({
  id,
  name,
  portfolioType,
  mutualFriends,
  isFollowing,
  onFollow
}: SuggestedFriendCardProps) => {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 border border-gray-100 rounded-lg">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium text-sm sm:text-base truncate">{name}</p>
          <div className="flex flex-col items-start gap-0.5">
            <Badge variant="lavender" className="text-[10px] sm:text-xs mb-0">
              {portfolioType}
            </Badge>
            <span className="text-[10px] sm:text-xs text-gray-500">
              {mutualFriends === 0
                ? "No mutual friends"
                : mutualFriends === 1
                  ? "1 mutual friend"
                  : `${mutualFriends} mutual friends`}
            </span>
          </div>
        </div>
      </div>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => onFollow(id)}
        className={isFollowing 
          ? "bg-sprout-lavender text-white hover:bg-sprout-lavender/90" 
          : "border-sprout-lavender text-sprout-lavender hover:bg-sprout-lavender/10"}
      >
        <UserPlus size={16} className="sm:mr-1" />
        <span className="hidden sm:inline">
          {isFollowing ? 'Following' : 'Follow'}
        </span>
      </Button>
    </div>
  );
};
