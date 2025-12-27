import React from "react";
import { navLinks } from "../../../constants/config";
import MenuToggle from "../../atoms/MenuToggle";
import menu from "../../../../public/assets/menu.svg";
import close from "../../../../public/assets/close.svg";


interface NavLinksMobileProps {
  active: string;
  setActive: (title: string) => void;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}

const NavLinksMobile: React.FC<NavLinksMobileProps> = ({ active, setActive, toggle, setToggle }) => {
  return (
    <div className="flex items-center gap-4 sm:hidden">
      {/* Bouton Menu */}
      <MenuToggle toggle={toggle} onClick={() => setToggle(!toggle)} menuIcon={menu} closeIcon={close} />

      {/* Liste des liens */}
      <div
        className={`absolute left-0 right-0 top-full border-b border-[rgba(145,94,255,0.1)] bg-[rgba(5,8,22,0.95)] backdrop-blur-[10px] transition-all duration-300 ${
          toggle ? "scale-y-100 opacity-100 visibility-visible" : "scale-y-0 opacity-0 visibility-hidden"
        } origin-top`}
      >
        <ul className="flex flex-col gap-4 p-6">
          {navLinks.map((nav) => (
            <li key={nav.id} onClick={() => { setToggle(false); setActive(nav.title); }}>
              <a
                href={`#${nav.id}`}
                className={`relative block text-[1.1rem] font-medium transition-all duration-200 hover:pl-2 ${
                  active === nav.title ? "text-[#915eff]" : "text-[#aaa6c3]"
                } hover:text-[#915eff] before:absolute before:left-0 before:opacity-0 before:transition-all before:duration-200 before:content-['→'] hover:before:opacity-100`}
              >
                {nav.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavLinksMobile;
