import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../../constants/config";
import menu from "../../assets/menu.svg";
import close from "../../assets/close.svg";
import logo from "../../assets/logo.svg";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      // transparent nav over the hero (no bg), keep transitions / shadows on scroll
      className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "shadow-lg shadow-[rgba(81,167,255,0.06)]"
          : "shadow-sm shadow-[rgba(31,78,135,0.04)]"
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(145,94,255,0.5)]"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="h-9 w-9 object-contain" />
          <p className="bg-gradient-to-r from-[#915eff] to-[#00c8ff] bg-clip-text text-xl font-bold tracking-wide text-transparent">
            Sonia
          </p>
        </Link>

        {/* Desktop Links */}
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

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-4 sm:hidden">
          <button
            onClick={() => setToggle(!toggle)}
            className="h-7 w-7 cursor-pointer"
            aria-label="Toggle menu"
          >
            <img
              src={toggle ? close : menu}
              alt="menu"
              className="h-full w-full object-contain"
            />
          </button>
        </div>

        {/* Mobile Links */}
        <div
          className={`absolute left-0 right-0 top-full border-b border-[rgba(145,94,255,0.1)] bg-[rgba(5,8,22,0.95)] backdrop-blur-[10px] transition-all duration-300 ${
            toggle
              ? "scale-y-100 opacity-100 visibility-visible"
              : "scale-y-0 opacity-0 visibility-hidden"
          } origin-top`}
        >
          <ul className="flex flex-col gap-4 p-6">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                onClick={() => {
                  setToggle(false);
                  setActive(nav.title);
                }}
              >
                <a
                  href={`#${nav.id}`}
                  className="relative block text-[1.1rem] font-medium text-[#aaa6c3] transition-all duration-200 hover:pl-2 hover:text-[#915eff] before:absolute before:left-0 before:opacity-0 before:transition-all before:duration-200 before:content-['→'] hover:before:opacity-100"
                >
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
