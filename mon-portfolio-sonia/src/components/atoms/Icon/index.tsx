// src/components/atoms/Icon.tsx
import React from "react";

interface IconProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ src, alt = "", className = "", onClick }) => {
  return <img src={src} alt={alt} className={className} onClick={onClick} />;
};

export default Icon;
