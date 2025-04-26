
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export const LearnCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sprout-blue/20 rounded-full flex items-center justify-center">
              <Book size={18} className="text-sprout-blue" />
            </div>
            <h3 className="font-bold">Learn</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight
                size={18}
                className={`transition-transform duration-200 ${
                  isOpen ? "transform rotate-90" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 ml-10">Coming soon: Sprout's own learning hub!</p>
        
        <CollapsibleContent>
          <div className="space-y-3 mt-4">
            {educationalContent.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b last:border-0 border-gray-100 py-2"
              >
                <div className="text-xl">{item.icon}</div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
