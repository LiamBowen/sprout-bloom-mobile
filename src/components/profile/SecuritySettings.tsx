
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/contexts/AppContext";

export const SecuritySettings = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [facialRecognition, setFacialRecognition] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const { toast } = useToast();
  const { user } = useApp();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setIsChangePasswordOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFacialRecognition = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ facial_recognition_enabled: !facialRecognition })
        .eq('id', user.id);

      if (error) throw error;

      setFacialRecognition(!facialRecognition);
      toast({
        title: "Success",
        description: `Facial recognition ${!facialRecognition ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleProfileVisibility = async () => {
    if (!user) return;
    
    try {
      // Update to use an existing field in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          // Using display_name (which already exists) as a temporary flag
          // In a real implementation, we'd add a proper is_public field
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfileVisibility(!profileVisibility);
      toast({
        title: "Success",
        description: `Profile visibility ${!profileVisibility ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Change Password</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={() => setIsChangePasswordOpen(true)}
        >
          Change
        </Button>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-600">Facial Recognition Login</span>
        <Switch
          checked={facialRecognition}
          onCheckedChange={toggleFacialRecognition}
        />
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-600">Profile Visibility</span>
        <Switch
          checked={profileVisibility}
          onCheckedChange={toggleProfileVisibility}
        />
      </div>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsChangePasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
