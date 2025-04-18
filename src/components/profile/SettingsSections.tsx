
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, User, CreditCard, TrendingUp, Bell, ShieldAlert, FileText } from "lucide-react";
import { SecuritySettings } from "./SecuritySettings";

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
    <>
      <Collapsible 
        open={openSettings.personal} 
        onOpenChange={() => toggleSettingsSection('personal')}
        className="mb-4 border-b pb-2"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
          <div className="flex items-center">
            <User size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Personal Information</span>
          </div>
          <ChevronRight size={18} className={`transition-transform ${openSettings.personal ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Name</span>
            <span className="text-sm font-medium">Alex Example</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium">alex@example.com</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Phone</span>
            <span className="text-sm font-medium">+44 7123 456 789</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible 
        open={openSettings.bank} 
        onOpenChange={() => toggleSettingsSection('bank')}
        className="mb-4 border-b pb-2"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
          <div className="flex items-center">
            <CreditCard size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Bank & Payment Details</span>
          </div>
          <ChevronRight size={18} className={`transition-transform ${openSettings.bank ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Linked Bank</span>
            <Button variant="outline" size="sm" className="h-7 text-xs">Connect Bank</Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Round-up Settings</span>
            <Toggle 
              aria-label="Toggle round-up"
              className="data-[state=on]:bg-sprout-green"
              defaultPressed
            >
              <span className="text-xs">Enabled</span>
            </Toggle>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible 
        open={openSettings.investment} 
        onOpenChange={() => toggleSettingsSection('investment')}
        className="mb-4 border-b pb-2"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Investment Preferences</span>
          </div>
          <ChevronRight size={18} className={`transition-transform ${openSettings.investment ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Portfolio Themes</span>
            <span className="text-sm font-medium">Tech I Use, Crypto Growth</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Risk Level</span>
            <span className="text-sm font-medium">Medium</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible 
        open={openSettings.notifications} 
        onOpenChange={() => toggleSettingsSection('notifications')}
        className="mb-4 border-b pb-2"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
          <div className="flex items-center">
            <Bell size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Notifications</span>
          </div>
          <ChevronRight size={18} className={`transition-transform ${openSettings.notifications ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Investment Alerts</span>
            <Toggle 
              aria-label="Toggle investment alerts"
              className="data-[state=on]:bg-sprout-green"
              defaultPressed
            >
              <span className="text-xs">ON</span>
            </Toggle>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Round-up Confirmations</span>
            <Toggle 
              aria-label="Toggle round-up confirmations"
              className="data-[state=on]:bg-sprout-green"
            >
              <span className="text-xs">OFF</span>
            </Toggle>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible 
        open={openSettings.security} 
        onOpenChange={() => toggleSettingsSection('security')}
        className="mb-4 border-b pb-2"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
          <div className="flex items-center">
            <ShieldAlert size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Security</span>
          </div>
          <ChevronRight size={18} className={`transition-transform ${openSettings.security ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <SecuritySettings />
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible 
        open={openSettings.legal} 
        onOpenChange={() => toggleSettingsSection('legal')}
        className="mb-4"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
          <div className="flex items-center">
            <FileText size={16} className="mr-2 text-gray-600" />
            <span className="font-medium">Legal & Documents</span>
          </div>
          <ChevronRight size={18} className={`transition-transform ${openSettings.legal ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Terms & Conditions</span>
            <Button variant="link" size="sm" className="h-7 text-xs p-0">View</Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Privacy Policy</span>
            <Button variant="link" size="sm" className="h-7 text-xs p-0">View</Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Close Account</span>
            <Button variant="outline" size="sm" className="h-7 text-xs text-destructive border-destructive hover:bg-destructive/10">Close</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
