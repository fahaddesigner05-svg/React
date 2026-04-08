import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter } from 'lucide-react';

interface ProjectData {
  _id: string;
  title: string;
  category: string;
  img: string;
  images?: string[];
  coverImg?: string;
  color: string;
  description: string;
  videoLink?: string;
  showOnHome?: boolean;
}

const AllProjects: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const result = await response.json();
        if (result.success) {
          setProjects(result.data);
          setFilteredProjects(result.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let filtered = projects;
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    setFilteredProjects(filtered);
  }, [searchTerm, activeCategory, projects]);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-cyan-500 selection:text-white bg-cyber">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="text-sm font-black tracking-tighter">
            FAHAD<span className="text-cyan-400">MALIK</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4">All <span className="text-cyan-400">Projects</span></h1>
          <p className="text-gray-400 max-w-2xl">Explore my complete library of graphic design, UI/UX, and creative video projects.</p>
        </motion.div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                  ? 'bg-cyan-500 text-black border-cyan-500' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-cyan-400 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              const ytId = project.videoLink ? getYouTubeId(project.videoLink) : null;
              
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="group relative overflow-hidden rounded-3xl cursor-pointer bg-white/5 border border-white/10"
                >
                  <div className="h-64 relative overflow-hidden">
                    {ytId ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <i className="fab fa-youtube text-4xl text-red-600"></i>
                      </div>
                    ) : project.videoLink ? (
                      <video 
                        src={project.videoLink || undefined} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        muted
                        playsInline
                        onError={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.style.display = 'none';
                          const parent = video.parentElement;
                          if (parent) {
                            const img = document.createElement('img');
                            img.src = project.coverImg || project.img || 'https://picsum.photos/seed/error/800/600';
                            img.className = "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110";
                            img.referrerPolicy = "no-referrer";
                            parent.appendChild(img);
                          }
                        }}
                        onMouseOver={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                    ) : (
                      <img 
                        src={project.coverImg || project.img || undefined} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-400 text-black px-3 py-1 rounded-full">View Case Study</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2 block">{project.category}</span>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20 text-gray-500 italic">
            No projects found matching your criteria.
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProjects;
