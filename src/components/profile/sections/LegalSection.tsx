
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface LegalSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const LegalSection = ({ isOpen, onOpenChange }: LegalSectionProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCloseAccount = async () => {
    if (!user) return;

    try {
      // Note: This is a placeholder. Full account deletion would require 
      // more complex backend logic to remove all user data
      await supabase.auth.deleteUser();
      
      toast({
        title: "Account Closed",
        description: "Your account has been successfully closed.",
      });

      // Navigate to auth page after account closure
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-4"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <FileText size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Legal & Documents</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Terms & Conditions</span>
          <Button variant="link" size="sm" className="h-7 text-xs p-0">View</Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Privacy Policy</span>
          <Button variant="link" size="sm" className="h-7 text-xs p-0">View</Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Close Account</span>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => setIsAlertOpen(true)}
              >
                Close
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCloseAccount}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
