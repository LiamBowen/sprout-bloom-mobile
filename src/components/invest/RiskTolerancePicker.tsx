
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface RiskTolerancePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const RiskTolerancePicker = ({ value, onChange }: RiskTolerancePickerProps) => {
  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">What's your risk tolerance?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This helps us suggest investments that match your comfort level with risk.
      </p>
      <RadioGroup value={value} onValueChange={onChange} className="grid gap-4">
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/20 transition-colors">
          <RadioGroupItem value="low" id="low" />
          <Label htmlFor="low" className="flex items-center gap-2 cursor-pointer">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <div>
              <span className="font-medium">Low Risk</span>
              <p className="text-xs text-muted-foreground">Stable returns with minimal volatility</p>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/20 transition-colors">
          <RadioGroupItem value="medium" id="medium" />
          <Label htmlFor="medium" className="flex items-center gap-2 cursor-pointer">
            <Shield className="h-4 w-4 text-yellow-500" />
            <div>
              <span className="font-medium">Medium Risk</span>
              <p className="text-xs text-muted-foreground">Balanced growth with moderate volatility</p>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/20 transition-colors">
          <RadioGroupItem value="high" id="high" />
          <Label htmlFor="high" className="flex items-center gap-2 cursor-pointer">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <div>
              <span className="font-medium">High Risk</span>
              <p className="text-xs text-muted-foreground">Higher potential returns with more volatility</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </Card>
  );
};
