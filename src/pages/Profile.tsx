
import { useApp } from "@/contexts/AppContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { FriendsCard } from "@/components/profile/FriendsCard";
import { SettingsCard } from "@/components/profile/SettingsCard";
import { ReferralCard } from "@/components/profile/ReferralCard";
import { GroupFundsCard } from "@/components/profile/GroupFundsCard";
import { LearnCard } from "@/components/profile/LearnCard";

const Profile = () => {
  const { user } = useApp();
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <UserInfoCard />
      <FriendsCard />
      <SettingsCard />
      <ReferralCard />
      <GroupFundsCard />
      <LearnCard />
    </div>
  );
};

export default Profile;
