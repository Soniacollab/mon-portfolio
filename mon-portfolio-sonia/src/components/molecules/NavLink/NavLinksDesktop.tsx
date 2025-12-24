import React from "react";
import { navLinks } from "../../../constants/config";

interface NavLinksDesktopProps {
  active: string;
  setActive: (title: string) => void;
}

const NavLinksDesktop: React.FC<NavLinksDesktopProps> = ({ active, setActive }) => {
  return (
    <ul className="hidden list-none flex-row gap-10 sm:flex">
      {navLinks.map((nav) => (
        <li key={nav.id} onClick={() => setActive(nav.title)}>
          <a
            href={`#${nav.id}`}
            className={`relative pb-1 transition-all duration-300 ${
              active === nav.title
                ? "font-semibold text-[#915eff]"
                : "text-[#aaa6c3] hover:text-[#915eff]"
            } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#915eff] after:to-[#00c8ff] after:transition-all after:duration-300 ${
              active === nav.title ? "after:w-full" : "after:w-0 hover:after:w-full"
            }`}
          >
            {nav.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default NavLinksDesktop;
