import { SectionWrapper } from "../../../hoc";
import { config } from "../../../constants/config";
import { Typography, Divider } from "../../atoms";
import { motion } from "framer-motion";
import { ProjectCard } from "../../molecules";
import { fadeIn } from "../../../utils/motion";
import { useProjects } from "../../../hooks/useProjects";
import { TProject, TSkill } from "../../../types";
import { skillColors } from "../../../constants/skill";

const API_BASE = "http://localhost:5000";

const Works = () => {
  const { projects, loading, error } = useProjects();

  if (loading) return <p className="text-white text-center">Chargement des projets...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Assure que chaque image est une string non undefined
  const projectsWithFullImage: TProject[] = projects.map((p) => ({
    ...p,
    image: p.image
      ? p.image.startsWith("http")
        ? p.image
        : `${API_BASE}${p.image}`
      : "/placeholder.jpg",
  }));

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

      <div className="flex flex-wrap justify-center gap-8">
        {projectsWithFullImage.map((project, index) => {
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
            />
          );
        })}
      </div>
    </section>
  );
};

export default SectionWrapper(Works, "projects");
