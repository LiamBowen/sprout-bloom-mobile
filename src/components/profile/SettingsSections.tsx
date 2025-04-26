
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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section === activeSection ? null : section);
  };

  return (
    <>
      <PersonalInfoSection 
        isOpen={activeSection === 'personal'}
        onOpenChange={() => handleSectionChange('personal')}
      />
      
      <BankSection 
        isOpen={activeSection === 'bank'}
        onOpenChange={() => handleSectionChange('bank')}
      />
      
      <InvestmentSection 
        isOpen={activeSection === 'investment'}
        onOpenChange={() => handleSectionChange('investment')}
      />
      
      <NotificationsSection 
        isOpen={activeSection === 'notifications'}
        onOpenChange={() => handleSectionChange('notifications')}
      />
      
      <SecuritySection 
        isOpen={activeSection === 'security'}
        onOpenChange={() => handleSectionChange('security')}
      />
      
      <LegalSection 
        isOpen={activeSection === 'legal'}
        onOpenChange={() => handleSectionChange('legal')}
      />
      
      <Separator className="my-4" />
      
      <HelpSection 
        isOpen={activeSection === 'help'}
        onOpenChange={() => handleSectionChange('help')}
      />
    </>
  );
};
