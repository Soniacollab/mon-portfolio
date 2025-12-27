import React from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import { Typography, Icon, Button } from "../../atoms";
import List from "../../atoms/List";
import {
  contentStyle,
  contentArrowStyle,
  iconStyle,
} from "./experienceCard.styles";

interface ExperienceCardProps {
  title: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  points: string[];
  iconUrl?: string;
  iconBg?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  companyName,
  startDate,
  endDate,
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
      <Icon
        src={iconUrl}
        alt={companyName}
        className="w-12 h-12 object-contain"
      />
    </div>
  ) : null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR");

  return (
    <VerticalTimelineElement
      contentStyle={contentStyle}
      contentArrowStyle={contentArrowStyle}
      iconStyle={customIconStyle}
      icon={iconElement}
    >
      <Typography variant="h3" className="text-white leading-snug">
        {title}
      </Typography>

      <Typography variant="p" className="text-secondary mt-1">
        {companyName} • {formatDate(startDate)}
        {endDate ? ` - ${formatDate(endDate)}` : ""}
      </Typography>

      <List items={points} className="mt-4" />

      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onEdit && (
            <Button
              onClick={onEdit}
              label="Edit"
              className="px-4 py-1 bg-yellow-600 hover:bg-yellow-700"
            />
          )}
          {onDelete && (
            <Button
              onClick={onDelete}
              label="Delete"
              className="px-4 py-1 bg-red-600 hover:bg-red-700"
            />
          )}
        </div>
      )}
    </VerticalTimelineElement>
  );
};

export default ExperienceCard;
