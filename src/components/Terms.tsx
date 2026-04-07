import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white bg-cyber selection:bg-cyan-500 selection:text-white pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/" className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-widest text-sm uppercase">Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-6">Terms of Service</h1>
            <p className="text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                <p>
                  We provide users with access to a rich collection of resources, including various communications tools, forums, shopping services, and personalized content through its network of properties (the "Service"). You also understand and agree that the Service may include advertisements and that these advertisements are necessary for us to provide the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
                <p>
                  You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from which such Content originated.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                <p>
                  All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of this site's owner or its content suppliers and protected by international copyright laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                <p>
                  You expressly understand and agree that we shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Modifications to Service</h2>
                <p>
                  We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
