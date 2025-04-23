import { useState } from "react";
import { ArrowLeft, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const FindFriends = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const suggestedFriends = [
    { id: 1, name: "Emma Johnson", portfolioType: "Tech Growth", mutualFriends: 3 },
    { id: 2, name: "Liam Smith", portfolioType: "Green Energy", mutualFriends: 1 },
    { id: 3, name: "Olivia Williams", portfolioType: "Balanced Mix", mutualFriends: 0 },
    { id: 4, name: "Noah Brown", portfolioType: "Crypto Explorer", mutualFriends: 2 },
  ];
  
  const handleBack = () => {
    navigate('/app/profile');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };
  
  const handleAddFriend = (friendId) => {
    toast({
      title: "Friend request sent!",
      description: "They'll receive a notification to accept your request.",
    });
  };
  
  const handleInvite = (e) => {
    e.preventDefault();
    toast({
      title: "Invitation sent!",
      description: "We've sent an invitation to join Sprout.",
    });
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Find Friends</h1>
      </div>
      
      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search by name or email" 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Suggested Friends</h2>
          
          {suggestedFriends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-2 sm:p-3 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{friend.name}</p>
                  <div className="flex flex-col items-start gap-0.5">
                    <Badge variant="lavender" className="text-[10px] sm:text-xs mb-0">
                      {friend.portfolioType}
                    </Badge>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {friend.mutualFriends === 0
                        ? "No mutual friends"
                        : friend.mutualFriends === 1
                          ? "1 mutual friend"
                          : `${friend.mutualFriends} mutual friends`}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleAddFriend(friend.id)}
                className="border-sprout-lavender text-sprout-lavender hover:bg-sprout-lavender/10 ml-2"
              >
                <UserPlus size={16} className="sm:mr-1" />
                <span className="hidden sm:inline">Follow</span>
              </Button>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4 sm:p-6">
        <h2 className="font-semibold text-lg mb-4">Invite Friends via Email</h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Friend's email address"
            required
          />
          <Button type="submit" className="w-full bg-sprout-lavender text-white hover:bg-sprout-lavender/90">
            Send Invitation
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default FindFriends;
