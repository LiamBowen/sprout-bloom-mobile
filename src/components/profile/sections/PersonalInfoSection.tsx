
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
  const personalInfo = usePersonalInfo();
  
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
        {personalInfo.isEditing ? (
          <PersonalInfoForm
            name={personalInfo.name}
            email={personalInfo.email}
            mobile={personalInfo.mobile}
            dateOfBirth={personalInfo.dateOfBirth}
            onNameChange={personalInfo.setName}
            onEmailChange={personalInfo.setEmail}
            onMobileChange={personalInfo.setMobile}
            onDateChange={personalInfo.setDateOfBirth}
            onSave={personalInfo.handleUpdateProfile}
            onCancel={() => personalInfo.setIsEditing(false)}
            loading={personalInfo.loading}
          />
        ) : (
          <PersonalInfoView
            user={personalInfo.user}
            onEdit={() => personalInfo.setIsEditing(true)}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
