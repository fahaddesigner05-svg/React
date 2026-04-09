import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Download } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setIsOpen(false);
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'auto'
      });
    }
  };

  const handleDownloadCV = () => {
    window.open('https://drive.google.com/uc?id=1hVgkkh3MNUKamh7wDNt_i-kDQxY2cShQ&export=download', '_blank');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'glass-panel py-4' : 'bg-transparent py-4 md:py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => scrollTo('home')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/30">F</div>
          <span className="text-xl font-black tracking-tighter">FAHAD</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-sm font-bold tracking-widest uppercase transition-colors relative ${activeSection === item.id ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-cyan-400 rounded-full animate-in fade-in zoom-in duration-300"></span>
              )}
            </button>
          ))}
        </div>

        <button 
            className="hidden lg:flex items-center space-x-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all"
            onClick={handleDownloadCV}
        >
          <Download className="w-4 h-4" />
          <span>Download CV</span>
        </button>
        
        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2 z-[110]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden bg-black flex flex-col"
          >
            {/* Header inside menu to ensure logo/close are always visible on black */}
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/20">F</div>
                <span className="text-xl font-black tracking-tighter text-white">FAHAD</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white p-2">
                <X size={32} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col px-10 py-12 space-y-10 flex-1 overflow-y-auto items-start text-left">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => scrollTo(item.id)}
                  className={`text-5xl font-black tracking-tighter uppercase transition-all duration-300 relative ${activeSection === item.id ? 'text-cyan-400' : 'text-white/70 hover:text-white'}`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.span 
                      layoutId="activeTabMobile"
                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-10 bg-cyan-400 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
              
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center space-x-3 w-full max-w-[260px] py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-bold text-lg mt-10 shadow-2xl shadow-cyan-500/30 active:scale-95 transition-transform"
                onClick={handleDownloadCV}
              >
                <Download size={24} />
                <span>Download CV</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
