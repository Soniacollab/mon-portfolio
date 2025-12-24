// src/components/atoms/Badge.tsx
import React from "react";

interface BadgeProps {
  text: string;
  className?: string; // pour la couleur spécifique
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const Badge: React.FC<BadgeProps> = ({ text, className = "", size = "md" }) => {
  return (
    <span
      className={`font-medium ${sizeMap[size]} ${className} cursor-default`}
    >
      {text}
    </span>
  );
};

export default Badge;
