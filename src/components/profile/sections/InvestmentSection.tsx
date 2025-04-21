
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvestmentSectionProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
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
      <CollapsibleContent className="pt-2 pb-4 space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium mb-2">Portfolio Themes</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tech-edit" 
                    checked={portfolioThemes.includes('Tech')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPortfolioThemes([...portfolioThemes, 'Tech']);
                      } else {
                        setPortfolioThemes(portfolioThemes.filter(theme => theme !== 'Tech'));
                      }
                    }}
                  />
                  <label htmlFor="tech-edit">Tech Companies</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sustainable-edit" 
                    checked={portfolioThemes.includes('Sustainable')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPortfolioThemes([...portfolioThemes, 'Sustainable']);
                      } else {
                        setPortfolioThemes(portfolioThemes.filter(theme => theme !== 'Sustainable'));
                      }
                    }}
                  />
                  <label htmlFor="sustainable-edit">Sustainable & Green Energy</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="crypto-edit" 
                    checked={portfolioThemes.includes('Crypto')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPortfolioThemes([...portfolioThemes, 'Crypto']);
                      } else {
                        setPortfolioThemes(portfolioThemes.filter(theme => theme !== 'Crypto'));
                      }
                    }}
                  />
                  <label htmlFor="crypto-edit">Cryptocurrency</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium mb-2">Risk Level</h4>
              <RadioGroup value={riskLevel} onValueChange={setRiskLevel} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="low-risk-edit" />
                  <label htmlFor="low-risk-edit">Low - Safe and steady</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium-risk-edit" />
                  <label htmlFor="medium-risk-edit">Medium - Balanced approach</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="high-risk-edit" />
                  <label htmlFor="high-risk-edit">High - Maximum growth potential</label>
                </div>
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
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">Portfolio Themes</span>
              <p className="font-medium">
                {portfolioThemes.length > 0 
                  ? portfolioThemes.join(", ") 
                  : "No themes selected"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-gray-600">Risk Level</span>
              <p className="font-medium">{riskLevel}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit Preferences
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
