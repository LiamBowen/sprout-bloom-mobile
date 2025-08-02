
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { investmentCategories } from "@/data/investment-data";
import { InvestmentCategory } from "@/components/invest/InvestmentCategory";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AddInvestment from "@/components/AddInvestment";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useNavigate } from "react-router-dom";

const NewInvestment = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  const navigate = useNavigate();
  const { triggerConfetti } = usePortfolio();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSelectedRiskLevel(null);
  };

  const handleRiskLevelSelect = (level: string) => {
    setSelectedRiskLevel(level);
  };

  const handleInvestmentSuccess = () => {
    triggerConfetti();
    navigate("/invest");
  };

  // Find selected category and risk level details
  const selectedCategoryData = selectedCategory 
    ? investmentCategories.find(cat => cat.id === selectedCategory)
    : null;
  
  const selectedRiskLevelData = selectedCategoryData && selectedRiskLevel
    ? selectedCategoryData.riskLevels.find(risk => risk.level === selectedRiskLevel)
    : null;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex items-center">
        <Link to="/invest">
          <Button variant="ghost" className="p-2 mr-2">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Investment</h1>
      </div>
      
      <div className="space-y-4 text-left">
        {investmentCategories.map((category) => (
          <InvestmentCategory
            key={category.id}
            {...category}
            selectedCategory={selectedCategory}
            selectedRiskLevel={selectedRiskLevel}
            onCategorySelect={handleCategorySelect}
            onRiskLevelSelect={handleRiskLevelSelect}
          />
        ))}
      </div>

      {selectedCategory && selectedRiskLevel && selectedCategoryData && selectedRiskLevelData && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full btn-action bg-sprout-green hover:bg-sprout-green/90">
              Continue to Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <AddInvestment 
              category={selectedCategoryData.name}
              riskLevel={selectedRiskLevel}
              recommendedAssets={selectedRiskLevelData.assets}
              onSuccess={handleInvestmentSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NewInvestment;
