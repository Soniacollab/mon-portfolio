import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import { experiences } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { Header } from "../atoms/Header";
import { TExperience } from "../../types";
import { config } from "../../constants/config";

const ExperienceCard: React.FC<TExperience> = (experience) => {
  return (
    <VerticalTimelineElement
      date={experience.date}
      contentStyle={{
        background: "rgba(17, 17, 24, 0.88)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(145,94,255,0.25)",
        borderRadius: "16px",
        boxShadow: "0 0 22px rgba(145,94,255,0.12)",
        color: "#fff",
      }}
      contentArrowStyle={{
        borderRight: "7px solid rgba(145,94,255,0.35)",
      }}
      iconStyle={{
        background: "linear-gradient(135deg,#915EFF,#00c8ff)",
        boxShadow: "0 0 18px rgba(145,94,255,0.45)",
      }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={experience.icon}
            alt={experience.companyName}
            className="h-[60%] w-[60%] object-contain"
          />
        </div>
      }
    >

      {/* Title */}
      <h3 className="text-[22px] font-semibold text-white leading-snug">
        {experience.title}
      </h3>

      {/* Company */}
      <p className="text-secondary text-[15px] font-medium mt-1">
        {experience.companyName}
      </p>

      {/* Points */}
      <ul className="mt-4 ml-5 list-disc space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={index}
            className="text-white/80 text-[14px] leading-relaxed"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
    {/* Separation line */}
      <div className="w-4/5  h-[1px] mx-auto my-8 
                      bg-gradient-to-r from-[#915EFF] via-[#bf61ff] to-[#00c8ff] 
                      rounded-full opacity-60" />
      {/* Section title */}
      <Header
        useMotion={true}
        {...config.sections.experience}
        className="mb-6 mt-[3rem] text-center"
      />

      {/* Timeline */}
      <div className="flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
