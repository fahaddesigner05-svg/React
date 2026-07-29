import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface ProjectData {
  _id: string;
  title: string;
  category: string;
  img: string;
  coverImg?: string;
  color?: string;
}

const DEFAULT_PROJECTS: ProjectData[] = [
  { _id: '1', title: 'Brand Identity', category: 'Branding', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' },
  { _id: '2', title: 'UI/UX App Design', category: 'UI/UX', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop' },
  { _id: '3', title: '3D Product Design', category: '3D Design', img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop' },
  { _id: '4', title: 'Dashboard System', category: 'Web App', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=400&auto=format&fit=crop' },
  { _id: '5', title: 'Social Media Kit', category: 'Graphics', img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=400&auto=format&fit=crop' },
  { _id: '6', title: 'Packaging Design', category: 'Print', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=400&auto=format&fit=crop' },
];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scrollIndicatorY = useTransform(scrollYProgress, [0, 0.05], [0, 20]);

  const [projects, setProjects] = useState<ProjectData[]>(DEFAULT_PROJECTS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            setProjects(result.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch projects in Hero:', err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const itemsToShow = 3;
  const visibleProjects = Array.from({ length: itemsToShow }).map((_, i) => {
    const idx = (currentIndex + i) % projects.length;
    return projects[idx];
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center px-6 lg:px-24 overflow-hidden pt-20 pb-24 md:pt-32 lg:pt-16 lg:pb-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-slate-950/85 z-0"></div>
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div>
            <h2 className="text-2xl font-light text-white mb-2">Hi, I'm</h2>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 whitespace-nowrap">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Fahad Malik
              </span>
            </h1>
            <motion.p 
              animate={{ 
                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="text-xl md:text-2xl text-white font-medium tracking-wide"
            >
              Graphic & UI UX Designer
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto px-8 py-4 bg-cyan-600/20 border-2 border-cyan-400 rounded-lg text-cyan-400 font-bold hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              View My Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-purple-600/20 border-2 border-purple-400 rounded-lg text-purple-400 font-bold hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Contact Me
            </button>
          </div>
        </div>

        {/* Right Side: Visual Library / Workstation Concept */}
        <div className="relative group animate-in fade-in zoom-in duration-1000 delay-200">
          <div className="relative w-full aspect-square md:aspect-[4/3] glass-panel rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl flex items-center justify-center p-4">
            {/* Inner "Library" Visuals */}
            <div className="w-full h-full relative rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                {/* Mock Workstation Screen UI */}
                <div className="absolute inset-0 flex flex-col p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Designer Console v2.0</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="group relative bg-gradient-to-br from-cyan-500/20 to-transparent rounded-xl border border-cyan-500/30 p-4 animate-pulse group-hover:animate-none transition-all duration-300 hover:border-cyan-400/80 hover:bg-cyan-500/20 overflow-hidden cursor-pointer">
                            {/* Default Lines State */}
                            <div className="transition-all duration-300 group-hover:opacity-0 group-hover:scale-95">
                                <div className="h-2 w-12 bg-cyan-400/50 rounded-full mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-gray-700 rounded-full"></div>
                                    <div className="h-1.5 w-3/4 bg-gray-700 rounded-full"></div>
                                    <div className="h-1.5 w-1/2 bg-gray-700 rounded-full"></div>
                                </div>
                            </div>

                            {/* Hover Text State */}
                            <div className="absolute inset-0 p-3 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900/95 backdrop-blur-sm border border-cyan-400/40 rounded-xl">
                                <p className="text-xs font-bold text-cyan-300 leading-tight">
                                    Hello, I'm Fahad Malik! 👋
                                </p>
                                <p className="text-[10px] text-gray-300 mt-1 leading-normal font-medium">
                                    Creative UI/UX & Brand Designer crafting modern digital experiences.
                                </p>
                            </div>
                        </div>
                        <div className="group relative bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl border border-purple-500/30 p-4 hover:border-purple-400/80 hover:bg-purple-500/20 overflow-hidden cursor-pointer transition-all duration-300">
                            {/* Default Spinner State */}
                            <div className="transition-all duration-300 group-hover:opacity-0 group-hover:scale-95">
                                <div className="h-2 w-12 bg-purple-400/50 rounded-full mb-4"></div>
                                <div className="flex justify-center items-center h-20">
                                    <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                                </div>
                            </div>

                            {/* Hover Image State */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900/95 backdrop-blur-sm border border-purple-400/40 rounded-xl overflow-hidden flex items-center justify-center p-1">
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                                    alt="Design Showcase"
                                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                                    <span className="text-[9px] font-bold text-purple-200 font-mono tracking-wider uppercase">
                                        Creative Showcase
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 bg-slate-800/50 rounded-xl border border-white/5 p-3 overflow-hidden">
                             <div className="flex justify-between items-center mb-2">
                               <div className="text-[10px] font-mono text-cyan-400">// Active Projects</div>
                               <div className="flex items-center space-x-1.5">
                                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                                 <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Auto Cycling</span>
                               </div>
                             </div>
                             <div className="grid grid-cols-3 gap-2">
                               <AnimatePresence mode="popLayout">
                                 {visibleProjects.map((project, i) => {
                                   const imgSrc = project.coverImg || project.img;
                                   return (
                                     <motion.div
                                       key={`${project._id || project.title}-${(currentIndex + i) % projects.length}`}
                                       initial={{ opacity: 0, scale: 0.9, y: 8 }}
                                       animate={{ opacity: 1, scale: 1, y: 0 }}
                                       exit={{ opacity: 0, scale: 0.9, y: -8 }}
                                       transition={{ duration: 0.4, ease: "easeInOut" }}
                                       onClick={() => {
                                         if (project._id && !project._id.match(/^[1-6]$/)) {
                                           navigate(`/project/${project._id}`);
                                         } else {
                                           scrollToSection('projects');
                                         }
                                       }}
                                       className="group relative h-14 bg-gray-900/90 rounded-md border border-white/10 overflow-hidden cursor-pointer hover:border-cyan-400/60 transition-all shadow-md"
                                     >
                                       {imgSrc ? (
                                         <img
                                           src={imgSrc}
                                           alt={project.title}
                                           className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                                         />
                                       ) : (
                                         <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                           <i className="fas fa-cube text-xs text-cyan-400/50"></i>
                                         </div>
                                       )}
                                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-1.5">
                                         <span className="text-[8.5px] font-bold text-white truncate leading-tight group-hover:text-cyan-300 transition-colors">
                                           {project.title}
                                         </span>
                                         <span className="text-[7px] text-cyan-400/80 font-mono truncate">
                                           {project.category}
                                         </span>
                                       </div>
                                     </motion.div>
                                   );
                                 })}
                               </AnimatePresence>
                             </div>
                        </div>
                    </div>
                </div>
                
                {/* Visual Decoration mirroring the image */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/30 blur-3xl"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/30 blur-3xl"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 glass-panel rounded-2xl border border-purple-400/50 flex items-center justify-center animate-float shadow-xl">
               <i className="fas fa-palette text-3xl text-purple-400"></i>
            </div>
            <div className="absolute -bottom-6 left-12 px-6 py-3 glass-panel rounded-full border border-cyan-400/50 flex items-center space-x-3 animate-float [animation-delay:1.5s] shadow-xl">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
               <span className="text-xs font-bold text-cyan-400 uppercase">Interactive Design Mode</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hero;
