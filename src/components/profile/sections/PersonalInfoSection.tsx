
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PersonalInfoSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const PersonalInfoSection = ({ isOpen, onOpenChange }: PersonalInfoSectionProps) => {
  const { user, setUser } = useApp();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, name });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUser({ ...user, avatar_url: publicUrl });
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      <CollapsibleContent className="pt-2 pb-4 space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar_url} alt={user?.name} />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={loading}
              />
              <Upload size={14} className="mr-2" />
              Upload Picture
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Name</span>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-2"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
