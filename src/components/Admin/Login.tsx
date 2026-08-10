import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, Eye, EyeOff, KeyRound, X, Mail, ShieldCheck, SkipForward, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'initial' | 'sending' | 'enter-code' | 'set-password'>('initial');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [targetEmail, setTargetEmail] = useState('fahaddesigner05@gmail.com');
  const [forgotError, setForgotError] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [fallbackCodeNotice, setFallbackCodeNotice] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  const handleOpenForgotModal = async () => {
    setShowForgotModal(true);
    setForgotStep('sending');
    setForgotError('');
    setForgotMsg('');
    setFallbackCodeNotice(null);

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'forgot-password' })
      });
      const result = await response.json();
      if (result.success) {
        if (result.email) setTargetEmail(result.email);
        setForgotMsg(`Verification code generated in database & sent to ${result.email || 'your email'}`);
        if (result.code) {
          setFallbackCodeNotice(result.code);
        }
        setForgotStep('enter-code');
      } else {
        setForgotError(result.error || 'Failed to generate verification code.');
        setForgotStep('initial');
      }
    } catch (err) {
      console.error('Forgot password request error:', err);
      setForgotError('Connection error. Please try again.');
      setForgotStep('initial');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setForgotError('Please enter or paste the verification code.');
      return;
    }
    setForgotError('');
    setForgotMsg('');

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-code', code: verificationCode.trim() })
      });
      const result = await response.json();
      if (result.success) {
        setForgotMsg('Code verified! Set your new password below.');
        setForgotStep('set-password');
      } else {
        setForgotError(result.error || 'Invalid verification code. Please check and try again.');
      }
    } catch (err) {
      console.error('Verify code error:', err);
      setForgotError('Failed to verify code.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setForgotError('Please enter a new password.');
      return;
    }
    setForgotError('');

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-password', code: verificationCode.trim(), newPassword })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        setForgotError(result.error || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setForgotError('Failed to reset password.');
    }
  };

  const handleSkipAndLogin = () => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] bg-cyber flex items-center justify-center px-4 admin-area">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black tracking-tighter text-white mb-2">
                Admin <span className="text-cyan-400">Portal</span>
              </h2>
              <p className="text-gray-400 text-sm">Welcome back, Fahad. Please sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                  <button
                    type="button"
                    onClick={handleOpenForgotModal}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs font-bold text-center"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl text-white font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 text-sm hover:text-cyan-400 transition-colors cursor-pointer"
          >
            ← Back to Website
          </button>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowForgotModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-panel bg-[#12141d] p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-gray-400 font-mono">{targetEmail}</p>
              </div>
            </div>

            {/* STEP: Sending code */}
            {forgotStep === 'sending' && (
              <div className="py-8 text-center space-y-3">
                <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-cyan-300 font-medium">Generating real-time code in database & sending email...</p>
              </div>
            )}

            {/* STEP: Enter Verification Code */}
            {forgotStep === 'enter-code' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 text-xs text-cyan-200 flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Verification Code Sent!</span>
                    <span>Please check your email inbox at <strong className="text-cyan-300">{targetEmail}</strong> and paste the 6-digit code below.</span>
                  </div>
                </div>

                {fallbackCodeNotice && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3 text-xs text-purple-200">
                    <span className="font-bold text-purple-300">Generated Code: </span>
                    <span className="font-mono text-sm tracking-widest font-black text-white">{fallbackCodeNotice}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Paste Verification Code
                  </label>
                  <input 
                    type="text" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="e.g. 842915"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-center text-xl font-mono tracking-widest text-white focus:border-cyan-400 outline-none transition-colors"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {forgotError && (
                  <p className="text-xs font-bold text-red-400 text-center">{forgotError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipAndLogin}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                    title="Skip password reset and enter admin panel directly"
                  >
                    <span>Skip</span>
                    <SkipForward className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP: Set New Password */}
            {forgotStep === 'set-password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-xs text-emerald-200 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Code verified! Enter your new admin password below.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:border-cyan-400 outline-none transition-colors"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {forgotError && (
                  <p className="text-xs font-bold text-red-400 text-center">{forgotError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
                  >
                    <span>Save & Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipAndLogin}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                    title="Skip setting password and enter admin panel directly"
                  >
                    <span>Skip</span>
                    <SkipForward className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP: Initial error or reset option */}
            {forgotStep === 'initial' && forgotError && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-red-400 text-center">{forgotError}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleOpenForgotModal}
                    className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipAndLogin}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>Skip</span>
                    <SkipForward className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
