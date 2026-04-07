import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

const SKILLS = [
  { 
    name: "UI UX Design", 
    level: 95, 
    icon: "fa-bezier-curve", 
    color: "text-cyan-400",
    details: {
      subSkills: ["Wireframing", "Prototyping", "User Research"],
      tools: ["Figma", "Adobe XD"]
    }
  },
  { 
    name: "Graphic Design", 
    level: 98, 
    icon: "fa-palette", 
    color: "text-purple-400",
    details: {
      subSkills: ["Visual Concepting", "Typography", "Layout Design"],
      tools: ["Adobe Photoshop", "Illustrator", "Canva"]
    }
  },
  { 
    name: "Brand Identity", 
    level: 100, 
    icon: "fa-copyright", 
    color: "text-cyan-400",
    details: {
      subSkills: ["Logo Design", "Color Theory", "Brand Guidelines"],
      tools: ["Illustrator", "Adobe Photoshop"]
    }
  },
  { 
    name: "Web Design", 
    level: 97, 
    icon: "fa-laptop", 
    color: "text-blue-400",
    details: {
      subSkills: ["Responsive Design", "Visual Design", "Interaction Design"],
      tools: ["Figma", "Adobe XD", "Photoshop"]
    }
  },
  { 
    name: "Figma Adobe XD", 
    level: 98, 
    icon: "fa-pen-nib", 
    color: "text-cyan-400",
    details: {
      subSkills: ["UI Components", "Design Systems", "Auto Layout"],
      tools: ["Figma", "Adobe XD"]
    }
  },
  { 
    name: "Photoshop", 
    level: 98, 
    icon: "fa-image", 
    color: "text-purple-400",
    details: {
      subSkills: ["Photo Manipulation", "Digital Painting", "Retouching"],
      tools: ["Adobe Photoshop"]
    }
  },
];

