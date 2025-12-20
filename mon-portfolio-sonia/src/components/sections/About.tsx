import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../../hoc";

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="
        relative
        mx-auto
        max-w-6xl
        pt-8   /* rapproché du Hero */
        flex
        flex-col
        items-center
      "
    >
      {/* Titre */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="
          text-4xl sm:text-5xl md:text-6xl
          font-extrabold
          text-center
          mb-12
          bg-gradient-to-r
          from-[#915EFF]
          via-[#7dd3fc]
          to-[#00c8ff]
          bg-clip-text
          text-transparent
        "
      >
        About Me
      </motion.h2>

      {/* Bloc principal */}
      <div className="relative w-full max-w-5xl">
        {/* Border gradient vivant */}
        <div className="absolute inset-0 rounded-3xl animate-border-flow pointer-events-none" />

        {/* Contenu */}
        <div
          className="
            relative z-10
            rounded-3xl
            p-10 sm:p-14
            flex flex-col md:flex-row
            items-center
            gap-12
          "
        >
          {/* Photo placeholder */}
          <div
            className="
              w-48 h-48
              sm:w-56 sm:h-56
              rounded-full
              bg-[#0b0b12]
              border border-white/10
              flex items-center justify-center
              flex-shrink-0
            "
          >
            <span className="text-white/40 text-sm">Photo</span>
          </div>

          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 text-center md:text-left"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
              Étudiante en informatique
            </h3>

            <p className="text-white/80 text-base sm:text-lg leading-7">
              Étudiante en 2ᵉ année d’informatique, passionnée par le développement
              et le design UI/UX. Cette section est pensée comme un espace
              professionnel évolutif, prêt à accueillir une photo et du contenu
              dynamique via une interface d’administration sécurisée.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Animations BORDER */}
      <style>
        {`
        @keyframes borderFlow {
          0% {
            opacity: 0.35;
            box-shadow: none;
          }
          50% {
            opacity: 1;
            box-shadow:
              0 0 25px rgba(145,94,255,0.35),
              0 0 35px rgba(125,211,252,0.25);
          }
          100% {
            opacity: 0.35;
            box-shadow: none;
          }
        }

        .animate-border-flow {
          border: 1.5px solid transparent;
          background:
            linear-gradient(#0b0b12, #0b0b12) padding-box,
            linear-gradient(
              120deg,
              rgba(145,94,255,0.7),
              rgba(125,211,252,0.5),
              rgba(145,94,255,0.7)
            ) border-box;
          animation: borderFlow 3.5s ease-in-out infinite;
        }
        `}
      </style>
    </section>
  );
};

export default SectionWrapper(About, "about");
