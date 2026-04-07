import React, { useEffect, useState, useRef } from 'react';

const About: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showVideo || !videoContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          setShowVideo(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(videoContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [showVideo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.25 - distance / 800})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setSettings(result.data);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const stats = [
    { label: "Years Experience", value: "2+", color: "text-cyan-400", glow: "shadow-cyan-500/20", hoverColor: "group-hover/stat:text-black", hoverBg: "hover:bg-cyan-400", hoverLabelColor: "group-hover/stat:text-black" },
    { label: "Projects Completed", value: "120+", color: "text-purple-400", glow: "shadow-purple-500/20", hoverColor: "group-hover/stat:text-white", hoverBg: "hover:bg-purple-500", hoverLabelColor: "group-hover/stat:text-white" },
    { label: "Global Clients", value: "50+", color: "text-cyan-400", glow: "shadow-cyan-500/20", hoverColor: "group-hover/stat:text-black", hoverBg: "hover:bg-cyan-400", hoverLabelColor: "group-hover/stat:text-black" }
  ];

  return (
    <div className="w-full relative overflow-hidden">
      {/* Particles Network Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      <div className="container mx-auto px-6 py-4 relative z-10">
        {/* Decorative Blur */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
        {/* Left: Content */}
        <div className="space-y-8 order-1 lg:order-1">
          <div>
            <h3 className="text-cyan-400 font-bold uppercase tracking-[0.3em] text-sm mb-2 text-left">Discovery</h3>
            <h2 className="text-4xl md:text-[3.5rem] font-extrabold leading-[1.1] tracking-tighter text-left max-w-xl">
              Designing the <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Future</span> of Digital Experience
            </h2>
          </div>

          <p className="text-white text-lg font-medium leading-relaxed max-w-xl text-left tracking-tight">
            I am Fahad Malik, a multidisciplinary designer specializing in high end UI UX and visual identities. My approach blends artistic intuition with data driven strategy to create interfaces that aren't just seen they are felt.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6">
            {stats.map((stat, i) => (
              <div key={i} className={`p-6 sm:p-4 glass-panel rounded-2xl border border-white/5 shadow-lg ${stat.glow} transition-all duration-500 cursor-pointer group/stat overflow-hidden relative hover:-translate-y-1 hover:border-white/20 ${stat.hoverBg} flex flex-col items-center sm:items-start text-center sm:text-left`}>
                <div className={`text-3xl sm:text-2xl md:text-3xl font-black mb-1 ${stat.color} ${stat.hoverColor} group-hover/stat:scale-110 transition-all duration-500 origin-center sm:origin-left relative z-10`}>{stat.value}</div>
                <div className={`text-[10px] uppercase font-bold text-gray-500 tracking-wider leading-tight ${stat.hoverLabelColor} transition-colors duration-500 relative z-10`}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="pt-8 w-full" ref={videoContainerRef}>
            <div 
              className="aspect-video glass-panel rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl"
            >
              {!showVideo ? (
                <div 
                  onClick={() => settings?.aboutVideoLink && setShowVideo(true)}
                  className="absolute inset-0 w-full h-full cursor-pointer z-20"
                >
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center group-hover:bg-black/40 transition-all duration-500 z-20">
                    <div className="w-16 h-16 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-cyan-400/10 group-hover:bg-cyan-400 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-2">
                      <i className={`fas ${settings?.aboutVideoLink ? 'fa-play' : 'fa-video-slash'} text-cyan-400 group-hover:text-black text-xl ml-1`}></i>
                    </div>
                    <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {settings?.aboutVideoLink ? 'Click to Play Video' : 'No Video Configured'}
                    </div>
                  </div>

                  {/* Video Placeholder Content */}
                  {settings?.aboutVideoPlaceholder ? (
                    <img 
                      src={settings.aboutVideoPlaceholder} 
                      alt="Video Placeholder" 
                      className="absolute inset-0 w-full h-full object-cover object-center z-10"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-[#0b0c10] z-10"></div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full z-30 bg-black">
                  {settings?.aboutVideoLink && (settings.aboutVideoLink.includes('youtube.com') || settings.aboutVideoLink.includes('youtu.be')) ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${settings.aboutVideoLink.includes('v=') ? settings.aboutVideoLink.split('v=')[1].split('&')[0] : settings.aboutVideoLink.split('/').pop()}?autoplay=1`}
                      className="w-full h-full"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : settings?.aboutVideoLink ? (
                    <video 
                      src={settings.aboutVideoLink} 
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      onError={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.style.display = 'none';
                        const parent = video.parentElement;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.className = "w-full h-full flex flex-col items-center justify-center bg-black text-gray-500 text-xs text-center p-8 space-y-4";
                          placeholder.innerHTML = `
                            <i class="fas fa-exclamation-triangle text-2xl text-amber-500"></i>
                            <p>This video source is not supported or the link is invalid.<br/>Please use a direct .mp4 link or a YouTube URL.</p>
                          `;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Visual Storytelling */}
        <div className="relative group order-2 lg:order-2 h-full">
          <div className="relative z-10 glass-panel p-2 rounded-[2rem] border-white/10 overflow-hidden transition-transform duration-500 h-full">
             <div className="h-full bg-slate-900 rounded-[1.8rem] overflow-hidden relative">
                <img 
                  src={settings?.aboutPageImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"} 
                  alt="Abstract Creative Visual" 
                  className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/40 via-transparent to-transparent"></div>
                
                {/* Floating Tech Stack Badges */}
                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                   {['React', 'Figma', 'Node', 'UI/UX'].map(tag => (
                     <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-white/80 border border-white/10">
                       {tag}
                     </span>
                   ))}
                </div>
             </div>
          </div>
          {/* Decorative Frames */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 blur-3xl -z-10 animate-pulse"></div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;
