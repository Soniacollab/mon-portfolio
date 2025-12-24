// src/components/molecules/Tech/Tech.tsx
import { SectionWrapper } from "../../../hoc";
import Divider from "../../atoms/Divider";
import { TechCard } from "../../molecules";
import { motion } from "framer-motion";
import { Typography } from "../../atoms";
import { config } from "../../../constants/config";
import { useSkills } from "../../../hooks/useSkills";

const Tech = () => {
  const { skills, error } = useSkills();

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Définir les skills principaux pour 3D
  const mainSkillNames = [
    "Node.js",
    "React",
    "JavaScript",
    "TypeScript",
    "MongoDB",
    "Tailwind CSS",
    "Three.js",
  ];

  const mainSkills = skills.filter(skill => mainSkillNames.includes(skill.name));
  const otherSkills = skills.filter(skill => !mainSkillNames.includes(skill.name));

  return (
    <section className="relative w-full max-w-6xl mx-auto py-12">
      {/* Ligne de séparation */}
      <Divider />

      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-6 mt-[2rem] text-center"
      >
        <Typography variant="p" className="text-white/70 text-lg sm:text-xl">
          {config.sections.tech.p}
        </Typography>
        <Typography
          variant="h2"
          className="text-4xl sm:text-5xl md:text-6xl violet-blue-text-gradient font-extrabold text-transparent leading-[1.2] inline-block z-10 pb-2"
        >
          {config.sections.tech.h2}
        </Typography>
      </motion.div>

      {/* Skills principaux 3D */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 mt-8">
        {mainSkills.map(skill => (
          <TechCard key={skill.name} icon={skill.icon} name={skill.name} />
        ))}
      </div>

      {/* Skills secondaires en badges cyber/tech */}
{otherSkills.length > 0 && (
  <div className="flex flex-wrap justify-center gap-4 mt-6">
    {otherSkills.map(skill => (
      <TechCard key={skill.name} name={skill.name} isMain={false} />
    ))}
  </div>
)}

    </section>
  );
};

export default SectionWrapper(Tech, "tech");
