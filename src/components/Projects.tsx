import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const result = await response.json();
          if (result.success) {
            const featuredProjects = result.data
              .filter((p: ProjectData) => p.showOnHome)
              .slice(0, 6);
            setProjects(featuredProjects);
          } else {
            throw new Error(result.error || 'Failed to fetch projects');
          }
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("Invalid server response. Check Vercel logs.");
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (videoLink?: string) => {
    // Increment click count
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'clicks' }),
    }).catch(err => console.error('Analytics error:', err));

    const isEmbedded = !!videoLink;

    if (videoLink && !isEmbedded) {
      window.open(videoLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-red-400 font-bold mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-cyan-600/20 border border-cyan-400 rounded-lg text-cyan-400"
        >
          Retry
        </button>
      </div>
    );
  }

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="container mx-auto px-6">
      <style>{`
        iframe, video {
          cursor: auto !important;
        }
      `}</style>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-2">Portfolio</h3>
          <h2 className="text-4xl md:text-5xl font-black">Featured Projects</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.length > 0 ? (
          projects.map((project, idx) => {
            const mainVideo = project.videoLinks?.[0] || project.videoLink;
            const ytId = mainVideo ? getYouTubeId(mainVideo) : null;
            
            return (
              <div 
                key={project._id} 
                onClick={() => handleProjectClick(mainVideo)}
                className="group relative overflow-hidden rounded-3xl cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                {ytId ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0`}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : mainVideo ? (
                  <video 
                    src={mainVideo || undefined} 
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.style.display = 'none';
                      const parent = video.parentElement;
                      if (parent) {
                        const img = document.createElement('img');
                        img.src = project.coverImg || project.img || 'https://picsum.photos/seed/error/800/600';
                        img.className = "w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110";
                        img.referrerPolicy = "no-referrer";
                        parent.appendChild(img);
                      }
                    }}
                  />
                ) : (
                  <img 
                    src={project.coverImg || project.img || undefined} 
                    alt={project.title}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-900/40 px-3 py-1 rounded-full mb-3 inline-block">
                    {project.category}
                  </span>
                  <h4 className="text-3xl font-bold text-white mb-2 group-hover:text-white transition-all duration-500">{project.title}</h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project/${project._id}`);
                    }}
                    className="mt-4 flex items-center space-x-3 group/btn"
                  >
                    <div className="px-6 py-2.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm group-hover/btn:border-cyan-400 group-hover/btn:bg-cyan-400/10 transition-all duration-300 flex items-center space-x-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 group-hover/btn:text-white transition-colors">Case Study</span>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-cyan-400 group-hover/btn:text-black transition-all duration-300">
                        <i className="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-0.5 transition-transform"></i>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Hover Accent Glow */}
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] pointer-events-none transition-colors duration-500 ${idx % 2 === 0 ? 'bg-cyan-500/0 group-hover:bg-cyan-500/40' : 'bg-purple-500/0 group-hover:bg-purple-500/40'}`}></div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-20 text-gray-500">
            <p className="mb-4 italic">No projects found. Add some to your database!</p>
            <p className="text-xs opacity-60">Tip: You can seed sample data from the Admin Dashboard.</p>
          </div>
        )}
      </div>

      <div className="mt-16 flex justify-center">
        <button 
          onClick={() => navigate('/projects')}
          className="px-8 py-4 bg-cyan-600/20 border-2 border-cyan-400 rounded-full text-cyan-400 font-bold tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 group"
        >
          <span>View All Work</span>
          <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

export default Projects;
