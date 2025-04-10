
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, TrendingUp, PiggyBank, MessagesSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const AppLayout = () => {
  const location = useLocation();
  
  const tabs = [
    {
      path: "/app/home",
      icon: <Home size={22} />,
      label: "Home",
      emoji: "🏡",
    },
    {
      path: "/app/invest",
      icon: <TrendingUp size={22} />,
      label: "Invest",
      emoji: "📈",
    },
    {
      path: "/app/save",
      icon: <PiggyBank size={22} />,
      label: "Save",
      emoji: "💰",
    },
    {
      path: "/app/coach",
      icon: <MessagesSquare size={22} />,
      label: "Coach",
      emoji: "🤖",
    },
    {
      path: "/app/profile",
      icon: <User size={22} />,
      label: "Profile",
      emoji: "👤",
    },
  ];

  // Determine if we should show the logo in the header
  const shouldShowLogo = location.pathname === "/app/profile";

  return (
    <div className="flex flex-col min-h-screen bg-sprout-background pb-16">
      {shouldShowLogo && (
        <header className="bg-white border-b border-gray-100 py-3">
          <div className="container max-w-md mx-auto px-4 flex justify-center">
            <img 
              src="/sprout-logo.png" 
              alt="Sprout" 
              className="h-10 w-auto" 
            />
          </div>
        </header>
      )}
      
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <nav className="tab-bar">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn("tab-item", isActive && "active")
            }
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
