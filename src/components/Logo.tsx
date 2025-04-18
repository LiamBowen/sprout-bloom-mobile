
import React from "react";
import { Leaf } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", showText = true, className = "" }) => {
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
    <div className={`flex items-center gap-2 ${className}`}>
      <Leaf
        size={sizeMap[size].icon}
        className="text-sprout-green" // This will now use the new #A3B18C green
        strokeWidth={2.5}
      />
      {showText && (
        <span 
          className={`font-medium ${sizeMap[size].text}`}
          style={{ 
            fontFamily: 'Bierstadt, sans-serif',
            color: 'rgba(0, 0, 0, 0.7)'
          }}
        >
          Sprout
        </span>
      )}
    </div>
  );
};

export default Logo;
