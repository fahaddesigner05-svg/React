import React, { useState, useEffect } from 'react';
import { Download, Home, User, Briefcase, Code, Mail } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
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
    <>
      {/* Top Navbar (Desktop Only) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-4' : 'bg-transparent py-4 md:py-8'} hidden md:block`}>
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
        </div>
      </nav>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden w-[95%] max-w-[440px]">
        <div className="glass-panel px-4 py-4 rounded-3xl flex justify-between items-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex flex-col items-center justify-center transition-all duration-300 ${activeSection === item.id ? 'text-cyan-400 scale-110' : 'text-gray-400'}`}
              >
                <Icon className={`w-6 h-6 ${activeSection === item.id ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : ''}`} />
                {activeSection === item.id && (
                  <span className="w-1 h-1 bg-cyan-400 rounded-full mt-1 animate-pulse"></span>
                )}
              </button>
            );
          })}
          
          {/* CV Download Button */}
          <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
          <button
            onClick={handleDownloadCV}
            className="flex flex-col items-center justify-center text-purple-400 hover:text-cyan-400 transition-all duration-300 active:scale-90"
          >
            <Download className="w-6 h-6 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
