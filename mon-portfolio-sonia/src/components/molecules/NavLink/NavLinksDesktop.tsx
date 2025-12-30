import { useNavigate } from "react-router-dom";
import { navLinks } from "../../../constants/config";

interface NavLinksDesktopProps {
  active: string;
}

const NavLinksDesktop: React.FC<NavLinksDesktopProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <ul className="hidden list-none flex-row gap-10 sm:flex">
      {navLinks.map((nav) => (
        <li key={nav.id}>
          {(() => {
            const activeNow = active === nav.title;
            const className = `relative pb-1 transition-all duration-300 ${
              activeNow ? "font-semibold text-[#915eff]" : "text-[#aaa6c3] hover:text-[#915eff]"
            } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-[#915eff] after:to-[#00c8ff] after:transition-all after:duration-300 ${
              activeNow ? "after:w-full" : "after:w-0 hover:after:w-full"
            }`;
            return (
              <a
                href={`/#${nav.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/#${nav.id}`);
                  try { (e.currentTarget as HTMLElement).blur(); } catch (err) { void err; }
                }}
                className={className}
              >
                {nav.title}
              </a>
            );
          })()}

        </li>
      ))}
    </ul>
  );
};

export default NavLinksDesktop;
