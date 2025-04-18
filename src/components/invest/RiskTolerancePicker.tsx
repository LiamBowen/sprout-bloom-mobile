
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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">What's your risk tolerance?</h3>
      <RadioGroup value={value} onValueChange={onChange} className="grid gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="low" id="low" />
          <Label htmlFor="low" className="flex items-center gap-2 cursor-pointer">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Low Risk
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="medium" id="medium" />
          <Label htmlFor="medium" className="flex items-center gap-2 cursor-pointer">
            <Shield className="h-4 w-4 text-yellow-500" />
            Medium Risk
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="high" id="high" />
          <Label htmlFor="high" className="flex items-center gap-2 cursor-pointer">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            High Risk
          </Label>
        </div>
      </RadioGroup>
    </Card>
  );
};
