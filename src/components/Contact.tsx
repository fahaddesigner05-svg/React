import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        if (result.success) {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
        } else {
          throw new Error(result.error || 'Something went wrong');
        }
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response. Please check your Vercel deployment logs.");
      }
    } catch (err: any) {
      console.error('Submit Error:', err);
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-6">
      <div className="max-w-5xl mx-auto glass-panel rounded-[40px] overflow-hidden border border-white/10 flex flex-col md:flex-row">
        
        {/* Left: Info */}
        <div className="md:w-2/5 p-12 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border-r border-white/5">
          <h2 className="text-4xl font-black mb-8">Let's craft something <span className="text-cyan-400">Epic</span>.</h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
               <a href="mailto:fahaddesigner05@gmail.com" className="w-10 h-10 rounded-full bg-cyan-500/10 flex-shrink-0 flex items-center justify-center text-cyan-400 border border-cyan-500/20 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 hover:scale-110 transition-all duration-300">
                  <i className="fas fa-envelope"></i>
               </a>
               <div className="min-w-0">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Email Me</p>
                  <a href="mailto:fahaddesigner05@gmail.com" className="font-semibold text-white hover:text-cyan-400 transition-colors text-sm lg:text-base leading-tight">
                    <span className="block lg:inline">fahaddesigner05</span>
                    <span className="block lg:inline">@gmail.com</span>
                  </a>
               </div>
            </div>
            
            <div className="flex items-center space-x-4">
               <a href="https://wa.me/923366595699" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-purple-500/10 flex-shrink-0 flex items-center justify-center text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white hover:border-purple-500 hover:scale-110 transition-all duration-300">
                  <i className="fab fa-whatsapp"></i>
               </a>
               <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">WhatsApp Me</p>
                  <a href="https://wa.me/923366595699" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-purple-400 transition-colors">
                    +92 336 6595699
                  </a>
               </div>
            </div>

            <div className="pt-10">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-4">Follow My Journey</p>
                <div className="flex space-x-4">
                   {['behance', 'facebook', 'instagram', 'linkedin'].map(social => (
                       <a 
                        key={social} 
                        href={
                          social === 'behance' ? 'https://www.behance.net/fahadmalik74' : 
                          social === 'facebook' ? 'https://www.facebook.com/profile.php?id=61563139933440' : 
                          social === 'instagram' ? 'https://www.instagram.com/fahadmalik8277/' :
                          social === 'linkedin' ? 'https://www.linkedin.com/in/fahad-malik-03b561368/' :
                          '#'
                        } 
                        target={social === 'behance' || social === 'facebook' || social === 'instagram' || social === 'linkedin' ? '_blank' : undefined}
                        rel={social === 'behance' || social === 'facebook' || social === 'instagram' || social === 'linkedin' ? 'noopener noreferrer' : undefined}
                        className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-600 transition-all"
                       >
                          <i className={`fab fa-${social}`}></i>
                       </a>
                   ))}
                </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:w-3/5 p-12">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <i className="fas fa-check text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-gray-400">Thanks for reaching out, Fahad will get back to you soon.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Fahad Malik"
                        required
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" 
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="fahad@design.com"
                        required
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors" 
                      />
                  </div>
              </div>
              <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Your Message</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hey Fahad, I have a project..."
                    required
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  ></textarea>
              </div>
              
              {status === 'error' && (
                <p className="text-red-400 text-xs font-bold">{errorMessage}</p>
              )}

              <button 
                disabled={status === 'loading'}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity transform active:scale-95 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;
