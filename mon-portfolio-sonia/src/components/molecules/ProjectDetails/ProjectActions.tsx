import React from "react";
import { Button, Icon } from "../../atoms";
import { Link } from "react-router-dom";
import { TProject } from "../../../types";
import { motion } from "framer-motion";

interface Props {
  project: TProject;
}

const githubIcon = "/assets/github.png";

const ProjectActions: React.FC<Props> = ({ project }) => {
  return (
    <div className="flex gap-3">
      {project.link && (
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button
            label={<><Icon src={githubIcon} className="inline-block h-4 w-4 mr-2" alt="github"/>Voir le code</>}
            onClick={() => window.open(project.link, "_blank")}
            aria-label={`Ouvrir le code de ${project.title}`}
            className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00C8FF] text-white shadow-md hover:brightness-105 transition"
          />
        </motion.div>
      )}

      <Link to="/">
        <motion.div whileHover={{ y: -3 }} whileTap={{ y: 0 }}>
          <Button label={"Retour"} className="text-sm px-4 py-2 rounded-full border border-slate-700 bg-transparent text-white hover:bg-slate-800 transition" />
        </motion.div>
      </Link>
    </div>
  );
};

export default ProjectActions;
