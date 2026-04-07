import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy: React.FC = () => {
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
            <h1 className="text-4xl md:text-5xl font-black mb-6">Privacy Policy</h1>
            <p className="text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us when you use our website, such as when you fill out a contact form, request a quote, or communicate with us. This may include your name, email address, phone number, and any other details you choose to provide.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                  <li>Respond to your inquiries and provide customer support.</li>
                  <li>Communicate with you about projects, services, and updates.</li>
                  <li>Improve our website and services.</li>
                  <li>Analyze usage trends and measure the effectiveness of our content.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Links</h2>
                <p>
                  Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this privacy policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us through the contact form on our website.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
