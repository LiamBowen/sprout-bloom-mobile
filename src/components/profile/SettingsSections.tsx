
import { useState } from "react";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { BankSection } from "./sections/BankSection";
import { InvestmentSection } from "./sections/InvestmentSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { SecuritySection } from "./sections/SecuritySection";
import { LegalSection } from "./sections/LegalSection";
import { HelpSection } from "./sections/HelpSection";
import { Separator } from "@/components/ui/separator";

export const SettingsSections = () => {
  const [openSettings, setOpenSettings] = useState({
    personal: false,
    bank: false,
    investment: false,
    notifications: false,
    security: false,
    legal: false,
    help: false
  });

  const toggleSettingsSection = (section: keyof typeof openSettings) => {
    setOpenSettings({
      ...openSettings,
      [section]: !openSettings[section]
    });
  };

  return (
    <>
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
      
      <Separator className="my-4" />
      
      <HelpSection 
        isOpen={openSettings.help}
        onOpenChange={() => toggleSettingsSection('help')}
      />
    </>
  );
};

