import React from "react";
import { NavLink } from "react-router-dom";
import { navLinks } from "../../../constants/config";
import MenuToggle from "../../atoms/MenuToggle";
const menu = "/assets/menu.svg";
const close = "/assets/close.svg";


interface NavLinksMobileProps {
  active: string;
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}

const NavLinksMobile: React.FC<NavLinksMobileProps> = ({ active, toggle, setToggle }) => {
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
            <li key={nav.id} onClick={() => { setToggle(false); }}>
                <NavLink
                  to={`/#${nav.id}`}
                  onClick={(e) => { /* blur after click for mouse users */ (e.currentTarget as HTMLElement).blur(); }}
                  className={() => {
                    const activeNow = active === nav.title;
                    return `relative block text-[1.1rem] font-medium transition-all duration-200 hover:pl-2 ${
                      activeNow ? "text-[#915eff]" : "text-[#aaa6c3]"
                    } hover:text-[#915eff] before:absolute before:left-0 before:opacity-0 before:transition-all before:duration-200 before:content-['→'] hover:before:opacity-100`;
                  }}
                >
                  {nav.title}
                </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavLinksMobile;
