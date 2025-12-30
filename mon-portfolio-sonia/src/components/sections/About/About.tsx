import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../../../hoc";
import { Typography } from "../../atoms";
import { useProfile } from "../../../hooks/useProfile";
import { API_BASE } from "../../../constants/api";

const About = () => {
  const { profile, loading, error, cvDownloadUrl, downloadCV } = useProfile();

  if (loading) return <p className="text-white text-center">Chargement…</p>;
  if (error || !profile) return <p className="text-red-500">{error}</p>;

  const avatarUrl = profile.avatar
    ? profile.avatar.startsWith("http")
      ? profile.avatar
        : `${API_BASE}${profile.avatar}`
    : null;

  const handleDownloadCV = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!cvDownloadUrl) return;
    try {
      await downloadCV(`${profile.first_name}_${profile.last_name}_CV.pdf`);
    } catch (err) {
      console.error("Téléchargement CV échoué:", err);
      window.open(cvDownloadUrl, "_blank");
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl pt-4 mb-2 flex flex-col items-center">
      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-8 text-center w-full"
      >
        <Typography
          variant="h2"
          className="text-5xl md:text-6xl violet-blue-text-gradient font-extrabold"
        >
          About Me
        </Typography>
      </motion.div>

      {/* Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-5xl"
      >
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
        <div className="relative rounded-3xl p-10 sm:p-14 glass-panel flex flex-col md:flex-row items-center gap-12">
          {/* Avatar */}
          <div className="avatar-border">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden">
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
          </div>

          {/* Contenu */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              <span className="text-white/90 mr-2">{profile.first_name}</span>
              <span className="violet-blue-text-gradient">
                {profile.last_name}
              </span>
            </h1>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 justify-center md:justify-start">
              <div className="meta-chip">📧 {profile.email}</div>
              {profile.cv_url && (
                <div className="meta-chip">📄 CV available</div>
              )}
            </div>

            <p className="text-white/80 mt-6 leading-7 max-w-2xl mx-auto md:mx-0">
              {profile.bio}
            </p>

            {/* Boutons */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              {/* Télécharger CV seulement si cv_url existe */}
              {profile.cv_url && (
                <a
                  href={cvDownloadUrl}
                  onClick={handleDownloadCV}
                  className="btn-primary"
                >
                  Télécharger CV
                </a>
              )}

              {/* Bouton contacter */}
              <a href="#contact" className="btn-secondary">
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(About, "about");
