
import { User, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@/contexts/AuthContext";

interface PersonalInfoViewProps {
  user: UserType | null;
  onEdit: () => void;
}

export const PersonalInfoView = ({ user, onEdit }: PersonalInfoViewProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <User size={16} className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-600">Name</span>
        </div>
        <span className="text-sm font-medium">{user?.name}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Mail size={16} className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-600">Email</span>
        </div>
        <span className="text-sm font-medium max-w-[180px] truncate">{user?.email}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Phone size={16} className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-600">Mobile</span>
        </div>
        <span className="text-sm font-medium">{user?.mobile_number || 'Not set'}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-600">Date of Birth</span>
        </div>
        <span className="text-sm font-medium">{user?.dateOfBirth || 'Not set'}</span>
      </div>
      <Button variant="outline" size="sm" onClick={onEdit} className="mt-2">
        Edit Profile
      </Button>
    </div>
  );
};
