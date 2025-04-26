
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { SecuritySettings } from "../SecuritySettings";

interface SecuritySectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const SecuritySection = ({ isOpen, onOpenChange }: SecuritySectionProps) => {
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-4 border-b pb-2"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <ShieldAlert size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Security & Privacy</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-3">
        <SecuritySettings />
      </CollapsibleContent>
    </Collapsible>
  );
};
