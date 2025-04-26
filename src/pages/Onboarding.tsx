import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const INVESTMENT_THEMES = [
  { id: "Tech", label: "Technology & Innovation" },
  { id: "Sustainable", label: "Sustainable & Green Energy" },
  { id: "Crypto", label: "Cryptocurrency" },
  { id: "HealthTech", label: "Healthcare & Biotech" },
  { id: "AI", label: "Artificial Intelligence" },
  { id: "RealEstate", label: "Real Estate" },
  { id: "Fintech", label: "Financial Technology" },
  { id: "CleanEnergy", label: "Clean Energy" },
  { id: "EVs", label: "Electric Vehicles" },
  { id: "ConsumerTech", label: "Consumer Technology" },
  { id: "CloudComputing", label: "Cloud Computing" },
  { id: "Robotics", label: "Robotics & Automation" },
  { id: "Gaming", label: "Gaming & eSports" },
  { id: "Space", label: "Space Technology" },
  { id: "Agriculture", label: "AgTech & FoodTech" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsOnboarded } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [financialGoal, setFinancialGoal] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [dateError, setDateError] = useState("");
  const [portfolioThemes, setPortfolioThemes] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState("Medium");
  
  const totalSteps = 5;
  
  const handleNextStep = async () => {
    if (step === 1 && !name) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2) {
      if (!day || !month || !year) {
        setDateError("Please enter a complete date of birth");
        return;
      }
      
      const dayInt = parseInt(day);
      const monthInt = parseInt(month);
      const yearInt = parseInt(year);
      
      if (dayInt < 1 || dayInt > 31 || monthInt < 1 || monthInt > 12 || yearInt < 1900 || yearInt > new Date().getFullYear() - 18) {
        setDateError("Please enter a valid date of birth (must be at least 18)");
        return;
      }
      
      setDateError("");
    }
    
    if (step === totalSteps) {
      if (!user) {
        toast({
          title: "Error",
          description: "User information is missing. Please try logging in again.",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: name,
          portfolio_themes: portfolioThemes,
          risk_level: riskLevel
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save preferences. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const updatedUser = {
        ...user,
        name,
        dateOfBirth: `${day}/${month}/${year}`,
        referralCode: referralCode || `${name.toUpperCase().substring(0, 4)}${Math.floor(1000 + Math.random() * 9000)}`,
        financialGoal: financialGoal || "Not specified",
        portfolioThemes,
        riskLevel
      };
      
      setUser(updatedUser);
      setIsOnboarded(true);
      
      toast({
        title: "Welcome to Sprout!",
        description: "Your profile has been set up successfully."
      });
      
      navigate("/app");
      return;
    }
    
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };
  
  const handleThemeChange = (theme: string, checked: boolean) => {
    if (checked && portfolioThemes.length >= 3) {
      toast({
        title: "Maximum themes reached",
        description: "You can only select up to 3 investment themes",
        variant: "destructive",
      });
      return;
    }
    
    setPortfolioThemes(
      checked 
        ? [...portfolioThemes, theme]
        : portfolioThemes.filter(t => t !== theme)
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Welcome to Sprout! 👋</h2>
            <p className="mb-6 text-gray-600">Let's get to know you. What's your name?</p>
            
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-6"
            />
          </div>
        );
        
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">
              Nice to meet you, {name}! 🎉
            </h2>
            <p className="mb-6 text-gray-600">When's your birthday?</p>
            
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div>
                <Input
                  type="text"
                  placeholder="DD"
                  value={day}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                    setDay(value);
                  }}
                  className="text-center"
                  maxLength={2}
                />
                <p className="text-xs text-center mt-1 text-gray-500">Day</p>
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="MM"
                  value={month}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                    setMonth(value);
                  }}
                  className="text-center"
                  maxLength={2}
                />
                <p className="text-xs text-center mt-1 text-gray-500">Month</p>
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="YYYY"
                  value={year}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setYear(value);
                  }}
                  className="text-center"
                  maxLength={4}
                />
                <p className="text-xs text-center mt-1 text-gray-500">Year</p>
              </div>
            </div>
            
            {dateError && (
              <p className="text-sm text-red-500 mb-6">{dateError}</p>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">
              Set a financial goal 🎯
            </h2>
            <p className="mb-6 text-gray-600">
              What would you like to save or invest for?
            </p>
            
            <div className="space-y-3 mb-6">
              {["Holiday", "New phone", "Emergency fund", "Future home"].map(
                (goal) => (
                  <button
                    key={goal}
                    onClick={() => setFinancialGoal(goal)}
                    className={`flex justify-between items-center w-full p-3 rounded-lg border ${
                      financialGoal === goal
                        ? "border-sprout-green bg-sprout-green/10"
                        : "border-gray-200"
                    }`}
                  >
                    <span>{goal}</span>
                    {financialGoal === goal && (
                      <Check size={18} className="text-sprout-green" />
                    )}
                  </button>
                )
              )}
              
              <div className="relative mt-2">
                <Input 
                  type="text"
                  placeholder="Or something else..."
                  value={financialGoal !== "Holiday" && 
                         financialGoal !== "New phone" && 
                         financialGoal !== "Emergency fund" && 
                         financialGoal !== "Future home" 
                           ? financialGoal 
                           : ""}
                  onChange={(e) => setFinancialGoal(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Investment Preferences 📈</h2>
            <p className="mb-6 text-gray-600">What kind of investments interest you? (Select up to 3)</p>
            
            <div className="space-y-4 mb-6">
              <ScrollArea className="h-[280px] rounded-md border p-4">
                <div className="space-y-4">
                  {INVESTMENT_THEMES.map(({ id, label }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={id} 
                        checked={portfolioThemes.includes(id)}
                        onCheckedChange={(checked) => handleThemeChange(id, checked as boolean)}
                      />
                      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium mb-2">Your Risk Appetite</h3>
              <RadioGroup 
                value={riskLevel} 
                onValueChange={setRiskLevel}
                className="flex flex-col space-y-2"
              >
                {[
                  { value: "Low", label: "Low - Safe and steady" },
                  { value: "Medium", label: "Medium - Balanced approach" },
                  { value: "High", label: "High - Maximum growth potential" }
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`risk-${value}`} />
                    <label htmlFor={`risk-${value}`} className="text-sm">
                      {label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">
              Got a referral code? 🎁
            </h2>
            <p className="mb-6 text-gray-600">
              If a friend invited you, enter their referral code to earn £5 each!
            </p>
            
            <Input
              type="text"
              placeholder="Enter referral code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="mb-6"
            />
            
            <p className="text-sm text-gray-500 mb-6">
              You can skip this step if you don't have a code.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full max-w-md mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handlePrevStep}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full w-6 ${
                  i < step ? "bg-sprout-green" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>
        
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        {renderStep()}
        
        <div className="mt-auto pt-8">
          <Button
            onClick={handleNextStep}
            disabled={step === 1 && !name}
            className="w-full btn-action btn-primary"
          >
            {step === totalSteps ? (
              <>
                Complete <Check size={18} />
              </>
            ) : (
              <>
                Continue <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
