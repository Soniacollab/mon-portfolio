import React from "react";
import { BallCanvas } from "../../canvas";
import Button from "../../atoms/Button";

interface TechCardProps {
  icon?: string;
  name: string;
  isMain?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TechCard: React.FC<TechCardProps> = ({
  icon,
  name,
  isMain = true,
  onEdit,
  onDelete,
}) => {
  const actionButtons = (
    <div className="flex gap-2 mt-2">
      {onEdit && (
        <Button
          label="✏️"
          onClick={onEdit}
          className="px-2 py-1 text-xs bg-[#915EFF]/80 hover:bg-[#915EFF]"
        />
      )}
      {onDelete && (
        <Button
          label="🗑️"
          onClick={onDelete}
          className="px-2 py-1 text-xs bg-red-500/80 hover:bg-red-600"
        />
      )}
    </div>
  );

  if (isMain) {
    return (
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
          {icon ? (
            <BallCanvas icon={icon} />
          ) : (
            <div className="bg-gray-700 w-full h-full rounded-full" />
          )}
        </div>

        <p className="text-white/80 text-sm mt-2 text-center">{name}</p>
        {actionButtons}
      </div>
    );
  }

  // Badge secondaire
  return (
    <div className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium shadow-[0_0_8px_rgba(145,94,255,0.3)] hover:shadow-[0_0_12px_rgba(125,211,252,0.6)] hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
      <span>{name}</span>
      {actionButtons}
    </div>
  );
};

export default TechCard;
