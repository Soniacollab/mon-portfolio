import { motion } from "framer-motion";

import { styles } from "../constants/styles";

interface Props {
  Component: React.ElementType;
  idName: string;
}

const SectionWrapper = (
  Component: Props["Component"],
  idName: Props["idName"]
) =>
  function HOC() {
    // HOC: fournit le conteneur commun et déclenche l'animation lorsque la section
    // entre dans le viewport. On évite de cacher la section par défaut pour
    // prévenir des cas où l'observer ne déclenche pas (problèmes dev/Firefox).
    return (
      <motion.section
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`${styles.padding} relative z-0 mx-auto max-w-7xl`}
        id={idName}
      >
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
