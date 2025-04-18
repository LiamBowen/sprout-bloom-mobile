
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddInvestment from "@/components/AddInvestment";

interface RiskLevel {
  level: string;
  icon: JSX.Element;
  description: string;
  assets: string[];
}

interface InvestmentCategoryProps {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  riskLevels: RiskLevel[];
  selectedCategory: string | null;
  selectedRiskLevel: string | null;
  onCategorySelect: (categoryId: string) => void;
  onRiskLevelSelect: (level: string) => void;
}

export const InvestmentCategory = ({
  id,
  name,
  icon,
  description,
  riskLevels,
  selectedCategory,
  selectedRiskLevel,
  onCategorySelect,
  onRiskLevelSelect,
}: InvestmentCategoryProps) => {
  return (
    <Card className="overflow-hidden">
      <div 
        className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
          selectedCategory === id ? "bg-sprout-green/10" : ""
        }`}
        onClick={() => onCategorySelect(id)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-sprout-green/10 p-2 rounded-full">
            {icon}
          </div>
          <div>
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      
      {selectedCategory === id && (
        <div className="border-t p-4 animate-fade-in">
          <h4 className="text-sm font-semibold mb-3">Select Risk Tolerance</h4>
          <div className="space-y-3">
            {riskLevels.map((risk) => (
              <div 
                key={risk.level}
                className={`p-3 border rounded-md cursor-pointer transition-all flex items-start gap-3 ${
                  selectedRiskLevel === risk.level ? "border-sprout-green bg-sprout-green/5" : "hover:bg-gray-50"
                }`}
                onClick={() => onRiskLevelSelect(risk.level)}
              >
                {risk.icon}
                <div>
                  <h5 className="font-medium">{risk.level}</h5>
                  <p className="text-xs text-gray-600">{risk.description}</p>
                  
                  {selectedRiskLevel === risk.level && (
                    <div className="mt-2 pt-2 border-t animate-fade-in">
                      <h6 className="text-xs font-medium mb-1">Recommended Assets:</h6>
                      <ul className="text-xs space-y-1">
                        {risk.assets.map((asset, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-sprout-green"></span>
                            {asset}
                          </li>
                        ))}
                      </ul>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full btn-action btn-primary mt-3 text-xs py-1 h-auto">
                            Add Investment <PlusCircle size={14} className="ml-1" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="p-0">
                          <AddInvestment 
                            category={name}
                            riskLevel={risk.level}
                            recommendedAssets={risk.assets}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

