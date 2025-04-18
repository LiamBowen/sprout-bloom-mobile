
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FriendsCard = () => {
  const navigate = useNavigate();
  const friends: any[] = []; // Empty by default to showcase the empty state

  const handleFindFriends = () => {
    navigate('/app/find-friends');
  };

  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-sprout-lavender/20 rounded-full flex items-center justify-center mr-2">
          <Users size={18} className="text-sprout-lavender" />
        </div>
        <h3 className="font-bold">Friends</h3>
      </div>
      
      {friends.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-600 mb-4">
            You haven't added any friends yet. Find and follow friends to grow your investing journey together!
          </p>
          <Button 
            onClick={handleFindFriends}
            className="bg-sprout-lavender text-white hover:bg-sprout-lavender/90"
          >
            <UserPlus size={18} className="mr-1" /> Find Friends
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {friends.map((friend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  {friend.portfolioType && (
                    <Badge variant="lavender" className="text-xs">
                      {friend.portfolioType}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleFindFriends}
              className="bg-sprout-lavender text-white hover:bg-sprout-lavender/90"
            >
              <UserPlus size={18} className="mr-1" /> Find Friends
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
