import React from 'react';
import { motion } from 'motion/react';

export default function TextDivider() { 
  return (
    <div className="w-full overflow-hidden py-10 bg-transparent border-y border-white/5 relative flex items-center group/container">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-1035px); }
        }
        .animate-divider {
          animation: scroll 8s linear infinite;
        }
      `}</style>
      <div className="whitespace-nowrap flex animate-divider group-hover/container:[animation-play-state:paused]">
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className={`text-[120px] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white/5 to-white/10 uppercase tracking-tighter mx-8 select-none transition-all duration-300 hover:bg-none ${
              i % 2 === 0 ? 'hover:text-cyan-400' : 'hover:text-purple-500'
            }`}
          >
            FAHAD MALIK
          </span>
        ))}
      </div>
    </div>
  );
}
