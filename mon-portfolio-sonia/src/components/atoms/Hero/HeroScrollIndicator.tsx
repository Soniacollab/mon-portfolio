
const HeroScrollIndicator = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("about");
    if (!target) return;
    const navbarOffset = 80; // adjust if you have a fixed navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
      <a href="#about" aria-label="Scroll to about section" className="hero-scroll" onClick={handleClick}>
        <span className="sr-only">Scroll to About</span>
        <div className="hero-scroll-dot" />
      </a>
    </div>
  );
};

export default HeroScrollIndicator;
