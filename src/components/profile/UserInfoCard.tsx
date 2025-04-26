
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, Check, X } from "lucide-react";

export const UserInfoCard = () => {
  const { setUser: setAppUser } = useApp();
  const { user, setUser: setAuthUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.name || "");
  const [updatedDay, setUpdatedDay] = useState(user?.dateOfBirth?.split('/')[0] || "");
  const [updatedMonth, setUpdatedMonth] = useState(user?.dateOfBirth?.split('/')[1] || "");
  const [updatedYear, setUpdatedYear] = useState(user?.dateOfBirth?.split('/')[2] || "");

  const handleSaveProfile = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      name: updatedName,
      dateOfBirth: `${updatedDay}/${updatedMonth}/${updatedYear}`,
    };
    
    setAuthUser(updatedUser);
    setAppUser(updatedUser);
    
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    // Reset form values to current user values
    setUpdatedName(user?.name || "");
    setUpdatedDay(user?.dateOfBirth?.split('/')[0] || "");
    setUpdatedMonth(user?.dateOfBirth?.split('/')[1] || "");
    setUpdatedYear(user?.dateOfBirth?.split('/')[2] || "");
    setIsEditingProfile(false);
  };

  if (!user) return null;

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative w-full flex justify-end">
          {!isEditingProfile ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingProfile(true)}
              className="text-gray-500 hover:text-gray-700 absolute right-0 top-0"
              title="Edit Profile"
            >
              <Pencil size={18} />
            </Button>
          ) : (
            <div className="flex space-x-2 absolute right-0 top-0">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
                title="Cancel"
              >
                <X size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSaveProfile}
                className="text-green-500 hover:text-green-700"
                title="Save"
              >
                <Check size={18} />
              </Button>
            </div>
          )}
        </div>
        
        {isEditingProfile ? (
          <>
            <div className="w-full max-w-xs mb-4">
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <Input 
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="text-center"
              />
            </div>
          </>
        ) : (
          <h2 className="font-bold text-lg mb-1">{user.name}</h2>
        )}
        
        <p className="text-sm text-gray-600 mb-4">Member since 2025</p>
        
        <div className="w-full max-w-xs">
          {isEditingProfile ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="DD"
                    value={updatedDay}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setUpdatedDay(value);
                    }}
                    className="text-center"
                    maxLength={2}
                  />
                  <p className="text-xs text-center mt-1 text-gray-500">Day</p>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="MM"
                    value={updatedMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setUpdatedMonth(value);
                    }}
                    className="text-center"
                    maxLength={2}
                  />
                  <p className="text-xs text-center mt-1 text-gray-500">Month</p>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="YYYY"
                    value={updatedYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setUpdatedYear(value);
                    }}
                    className="text-center"
                    maxLength={4}
                  />
                  <p className="text-xs text-center mt-1 text-gray-500">Year</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p>{user.dateOfBirth}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserInfoCard;
