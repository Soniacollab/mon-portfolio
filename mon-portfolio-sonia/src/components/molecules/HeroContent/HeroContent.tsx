import AccentLine from "../../atoms/Hero/AccentLine";
import HeroText from "../../atoms/Hero/HeroText";

const HeroContent = () => {
  return (
    <div className="absolute inset-0 top-20 sm:top-28 mx-auto max-w-7xl px-5 sm:px-12 flex flex-col sm:flex-row items-start gap-5 z-20 pointer-events-none">
      <AccentLine />
      <HeroText />
    </div>
  );
};

export default HeroContent;
