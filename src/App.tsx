import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TextDivider from './components/TextDivider';
import MouseRing from './components/MouseRing';
import Login from './components/Admin/Login';
import Dashboard from './components/Admin/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import AllProjects from './components/AllProjects';
import LoadingScreen from './components/LoadingScreen';
import Privacy from './components/Privacy';
import Terms from './components/Terms';

const SectionWrapper = ({ children, id, className = "" }: { children: React.ReactNode, id: string, className?: string }) => (
  <motion.section 
    id={id} 
    className={className}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.section>
);

const MainSite: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Increment view count only if not an admin
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (!isAdmin) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'views' }),
      }).catch(err => console.error('Analytics error:', err));
    }

    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white bg-cyber selection:bg-cyan-500 selection:text-white">
      <Navbar activeSection={activeSection} />
      
      <main>
        <section id="home">
          <Hero />
        </section>

        <SectionWrapper id="about" className="py-20 border-b border-white/5">
          <About />
        </SectionWrapper>

        <TextDivider />
        
        <SectionWrapper id="projects" className="py-20">
          <Projects />
        </SectionWrapper>
        
        <SectionWrapper id="skills" className="py-20 bg-slate-900/30">
          <Skills />
        </SectionWrapper>
        
        <SectionWrapper id="contact" className="py-20">
          <Contact />
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <LoadingScreen />
      <MouseRing />
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* Redirect any other admin routes to login or dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
