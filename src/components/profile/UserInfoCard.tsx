import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

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

  if (!user) return null;

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative w-full flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditingProfile(true)}
            className="text-gray-500 hover:text-gray-700 absolute right-0 top-0"
            title="Edit Profile"
          >
            <Pencil size={18} />
          </Button>
        </div>
        <h2 className="font-bold text-lg mb-1">{user.name}</h2>
        <p className="text-sm text-gray-600 mb-4">Member since 2025</p>
        
        <div className="w-full max-w-xs">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p>{user.dateOfBirth}</p>
          </div>
        </div>
      </div>

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserInfoCard;
