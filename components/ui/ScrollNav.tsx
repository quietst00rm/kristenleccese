import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'hero', label: 'Home' },
  { id: 'problem', label: 'The Problem' },
  { id: 'about', label: 'About' },
  { id: 'approach', label: 'Approach' },
  { id: 'contact', label: 'Contact' }
];

const ScrollNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Active when element is in middle 20% of screen
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 items-end pointer-events-auto hidden md:flex">
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const isHovered = hoveredSection === section.id;

        return (
          <div
            key={section.id}
            className="relative flex items-center justify-end group cursor-pointer p-2 -mr-2"
            onClick={() => scrollToSection(section.id)}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Label */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: -16 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-full whitespace-nowrap text-xs uppercase tracking-widest text-brand-gold font-medium"
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Indicator Dot */}
            <motion.div
              animate={{
                scale: isActive ? 1.5 : 1,
                backgroundColor: isActive ? '#C9A962' : '#9CA3AF',
                opacity: isActive ? 1 : 0.3
              }}
              transition={{ duration: 0.3 }}
              className="w-1.5 h-1.5 rounded-full group-hover:bg-brand-gold group-hover:opacity-80 transition-colors"
            />
          </div>
        );
      })}
    </nav>
  );
};

export default ScrollNav;