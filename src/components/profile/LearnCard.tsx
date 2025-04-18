
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, ChevronRight } from "lucide-react";

export const LearnCard = () => {
  const educationalContent = [
    {
      title: "Investing Basics",
      description: "Learn the fundamentals of investing",
      icon: "📊",
    },
    {
      title: "Savings Strategies",
      description: "Tips to maximize your savings",
      icon: "💰",
    },
    {
      title: "Understanding Risk",
      description: "What risk means in investing",
      icon: "⚖️",
    },
  ];

  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-sprout-blue/20 rounded-full flex items-center justify-center mr-2">
            <Book size={18} className="text-sprout-blue" />
          </div>
          <h3 className="font-bold">Learn</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {}}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      
      <div className="space-y-3">
        {educationalContent.map((item, index) => (
          <div
            key={index}
            className="flex items-center border-b last:border-0 border-gray-100 py-2"
          >
            <div className="text-xl mr-3">{item.icon}</div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
