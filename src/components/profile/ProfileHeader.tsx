
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const ProfileHeader = () => {
  return (
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
  );
};
