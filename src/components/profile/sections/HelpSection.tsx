
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, HelpCircle, MessageSquareQuestion, LifeBuoy } from "lucide-react";
import { logAnalyticsEvent } from "@/utils/analytics";

interface HelpSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const HelpSection = ({ isOpen, onOpenChange }: HelpSectionProps) => {
  const handleSupportClick = () => {
    logAnalyticsEvent('help_support_clicked', { source: 'settings' });
    window.location.href = 'mailto:support@sproutapp.com';
  };

  const handleFaqClick = () => {
    logAnalyticsEvent('help_faq_clicked', { source: 'settings' });
    window.open('https://sproutapp.com/faq', '_blank');
  };

  const handleCommunityClick = () => {
    logAnalyticsEvent('help_community_clicked', { source: 'settings' });
    window.open('https://community.sproutapp.com', '_blank');
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-4 border-b pb-2"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <LifeBuoy size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Help & Support</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Need help with your account or have questions about investing? We're here to help!
          </p>
          
          <div className="grid gap-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleSupportClick}
            >
              <MessageSquareQuestion className="mr-2" />
              Contact Support
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleFaqClick}
            >
              <HelpCircle className="mr-2" />
              FAQs & Guides
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleCommunityClick}
            >
              <LifeBuoy className="mr-2" />
              Community Forum
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
