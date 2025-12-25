import { motion } from "framer-motion";
import { SectionWrapper } from "../../../hoc";
import { Typography } from "../../atoms";
import { useProfile } from "../../../hooks/useProfile";

const About = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <p className="text-white text-center">Chargement…</p>;
  if (error || !profile) return <p className="text-red-500">{error}</p>;

  const avatarUrl = profile.avatar
    ? profile.avatar.startsWith("http")
      ? profile.avatar
      : `http://localhost:5000${profile.avatar}`
    : null;

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
        transition={{ duration: 0.7 }}
        className="mb-14 text-center w-full"
      >
        <Typography
          variant="h2"
          className="text-5xl md:text-6xl violet-blue-text-gradient font-extrabold"
        >
          About Me
        </Typography>
      </motion.div>

      {/* Card */}
      <div className="relative w-full max-w-5xl">
        <div className="relative rounded-3xl p-10 sm:p-14 bg-[#0b0b12] flex flex-col md:flex-row items-center gap-12 shadow-lg">
          
          {/* Avatar */}
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border border-white/10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30">
                Photo
              </div>
            )}
          </div>

          {/* Texte */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-white">
              {profile.first_name} {profile.last_name}
            </h3>

            <p className="text-white/80 mt-4 leading-7">
              {profile.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(About, "about");
