
import React from "react";
import { Sprout } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "md", showText = true }) => {
  // Size mappings
  const sizeMap = {
    sm: {
      icon: 20,
      text: "text-lg",
    },
    md: {
      icon: 28,
      text: "text-2xl",
    },
    lg: {
      icon: 36,
      text: "text-3xl",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <Sprout
        size={sizeMap[size].icon}
        className="text-sprout-green"
        strokeWidth={2.5}
      />
      {showText && (
        <span className={`font-bold ${sizeMap[size].text} text-gray-800`}>
          Sprout
        </span>
      )}
    </div>
  );
};

export default Logo;
