
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { BankSection } from "./sections/BankSection";
import { InvestmentSection } from "./sections/InvestmentSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { SecuritySection } from "./sections/SecuritySection";
import { LegalSection } from "./sections/LegalSection";

export const SettingsSections = () => {
  const [openSettings, setOpenSettings] = useState({
    personal: false,
    bank: false,
    investment: false,
    notifications: false,
    security: false,
    legal: false
  });

  const toggleSettingsSection = (section: keyof typeof openSettings) => {
    setOpenSettings({
      ...openSettings,
      [section]: !openSettings[section]
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
      <div className="space-y-4 pb-0 mb-0"> {/* Added mb-0 to ensure no margin at bottom */}
        <PersonalInfoSection 
          isOpen={openSettings.personal}
          onOpenChange={() => toggleSettingsSection('personal')}
        />
        
        <BankSection 
          isOpen={openSettings.bank}
          onOpenChange={() => toggleSettingsSection('bank')}
        />
        
        <InvestmentSection 
          isOpen={openSettings.investment}
          onOpenChange={() => toggleSettingsSection('investment')}
        />
        
        <NotificationsSection 
          isOpen={openSettings.notifications}
          onOpenChange={() => toggleSettingsSection('notifications')}
        />
        
        <SecuritySection 
          isOpen={openSettings.security}
          onOpenChange={() => toggleSettingsSection('security')}
        />
        
        <LegalSection 
          isOpen={openSettings.legal}
          onOpenChange={() => toggleSettingsSection('legal')}
        />
      </div>
    </ScrollArea>
  );
};
