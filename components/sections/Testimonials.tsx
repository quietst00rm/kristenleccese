import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../ui/Reveal';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-brand-black relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
        
        <div className="space-y-24">
          <Reveal>
            <div className="relative">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl text-brand-gold/10 font-serif">"</span>
              <blockquote className="relative z-10">
                <p className="text-2xl md:text-4xl font-serif text-brand-cream italic leading-tight mb-8">
                  "Kristen solved in 48 hours what our legal team couldn't fix in 4 months."
                </p>
                <cite className="block text-xs md:text-sm text-brand-gold uppercase tracking-[0.2em] not-italic">
                  — Michael R., 8-Figure Seller
                </cite>
              </blockquote>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl text-brand-gold/10 font-serif">"</span>
              <blockquote className="relative z-10">
                <p className="text-2xl md:text-4xl font-serif text-brand-cream italic leading-tight mb-8">
                  "The only person I trust with our account health. Her diagnostic approach is surgical."
                </p>
                <cite className="block text-xs md:text-sm text-brand-gold uppercase tracking-[0.2em] not-italic">
                  — Sarah M., Global Brand Director
                </cite>
              </blockquote>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;