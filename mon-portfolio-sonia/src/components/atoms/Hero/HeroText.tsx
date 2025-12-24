import { config } from "../../../constants/config";
import Typography from "../../atoms/Typography";

const HeroText = () => {
  return (
    <div className="flex-1">
      <Typography
        variant="h1"
        className="
          text-[clamp(2.25rem,6vw,5.5rem)]
          font-bold
          leading-[1.05]
          bg-gradient-to-r from-[#EAF5FF] via-[#915EFF] to-[#00c8ff]
          bg-clip-text text-transparent
          max-w-[22ch]
        "
      >
        Hi, I'm <span className="text-[#915EFF]">{config.hero.name}</span>
      </Typography>

      <Typography
        variant="p"
        className="
          mt-4
          max-w-prose
          text-[#9fd1ff]
          leading-relaxed
          text-[clamp(0.95rem,2.2vw,1.125rem)]
        "
      >
        {config.hero.p[0]} <br className="hidden sm:block" />
        {config.hero.p[1]}
      </Typography>
    </div>
  );
};

export default HeroText;
