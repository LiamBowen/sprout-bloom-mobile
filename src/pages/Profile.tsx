
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { FriendsCard } from "@/components/profile/FriendsCard";
import { ReferralCard } from "@/components/profile/ReferralCard";
import { SettingsCard } from "@/components/profile/SettingsCard";
import { LearnCard } from "@/components/profile/LearnCard";
import { useEffect } from "react";

const Profile = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <UserInfoCard />
      <FriendsCard />
      <ReferralCard />
      <SettingsCard />
      <LearnCard />
    </div>
  );
};

export default Profile;
