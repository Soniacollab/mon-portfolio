import React from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import { Typography, Icon } from "../../atoms";
import List from "../../atoms/List";
import { contentStyle, contentArrowStyle, iconStyle } from "./experienceCard.styles";

interface ExperienceCardProps {
  title: string;
  companyName: string;
  date: string;
  points: string[];
  iconUrl?: string;  // <- juste l'URL
  iconBg?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  companyName,
  date,
  points,
  iconUrl,
  iconBg = "#333",
  onEdit,
  onDelete,
}) => {
  const customIconStyle = {
    ...iconStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: iconBg,
  };

  const iconElement = iconUrl ? (
    <div className="w-full h-full flex items-center justify-center">
      <Icon src={iconUrl} alt={companyName} className="w-12 h-12 object-contain" />
    </div>
  ) : null;

  return (
    <VerticalTimelineElement
      date={date}
      contentStyle={contentStyle}
      contentArrowStyle={contentArrowStyle}
      iconStyle={customIconStyle}
      icon={iconElement} // <- ReactElement ou null
    >
      <Typography variant="h3" className="text-white leading-snug">
        {title}
      </Typography>

      <Typography variant="p" className="text-secondary mt-1">
        {companyName}
      </Typography>

      <List items={points} className="mt-4" />

      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4">
          {onEdit && <button onClick={onEdit} className="btn-edit">Edit</button>}
          {onDelete && <button onClick={onDelete} className="btn-delete">Delete</button>}
        </div>
      )}
    </VerticalTimelineElement>
  );
};

export default ExperienceCard;
