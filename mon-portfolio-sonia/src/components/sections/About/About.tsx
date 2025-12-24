import { motion } from "framer-motion";
import { SectionWrapper } from "../../../hoc";
import { Typography } from "../../atoms";
import { useProfile } from "../../../hooks/useProfile";

const About = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <p className="text-white text-center">Chargement…</p>;
  if (error || !profile) return <p className="text-red-500">{error}</p>;

  return (
    <section
      id="about"
      className="relative mx-auto max-w-6xl pt-8 flex flex-col items-center"
    >
      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-14 text-center w-full"
      >
        <Typography
          variant="h2"
          className="text-5xl md:text-6xl violet-blue-text-gradient font-extrabold"
        >
          About Me
        </Typography>
      </motion.div>

      {/* Box */}
      <div className="relative w-full max-w-5xl">
        {/* Border animé */}
        <div
          className="
            absolute inset-0 rounded-3xl pointer-events-none
            bg-[linear-gradient(#0b0b12,#0b0b12)_padding-box,
            linear-gradient(120deg,rgba(145,94,255,0.7),rgba(125,211,252,0.5),rgba(145,94,255,0.7))_border-box]
            border-[1.5px] border-transparent
            animate-borderFlow
          "
        />

        {/* Intérieur */}
        <div className="relative rounded-3xl p-10 sm:p-14 bg-[#0b0b12] flex flex-col md:flex-row items-center gap-12
          border border-[#0b0b12] shadow-[0_0_15px_rgba(145,94,255,0.2)]"
        >
          {/* Photo */}
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border border-white/10">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30">
                Photo
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-white">
              {profile.first_name} {profile.last_name}
            </h3>

            <p className="text-white/80 mt-4 leading-7">
              {profile.bio}
            </p>

            {/* Boutons */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              <a
                href="/cv.pdf"
                download
                className="
                  px-6 py-3 rounded-xl text-white font-medium
                  bg-gradient-to-r from-violet-500 to-sky-400
                  hover:scale-[1.03] transition-transform
                "
              >
                Télécharger CV
              </a>

              <a
                href="#contact"
                className="
                  px-6 py-3 rounded-xl text-white font-medium
                  border border-violet-400/60
                  hover:bg-violet-500/10 transition
                "
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(About, "about");
