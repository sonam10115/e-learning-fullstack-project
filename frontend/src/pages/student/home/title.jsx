import React from "react";

// import motion

import { motion } from "motion/react";
import * as variants from "../../../motion/animation";

const Title = ({ title }) => {
  return (
    <div
      className="flex items-center justify-between flex-wrap
    gap-4"
    >
      <div>
        <motion.h2
          variants={variants.fadeInUp}
          className="text-3xl font-bold mb-6 text-[#142C52] items-center justify-center flex"
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
};

export default Title;
