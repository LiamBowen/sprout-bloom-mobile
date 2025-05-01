
import { useState, useEffect } from "react";
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
    user?.dateOfBirth ? parseDateString(user.dateOfBirth) : undefined
  );
  const [loading, setLoading] = useState(false);
  
  // Parse date string in DD/MM/YYYY format to Date object
  function parseDateString(dateString: string): Date | undefined {
    if (!dateString) return undefined;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return undefined;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;
    
    return new Date(year, month, day);
  }

  // Update state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile_number || '');
      setDateOfBirth(user.dateOfBirth ? parseDateString(user.dateOfBirth) : undefined);
    }
  }, [user]);

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
          mobile_number: mobile,
          date_of_birth: formattedDOB
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
