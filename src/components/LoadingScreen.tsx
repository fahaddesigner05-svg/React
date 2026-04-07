import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowName(true), 1000);
    const timer2 = setTimeout(() => setIsVisible(false), 2500);

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
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-[#0b0c10] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Ambience */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.8 
              }}
              className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-5xl text-white shadow-[0_0_40px_rgba(34,211,238,0.3)] mb-8"
            >
              F
            </motion.div>

            {/* Name Animation */}
            <div className="h-12 flex items-center justify-center">
              <AnimatePresence>
                {showName && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center"
                  >
                    <span className="text-4xl font-black tracking-[0.2em] text-white">
                      FAHAD
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Loading Bar */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="mt-12 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full relative overflow-hidden"
            >
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/40"
              />
            </motion.div>
          </div>

          {/* Decorative Particles (Static for simple loading) */}
          <div className="absolute bottom-10 text-[10px] uppercase font-bold tracking-[0.5em] text-gray-500 animate-pulse">
            Initializing Experience
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
