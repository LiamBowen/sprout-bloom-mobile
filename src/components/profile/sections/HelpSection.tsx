
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, HelpCircle, MessageSquare, LifeBuoy } from "lucide-react";
import { logAnalyticsEvent } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HelpSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const HelpSection = ({ isOpen, onOpenChange }: HelpSectionProps) => {
  const navigate = useNavigate();
  
  const handleSupportClick = () => {
    logAnalyticsEvent('help_support_clicked', { source: 'settings' });
    window.location.href = 'mailto:grow@getsproutapp.com';
  };

  const handleFaqClick = () => {
    logAnalyticsEvent('help_faq_clicked', { source: 'settings' });
    navigate('/faq');
  };

  const handleCommunityClick = () => {
    console.log('Community button clicked'); // For debugging
    logAnalyticsEvent('help_community_clicked', { source: 'settings' });
    
    // Use sonner toast instead of the previous implementation
    toast("Coming Soon!", {
      description: "Sprout Community Incoming!",
      duration: 3000,
    });
    
    console.log('Toast should have been triggered'); // For debugging
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
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
              <MessageSquare className="mr-2" />
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
