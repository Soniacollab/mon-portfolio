import { useState } from "react";
import { SectionWrapper } from "../../../hoc";
import { config } from "../../../constants/config";
import { Typography, Divider } from "../../atoms";
import { motion } from "framer-motion";
import { ProjectCard, MultiSelectSkills } from "../../molecules";
import { fadeIn } from "../../../utils/motion";
import { useProjects } from "../../../hooks/useProjects";
import { useSkills } from "../../../hooks/useSkills";
import { asset } from "../../../utils/asset";
import { API_BASE } from "../../../constants/api";
import { TProject, TSkill } from "../../../types";
import { skillColors } from "../../../constants/skill";


const Works = () => {
  const { projects, loading, error } = useProjects();
  const { skills: allSkills } = useSkills();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  if (loading) return <p className="text-white text-center">Chargement des projets...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Assure que chaque image est une string non undefined
  const projectsWithFullImage: TProject[] = projects.map((p) => ({
    ...p,
    image: p.image
      ? p.image.startsWith("http")
        ? p.image
        : asset(`${API_BASE}${p.image}`)
      : asset("/placeholder.jpg"),
  }));

  // Filtre selon les skills sélectionnées (si aucune sélection -> tout afficher).
  const filteredProjects = projectsWithFullImage.filter((p) => {
    if (selectedSkills.length === 0) return true;
    const projSkillIds = (p.skills || []).map((s) => (typeof s === "string" ? s : s._id));
    // Require that project contains ALL selected skills (AND)
    return selectedSkills.every((id) => projSkillIds.includes(id));
  });

  return (
    <section>
      <Divider />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-6 mt-[2rem] text-center"
      >
        <Typography variant="p" className="text-white/70 text-lg sm:text-xl">
          {config.sections.works.p}
        </Typography>
        <Typography
          variant="h2"
          className="text-4xl sm:text-5xl md:text-6xl violet-blue-text-gradient font-extrabold text-transparent leading-[1.2] inline-block z-10 pb-2"
        >
          {config.sections.works.h2}
        </Typography>
      </motion.div>

      <motion.div variants={fadeIn("up", "spring", 0.1, 1)}>
        <Typography
          variant="p"
          className="text-white/70 mt-3 max-w-3xl mx-auto text-center text-[17px] leading-[30px] mb-10"
        >
          {config.sections.works.content}
        </Typography>
      </motion.div>

      {/* Skills filter */}
      <div className="mb-6 flex items-center justify-center gap-4 flex-wrap">
        <MultiSelectSkills skills={allSkills} selected={selectedSkills} onChange={setSelectedSkills} />
        {selectedSkills.length > 0 && (
          <button
            className="text-sm text-white/80 underline ml-2"
            onClick={() => setSelectedSkills([])}
          >
            Effacer les filtres
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start justify-center">
        {filteredProjects.map((project, index) => {
          // Gestion sécurisée des skills
          const tags = (project.skills || []).map((skill) => {
            const skillObj: TSkill = typeof skill === "string" ? { _id: skill, name: skill, technique: false } : skill;
            return {
              name: skillObj.name,
              color: skillColors[skillObj.name] ?? "text-white/80",
            };
          });

          return (
            <ProjectCard
              key={project._id}
              index={index}
              name={project.title}
              description={project.description ?? ""}
              image={project.image ?? "/placeholder.jpg"}
              sourceCodeLink={project.link ?? "#"}
              tags={tags}
              detailLink={`/projects/${project._id}`}
            />
          );
        })}
      </div>
      
    </section>
  );
};

export default SectionWrapper(Works, "works");
