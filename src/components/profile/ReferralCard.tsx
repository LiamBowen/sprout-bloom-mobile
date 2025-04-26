
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

export const ReferralCard = () => {
  const { triggerConfetti } = useApp();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Default values if user data is incomplete
  const referralCode = user?.referralCode || "USER2025";
  const friendsReferred = user?.friendsReferred || 0;
  const rewardsEarned = user?.rewardsEarned || 0;

  const handleCopyReferralCode = () => {
    if (!referralCode) return;
    
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!user) return null;

  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-sprout-pink/20 rounded-full flex items-center justify-center mr-2">
          <Gift size={18} className="text-sprout-pink" />
        </div>
        <h3 className="font-bold">Refer a Friend!</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Share your referral code with friends. You both get £5 when they join!
      </p>
      
      <div className="mb-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-mono font-medium">{referralCode}</span>
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
          <p className="font-medium">{friendsReferred} friends referred</p>
          <p className="text-sm text-gray-600">£{rewardsEarned} earned</p>
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
  );
};
