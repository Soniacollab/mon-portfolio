
const HeroScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
      <a href="#about" aria-label="Scroll to about section" className="hero-scroll">
        <span className="sr-only">Scroll to About</span>
        <div className="hero-scroll-dot" />
      </a>
    </div>
  );
};

export default HeroScrollIndicator;
