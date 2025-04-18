
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, Bell } from "lucide-react";

interface NotificationsSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const NotificationsSection = ({ isOpen, onOpenChange }: NotificationsSectionProps) => {
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-4 border-b pb-2"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <Bell size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Notifications</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Investment Alerts</span>
          <Toggle 
            aria-label="Toggle investment alerts"
            className="data-[state=on]:bg-sprout-green"
            defaultPressed
          >
            <span className="text-xs">ON</span>
          </Toggle>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Round-up Confirmations</span>
          <Toggle 
            aria-label="Toggle round-up confirmations"
            className="data-[state=on]:bg-sprout-green"
          >
            <span className="text-xs">OFF</span>
          </Toggle>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
