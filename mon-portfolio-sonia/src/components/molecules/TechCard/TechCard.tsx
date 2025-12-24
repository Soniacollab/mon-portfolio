import { BallCanvas } from "../../canvas";
import { html } from "../../../assets"; 
interface TechCardProps {
  icon?: string;
  name: string;
  isMain?: boolean; // true = 3D ball, false = badge
}

const TechCard: React.FC<TechCardProps> = ({ icon, name, isMain = true }) => {
  if (isMain) {
    const iconToUse = icon || html;
    return (
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
          <BallCanvas icon={iconToUse} />
        </div>
        <p className="text-white/80 text-sm mt-2 text-center">{name}</p>
      </div>
    );
  }

  // Badge secondaire cyber/tech
  return (
    <div className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium 
                    shadow-[0_0_8px_rgba(145,94,255,0.3)] 
                    hover:shadow-[0_0_12px_rgba(125,211,252,0.6)]
                    hover:bg-white/20
                    transition-all duration-300 cursor-default">
      {name}
    </div>
  );
};

export default TechCard;
