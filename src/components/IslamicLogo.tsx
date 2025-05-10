
import React from "react";

interface IslamicLogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const IslamicLogo: React.FC<IslamicLogoProps> = ({ 
  size = "md", 
  animated = false 
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Use the image instead of the SVG logo
  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <img 
        src="/lovable-uploads/al-munawwarah-logo.png" 
        alt="Al-Munawwarah Logo"
        className={`w-full h-full object-contain ${animated ? "animate-pulse-slow" : ""}`}
      />
    </div>
  );
};

export default IslamicLogo;
