import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavLinksDesktop from "../molecules/NavLink/NavLinksDesktop";
import NavLinksMobile from "../molecules/NavLink/NavLinksMobile";
import logo from "../../assets/logo.svg";
import { Image } from "../atoms";


const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-300 ${
      scrolled ? "shadow-lg shadow-[rgba(81,167,255,0.06)]" : "shadow-sm shadow-[rgba(31,78,135,0.04)]"
    }`} aria-label="Main navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(145,94,255,0.5)]" onClick={() => { setActive(""); window.scrollTo(0,0); }}>
          <Image src={logo} alt="Logo Sonia" rounded className="h-9 w-9 object-contain" />
          <p className="bg-gradient-to-r from-[#915eff] to-[#00c8ff] bg-clip-text text-xl font-bold tracking-wide text-transparent">Sonia</p>
        </Link>

        <NavLinksDesktop active={active} setActive={setActive} />
        <NavLinksMobile active={active} setActive={setActive} toggle={toggle} setToggle={setToggle} />
      </div>
    </nav>
  );
};

export default Navbar;
