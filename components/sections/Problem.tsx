import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../ui/Reveal';

const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-16 md:py-40 bg-brand-black relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight text-brand-cream mb-12 text-center">
            Amazon isn't just a marketplace—<br />
            it's a <span className="italic text-[#c9aa62]">battlefield.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="space-y-8 text-lg md:text-xl text-brand-muted font-light leading-relaxed border-l border-brand-charcoal pl-8 md:pl-12">
            <p>
              Human nuance versus automated enforcement. A trillion-dollar algorithm that doesn't understand the context of your business, your inventory, or your intent.
            </p>
            <p>
              Most sellers don't fail because of bad products. They fail because of invisible roadblocks—vague compliance flags, competitor sabotage, catalog glitches, and suspension notices that no AI tool or template can solve.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Problem;