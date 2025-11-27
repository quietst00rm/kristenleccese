import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import About from './components/sections/About';
import Approach from './components/sections/Approach';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';
import ScrollNav from './components/ui/ScrollNav';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream antialiased selection:bg-brand-gold/30 selection:text-brand-gold">
      
      {/* Custom Cursor Glow Effect - Subtle Ambient Light following mouse */}
      <div 
        className="cursor-glow hidden md:block"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* Navigation Dots */}
      <ScrollNav />

      <main className="relative z-10">
        <Hero />
        <Problem />
        <About />
        <Approach />
        <Testimonials />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;