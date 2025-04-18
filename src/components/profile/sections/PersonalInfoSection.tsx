
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, User } from "lucide-react";

interface PersonalInfoSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const PersonalInfoSection = ({ isOpen, onOpenChange }: PersonalInfoSectionProps) => {
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-4 border-b pb-2"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <User size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Personal Information</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Name</span>
          <span className="text-sm font-medium">Alex Example</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Email</span>
          <span className="text-sm font-medium">alex@example.com</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Phone</span>
          <span className="text-sm font-medium">+44 7123 456 789</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
