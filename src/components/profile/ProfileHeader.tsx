import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
export const ProfileHeader = () => {
  const {
    user,
    setUser
  } = useApp();
  const {
    toast
  } = useToast();
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('profile-pictures').upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
      const {
        error: updateError
      } = await supabase.from('profiles').update({
        avatar_url: publicUrl
      }).eq('id', user.id);
      if (updateError) throw updateError;
      setUser({
        ...user,
        avatar_url: publicUrl
      });
      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  return <div className="animate-fade-in text-center mb-4">
      <div className="relative inline-block group">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-sprout-green bg-white cursor-pointer hover:opacity-90 transition-opacity">
          <AvatarImage src={user?.avatar_url || "/sprout-logo.png"} alt="Profile" className="p-2" />
          <AvatarFallback className="bg-sprout-green/20">
            <User size={32} />
          </AvatarFallback>
        </Avatar>
        
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
          <Upload className="w-8 h-8 text-white" />
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      </div>
      <p className="text-gray-600 text-lg font-semibold">Manage your account</p>
    </div>;
};