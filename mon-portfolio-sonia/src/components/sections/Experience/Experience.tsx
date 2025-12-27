import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { SectionWrapper } from "../../../hoc";
import ExperienceCard from "../../molecules/ExperienceCard/ExperienceCard";
import { SectionHeader } from "../../molecules/";
import { Divider, Typography } from "../../atoms";
import { config } from "../../../constants/config";
import { useExperiences } from "../../../hooks/useExperiences";
import parseAchievements from "../../../utils/parseAchievements";
import thp from "../../../../public/assets/thp.png";

const Experience = () => {
  const { experiences, loading, error } = useExperiences();

  if (loading) {
    return (
      <section className="text-center text-white mt-20">
        Chargement des expériences...
      </section>
    );
  }

  if (error) {
    return (
      <section className="text-center text-red-400 mt-20">{error}</section>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <section className="relative w-full max-w-6xl mx-auto py-12">
        <Divider />
        <SectionHeader
          p={config.sections.experience.p}
          h2={config.sections.experience.h2}
          className="text-center mt-[3rem] mb-6 violet-blue-text-gradient"
        />
        <Typography variant="p" className="text-white/70 text-center mt-10">
          Aucune expérience professionnelle à afficher
        </Typography>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-6xl mx-auto py-12">
      <Divider />
      <SectionHeader
        p={config.sections.experience.p}
        h2={config.sections.experience.h2}
        className="text-center mt-[3rem] mb-6 violet-blue-text-gradient"
      />

      <VerticalTimeline >
        {experiences.map((exp, i) => (
          <ExperienceCard
            key={i}
            title={exp.title}
            companyName={`${exp.company} - ${
              exp.type === "stage"
                ? "Stage"
                : exp.type === "job"
                ? "Job"
                : exp.type === "internship"
                ? "Internship"
                : "Freelance"
            }`}
            startDate={exp.startDate}
            endDate={exp.endDate}
            points={[
              exp.description,
              ...parseAchievements(exp.achievements),
              `Technologies : ${exp.technologies?.map((t) => t.name).filter(Boolean).join(", ")}`,
            ].filter((p) => typeof p === "string" && p.trim() !== "")}
            iconUrl={exp.icon ? `http://localhost:5000${exp.icon}` : thp}
            iconBg="#383E56"
              />
        ))}
      </VerticalTimeline>
    </section>
  );
};

export default SectionWrapper(Experience, "work");
