// src/components/molecules/ProjectCard/ProjectCard.tsx
import { FC } from "react";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
const github = "/assets/github.png";
import { Typography, Icon, Badge, Button, Image } from "../../atoms";
import * as S from "./projectCard.styles";
import { skillColors } from "../../../constants/skill";
import { fadeIn } from "../../../utils/motion";

export interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  image?: string;
  sourceCodeLink?: string;
  tags?: { name: string; color?: string }[];
  detailLink?: string;

  // Props admin 
  _id?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProjectCard: FC<ProjectCardProps> = ({
  index,
  name,
  description,
  image,
  sourceCodeLink,
  tags = [],
  detailLink,
  onEdit,
  onDelete,
}) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.5, 0.75)}
    whileHover={{ scale: 1.05 }}
    className="transition-transform duration-300"
  >
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={false}>
      <div className={S.cardStyle}>
        {/* Image + GitHub */}
        {image && (
          <div className={S.imageContainerStyle}>
            <Image
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-xl"
            />
            {sourceCodeLink && (
              <div className="absolute top-3 right-3">
                <Button
                  onClick={() => window.open(sourceCodeLink, "_blank")}
                  className={S.githubButtonStyle}
                  label={<Icon src={github} alt="github" className="h-5 w-5" />}
                />
              </div>
            )}
          </div>
        )}

        {/* Titre & Description */}
        <div className="mt-4">
          <Typography variant="h3" className={S.titleStyle}>
            {name}
          </Typography>
          <Typography variant="p" className={S.descriptionStyle}>
            {description}
          </Typography>
        </div>

        {/* Tags / Skills */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.name}
                text={`#${tag.name}`}
                className={skillColors[tag.name] || "text-white/80"}
              />
            ))}
          </div>
        )}

      
        
        {(onEdit || onDelete) && (
          <div className="mt-4 flex gap-2">
            {onEdit && (
              <Button
                onClick={onEdit}
                label="Edit"
                className="bg-yellow-600 hover:bg-yellow-700"
              />
            )}
            {onDelete && (
              <Button
                onClick={onDelete}
                label="Delete"
                className="bg-red-600 hover:bg-red-700"
              />
            )}
          </div>
        )}

        
        {detailLink && (
          <div className="mt-4 flex justify-center">
            <Link to={detailLink}>
              <Button label={"Voir plus"} />
            </Link>
          </div>
        )}
      </div>
    </Tilt>
  </motion.div>
);

export default ProjectCard;
