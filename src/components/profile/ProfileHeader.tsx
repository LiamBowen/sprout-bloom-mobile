
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Crop } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AvatarCropper } from "./AvatarCropper";

export const ProfileHeader = () => {
  const { setUser: setAppUser } = useApp();
  const { user, setUser: setAuthUser } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setShowCropDialog(true);
  };
  
  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl);
  };
  
  const handleUpload = async () => {
    if (!croppedImage || !user) return;
    
    try {
      setUploadLoading(true);
      
      // Convert base64 to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "profile-picture.png", { type: "image/png" });
      
      // Upload the cropped image
      const filePath = `${user.id}/${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);
      
      // Update the user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Update local user state
      const updatedUser = {
        ...user,
        avatar_url: publicUrl
      };
      
      setAuthUser(updatedUser);
      setAppUser(updatedUser);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
      
      // Close the dialog and reset states
      setShowCropDialog(false);
      setSelectedFile(null);
      setCroppedImage(null);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploadLoading(false);
    }
  };
  
  return (
    <div className="animate-fade-in text-center mb-4">
      <div className="relative inline-block group">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-sprout-green bg-white cursor-pointer hover:opacity-90 transition-opacity">
          <AvatarImage src={user?.avatar_url || "/sprout-logo.png"} alt="Profile" className="object-cover" />
          <AvatarFallback className="bg-sprout-green/20">
            <User size={32} />
          </AvatarFallback>
        </Avatar>
        
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
          <Upload className="w-8 h-8 text-white" />
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileSelect} 
          />
        </label>
      </div>
      <p className="text-gray-600 text-lg font-semibold">Manage your account</p>
      
      {/* Image Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Profile Picture</DialogTitle>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              <AvatarCropper 
                imageFile={selectedFile} 
                onCropComplete={handleCropComplete} 
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCropDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={!croppedImage || uploadLoading}
                >
                  {uploadLoading ? "Uploading..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
