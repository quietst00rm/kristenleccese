import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../ui/Reveal';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-32 bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          {/* Image Column */}
          <div className="md:col-span-5 relative group">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               viewport={{ once: true }}
               className="relative z-10 aspect-[3/4] overflow-hidden bg-brand-charcoal"
             >
                <div className="absolute inset-0 border border-brand-gold/10 z-20 transition-all duration-700 group-hover:border-brand-gold/30"></div>
                <img
                  src="/images/Kristen-Leccese-Amazon-Expert-Consultant.png"
                  alt="Kristen Leccese"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity transition-transform duration-1000 group-hover:scale-105"
                />
             </motion.div>
             {/* Decorative offset border */}
             <motion.div 
               initial={{ opacity: 0, x: -20, y: 20 }}
               whileInView={{ opacity: 1, x: 0, y: 0 }}
               transition={{ delay: 0.3, duration: 1 }}
               viewport={{ once: true }}
               className="absolute -bottom-6 -left-6 w-full h-full border border-brand-subtle z-0 hidden md:block"
             />
          </div>

          {/* Text Column */}
          <div className="md:col-span-7 md:pl-12 pt-8 md:pt-0">
            <Reveal>
              <span className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase block mb-6">
                Since 2013
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-6 text-brand-muted text-lg leading-relaxed">
                <p>
                  I've spent over a decade in the trenches of the Amazon marketplace. Not watching from the sidelines—operating accounts, managing crises, and navigating the dirty side of competitor attacks so my clients don't have to.
                </p>
                <p>
                  Amazon is a data company first and a retailer second. That distinction changes everything about how you must manage your business to survive. I understood this early. It's why I'm still here when others have burned out or moved on.
                </p>
                <p>
                  My work is diagnostic. While generative AI can write a generic appeal letter, it cannot identify the complex operational failures that triggered a suspension in the first place. If you can't accurately diagnose the problem, you can't fix it. I dig into the data, find the true root cause, and build resolution strategies that satisfy Amazon's internal teams—not just their automated systems.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-12 pt-8 border-t border-brand-charcoal">
                <p className="font-serif text-2xl md:text-3xl text-brand-cream italic">
                  "I don't promise magic. I promise radical honesty and a battle-tested approach."
                </p>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;