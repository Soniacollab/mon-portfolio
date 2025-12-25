import { SectionWrapper } from "../../../hoc";
import { config } from "../../../constants/config";
import { Typography, Divider } from "../../atoms";
import { motion } from "framer-motion";
import { ProjectCard } from "../../molecules";
import { fadeIn } from "../../../utils/motion";
import { useProjects } from "../../../hooks/useProjects";

const API_BASE = "http://localhost:5000";

const Works = () => {
  const { projects, loading, error } = useProjects();

  if (loading) return <p className="text-white text-center">Chargement des projets...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Transforme chaque image en URL complète si besoin
  const projectsWithFullImage = projects.map((p) => ({
    ...p,
    image: p.image
      ? p.image.startsWith("http") // si déjà URL complète
        ? p.image
        : `${API_BASE}${p.image}` // sinon ajoute API_BASE
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
        {projectsWithFullImage.map((project, index) => (
          <ProjectCard
            key={project._id}
            index={index}
            name={project.title}
            description={project.description}
            image={project.image}
            sourceCodeLink={project.link ?? "#"}
            tags={
              project.skills?.map((skill) => ({
                name: skill.name,
                color:
                  skill.name === "React"
                    ? "text-[#61dafb]"
                    : skill.name === "Node.js"
                    ? "text-[#3C873A]"
                    : skill.name === "TypeScript"
                    ? "text-[#3178C6]"
                    : "text-white/80",
              })) || []
            }
          />
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(Works, "projects");
