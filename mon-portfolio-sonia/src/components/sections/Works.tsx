import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { github } from "../../assets";
import { SectionWrapper } from "../../hoc";
import { projects } from "../../constants";
import { fadeIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { TProject } from "../../types";

const ProjectCard: React.FC<{ index: number } & TProject> = ({
  index,
  name,
  description,
  tags,
  image,
  sourceCodeLink,
}) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      whileHover={{ scale: 1.05 }}
      className="transition-transform duration-300"
    >
      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={false}>
        {/* Card style comme Experience */}
        <div
          className="w-full sm:w-[320px] rounded-2xl p-5"
          style={{
            background: "rgba(17, 17, 24, 0.88)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(145,94,255,0.25)",
            borderRadius: "16px",
            boxShadow: "0 0 22px rgba(145,94,255,0.12)",
          }}
        >
          {/* Image */}
          <div className="relative h-[200px] w-full rounded-xl overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-3 right-3">
              <div
                onClick={() => window.open(sourceCodeLink, "_blank")}
                className="bg-gradient-to-r from-[#915EFF] to-[#00c8ff] p-2 rounded-full cursor-pointer hover:scale-110 transition-transform"
              >
                <img src={github} alt="github" className="h-5 w-5 object-contain" />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mt-4">
            <h3 className="text-[22px] font-semibold text-white leading-snug">
              {name}
            </h3>
            <p className="text-white/80 mt-2 text-sm">{description}</p>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.name}
                className={`text-xs px-2 py-1 rounded-full ${tag.color} bg-gray-800/30`}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      {/* Separation line */}
      <div className="w-4/5 h-[1px] mx-auto my-8 
                      bg-gradient-to-r from-[#915EFF] via-[#bf61ff] to-[#00c8ff] 
                      rounded-full opacity-60" />

      {/* Section title */}
      <Header
        useMotion={false}
        {...config.sections.works}
        className="mb-6 mt-[3rem] text-center text-[28px] font-extrabold text-white"
      />

      {/* Description */}
      <p className="text-white/70 max-w-3xl mx-auto text-center mb-10 text-sm sm:text-base">
        {config.sections.works.content}
      </p>

      {/* Project Cards */}
      <div className="flex flex-wrap justify-center gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
