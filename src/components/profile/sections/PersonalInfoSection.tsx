
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfoSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const PersonalInfoSection = ({
  isOpen,
  onOpenChange
}: PersonalInfoSectionProps) => {
  const { setUser: setAppUser } = useApp();
  const { user, setUser: setAuthUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile_number || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update auth email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ 
          email: email 
        });
        if (emailError) throw emailError;
      }

      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: name,
          mobile_number: mobile
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const updatedUser = {
        ...user,
        name,
        email,
        mobile_number: mobile
      };
      
      setAuthUser(updatedUser);
      setAppUser(updatedUser); // Also update in AppContext for compatibility

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Name</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="max-w-sm" 
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Email</label>
              <Input 
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="max-w-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Mobile Number</label>
              <Input 
                type="tel"
                value={mobile} 
                onChange={e => setMobile(e.target.value)} 
                className="max-w-sm"
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-600" />
                <span className="text-sm text-gray-600">Name</span>
              </div>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-600" />
                <span className="text-sm text-gray-600">Email</span>
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-600" />
                <span className="text-sm text-gray-600">Mobile</span>
              </div>
              <span className="text-sm font-medium">{user?.mobile_number || 'Not set'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="mt-2">
              Edit Profile
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
