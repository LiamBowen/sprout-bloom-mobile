import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePersonalInfo = () => {
  const { setUser: setAppUser } = useApp();
  const { user, setUser: setAuthUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile_number || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    user?.dateOfBirth ? new Date(user.dateOfBirth.split('/').reverse().join('-')) : undefined
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ 
          email: email 
        });
        if (emailError) throw emailError;
      }

      const formattedDOB = dateOfBirth 
        ? `${dateOfBirth.getDate().toString().padStart(2, '0')}/${(dateOfBirth.getMonth() + 1).toString().padStart(2, '0')}/${dateOfBirth.getFullYear()}`
        : user.dateOfBirth;

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
        mobile_number: mobile,
        dateOfBirth: formattedDOB
      };
      
      setAuthUser(updatedUser);
      setAppUser(updatedUser);

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

  return {
    user,
    isEditing,
    setIsEditing,
    name,
    setName,
    email,
    setEmail,
    mobile,
    setMobile,
    dateOfBirth,
    setDateOfBirth,
    loading,
    handleUpdateProfile
  };
};
