import React from "react";
import { Typography } from "../../atoms";
import { TProject } from "../../../types";
import { skillColors } from "../../../constants/skill";

interface Props {
  project: TProject;
}

const ProjectInfo: React.FC<Props> = ({ project }) => {
  const tags = (project.skills || []).map((skill) => (typeof skill === "string" ? { name: skill } : skill));

  return (
    <>
      <div className="flex items-center justify-between">
        <Typography variant="h2" className="text-lg text-white font-semibold tracking-tight">
          {project.title}
        </Typography>
      </div>

      <Typography variant="p" className="text-slate-300 text-sm mt-2 mb-4 leading-relaxed">
        {project.description}
      </Typography>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((t) => (
            <span
              key={t.name}
              className={`${skillColors[t.name] ?? "text-white/80"} text-xs text-slate-200 bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700 hover:scale-105 transition-transform duration-150`}
            >
              #{t.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectInfo;
