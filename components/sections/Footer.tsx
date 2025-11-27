import React from 'react';
import { Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-brand-black border-t border-brand-charcoal/30">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-brand-muted font-serif italic text-lg">
          Kristen Leccese
        </div>
        
        <div className="text-xs text-brand-muted/50 uppercase tracking-widest text-center">
          &copy; {new Date().getFullYear()} Kristen Leccese. All Rights Reserved.
        </div>

        <div>
          <a 
            href="https://www.linkedin.com/in/kristenmichelleleccese/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-muted hover:text-brand-gold transition-colors p-2 block"
            aria-label="LinkedIn"
          >
            <Linkedin strokeWidth={1.5} size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;