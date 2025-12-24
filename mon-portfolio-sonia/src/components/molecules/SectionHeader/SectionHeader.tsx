import React from "react";
import { motion } from "framer-motion";
import { styles } from "../../../constants/styles";
import { textVariant } from "../../../utils/motion";

interface HeaderProps {
  useMotion?: boolean;
  p: string;
  h2: string;
  className?: string;
}

const SectionHeader: React.FC<HeaderProps> = ({
  useMotion = true,
  p,
  h2,
  className = "",
}) => {
  const content = (
    <div className={className}>
      <p className={styles.sectionSubText}>{p}</p>
      <h2 className={styles.sectionHeadText}>{h2}</h2>
    </div>
  );

  return useMotion ? (
    <motion.div
      variants={textVariant()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
};

export default SectionHeader;
