import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import { AnimationProps } from '../../types';

export const Reveal: React.FC<AnimationProps> = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
};