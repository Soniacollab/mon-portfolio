import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { github } from "../../../assets";
import { TProject } from "../../../types";
import { fadeIn } from "../../../utils/motion";
import { Typography, Icon, Badge, Button, Image } from "../../atoms";
import * as S from "./projectCard.styles";
import { skillColors } from "../../../constants/skill";

interface ProjectCardProps extends TProject {
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  name,
  description,
  tags,
  image,
  sourceCodeLink,
}) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.5, 0.75)}
    whileHover={{ scale: 1.05 }}
    className="transition-transform duration-300"
  >
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={false}>
      <div className={S.cardStyle}>
        {/* Image + GitHub */}
        <div className={S.imageContainerStyle}>
          <Image
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute top-3 right-3">
            <Button
              onClick={() => window.open(sourceCodeLink, "_blank")}
              className={S.githubButtonStyle}
              label={<Icon src={github} alt="github" className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4">
          <Typography variant="h3" className={S.titleStyle}>
            {name}
          </Typography>
          <Typography variant="p" className={S.descriptionStyle}>
            {description}
          </Typography>
        </div>

        {/* Tags collés en bas */}
        <div className="mt-auto">
          <div className={S.tagsContainerStyle}>
            {tags.map((tag) => (
              <Badge
                key={tag.name}
      text={`#${tag.name}`}
      className={skillColors[tag.name] || "text-white"} // fallback blanc
              />
            ))}
          </div>
        </div>
      </div>
    </Tilt>
  </motion.div>
);

export default ProjectCard;
