
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvestmentSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const INVESTMENT_THEMES = [
  { id: "Tech", label: "Technology & Innovation" },
  { id: "Sustainable", label: "Sustainable & Green Energy" },
  { id: "Crypto", label: "Cryptocurrency" },
  { id: "HealthTech", label: "Healthcare & Biotech" },
  { id: "AI", label: "Artificial Intelligence" },
  { id: "RealEstate", label: "Real Estate" },
  { id: "Fintech", label: "Financial Technology" },
  { id: "CleanEnergy", label: "Clean Energy" },
  { id: "EVs", label: "Electric Vehicles" },
  { id: "ConsumerTech", label: "Consumer Technology" },
  { id: "CloudComputing", label: "Cloud Computing" },
  { id: "Robotics", label: "Robotics & Automation" },
  { id: "Gaming", label: "Gaming & eSports" },
  { id: "Space", label: "Space Technology" },
  { id: "Agriculture", label: "AgTech & FoodTech" },
];

export const InvestmentSection = ({ isOpen, onOpenChange }: InvestmentSectionProps) => {
  const { user, setUser } = useApp();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioThemes, setPortfolioThemes] = useState<string[]>(user?.portfolioThemes || []);
  const [riskLevel, setRiskLevel] = useState(user?.riskLevel || "Medium");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          portfolio_themes: portfolioThemes,
          risk_level: riskLevel
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        portfolioThemes,
        riskLevel
      });

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Investment preferences updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="mb-4 border-b pb-2"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center py-2">
        <div className="flex items-center">
          <TrendingUp size={16} className="mr-2 text-gray-600" />
          <span className="font-medium">Investment Preferences</span>
        </div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm text-gray-600">Portfolio Themes</h4>
              <ScrollArea className="h-[280px] rounded-md border p-4">
                <div className="space-y-2">
                  {INVESTMENT_THEMES.map(({ id, label }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`theme-${id}`}
                        checked={portfolioThemes.includes(id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPortfolioThemes([...portfolioThemes, id]);
                          } else {
                            setPortfolioThemes(portfolioThemes.filter(t => t !== id));
                          }
                        }}
                      />
                      <label htmlFor={`theme-${id}`} className="text-sm">{label}</label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2 pt-4">
              <h4 className="text-sm text-gray-600">Risk Level</h4>
              <RadioGroup value={riskLevel} onValueChange={setRiskLevel} className="space-y-2">
                {[
                  { value: "Low", label: "Low - Safe and steady" },
                  { value: "Medium", label: "Medium - Balanced approach" },
                  { value: "High", label: "High - Maximum growth potential" }
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`risk-${value}`} />
                    <label htmlFor={`risk-${value}`} className="text-sm">{label}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setPortfolioThemes(user?.portfolioThemes || []);
                  setRiskLevel(user?.riskLevel || "Medium");
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Portfolio Themes</span>
              <div className="text-right">
                <span className="text-sm font-medium">
                  {portfolioThemes.length > 0 
                    ? portfolioThemes.map(theme => 
                        INVESTMENT_THEMES.find(t => t.id === theme)?.label
                      ).join(", ") 
                    : "None selected"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Risk Level</span>
              <span className="text-sm font-medium">{riskLevel}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Edit Preferences
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

