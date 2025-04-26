
import { ChevronRight } from "lucide-react";
import { User } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PersonalInfoView } from "./personal-info/PersonalInfoView";
import { PersonalInfoForm } from "./personal-info/PersonalInfoForm";
import { usePersonalInfo } from "./personal-info/usePersonalInfo";

interface PersonalInfoSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const PersonalInfoSection = ({
  isOpen,
  onOpenChange
}: PersonalInfoSectionProps) => {
  const {
    isEditing,
    setIsEditing,
    name,
    setName,
    email,
    setEmail,
    mobile,
    setMobile,
    dateOfBirth,
    setDateOfBirth,
    loading,
    handleUpdateProfile,
  } = usePersonalInfo();

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="mb-4 border-b pb-2">
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <User size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Personal Information</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-4">
        {isEditing ? (
          <PersonalInfoForm
            name={name}
            email={email}
            mobile={mobile}
            dateOfBirth={dateOfBirth}
            onNameChange={setName}
            onEmailChange={setEmail}
            onMobileChange={setMobile}
            onDateChange={setDateOfBirth}
            onSave={handleUpdateProfile}
            onCancel={() => setIsEditing(false)}
            loading={loading}
          />
        ) : (
          <PersonalInfoView
            user={usePersonalInfo().user}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
