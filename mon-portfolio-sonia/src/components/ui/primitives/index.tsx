// Consolidated simple primitives: Badge, Divider, Icon, MenuToggle
import React from "react";

export const Badge: React.FC<{ text: string; className?: string; size?: "sm" | "md" | "lg" }> = ({ text, className = "", size = "md" }) => {
  const sizeMap: Record<string, string> = { sm: "text-sm", md: "text-base", lg: "text-lg" };
  return <span className={`font-medium ${sizeMap[size]} ${className} cursor-default`}>{text}</span>;
};

export const Divider: React.FC = () => (
  <div
    className="w-4/5 h-0.5 mx-auto mt-4 mb-8 bg-gradient-to-r from-[#915EFF] via-[#bf61ff] to-[#00c8ff] rounded-full opacity-80"
  />
);

export const Icon: React.FC<{ src: string; alt?: string; className?: string; onClick?: () => void }> = ({ src, alt = "", className = "", onClick }) => (
  // simple img wrapper
  <img src={src} alt={alt} className={className} onClick={onClick} />
);

export const MenuToggle: React.FC<{
  toggle: boolean;
  onClick: () => void;
  menuIcon: string;
  closeIcon: string;
  className?: string;
}> = ({ toggle, onClick, menuIcon, closeIcon, className = "" }) => (
  <button onClick={onClick} className={`h-7 w-7 cursor-pointer ${className}`} aria-label="Toggle menu">
    <img src={toggle ? closeIcon : menuIcon} alt="menu toggle" className="h-full w-full object-contain" />
  </button>
);

export default { Badge, Divider, Icon, MenuToggle };
