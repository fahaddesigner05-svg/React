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
    // Replace with actual link to your CV file
    alert("CV downloading feature initiated!");
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
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0b0c10]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left text-lg font-black tracking-widest uppercase transition-colors ${activeSection === item.id ? 'text-cyan-400' : 'text-gray-400'}`}
                >
                  {item.label}
                </button>
              ))}
              <button 
                className="flex items-center justify-center space-x-2 w-full py-4 bg-cyan-600/20 border border-cyan-400 rounded-xl text-cyan-400 font-bold"
                onClick={handleDownloadCV}
              >
                <Download size={18} />
                <span>Download CV</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
