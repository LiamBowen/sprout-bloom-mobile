import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Bot } from "lucide-react";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();
  const { isOnboarded } = useApp();
  
  useEffect(() => {
    if (isOnboarded) {
      navigate("/app/home");
    }
  }, [isOnboarded, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white to-sprout-green/20">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 animate-fade-in flex flex-col items-center">
          <Logo size="lg" />
          <p className="text-xl text-gray-600 mt-4">
            Investing and saving, but make it fun
          </p>
        </div>
        
        <div className="space-y-6 animate-slide-up">
          <div className="flex flex-col gap-4">
            <div className="card bg-sprout-green/10 border-sprout-green/20">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Grow your money</h3>
              </div>
              <p className="text-sm text-gray-600">
                Start with just £1. No jargon, no complexity.
              </p>
            </div>
            
            <div className="card bg-sprout-pink/10 border-sprout-pink/20">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Save together</h3>
              </div>
              <p className="text-sm text-gray-600">
                Create group funds with friends for shared goals.
              </p>
            </div>
            
            <div className="card bg-sprout-lavender/10 border-sprout-lavender/20">
              <div className="flex items-center mb-2">
                <Bot className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Personal coach</h3>
              </div>
              <p className="text-sm text-gray-600">
                Get friendly advice on your financial journey.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full btn-action btn-primary"
          >
            Get Started <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
