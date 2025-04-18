
import { Slider } from "@/components/ui/slider";

interface InvestmentGoalProps {
  currentValue: number;
  goalValue: number;
  onGoalChange: (value: number) => void;
  portfolioColor: string;
}

export const InvestmentGoal = ({
  currentValue,
  goalValue,
  onGoalChange,
  portfolioColor
}: InvestmentGoalProps) => {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-4">Your Investment Goal</h4>
      <div className="mb-2 flex justify-between text-sm">
        <span>Current: £{currentValue.toFixed(2)}</span>
        <span>Goal: £{goalValue}</span>
      </div>
      <Slider
        value={[goalValue]}
        min={500}
        max={5000}
        step={100}
        onValueChange={(value) => onGoalChange(value[0])}
        className="mb-4"
      />
      
      <div className="progress-bar mt-2 mb-4">
        <div
          className={`progress-fill ${portfolioColor}`}
          style={{ width: `${Math.min(100, (currentValue / goalValue) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

