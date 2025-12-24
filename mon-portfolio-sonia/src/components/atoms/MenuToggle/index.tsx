// src/components/atoms/MenuToggle.tsx
import React from "react";

interface MenuToggleProps {
  toggle: boolean;
  onClick: () => void;
  menuIcon: string;
  closeIcon: string;
  className?: string;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, onClick, menuIcon, closeIcon, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`h-7 w-7 cursor-pointer ${className}`}
      aria-label="Toggle menu"
    >
      <img
        src={toggle ? closeIcon : menuIcon}
        alt="menu toggle"
        className="h-full w-full object-contain"
      />
    </button>
  );
};

export default MenuToggle;
