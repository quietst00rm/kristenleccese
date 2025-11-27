import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../ui/Reveal';
import { staggerContainer } from '../../utils/animations';

const pillars = [
  {
    title: "Crisis Management",
    description: "Reinstating suspended ASINs and accounts when generic templates and AI-generated appeals have failed."
  },
  {
    title: "Risk Mitigation",
    description: "Identifying black hat attacks and repeat-violator flags before they escalate into critical suspensions."
  },
  {
    title: "Strategic Resolution",
    description: "Diagnosing complex policy violations and structuring compliance plans that actually get accounts back online."
  },
  {
    title: "Compliance Strategy",
    description: "Navigating the gray areas of Amazon's Terms of Service to build your business on a stable foundation."
  }
];

const Approach: React.FC = () => {
  return (
    <section id="approach" className="py-24 md:py-32 bg-brand-black">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <Reveal className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-cream mb-4">The Approach</h2>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto"></div>
        </Reveal>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="group relative p-8 bg-brand-dark/30 border border-brand-charcoal hover:border-brand-gold/20 transition-all duration-500 ease-out hover:-translate-y-1"
            >
              {/* Hover Line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <h3 className="text-xl font-serif text-brand-cream mb-4 group-hover:text-brand-gold transition-colors duration-300">
                {pillar.title}
              </h3>
              <p className="text-brand-muted leading-relaxed font-light text-sm md:text-base">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Approach;