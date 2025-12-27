import RobotPlayground from "../../canvas/RobotPlayground";
import HeroContent from "../../molecules/HeroContent/HeroContent";
import HeroScrollIndicator from "../../atoms/Hero/HeroScrollIndicator";
import HeroStars from "../../canvas/HeroStars";
import { usePointerParallax } from "../../../hooks/usePointerParallax";

const Hero = () => {
  
  const {
    containerRef,
    handlePointerMove,
    resetPointer,
  } = usePointerParallax<HTMLElement>();

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Fond animé de particules/stars */}
      <HeroStars />

     
      <div className="hero-css-bg" />
      <div className="hero-noise" />

      {/* Zone 3D / robot render (Three.js) */}
      <RobotPlayground />

      {/* Contenu principal */}
      <HeroContent />

      {/* Indicateur pour scroller vers le bas */}
      <HeroScrollIndicator />
    </section>
  );
};

export default Hero;
