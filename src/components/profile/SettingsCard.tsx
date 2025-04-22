
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { SettingsSections } from "./SettingsSections";

export const SettingsCard = () => {
  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-sprout-blue/20 rounded-full flex items-center justify-center mr-2">
          <Settings size={18} className="text-sprout-blue" />
        </div>
        <h2 className="text-xl font-semibold">Settings ⚙️</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Manage your account, investments, and preferences.</p>
      
      <SettingsSections />
    </Card>
  );
};
