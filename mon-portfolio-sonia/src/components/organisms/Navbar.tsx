import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavLinksDesktop from "../molecules/NavLink/NavLinksDesktop";
import NavLinksMobile from "../molecules/NavLink/NavLinksMobile";
const logo = "/assets/logo.svg";
import { Image } from "../atoms";
import { navLinks } from "../../constants/config";


const Navbar = () => {
  // États pour la gestion de l'état du composant
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  // Gestion du scroll pour ajouter une ombre à la navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion de l'observation des sections pour maj le lien actif
  useEffect(() => {
    if (typeof window === "undefined" || !document) return;

    // Si on n'est pas sur la page d'accueil, on ne fait rien
    if (location.pathname !== "/") {
      const t = window.setTimeout(() => setActive(""), 0);
      return () => clearTimeout(t);
    }

    // Fonction d'observation des sections
    const observer = new IntersectionObserver(
      // Callback quand une section est visible
      (entries) => {
        // Pour chaque section observée cad scrollée dans la vue
        entries.forEach((entry) => {
          // Si la section est visible, on met à jour l'état actif cad activer le style hover
          if (entry.isIntersecting) {
            const id = entry.target.id;
            // Trouve le lien correspondant à cette section
            const nav = navLinks.find((n) => n.id === id);
            // Met à jour l'état actif
            if (nav) setActive(nav.title);
          }
        });
      },
      // Options de l'observer root car on observe par rapport à la fenêtre
      // ROOT MARGIN pour déclencher l'observation un peu avant d'atteindre le milieu
      // et threshold à 0 pour déclencher dès que un pixel est visible
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    // On observe chaque section définie dans navLinks
    navLinks.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });

    // Nettoyage à la désactivation du composant et enlever le state 
    return () => observer.disconnect();
  }, [location.pathname, location.hash]);
  return (
    <nav className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-300 ${
      scrolled ? "shadow-lg shadow-[rgba(81,167,255,0.06)]" : "shadow-sm shadow-[rgba(31,78,135,0.04)]"
    }`} aria-label="Main navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(145,94,255,0.5)]" onClick={() => { setActive(""); window.scrollTo(0,0); }}>
          <Image src={logo} alt="Logo Sonia" rounded className="h-9 w-9 object-contain" />
          <p className="bg-gradient-to-r from-[#915eff] to-[#00c8ff] bg-clip-text text-xl font-bold tracking-wide text-transparent">Sonia</p>
        </Link>

        <NavLinksDesktop active={active} />
        <NavLinksMobile active={active} toggle={toggle} setToggle={setToggle} />
      </div>
    </nav>
  );
};

export default Navbar;
