
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { BarChart2, Bitcoin, PieChart } from "lucide-react";

interface InvestmentTypeOption {
  title: string;
  description: string;
  filter: string;
  icon: React.ReactNode;
}

const investmentTypes: InvestmentTypeOption[] = [
  {
    title: "Stocks & ETFs",
    description: "Invest in companies and funds you believe in.",
    filter: "stocks_etfs",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: "Crypto",
    description: "Explore the future of money.",
    filter: "crypto",
    icon: <Bitcoin className="h-5 w-5" />,
  },
  {
    title: "Fractional Shares",
    description: "Own a piece of big brands, starting small.",
    filter: "fractional",
    icon: <PieChart className="h-5 w-5" />,
  },
];

interface InvestmentTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

export const InvestmentTypeSelector = ({
  selectedType,
  onTypeSelect,
}: InvestmentTypeSelectorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center space-y-1">
        <h3 className="font-semibold text-lg">Your Investment Portfolios</h3>
        <p className="text-sm text-muted-foreground">
          Pick a type to explore and grow your money.
        </p>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {investmentTypes.map((type) => (
            <CarouselItem key={type.filter} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3">
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-md",
                  selectedType === type.filter
                    ? "border-2 border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => onTypeSelect(type.filter)}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    {type.icon}
                    <h4 className="font-medium">{type.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
