
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, TrendingUp } from "lucide-react";

interface InvestmentSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const InvestmentSection = ({ isOpen, onOpenChange }: InvestmentSectionProps) => {
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-4 border-b pb-2"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <TrendingUp size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Investment Preferences</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Portfolio Themes</span>
          <span className="text-sm font-medium">Tech I Use, Crypto Growth</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Risk Level</span>
          <span className="text-sm font-medium">Medium</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
