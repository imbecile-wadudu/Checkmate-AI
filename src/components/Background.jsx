import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Mesh Gradient / Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[60px]"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -150, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-secondary/10 rounded-full blur-[80px]"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 rounded-full blur-[50px]"
        style={{ willChange: 'transform' }}
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
    </div>
  );
};

export default Background;