const Skills: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<typeof SKILLS[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    customService: '',
    budget: '$1k to $5k',
    customBudget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (selectedSkill) {
      setFormData({
        name: '',
        email: '',
        service: selectedSkill.details.subSkills[0] || '',
        customService: '',
        budget: '$1k to $5k',
        customBudget: '',
        message: ''
      });
      setSubmitSuccess(false);
    }
  }, [selectedSkill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalService = formData.service === 'Custom' ? formData.customService : formData.service;
    const finalBudget = formData.budget === 'Custom' ? formData.customBudget : formData.budget;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          service: `${finalService} (${selectedSkill?.name})`,
          budget: finalBudget
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSelectedSkill(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h3 className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-2">Expertise</h3>
        <h2 className="text-4xl md:text-5xl font-black">Design Arsenal</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SKILLS.map((skill, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedSkill(skill)}
            className={`glass-panel p-8 rounded-2xl border-2 border-white/5 ${skill.color.replace('text', 'hover:border')} transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden cursor-pointer`}
          >
            {/* Subtle Background Glow */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${skill.color.replace('text', 'bg')}`}></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div 
                className={`w-12 h-12 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 flex items-center justify-center ${skill.color} group-hover:scale-110 transition-transform duration-500 hover:bg-white/5`}
              >
                <i className={`fas ${skill.icon} text-xl`}></i>
              </div>
              <span className="text-2xl font-black text-white/10 group-hover:text-white/30 transition-colors">0{idx + 1}</span>
            </div>
            
            <h4 className="text-xl font-bold mb-6 text-white group-hover:text-white transition-colors relative z-10">{skill.name}</h4>
            
            <div className="relative z-10">
              <div className="w-full bg-slate-900/50 h-2 rounded-full overflow-hidden border border-white/5">
                 <div 
                   className={`h-full rounded-full bg-gradient-to-r from-transparent via-current to-current transition-all duration-1000 ease-out relative ${skill.color.replace('text', 'bg')}`}
                   style={{ width: `${skill.level}%` }}
                 >
                   {/* Subtle Tip Glow */}
                   <div className="absolute right-0 top-0 h-full w-4 bg-white blur-sm opacity-30"></div>
                 </div>
              </div>
              <div className="flex justify-between mt-3 items-center">
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Proficiency</span>
                  <span className={`text-xs font-black ${skill.color} tabular-nums`}>{skill.level}%</span>
              </div>
            </div>

            {/* Subtle Bottom Accent */}
            <div className={`absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-700 ${skill.color.replace('text', 'bg')} opacity-30`}></div>
          </div>
        ))}
      </div>

      {/* Modal Structure */}
      {selectedSkill && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
          onClick={() => setSelectedSkill(null)}
        >
          <div 
            className={`bg-[#0b0c10] border-2 ${selectedSkill.color.replace('text', 'border')} p-6 md:p-8 rounded-3xl max-w-3xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto modal-scrollbar`}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              .modal-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .modal-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                margin-top: 32px;
                margin-bottom: 32px;
              }
              .modal-scrollbar::-webkit-scrollbar-thumb {
                background-color: ${
                  selectedSkill.color === 'text-cyan-400' ? '#22d3ee' : 
                  selectedSkill.color === 'text-purple-400' ? '#c084fc' : 
                  selectedSkill.color === 'text-blue-400' ? '#60a5fa' : '#ffffff'
                };
                border-radius: 8px;
              }
            `}</style>
            <button 
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10 bg-[#0b0c10] rounded-full p-1"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center shrink-0 ${selectedSkill.color}`}>
                <i className={`fas ${selectedSkill.icon} text-xl`}></i>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{selectedSkill.name}</h3>
            </div>

            {submitSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-gray-400">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${selectedSkill.color} mb-3`}>{selectedSkill.name} Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.details.subSkills.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-3">Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.details.tools.map((t, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${selectedSkill.color.replace('text-', 'bg-')}`}></div>
                    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${selectedSkill.color.replace('text-', 'bg-')}`}></div>
                    
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <i className="fas fa-bolt text-yellow-400"></i>
                      Why Choose Me?
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-gray-400">
                        <i className={`fas fa-check-circle mt-1 ${selectedSkill.color}`}></i>
                        <span>100% Client Satisfaction & Revisions</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-400">
                        <i className={`fas fa-check-circle mt-1 ${selectedSkill.color}`}></i>
                        <span>Modern, Clean & User-Centric Design</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-400">
                        <i className={`fas fa-check-circle mt-1 ${selectedSkill.color}`}></i>
                        <span>Fast Delivery & Clear Communication</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center group hover:bg-white/10 transition-colors relative overflow-hidden">
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${selectedSkill.color.replace('text-', 'bg-')}`}></div>
                      <h5 className={`text-3xl font-black ${selectedSkill.color}`}>50+</h5>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Projects Done</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center group hover:bg-white/10 transition-colors relative overflow-hidden">
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${selectedSkill.color.replace('text-', 'bg-')}`}></div>
                      <h5 className={`text-3xl font-black ${selectedSkill.color}`}>100%</h5>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Success Rate</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 group hover:border-white/20 transition-colors cursor-default">
                    <div className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedSkill.color.replace('text-', 'bg-')}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${selectedSkill.color.replace('text-', 'bg-')}`}></span>
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-gray-200 transition-colors">Available for new projects</span>
                  </div>
                </div>

                {/* Right Column: Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Start a Project</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Service</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full bg-[#1a1b23] border border-white/10 rounded-lg px-3 py-2 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                    >
                      {selectedSkill.details.subSkills.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                      <option value="Custom">Custom Service</option>
                    </select>
                  </div>

                  {formData.service === 'Custom' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Custom Service</label>
                      <input 
                        type="text" 
                        required
                        value={formData.customService}
                        onChange={(e) => setFormData({...formData, customService: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                        placeholder="Describe the service you need"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full bg-[#1a1b23] border border-white/10 rounded-lg px-3 py-2 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                    >
                      <option value="Less than $1k">Less than $1k</option>
                      <option value="$1k to $5k">$1k to $5k</option>
                      <option value="$5k to $10k">$5k to $10k</option>
                      <option value="$10k+">$10k+</option>
                      <option value="Custom">Custom Budget</option>
                    </select>
                  </div>

                  {formData.budget === 'Custom' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Custom Budget</label>
                      <input 
                        type="text" 
                        required
                        value={formData.customBudget}
                        onChange={(e) => setFormData({...formData, customBudget: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:border-cyan-400 outline-none transition-all text-sm text-white"
                        placeholder="e.g. $2500"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Message</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:border-cyan-400 outline-none transition-all text-sm text-white min-h-[80px] resize-none"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${selectedSkill.color.replace('text-', 'bg-')} hover:opacity-80 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center space-x-2 group`}
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
