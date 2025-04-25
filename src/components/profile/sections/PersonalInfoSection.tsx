
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, User, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
            <div>
              <label className="text-sm text-gray-600 block mb-1">Date of Birth</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
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
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-600" />
                <span className="text-sm text-gray-600">Date of Birth</span>
              </div>
              <span className="text-sm font-medium">{user?.dateOfBirth || 'Not set'}</span>
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
