import { motion } from "framer-motion";
import { SectionWrapper } from "../../hoc";
import { technologies } from "../../constants";
import { BallCanvas } from "../canvas";

const Tech = () => {
  return (
    <>
    {/* Separation line */}
      <div className="w-6/5 h-[1px] mx-auto mb-10 bg-gradient-to-r from-[#915EFF] via-[#bf61ff] to-[#00c8ff] opacity-50 rounded-full" />

      {/* Section title */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#915EFF] via-[#7dd3fc] to-[#00c8ff] bg-clip-text text-transparent"
      >
        Technologies
      </motion.h2>

      {/* Logos */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
        {technologies.map((tech) => (
          <div className="flex flex-col items-center" key={tech.name}>
            <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
              <BallCanvas icon={tech.icon} />
            </div>
            <p className="text-white/80 text-sm mt-2 text-center">{tech.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
