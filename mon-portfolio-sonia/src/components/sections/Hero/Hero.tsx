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
      <HeroStars />
      <RobotPlayground />
      <HeroContent />
      <HeroScrollIndicator />
    </section>
  );
};

export default Hero;
