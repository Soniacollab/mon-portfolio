import React from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import { Typography, Icon, Button } from "../../atoms";
import { config } from "../../../constants/config";
import List from "../../atoms/List";

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
  plain?: boolean;
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
  plain = false,
}) => {
  const bgClassMap: Record<string, string> = {
    "#383E56": "bg-[#383E56]",
    "#E6DEDD": "bg-[#E6DEDD]",
    "#3b3f66": "bg-[#3b3f66]",
    "#333": "bg-[#333]",
  };

  const bgClass = bgClassMap[iconBg] || `bg-[${iconBg}]`;

  const iconClasses = `${bgClass} w-14 h-14 rounded-[12px] flex items-center justify-center border border-[rgba(145,94,255,0.14)] shadow-md overflow-hidden`;

  const iconElement = iconUrl ? (
    <div className="w-full h-full flex items-center justify-center">
      <Icon
        src={iconUrl}
        alt={companyName}
        className="w-10 h-10 object-contain"
      />
    </div>
  ) : null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR");

  if (plain) {
    return (
      <article className="future-card relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className={`future-card__icon flex-shrink-0 ${iconClasses}`}>{iconElement}</div>

          <div className="future-card__content flex-1">
            <Typography variant="h3" className="text-white leading-snug">
              {title}
            </Typography>

                <Typography variant="p" className="text-secondary mt-1">
                  {companyName} • {formatDate(startDate)}
                  {endDate ? ` - ${formatDate(endDate)}` : ` - ${config.sections.experience.inProgressLabel}`}
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
          </div>
        </div>
      </article>
    );
  }

  return (
    <VerticalTimelineElement
      iconClassName={iconClasses}
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
