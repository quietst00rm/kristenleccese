import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Point3D { x: number; y: number; z: number; }
interface Edge { start: number; end: number; }
interface Shape3D {
  vertices: Point3D[];
  edges: Edge[];
  position: Point3D;
  rotation: Point3D;
  rotationSpeed: Point3D;
  scale: number;
}

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // --- GEOMETRY SETUP ---
    
    // Helper to create regular shapes
    const createCube = (): { vertices: Point3D[], edges: Edge[] } => {
      const v = [];
      for(let i=0; i<8; i++) {
        v.push({
          x: (i & 1) ? 1 : -1,
          y: (i & 2) ? 1 : -1,
          z: (i & 4) ? 1 : -1
        });
      }
      const e = [
        {start:0,end:1}, {start:1,end:3}, {start:3,end:2}, {start:2,end:0}, // Front
        {start:4,end:5}, {start:5,end:7}, {start:7,end:6}, {start:6,end:4}, // Back
        {start:0,end:4}, {start:1,end:5}, {start:2,end:6}, {start:3,end:7}  // Connecting
      ];
      return { vertices: v, edges: e };
    };

    const createOctahedron = () => {
      const v = [
        {x:0, y:1, z:0}, {x:0, y:-1, z:0}, 
        {x:1, y:0, z:0}, {x:-1, y:0, z:0}, {x:0, y:0, z:1}, {x:0, y:0, z:-1}
      ];
      const e = [
        {start:0,end:2}, {start:0,end:3}, {start:0,end:4}, {start:0,end:5}, // Top pyramid
        {start:1,end:2}, {start:1,end:3}, {start:1,end:4}, {start:1,end:5}, // Bottom pyramid
        {start:2,end:4}, {start:4,end:3}, {start:3,end:5}, {start:5,end:2}  // Equator
      ];
      return { vertices: v, edges: e };
    };

    const createTetrahedron = () => {
      const v = [
        {x:1, y:1, z:1}, {x:-1, y:-1, z:1}, {x:-1, y:1, z:-1}, {x:1, y:-1, z:-1}
      ];
      const e = [
        {start:0,end:1}, {start:0,end:2}, {start:0,end:3},
        {start:1,end:2}, {start:2,end:3}, {start:3,end:1}
      ];
      return { vertices: v, edges: e };
    };

    // Instantiate Shapes
    const shapes: Shape3D[] = [
      { 
        ...createOctahedron(), 
        position: { x: -width * 0.3, y: -height * 0.2, z: 400 }, 
        rotation: { x: 0, y: 0, z: 0 }, 
        rotationSpeed: { x: 0.002, y: 0.003, z: 0.001 },
        scale: 80 
      },
      { 
        ...createCube(), 
        position: { x: width * 0.35, y: height * 0.3, z: 500 }, 
        rotation: { x: 0, y: 0, z: 0 }, 
        rotationSpeed: { x: -0.002, y: 0.002, z: -0.001 },
        scale: 60 
      },
      { 
        ...createTetrahedron(), 
        position: { x: -width * 0.25, y: height * 0.35, z: 300 }, 
        rotation: { x: 0, y: 0, z: 0 }, 
        rotationSpeed: { x: 0.003, y: -0.001, z: 0.002 },
        scale: 50 
      },
      { 
        ...createOctahedron(), 
        position: { x: width * 0.2, y: -height * 0.3, z: 600 }, 
        rotation: { x: 0, y: 0, z: 0 }, 
        rotationSpeed: { x: 0.001, y: -0.003, z: 0.001 },
        scale: 90 
      }
    ];

    // Particles
    const particleCount = 150;
    const particles: {x: number, y: number, z: number, size: number, alpha: number}[] = [];
    
    for(let i=0; i<particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * 1000 + 200, // Depth
        size: Math.random() * 2,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    // --- ANIMATION LOOP ---

    const rotatePoint = (p: Point3D, r: Point3D): Point3D => {
      // Rotate X
      let y = p.y * Math.cos(r.x) - p.z * Math.sin(r.x);
      let z = p.y * Math.sin(r.x) + p.z * Math.cos(r.x);
      let x = p.x;
      
      // Rotate Y
      let z2 = z * Math.cos(r.y) - x * Math.sin(r.y);
      let x2 = z * Math.sin(r.y) + x * Math.cos(r.y);
      
      // Rotate Z
      let x3 = x2 * Math.cos(r.z) - y * Math.sin(r.z);
      let y3 = x2 * Math.sin(r.z) + y * Math.cos(r.z);
      
      return { x: x3, y: y3, z: z2 };
    };

    const project = (p: Point3D, focalLength: number = 800): {x: number, y: number, scale: number} => {
      const scale = focalLength / (focalLength + p.z);
      return {
        x: p.x * scale + width / 2,
        y: p.y * scale + height / 2,
        scale: scale
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Draw Particles
      ctx.fillStyle = '#C9A962';
      particles.forEach(p => {
        // Parallax
        const parallaxX = -mouseX * (p.z * 0.05);
        const parallaxY = -mouseY * (p.z * 0.05);
        
        // Simple projection for particles
        const proj = project({x: p.x + parallaxX, y: p.y + parallaxY, z: p.z});
        
        ctx.globalAlpha = p.alpha * (proj.scale * 0.8); // Fade distant
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Shapes
      ctx.strokeStyle = '#C9A962';
      ctx.lineWidth = 1;

      shapes.forEach(shape => {
        // Update rotation
        shape.rotation.x += shape.rotationSpeed.x;
        shape.rotation.y += shape.rotationSpeed.y;
        shape.rotation.z += shape.rotationSpeed.z;

        // Calculate Parallax position
        const parallaxX = -mouseX * (shape.position.z * 0.1);
        const parallaxY = -mouseY * (shape.position.z * 0.1);

        const currentPos = {
            x: shape.position.x + parallaxX,
            y: shape.position.y + parallaxY,
            z: shape.position.z
        };

        // Project vertices
        const projectedVerts = shape.vertices.map(v => {
          // Scale first
          const scaled = { x: v.x * shape.scale, y: v.y * shape.scale, z: v.z * shape.scale };
          // Rotate
          const rotated = rotatePoint(scaled, shape.rotation);
          // Translate to position
          const translated = { 
            x: rotated.x + currentPos.x, 
            y: rotated.y + currentPos.y, 
            z: rotated.z + currentPos.z 
          };
          // Project to 2D
          return project(translated);
        });

        // Draw Edges
        ctx.globalAlpha = 0.15; // Very subtle wireframe
        ctx.beginPath();
        shape.edges.forEach(edge => {
          const start = projectedVerts[edge.start];
          const end = projectedVerts[edge.end];
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
        });
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Update shape baseline positions based on new dimensions to keep them centered/spread
      shapes[0].position = { x: -width * 0.3, y: -height * 0.2, z: 400 };
      shapes[1].position = { x: width * 0.35, y: height * 0.3, z: 500 };
      shapes[2].position = { x: -width * 0.25, y: height * 0.35, z: 300 };
      shapes[3].position = { x: width * 0.2, y: -height * 0.3, z: 600 };
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize -1 to 1
      targetMouseX = (e.clientX / width) * 2 - 1;
      targetMouseY = (e.clientY / height) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial resize to set positions
    handleResize();
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="hero" ref={ref} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-brand-black">
      {/* 3D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      
      {/* Background Ambience / Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-brand-charcoal/10 to-brand-black/90 z-0 pointer-events-none" />
      
      {/* Parallax Content */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-cream tracking-tight mb-6"
        >
          KRISTEN LECCESE
        </motion.h1>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-[1px] bg-brand-gold/50 mx-auto mb-8"
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-xl text-brand-muted tracking-wide font-light max-w-2xl mx-auto leading-relaxed"
        >
          Strategic Compliance for Amazon's Most Complex Challenges
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 cursor-pointer z-20"
        onClick={() => {
          document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-muted">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-brand-gold opacity-70" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;