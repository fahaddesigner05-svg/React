import React from 'react';
import { motion } from 'motion/react';

export default function TextDivider() { 
  return (
    <div className="w-full overflow-hidden py-10 bg-[#0b0c10] border-y border-white/5 relative flex items-center group">
      <motion.div 
        className="whitespace-nowrap flex"
        animate={{ x: [0, -1035] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[120px] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white/5 to-white/10 uppercase tracking-tighter mx-8 select-none transition-colors duration-300 group-hover:bg-none">
            <span className="transition-colors duration-300 group-hover:text-purple-500">FAHAD</span>{' '}
            <span className="transition-colors duration-300 group-hover:text-cyan-400">MALIK</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
