
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { User, Users, Gift, Book, Copy, Check, Edit, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { user, setUser, triggerConfetti } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.name || "");
  const [updatedDay, setUpdatedDay] = useState(user?.dateOfBirth?.split('/')[0] || "");
  const [updatedMonth, setUpdatedMonth] = useState(user?.dateOfBirth?.split('/')[1] || "");
  const [updatedYear, setUpdatedYear] = useState(user?.dateOfBirth?.split('/')[2] || "");
  
  const [copied, setCopied] = useState(false);
  
  const handleCopyReferralCode = () => {
    if (!user) return;
    
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleSaveProfile = () => {
    if (!user) return;
    
    setUser({
      ...user,
      name: updatedName,
      dateOfBirth: `${updatedDay}/${updatedMonth}/${updatedYear}`,
    });
    
    setIsEditingProfile(false);
  };
  
  if (!user) return null;
  
  const educationalContent = [
    {
      title: "Investing Basics",
      description: "Learn the fundamentals of investing",
      icon: "📊",
    },
    {
      title: "Savings Strategies",
      description: "Tips to maximize your savings",
      icon: "💰",
    },
    {
      title: "Understanding Risk",
      description: "What risk means in investing",
      icon: "⚖️",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in text-center mb-4">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-sprout-green bg-white">
          <AvatarImage src="/sprout-logo.png" alt="Sprout" className="p-2" />
          <AvatarFallback className="bg-sprout-green/20">
            <User size={32} />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">Profile 👤</h1>
        <p className="text-gray-600">Manage your account</p>
      </div>
      
      <Card className="p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-sprout-green/20 rounded-full flex items-center justify-center mr-3">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-600">Member since 2025</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsEditingProfile(true)}>
            <Edit size={18} />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p>{user.dateOfBirth}</p>
          </div>
        </div>
      </Card>
      
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="DD"
                    value={updatedDay}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setUpdatedDay(value);
                    }}
                    className="text-center"
                    maxLength={2}
                  />
                  <p className="text-xs text-center mt-1 text-gray-500">Day</p>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="MM"
                    value={updatedMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setUpdatedMonth(value);
                    }}
                    className="text-center"
                    maxLength={2}
                  />
                  <p className="text-xs text-center mt-1 text-gray-500">Month</p>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="YYYY"
                    value={updatedYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setUpdatedYear(value);
                    }}
                    className="text-center"
                    maxLength={4}
                  />
                  <p className="text-xs text-center mt-1 text-gray-500">Year</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-sprout-pink/20 rounded-full flex items-center justify-center mr-2">
            <Gift size={18} className="text-sprout-pink" />
          </div>
          <h3 className="font-bold">Referral Program</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Share your referral code with friends. You both get £5 when they join!
        </p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-mono font-medium">{user.referralCode}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyReferralCode}
              className="text-gray-500 hover:text-gray-700"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-sprout-green/10 rounded-lg">
          <div>
            <p className="font-medium">{user.friendsReferred} friends referred</p>
            <p className="text-sm text-gray-600">£{user.rewardsEarned} earned</p>
          </div>
          <Button
            className="bg-sprout-green text-black/80 hover:bg-sprout-green/90"
            size="sm"
            onClick={() => {
              handleCopyReferralCode();
              triggerConfetti();
            }}
          >
            Share
          </Button>
        </div>
      </Card>
      
      <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-sprout-lavender/20 rounded-full flex items-center justify-center mr-2">
              <Users size={18} className="text-sprout-lavender" />
            </div>
            <h3 className="font-bold">Group Funds</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {}}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        
        <p className="text-sm text-gray-600">
          You're part of 1 group fund. Track progress and chat with members.
        </p>
      </Card>
      
      <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-sprout-blue/20 rounded-full flex items-center justify-center mr-2">
              <Book size={18} className="text-sprout-blue" />
            </div>
            <h3 className="font-bold">Learn</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {}}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        
        <div className="space-y-3">
          {educationalContent.map((item, index) => (
            <div
              key={index}
              className="flex items-center border-b last:border-0 border-gray-100 py-2"
            >
              <div className="text-xl mr-3">{item.icon}</div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
