
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

interface PortfolioPerformanceProps {
  data: Array<{ period: string; value: number }>;
  color: string;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const PortfolioPerformance = ({ 
  data, 
  color, 
  timeRange,
  onTimeRangeChange 
}: PortfolioPerformanceProps) => {
  return (
    <div className="mt-4 pt-4 border-t animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Performance</h4>
        <div className="flex space-x-2">
          {["24h", "1w", "1m", "12m"].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`text-xs px-2 py-1 rounded-full ${
                timeRange === range
                  ? "bg-sprout-green text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {range === "24h" ? "24H" : 
               range === "1w" ? "1W" : 
               range === "1m" ? "1M" : 
               range === "12m" ? "1Y" : ""}
            </button>
          ))}
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="period" hide={true} />
            <YAxis hide={true} />
            <RechartsTooltip
              formatter={(value) => [`£${value}`, "Value"]}
              labelFormatter={() => ""}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color === "bg-sprout-green" ? "#A8D5BA" : 
                      color === "bg-sprout-blue" ? "#B8D8EB" :
                      color === "bg-sprout-lavender" ? "#E0BBE4" : "#F8C4B4"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

