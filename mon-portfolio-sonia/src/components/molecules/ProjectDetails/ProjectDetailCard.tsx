import { motion } from "framer-motion";
import ProjectThumbnail from "./ProjectThumbnail";
import ProjectInfo from "./ProjectInfo";
import ProjectActions from "./ProjectActions";
import { TProject } from "../../../types";

interface Props {
  project: TProject;
}

const ProjectDetailCard: React.FC<Props> = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-3xl w-full"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {project.image && <ProjectThumbnail image={project.image} title={project.title} />}

          <div className="flex-1">
            <ProjectInfo project={project} />
            <ProjectActions project={project} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailCard;
