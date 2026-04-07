import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-white/5 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-xl font-black tracking-tighter mb-2">FAHAD<span className="text-cyan-400">.</span></div>
            <p className="text-sm text-gray-500">Crafting digital experiences that matter.</p>
          </div>
          
          <div className="text-sm text-gray-500 flex flex-col items-center md:items-end">
            <p className="mb-2">© {new Date().getFullYear()} Fahad Malik. All Rights Reserved.</p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
              <Link to="/admin" className="text-[10px] text-gray-700 hover:text-cyan-400 transition-colors opacity-50 hover:opacity-100">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
