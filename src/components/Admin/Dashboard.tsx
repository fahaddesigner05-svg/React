import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SiFigma, SiCanva, SiSketch, SiInvision, SiFramer, SiReact, SiWordpress, SiElementor, SiWebflow, SiWix, SiShopify } from 'react-icons/si';
import { DiPhotoshop, DiIllustrator } from 'react-icons/di';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Users, 
  Eye, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Database,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Layout,
  Layers,
  Code,
  Video,
  Upload,
  Star,
  Menu,
  X
} from 'lucide-react';

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'messages' | 'settings' | 'portfolio-videos' | 'feedbacks'>('dashboard');
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0 });
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; error?: string }>({ connected: true });
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);
  const [settings, setSettings] = useState({ 
    aboutVideoLink: '', 
    aboutVideoPlaceholder: '', 
    aboutPageImage: '',
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      behance: '',
      dribbble: ''
    },
    themeColor: '#22d3ee',
    enableEmailNotifications: true,
    maintenanceMode: false
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState(false);
  const [isUploadingProjectImage, setIsUploadingProjectImage] = useState(false);
  const [isUploadingProjectVideo, setIsUploadingProjectVideo] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Message Modal State
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  // Project Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    img: '',
    images: [] as string[],
    coverImg: '',
    videoLink: '',
    color: 'cyan',
    role: 'Lead Designer',
    timeline: 'March 2026',
    goals: [] as string[],
    techStack: [] as { name: string; iconType: string }[],
    showOnHome: false
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      fetchMessages();
      fetchFeedbacks();
      fetchProjects();
      fetchAnalytics();
      fetchAdminData();
      fetchSettings();
      checkDbStatus();
    }
  }, [navigate]);

  useEffect(() => {
    if (messages.length > 0) {
      const storedReadMessages = localStorage.getItem('readMessages');
      let readMessages = [];
      
      if (!storedReadMessages) {
        // First time running this feature: assume all existing messages are already read
        readMessages = messages.map(m => m._id);
        localStorage.setItem('readMessages', JSON.stringify(readMessages));
      } else {
        readMessages = JSON.parse(storedReadMessages);
      }

      if (activeTab === 'messages') {
        const newReadMessages = [...new Set([...readMessages, ...messages.map(m => m._id)])];
        localStorage.setItem('readMessages', JSON.stringify(newReadMessages));
        setUnreadCount(0);
      } else {
        const unread = messages.filter(m => !readMessages.includes(m._id)).length;
        setUnreadCount(unread);
      }
    } else {
      setUnreadCount(0);
    }
  }, [activeTab, messages]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin');
      const result = await response.json();
      if (result.success) {
        setAdminData(result.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const result = await response.json();
      if (result.success) {
        // Success
      } else {
        console.error(result.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    try {
      const signResponse = await fetch('/api/upload/sign');
      const signData = await signResponse.json();
      if (!signData.success) throw new Error(signData.error || 'Failed to get upload signature');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.api_key);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signData.cloud_name}/${file.type.startsWith('video/') ? 'video' : 'image'}/upload`;
      const uploadResponse = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
      const uploadData = await uploadResponse.json();
      if (uploadData.error) throw new Error(uploadData.error.message || 'Cloudinary upload failed');
      return uploadData.secure_url;
    } catch (error: any) {
      console.error('Cloudinary Upload Error:', error);
      throw error;
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      console.warn('Please select a valid video file.');
      return;
    }
    setIsUploadingVideo(true);
    try {
      const url = await uploadToCloudinary(file);
      setSettings({ ...settings, aboutVideoLink: url });
    } catch (error: any) {
      console.error('Upload failed:', error.message);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      console.warn('Please select a valid image file.');
      return;
    }
    setIsUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file);
      setSettings({ ...settings, aboutVideoPlaceholder: url });
    } catch (error: any) {
      console.error('Upload failed:', error.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      console.warn('Please select a valid image file.');
      return;
    }
    setIsUploadingAboutImage(true);
    try {
      const url = await uploadToCloudinary(file);
      setSettings({ ...settings, aboutPageImage: url });
    } catch (error: any) {
      console.error('Upload failed:', error.message);
    } finally {
      setIsUploadingAboutImage(false);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      console.warn('Please select a valid image file.');
      return;
    }
    setIsUploadingProjectImage(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url],
        img: prev.images.length === 0 ? url : prev.img,
        coverImg: prev.images.length === 0 ? url : prev.coverImg
      }));
    } catch (error: any) {
      console.error('Upload failed:', error.message);
    } finally {
      setIsUploadingProjectImage(false);
      e.target.value = '';
    }
  };

  const handleProjectVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      console.warn('Please select a valid video file.');
      return;
    }
    setIsUploadingProjectVideo(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, videoLink: url }));
    } catch (error: any) {
      console.error('Upload failed:', error.message);
    } finally {
      setIsUploadingProjectVideo(false);
      e.target.value = '';
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAdmin(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
      const result = await response.json();
    if (result.success) {
      // Success
    } else {
      console.error(result.error || 'Failed to update admin credentials');
    }
    } catch (error) {
      console.error('Error updating admin data:', error);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const result = await response.json();
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const resetAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/reset', { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setAnalytics({ views: 0, clicks: 0 });
      }
    } catch (error) {
      console.error('Error resetting analytics:', error);
    }
  };

  const checkDbStatus = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (!result.success && result.error?.includes('MONGODB_URI')) {
        setDbStatus({ connected: false, error: 'MongoDB URI is missing. Please set it in .env.example' });
      } else if (!result.success) {
        setDbStatus({ connected: false, error: result.error });
      } else {
        setDbStatus({ connected: true });
      }
    } catch (error: any) {
      setDbStatus({ connected: false, error: error.message });
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedStatus('loading');
    try {
      const response = await fetch('/api/projects/seed', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setSeedStatus('success');
        setTimeout(() => setSeedStatus('idle'), 3000);
        fetchProjects();
      } else {
        throw new Error(result.error || 'Failed to seed data');
      }
    } catch (error: any) {
      console.error('Seed Error:', error);
      setSeedStatus('error');
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await fetch('/api/messages');
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        if (result.success) {
          setMessages(result.data);
        }
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      const result = await response.json();
      if (result.success) {
        setFeedbacks(result.data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setMessages(messages.filter(m => m._id !== id));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const response = await fetch(`/api/feedback?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setFeedbacks(feedbacks.filter(f => f._id !== id));
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleOpenModal = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        img: project.img,
        images: project.images || [],
        coverImg: project.coverImg || project.img,
        videoLink: project.videoLink || '',
        color: project.color || 'cyan',
        role: project.role || 'Lead Designer',
        timeline: project.timeline || 'March 2026',
        goals: project.goals || [],
        techStack: project.techStack || [],
        showOnHome: project.showOnHome || false
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        img: '',
        images: [],
        coverImg: '',
        videoLink: '',
        color: 'cyan',
        role: 'Lead Designer',
        timeline: 'March 2026',
        goals: [],
        techStack: [],
        showOnHome: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProject ? 'PUT' : 'POST';
      
      // Ensure img has a fallback if videoLink is provided but no images
      const dataToSave = { ...formData };
      const ytId = dataToSave.videoLink ? getYouTubeId(dataToSave.videoLink) : null;
      
      if (ytId && !dataToSave.img && dataToSave.images.length === 0) {
        const thumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        dataToSave.img = thumb;
        dataToSave.coverImg = thumb;
      } else if (dataToSave.videoLink && !dataToSave.img && dataToSave.images.length === 0) {
        dataToSave.img = ''; // Allow empty string for img if video is present
      }

      const body = editingProject ? { ...dataToSave, id: editingProject._id } : dataToSave;
      
      const response = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = await response.json();
      if (result.success) {
        fetchProjects();
        setIsModalOpen(false);
      } else {
        console.error(result.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const stats = [
    { label: 'Total Views', value: analytics.views.toLocaleString(), icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Feedbacks', value: feedbacks.length.toString(), icon: Star, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Inquiries', value: messages.length.toString(), icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Active Projects', value: projects.length.toString(), icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex admin-area relative overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 w-64 h-full border-r border-white/5 bg-[#0b0c10] md:bg-black/20 backdrop-blur-xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tighter">
            FAHAD<span className="text-cyan-400">ADMIN</span>
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Projects</span>
          </button>
          <button 
            onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Messages</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('feedbacks'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'feedbacks' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Star className="w-5 h-5" />
            <span className="font-medium">Feedbacks</span>
          </button>
          <button 
            onClick={() => { setActiveTab('portfolio-videos'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'portfolio-videos' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">Portfolio Videos</span>
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-400/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-cyber relative">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/20 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {activeTab === 'projects' && (
              <button 
                onClick={() => handleOpenModal()}
                className="p-2 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 transition-all border border-cyan-400/20"
              >
                <Plus className="w-5 h-5 text-cyan-400" />
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center font-bold">
              FM
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* DB Status Warning */}
              {!dbStatus.connected && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-4 text-red-400"
                >
                  <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Database Connection Error</p>
                    <p className="text-sm opacity-80">{dbStatus.error}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Overview</h2>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => { fetchMessages(); fetchProjects(); fetchAnalytics(); checkDbStatus(); }}
                    className="text-cyan-400 text-sm font-bold hover:underline flex items-center space-x-1"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Refresh Stats</span>
                  </button>
                  <button 
                    onClick={resetAnalytics}
                    className="text-red-400 text-sm font-bold hover:underline flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Reset Views</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  let targetTab: 'dashboard' | 'projects' | 'messages' | 'settings' | 'portfolio-videos' | 'feedbacks' | null = null;
                  if (stat.label === 'Feedbacks') targetTab = 'feedbacks';
                  if (stat.label === 'Inquiries') targetTab = 'messages';
                  if (stat.label === 'Active Projects') targetTab = 'projects';

                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => targetTab && setActiveTab(targetTab)}
                      className={`glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group ${targetTab ? 'cursor-pointer hover:border-white/20' : ''}`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-3xl -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-3xl font-black">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Messages Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel rounded-3xl border border-white/5 overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Messages</h2>
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className="text-cyan-400 text-sm font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Budget</th>
                        <th className="px-6 py-4">Message</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingMessages ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">Loading...</td>
                        </tr>
                      ) : messages.length > 0 ? (
                        messages.slice(0, 5).map((msg) => (
                          <tr 
                            key={msg._id} 
                            className="hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedMessage(msg);
                              setIsMessageModalOpen(true);
                            }}
                          >
                            <td className="px-6 py-4 font-medium">{msg.name}</td>
                            <td className="px-6 py-4 text-gray-400">
                              <div className="max-w-[150px] truncate" title={msg.service}>{msg.service || '-'}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-400">{msg.budget || '-'}</td>
                            <td className="px-6 py-4 text-gray-400">
                              <div className="max-w-xs truncate" title={msg.message}>{msg.message}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">No messages.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}

          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Projects</h2>
                <div className="flex space-x-4">
                  <button 
                    onClick={fetchProjects}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
                  >
                    Refresh
                  </button>
                  <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingProjects ? (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project._id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden group">
                      <div className="h-40 relative">
                        {(() => {
                          const ytId = project.videoLink ? getYouTubeId(project.videoLink) : null;
                          if (ytId) {
                            return (
                              <div className="w-full h-full bg-black flex items-center justify-center">
                                <i className="fab fa-youtube text-4xl text-red-600"></i>
                              </div>
                            );
                          } else if (project.videoLink) {
                            return (
                              <video 
                                src={project.videoLink || undefined} 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                muted
                                playsInline
                                onError={(e) => {
                                  // Fallback if video fails to load
                                  (e.target as HTMLVideoElement).style.display = 'none';
                                  const parent = (e.target as HTMLVideoElement).parentElement;
                                  if (parent) {
                                    const img = document.createElement('img');
                                    img.src = project.coverImg || project.img || 'https://picsum.photos/seed/error/800/600';
                                    img.className = "w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity";
                                    parent.appendChild(img);
                                  }
                                }}
                                onMouseOver={(e) => e.currentTarget.play().catch(() => {})}
                                onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                              />
                            );
                          } else {
                            return (
                              <img 
                                src={project.coverImg || project.img || undefined} 
                                alt={project.title} 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                                referrerPolicy="no-referrer"
                              />
                            );
                          }
                        })()}
                        <div className="absolute top-2 right-2 flex space-x-2 z-10">
                          <button 
                            onClick={() => handleOpenModal(project)}
                            className="p-2 rounded-lg bg-black/60 text-white hover:bg-cyan-500 hover:text-black transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProject(project._id)}
                            className="p-2 rounded-lg bg-black/60 text-white hover:bg-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">{project.category}</span>
                        {project.showOnHome && (
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">Featured</span>
                        )}
                        <h3 className="text-lg font-bold mt-1">{project.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-2">{project.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-gray-500 italic">
                    No projects found.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-3xl border border-white/5 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold">All Messages</h2>
                <button 
                  onClick={fetchMessages}
                  className="text-cyan-400 text-sm font-bold hover:underline"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Budget</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingMessages ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">Loading...</td>
                      </tr>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => (
                        <tr 
                          key={msg._id} 
                          className="hover:bg-white/5 transition-colors group cursor-pointer"
                          onClick={() => {
                            setSelectedMessage(msg);
                            setIsMessageModalOpen(true);
                          }}
                        >
                          <td className="px-6 py-4 font-medium">{msg.name}</td>
                          <td className="px-6 py-4 text-gray-400">{msg.email}</td>
                          <td className="px-6 py-4 text-gray-400">
                            <div className="max-w-[150px] truncate" title={msg.service}>{msg.service || '-'}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{msg.budget || '-'}</td>
                          <td className="px-6 py-4 text-gray-400">
                            <div className="max-w-xs truncate" title={msg.message}>{msg.message}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">No messages found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'feedbacks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-3xl border border-white/5 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Project Feedbacks</h2>
                <button 
                  onClick={fetchFeedbacks}
                  className="text-cyan-400 text-sm font-bold hover:underline"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Feedback</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {feedbacks.length > 0 ? (
                      feedbacks.map((fb) => {
                        const project = projects.find(p => p._id === fb.projectId);
                        return (
                          <tr key={fb._id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 font-medium text-cyan-400">
                              {project ? project.title : 'Unknown Project'}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-3 h-3 ${star <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">{fb.name}</div>
                              <div className="text-xs text-gray-500">{fb.email}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm max-w-xs truncate">{fb.message}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                              {new Date(fb.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => deleteFeedback(fb._id)}
                                className="p-2 rounded-lg hover:bg-red-400/10 text-red-400 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">No feedbacks yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio-videos' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl space-y-8"
            >
              <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  <span>About Video Settings</span>
                </h2>
                <form onSubmit={handleUpdateSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">About Video Link (Direct URL or YouTube)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://example.com/video.mp4"
                      value={settings.aboutVideoLink} 
                      onChange={(e) => setSettings({ ...settings, aboutVideoLink: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Video Placeholder Image URL</label>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="e.g. https://images.unsplash.com/..."
                        value={settings.aboutVideoPlaceholder} 
                        onChange={(e) => setSettings({ ...settings, aboutVideoPlaceholder: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50"
                    >
                      {isSavingSettings ? 'Saving...' : 'Update Video Settings'}
                    </button>
                  </div>
                </form>

                {settings.aboutVideoLink && (
                  <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Live Preview</p>
                    <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      {settings.aboutVideoLink.includes('youtube.com') || settings.aboutVideoLink.includes('youtu.be') ? (
                        <iframe 
                          src={`https://www.youtube.com/embed/${settings.aboutVideoLink.includes('v=') ? settings.aboutVideoLink.split('v=')[1].split('&')[0] : settings.aboutVideoLink.split('/').pop()}`}
                          className="w-full h-full"
                          frameBorder="0"
                        ></iframe>
                      ) : (
                        <video 
                          src={settings.aboutVideoLink || undefined} 
                          className="w-full h-full object-contain" 
                          controls 
                          onError={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.style.display = 'none';
                            const parent = video.parentElement;
                            if (parent) {
                              const placeholder = document.createElement('div');
                              placeholder.className = "w-full h-full flex items-center justify-center bg-white/5 text-gray-500 text-xs text-center p-4";
                              placeholder.innerText = "Video source not supported or invalid URL. Please provide a direct video link or YouTube URL.";
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-purple-400" />
                  <span>About Page Image</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Image URL</label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={settings.aboutPageImage} 
                      onChange={(e) => setSettings({ ...settings, aboutPageImage: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingAboutImage ? 'Uploading...' : 'Upload New Image'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAboutImageUpload}
                        disabled={isUploadingAboutImage}
                      />
                    </label>
                    <button 
                      onClick={handleUpdateSettings}
                      disabled={isSavingSettings}
                      className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400 transition-all disabled:opacity-50"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Image'}
                    </button>
                  </div>
                  {settings.aboutPageImage && (
                    <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img 
                        src={settings.aboutPageImage || undefined} 
                        alt="About Page Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl space-y-8 pb-20"
            >
              {/* Account Settings */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Account Settings</span>
                </h2>
                <form onSubmit={handleUpdateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Admin Username</label>
                    <input 
                      type="text" 
                      value={adminData.username} 
                      onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Admin Password</label>
                    <input 
                      type="password" 
                      value={adminData.password} 
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      type="submit"
                      disabled={isSavingAdmin}
                      className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50"
                    >
                      {isSavingAdmin ? 'Saving...' : 'Update Credentials'}
                    </button>
                  </div>
                </form>
              </div>

              {/* General Site Settings */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>General Site Settings</span>
                </h2>
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Site Name</label>
                      <input 
                        type="text" 
                        value={settings.siteName} 
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contact Email</label>
                      <input 
                        type="email" 
                        value={settings.contactEmail} 
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Site Description</label>
                    <textarea 
                      value={settings.siteDescription} 
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all resize-none" 
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Saving...' : 'Save General Settings'}
                  </button>
                </form>
              </div>

              {/* Social Links */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>Social Links</span>
                </h2>
                <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(settings.socialLinks).map((platform) => (
                    <div key={platform}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 capitalize">{platform}</label>
                      <input 
                        type="url" 
                        value={(settings.socialLinks as any)[platform]} 
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          socialLinks: { ...settings.socialLinks, [platform]: e.target.value } 
                        })}
                        placeholder={`https://${platform}.com/your-profile`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none transition-all" 
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <button 
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400 transition-all disabled:opacity-50"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Social Links'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Preferences & Security */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-3xl border border-white/5">
                  <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span>System Preferences</span>
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Maintenance Mode</p>
                        <p className="text-xs text-gray-500">Hide site from public view</p>
                      </div>
                      <button 
                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-yellow-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive alerts for new messages</p>
                      </div>
                      <button 
                        onClick={() => setSettings({ ...settings, enableEmailNotifications: !settings.enableEmailNotifications })}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.enableEmailNotifications ? 'bg-cyan-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableEmailNotifications ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                    <button 
                      onClick={handleUpdateSettings}
                      disabled={isSavingSettings}
                      className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/5">
                  <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span>Data Management</span>
                  </h2>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-400">Use these tools to reset or manage your portfolio data.</p>
                    <button 
                      onClick={handleSeedData}
                      disabled={isSeeding}
                      className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      <Database className="w-4 h-4" />
                      <span>{isSeeding ? 'Seeding...' : 'Seed Sample Projects'}</span>
                    </button>
                    <button 
                      onClick={resetAnalytics}
                      className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Reset All Analytics</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel w-full max-w-2xl rounded-[32px] border border-white/10 overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Project Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all resize-none"
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <input 
                  type="checkbox" 
                  id="showOnHome"
                  checked={formData.showOnHome}
                  onChange={(e) => setFormData({...formData, showOnHome: e.target.checked})}
                  className="w-5 h-5 rounded border-white/10 bg-black text-cyan-400 focus:ring-cyan-400"
                />
                <label htmlFor="showOnHome" className="text-sm font-bold text-gray-300 cursor-pointer">Show on Home Page (Featured)</label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Role</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Timeline</label>
                  <input 
                    type="text" 
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Project Goals</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, goals: [...formData.goals, '']})}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Goal</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.goals.map((goal, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        required
                        placeholder={`Goal ${idx + 1}`}
                        value={goal}
                        onChange={(e) => {
                          const newGoals = [...formData.goals];
                          newGoals[idx] = e.target.value;
                          setFormData({...formData, goals: newGoals});
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all text-sm"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const newGoals = formData.goals.filter((_, i) => i !== idx);
                          setFormData({...formData, goals: newGoals});
                        }}
                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Design Stack</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, techStack: [...formData.techStack, { name: '', iconType: 'Globe' }]})}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Tool</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.techStack.map((tech, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Tool Name (e.g. Figma)"
                        value={tech.name}
                        onChange={(e) => {
                          const newStack = [...formData.techStack];
                          newStack[idx].name = e.target.value;
                          setFormData({...formData, techStack: newStack});
                        }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all text-sm"
                      />
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-cyan-400">
                        {getIcon(tech.name, tech.iconType)}
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const newStack = formData.techStack.filter((_, i) => i !== idx);
                          setFormData({...formData, techStack: newStack});
                        }}
                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Project Images</label>
                  <div className="flex items-center justify-end">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                      className="text-xs font-bold text-gray-400 hover:underline flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add URL</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          required
                          placeholder={`Image URL ${idx + 1}`}
                          value={url}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[idx] = e.target.value;
                            setFormData({...formData, images: newImages});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all text-sm"
                        />
                        {url && (
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, coverImg: url, img: url})}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase px-2 py-1 rounded-md transition-all ${formData.coverImg === url ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                          >
                            {formData.coverImg === url ? 'Cover' : 'Set Cover'}
                          </button>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== idx);
                          setFormData({...formData, images: newImages});
                        }}
                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length === 0 && !formData.videoLink && (
                    <p className="text-xs text-gray-500 italic">No images or video added yet. Click "Add Image URL" or enter a Video Link to start.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hidden">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Main Image URL (Legacy)</label>
                  <input 
                    type="text" 
                    value={formData.img}
                    onChange={(e) => setFormData({...formData, img: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Video (Optional)</label>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Paste video URL here..."
                      value={formData.videoLink}
                      onChange={(e) => setFormData({...formData, videoLink: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Message View Modal */}
      {isMessageModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0b0c10] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-cyan-500/10"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Message Details
              </h2>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Name</p>
                  <p className="text-lg font-medium text-white">{selectedMessage.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</p>
                  <p className="text-lg font-medium text-white">
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-cyan-400 transition-colors">
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Service Requested</p>
                  <p className="text-lg font-medium text-cyan-400">{selectedMessage.service || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Budget</p>
                  <p className="text-lg font-medium text-purple-400">{selectedMessage.budget || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex justify-between">
                  <span>Message</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </p>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
              <button 
                onClick={() => {
                  deleteMessage(selectedMessage._id);
                  setIsMessageModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Message
              </button>
              <a 
                href={`mailto:${selectedMessage.email}`}
                className="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <i className="fas fa-reply"></i>
                Reply via Email
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
