import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, UserPlus, UserMinus, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FriendDetailsDialog } from "./FriendDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Friend {
  id: number;
  name: string;
  portfolioType: string;
  mutualFriends: number;
  joinDate: string;
  investmentPreferences: string[];
  totalInvestments: number;
}

export const FriendsCard = () => {
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "Emma Johnson",
      portfolioType: "Tech Growth",
      mutualFriends: 3,
      joinDate: "January 2025",
      investmentPreferences: ["Technology", "Clean Energy", "Growth Stocks"],
      totalInvestments: 8
    },
    {
      id: 2,
      name: "Liam Smith",
      portfolioType: "Green Energy",
      mutualFriends: 1,
      joinDate: "February 2025",
      investmentPreferences: ["Renewable Energy", "Sustainable Tech", "ESG Funds"],
      totalInvestments: 5
    },
    {
      id: 3,
      name: "Olivia Williams",
      portfolioType: "Balanced Mix",
      mutualFriends: 0,
      joinDate: "March 2025",
      investmentPreferences: ["Index Funds", "Bonds", "Blue Chip Stocks"],
      totalInvestments: 12
    }
  ]);

  const handleFindFriends = () => {
    navigate('/app/find-friends');
  };

  const handleRemoveFriend = (friendId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const friendToRemove = friends.find(f => f.id === friendId);
    setFriends(friends.filter(friend => friend.id !== friendId));
    
    toast({
      title: "Friend Removed",
      description: `You have removed ${friendToRemove?.name} from your friends list`,
    });
  };

  return (
    <>
      <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sprout-lavender/20 rounded-full flex items-center justify-center mr-2">
                <Users size={18} className="text-sprout-lavender" />
              </div>
              <h3 className="font-bold">Friends</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleFindFriends}
                variant="outline"
                size="sm"
                className="border-sprout-lavender text-sprout-lavender hover:bg-sprout-lavender/10"
              >
                <UserPlus size={16} className="mr-1" /> Find Friends
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-200 ${
                      isOpen ? "transform rotate-90" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            {friends.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-600 mb-4">
                  You haven't added any friends yet. Find and follow friends to grow your investing journey together!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <div 
                      key={friend.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{friend.name}</p>
                          <Badge variant="lavender" className="text-xs">
                            {friend.portfolioType}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => handleRemoveFriend(friend.id, e)}
                      >
                        <UserMinus size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <FriendDetailsDialog 
        friend={selectedFriend}
        isOpen={selectedFriend !== null}
        onClose={() => setSelectedFriend(null)}
      />
    </>
  );
};
