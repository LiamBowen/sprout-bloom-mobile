
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface GrowthProjectionProps {
  initialAmount: number;
  targetAmount: number;
  apy: number;
}

const GrowthProjection = ({ initialAmount, targetAmount, apy }: GrowthProjectionProps) => {
  // Generate growth projection data
  const generateGrowthProjection = (initialAmount: number, targetAmount: number, apy: number) => {
    const data = [];
    let currentAmount = initialAmount;
    // Assume monthly compounding over 3 years
    const months = 36;
    const monthlyRate = apy / 100 / 12;
    
    // Estimate monthly deposit needed to reach target
    const targetMonthlyDeposit = (targetAmount - initialAmount * Math.pow(1 + monthlyRate, months)) / 
                              ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    // Use a realistic monthly deposit amount (rounded to nearest £5)
    const monthlyDeposit = Math.max(5, Math.round(targetMonthlyDeposit / 5) * 5);
    
    for (let i = 0; i <= months; i++) {
      // Monthly compounding with regular deposits
      if (i > 0) {
        currentAmount = currentAmount * (1 + monthlyRate) + monthlyDeposit;
      }
      
      data.push({
        month: i,
        value: Math.round(currentAmount * 100) / 100,
      });
    }
    
    return { data, monthlyDeposit };
  };

  const { data, monthlyDeposit } = generateGrowthProjection(initialAmount, targetAmount, apy);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center">
        <TrendingUp size={16} className="mr-1" /> Projected Growth
      </h4>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="mb-2 text-xs text-gray-600">
          With a monthly deposit of <span className="font-medium">£{monthlyDeposit}</span>, you could reach your goal in:
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <XAxis 
                dataKey="month"
                tickFormatter={(value) => value % 12 === 0 ? `${value/12}yr` : ''}
              />
              <YAxis 
                tickFormatter={(value) => `£${value}`}
              />
              <Tooltip 
                formatter={(value) => [`£${value}`, 'Amount']}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#86EFAC" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GrowthProjection;
