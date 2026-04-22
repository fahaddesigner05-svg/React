import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Globe, Code, Layers, Layout, User, Calendar, Star, Send, MessageSquare } from 'lucide-react';
import { SiFigma, SiCanva, SiSketch, SiInvision, SiFramer, SiReact, SiWordpress, SiElementor, SiWebflow, SiWix, SiShopify } from 'react-icons/si';
import { DiPhotoshop, DiIllustrator } from 'react-icons/di';

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
  videoLinks?: string[];
  createdAt: string;
  role?: string;
  timeline?: string;
  goals?: string[];
  techStack?: { name: string; iconType: string }[];
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', message: '' });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      alert('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: id,
          ...feedbackData,
          rating,
          message: `[Feedback for ${project?.title}]: ${feedbackData.message}`
        }),
      });
      if (response.ok) {
        setFeedbackSubmitted(true);
        setTimeout(() => setShowFeedbackPopup(false), 2000);
      }
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!scrollContainerRef.current || isHovering || loading || error || !project) return;

    let animationFrameId: number;
    const scrollContainer = scrollContainerRef.current;

    const scrollStep = () => {
      if (scrollContainer) {
        scrollContainer.scrollTop += 1;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering, loading, error, project]);

  const getIcon = (name: string, type: string) => {
    const lowerName = name.toLowerCase();
    // @ts-ignore
    if (lowerName.includes('photoshop')) return <DiPhotoshop className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('figma')) return <SiFigma className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('illustrator') || lowerName.includes('illustrater')) return <DiIllustrator className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('canva')) return <SiCanva className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('sketch')) return <SiSketch className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('invision')) return <SiInvision className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('framer')) return <SiFramer className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('react')) return <SiReact className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('wordpress')) return <SiWordpress className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('elementor')) return <SiElementor className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('webflow')) return <SiWebflow className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('wix')) return <SiWix className="w-4 h-4" />;
    // @ts-ignore
    if (lowerName.includes('shopify')) return <SiShopify className="w-4 h-4" />;

    switch (type) {
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'Layout': return <Layout className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Code': return <Code className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const foundProject = result.data.find((p: ProjectData) => String(p._id) === String(id));
          if (foundProject) {
            setProject(foundProject);
          } else {
            throw new Error('Project not found in database');
          }
        } else {
          throw new Error(result.error || 'Failed to fetch projects');
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0b0c10] flex items-center justify-center z-[200]">
        <div className="text-cyan-400 font-bold animate-pulse">Loading Project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="fixed inset-0 bg-[#0b0c10] flex flex-col items-center justify-center p-6 text-center z-[200]">
        <p className="text-red-400 font-bold mb-4">Error: {error || 'Project not found'}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-cyan-600/20 border border-cyan-400 rounded-lg text-cyan-400 font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0b0c10] text-white selection:bg-cyan-500 selection:text-white z-[100] flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden scrollbar-hide">
      {/* Global Background Mesh Gradient & Grain */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Mesh Glows */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-cyan-500/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute top-[10%] -right-[20%] w-[60%] h-[80%] bg-indigo-600/[0.12] rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-[20%] left-[10%] w-[80%] h-[50%] bg-cyan-600/[0.05] rounded-full blur-[130px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-indigo-500/[0.05] rounded-full blur-[100px]"></div>
        
        {/* Noise Overlay for Premium Texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        iframe, video {
          cursor: auto !important;
        }
      `}</style>
      
      {/* Close Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-4 right-4 lg:top-8 lg:right-8 z-[150] w-10 h-10 lg:w-12 lg:h-12 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-full flex items-center justify-center text-white hover:bg-red-500/20 hover:scale-110 transition-all duration-300 group"
      >
        <X className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Left Column: Project Info */}
      <div className="w-full lg:w-[45%] h-auto lg:h-full overflow-y-visible lg:overflow-y-auto p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/5 scrollbar-hide relative bg-transparent z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto lg:mx-0 relative z-10 flex flex-col min-h-full"
        >
          {/* Category Tag */}
          <div 
            onClick={() => navigate('/projects', { state: { category: project.category } })}
            className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-gradient-to-r from-cyan-400/10 to-purple-500/10 border border-white/10 backdrop-blur-md shadow-lg w-fit relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] relative z-10">
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-[1.1] tracking-tighter uppercase text-white">
            {project.title}
          </h1>

          {/* Role & Timeline Grid */}
          <div className="relative mb-16 p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/20 backdrop-blur-md shadow-2xl group overflow-hidden">
            {/* Animated Background Glow - Now Permanent */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[80px] transition-all duration-700"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[80px] transition-all duration-700"></div>
            
            {/* Corner Accents - Now Permanent */}
            <div className="absolute top-0 left-0 w-full h-full border-t-[3px] border-l-[3px] border-cyan-400 rounded-2xl transition-all duration-700"></div>
            <div className="absolute bottom-0 right-0 w-full h-full border-b-[3px] border-r-[3px] border-purple-400 rounded-2xl transition-all duration-700"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
              <div className="group/item cursor-default">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-3 h-3 text-cyan-400 transition-colors duration-300" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 transition-colors duration-300">Role</h3>
                </div>
                <div className="relative inline-block">
                  <p className="text-cyan-400 font-black text-xl tracking-tighter uppercase transition-colors duration-300">
                    {project.role || 'Lead Designer'}
                  </p>
                  <div 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-cyan-400/30"
                  />
                </div>
              </div>
              <div className="group/item cursor-default">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-3 h-3 text-purple-400 transition-colors duration-300" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 transition-colors duration-300">Timeline</h3>
                </div>
                <div className="relative inline-block">
                  <p className="text-purple-400 font-black text-xl tracking-tighter uppercase transition-colors duration-300">
                    {project.timeline || (project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2026')}
                  </p>
                  <div 
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-400/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="mb-16">
            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-6">Project Overview</h3>
            <div 
              className="text-white leading-relaxed text-lg font-medium tracking-tight description-content-v2"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>

          {/* Project Goals */}
          {project.goals && project.goals.length > 0 && (
            <div className="mb-16">
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-purple-400 mb-6">Project Goals</h3>
              <div className="space-y-4">
                {project.goals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-4 text-gray-300 text-sm font-bold group">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0 transition-transform duration-300"></div>
                    <p className="group-hover:text-white transition-colors duration-300">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-16">
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-6">Design Stack</h3>
              <div className="flex flex-wrap gap-4">
                {project.techStack.map((tech, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300"
                  >
                    {getIcon(tech.name, tech.iconType)}
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-8">
            <button 
              onClick={() => navigate('/projects')}
              className="flex items-center justify-center space-x-4 w-full py-6 bg-cyan-600/20 border-2 border-cyan-400 text-cyan-400 font-black rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-[1.02] group"
            >
              <span className="uppercase tracking-widest text-sm">View All Work</span>
              <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Project Media */}
      <div 
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="w-full lg:w-[55%] h-auto lg:h-full overflow-y-visible lg:overflow-y-auto scrollbar-hide bg-transparent z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col min-h-full"
        >
          {/* Main Media Section */}
          <div className="w-full flex flex-col items-center">
            {/* Handle Legacy Single Video Link */}
            {project.videoLink && (
              <div className="w-full mb-0 overflow-hidden">
                {(() => {
                  const ytId = getYouTubeId(project.videoLink);
                  if (ytId) {
                    return (
                      <div className="aspect-video w-full">
                        <iframe 
                          src={`https://www.youtube.com/embed/${ytId}`}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  }
                  return (
                    <video 
                      src={project.videoLink} 
                      className="w-full h-auto"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    />
                  );
                })()}
              </div>
            )}

            {/* Handle Multiple Video Links */}
            {project.videoLinks && project.videoLinks.filter(v => v && v.trim() !== '').map((vLink, vIdx) => (
              <div key={`v-${vIdx}`} className="w-full mb-0 overflow-hidden">
                {(() => {
                  const ytId = getYouTubeId(vLink);
                  if (ytId) {
                    return (
                      <div className="aspect-video w-full">
                        <iframe 
                          src={`https://www.youtube.com/embed/${ytId}`}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  }
                  return (
                    <video 
                      src={vLink} 
                      className="w-full h-auto"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    />
                  );
                })()}
              </div>
            ))}

            {/* Main Cover Image (Only if no videos or specifically set) */}
            {(!project.videoLink && (!project.videoLinks || project.videoLinks.length === 0)) && (project.coverImg || project.img) && (
              <div 
                className="w-full cursor-zoom-in"
                onClick={() => setSelectedImage(project.coverImg || project.img)}
              >
                <img 
                  src={project.coverImg || project.img || undefined} 
                  alt={project.title}
                  className="w-full h-auto transition-transform duration-700 hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Gallery Images */}
          {project.images && project.images
            .filter(img => img && img.trim() !== '' && img !== (project.coverImg || project.img))
            .map((img, idx) => (
            <div
              key={idx}
              className="w-full overflow-hidden group cursor-zoom-in"
              onClick={() => setSelectedImage(img)}
            >
              <img 
                src={img} 
                alt={`${project.title} - view ${idx + 1}`} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}

          {/* THANKS FOR WATCHING - Single Horizontal Line */}
          <div className="mt-auto py-20 flex items-center justify-center border-t border-white/5 px-4">
            <p className="text-cyan-400 hover:text-purple-400 font-black uppercase tracking-[0.4em] lg:tracking-[1.2em] text-[10px] lg:text-[11px] text-center transition-colors duration-700 cursor-default">
              THANKS FOR WATCHING
            </p>
          </div>
        </motion.div>
      </div>

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowFeedbackPopup(false)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-panel rounded-3xl border-white/10 overflow-hidden flex flex-col max-h-[90vh] cursor-default"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none z-0"></div>

            {/* Fixed Close Button */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowFeedbackPopup(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 shadow-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 relative z-10">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 lg:mb-6">
                <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-cyan-400" />
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">Share Your Feedback</h3>
              <p className="text-gray-400 text-xs lg:text-sm mb-6 lg:mb-8">We'd love to hear your thoughts on this case study!</p>

              {feedbackSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-green-400 fill-green-400" />
                  </div>
                  <p className="text-white font-medium">Thank you for your feedback!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                    <input 
                      type="text" 
                      required
                      value={feedbackData.name}
                      onChange={(e) => setFeedbackData({...feedbackData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                    <input 
                      type="email" 
                      required
                      value={feedbackData.email}
                      onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Rating</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-600'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Review / Feedback</label>
                    <textarea 
                      required
                      value={feedbackData.message}
                      onChange={(e) => setFeedbackData({...feedbackData, message: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all text-sm text-white min-h-[100px] resize-none"
                      placeholder="What do you think about this project?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 group"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Submit Feedback'}</span>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {/* Image Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-12 bg-black/95 backdrop-blur-md cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Project view" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              
              {/* Modal Close Button */}
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 w-10 h-10 lg:w-12 lg:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 z-[310]"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
