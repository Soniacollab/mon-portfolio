import { EarthCanvas } from "../../canvas";
import { SectionWrapper } from "../../../hoc";
import { Typography } from "../../atoms";
import { SectionHeader } from "../../molecules";
import ContactForm from "../../molecules/ContactForm/ContactForm";
import { config } from "../../../constants/config";

const Contact = () => {
  return (
    <div className="flex flex-col items-center gap-8 w-full px-4 md:px-12 xl:px-20 py-8">
      <Typography
        variant="h2"
        className="text-center mb-2 bg-gradient-to-r from-[#915EFF] via-[#7dd3fc] to-[#00c8ff] bg-clip-text text-transparent"
      >
        Contact Me
      </Typography>

      <div className="w-4/5 h-[2px] bg-gradient-to-r from-[#915EFF] via-[#bf61ff] to-[#00c8ff] rounded-full opacity-60" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
        {/* Formulaire */}
        <div className="flex-1 max-w-lg w-full rounded-2xl p-8 shadow-lg bg-[rgba(17,17,24,0.88)] backdrop-blur-[8px] border border-[rgba(145,94,255,0.25)]">
          <SectionHeader useMotion={false} {...config.contact} className="text-center text-white text-1xl" />
          <ContactForm />
        </div>

        {/* Planète */}
        <div className="w-full md:flex-1 h-80 sm:h-[350px] md:h-[450px] lg:h-[500px]">
          <EarthCanvas />
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
