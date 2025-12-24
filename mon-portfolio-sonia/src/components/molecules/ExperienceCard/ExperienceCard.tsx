import React from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import { TExperience } from "../../../types";
import { Typography, Icon } from "../../atoms";
import {
  contentStyle,
  contentArrowStyle,
  iconStyle,
} from "./experienceCard.styles";
import List from "../../atoms/List";

const ExperienceCard: React.FC<TExperience> = ({
  title,
  companyName,
  date,
  points,
  icon,
}) => {
  // Style pour centrer l'icône
  const customIconStyle = {
    ...iconStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  return (
    <VerticalTimelineElement
      date={date}
      contentStyle={contentStyle}
      contentArrowStyle={contentArrowStyle}
      iconStyle={customIconStyle}
      icon={
        <div className="w-full h-full flex items-center justify-center">
          <Icon src={icon} alt={companyName} className="w-12 h-12 object-contain" />
        </div>
      }
    >
      <Typography variant="h3" className="text-white leading-snug">
        {title}
      </Typography>

      <Typography variant="p" className="text-secondary mt-1">
        {companyName}
      </Typography>

      <List items={points} className="mt-4" />
    </VerticalTimelineElement>
  );
};

export default ExperienceCard;