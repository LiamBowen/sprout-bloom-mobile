
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { FriendsCard } from "@/components/profile/FriendsCard";
import { ReferralCard } from "@/components/profile/ReferralCard";
import { SettingsCard } from "@/components/profile/SettingsCard";
import { LearnCard } from "@/components/profile/LearnCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!user) return null;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user data but maintain onboarding status
      setUser(null);
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <UserInfoCard />
      <FriendsCard />
      <ReferralCard />
      <SettingsCard />
      <LearnCard />
      
      <Button 
        variant="outline" 
        className="w-full text-destructive border-destructive hover:bg-destructive/10"
        onClick={handleSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default Profile;
