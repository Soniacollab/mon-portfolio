import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { SectionWrapper } from "../../../hoc";
import ExperienceCard from "../../molecules/ExperienceCard/ExperienceCard";
import { SectionHeader } from "../../molecules/";
import { Divider } from "../../atoms";
import { config } from "../../../constants/config";
import { useExperiences } from "../../../hooks/useExperiences";
import { Typography } from "../../atoms";
import { thp } from "../../../assets"; 

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
      <section className="text-center text-red-400 mt-20">
        {error}
      </section>
    );
  }

  // Si pas d'expériences en base
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

  // Transforme SEULEMENT tes données API
  const formattedExperiences = experiences.map(exp => ({
    title: exp.title,
    companyName: `${exp.company} - ${exp.type === 'stage' ? 'Stage' : 'Emploi'}`,
    icon: thp,
    iconBg: "#383E56", // <-- AJOUTE CETTE LIGNE
    date: `${new Date(exp.startDate).toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    })} - ${exp.endDate 
      ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      : 'Présent'
    }`,
    points: [
      exp.description,
      ...exp.achievements,
      `Technologies : ${exp.technologies?.map(t => t.name).join(', ')}`
    ]
  }));

  return (
    <section className="relative w-full max-w-6xl mx-auto py-12">
      <Divider />

      <SectionHeader
        p={config.sections.experience.p}
        h2={config.sections.experience.h2}
        className="text-center mt-[3rem] mb-6 violet-blue-text-gradient"
      />

      

      <div className="flex flex-col">
        <VerticalTimeline layout="1-column">
          {formattedExperiences.map((exp, i) => (
            <ExperienceCard 
              key={i} 
              title={exp.title}
              companyName={exp.companyName}
              icon={exp.icon}
              iconBg={exp.iconBg} // <-- N'OUBLIE PAS DE PASSER iconBg !
              date={exp.date}
              points={exp.points}
            />
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
};

export default SectionWrapper(Experience, "work");