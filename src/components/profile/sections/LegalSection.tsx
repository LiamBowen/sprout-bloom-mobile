
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";

interface LegalSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const LegalSection = ({ isOpen, onOpenChange }: LegalSectionProps) => {
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-0" // Keep mb-0 to remove extra bottom margin
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <FileText size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Legal & Documents</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-0 space-y-3"> {/* Keeping pb-0 */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Terms & Conditions</span>
          <Button variant="link" size="sm" className="h-7 text-xs p-0">View</Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Privacy Policy</span>
          <Button variant="link" size="sm" className="h-7 text-xs p-0">View</Button>
        </div>
        <div className="flex justify-between items-center mb-0"> {/* Added mb-0 to last item */}
          <span className="text-sm text-gray-600">Close Account</span>
          <Button variant="outline" size="sm" className="h-7 text-xs text-destructive border-destructive hover:bg-destructive/10">Close</Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
