import React from "react";
import { motion } from "framer-motion";

import { styles } from "../../constants/styles";
import { textVariant } from "../../utils/motion";

interface IHeader {
  useMotion: boolean;
  p: string;
  h2: string;
  className?: string;
}

export const Header: React.FC<IHeader> = ({ useMotion, p, h2, className }) => {
  const Content = () => (
    <div className={className ? className : ""}>
      <p className={styles.sectionSubText}>{p}</p>
      <h2 className={styles.sectionHeadText}>{h2}</h2>
    </div>
  );

  return useMotion ? (
    <motion.div variants={textVariant()}>
      <Content />
    </motion.div>
  ) : (
    <Content />
  );
};
