import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowName(true), 1200);
    const timer2 = setTimeout(() => setIsVisible(false), 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.5,
            filter: "blur(20px)",
            transition: { duration: 1, ease: [0.7, 0, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#0b0c10] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Ambience */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
          
          <div className="relative flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="w-32 h-32 flex items-center justify-center mb-6"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <defs>
                  <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <g fill="url(#loader-grad)">
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M30 50 L15 50 L40 15 L95 15 L80 35 L50 35 Z" 
                  />
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    d="M45 85 L30 85 L55 50 L85 50 L70 70 L60 70 Z" 
                  />
                </g>
              </svg>
            </motion.div>

            {/* Name Animation */}
            <div className="h-16 flex items-center justify-center overflow-hidden">
              <AnimatePresence>
                {showName && (
                  <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-5xl font-black tracking-[0.3em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      FAHAD
                    </span>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0b0c10_100%)] pointer-events-none"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
