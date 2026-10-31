import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Key,
  Globe,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const AdminLogin: React.FC = () => {
  const { setIsAdminAuthenticated, setIsAdminView, language, setLanguage } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [captchaCode, setCaptchaCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 4-character captcha
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Draw CAPTCHA on Canvas
  useEffect(() => {
    if (!captchaCode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Random noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 200 + 55}, ${Math.random() * 200 + 55}, 255, 0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Random noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Render characters
    ctx.font = 'bold 22px monospace';
    ctx.textBaseline = 'middle';
    const charWidth = canvas.width / 4;

    for (let i = 0; i < captchaCode.length; i++) {
      ctx.save();
      const x = i * charWidth + charWidth / 2;
      const y = canvas.height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() - 0.5) * 0.4;

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Gradient text color
      const colors = ['#FF6B35', '#a855f7', '#38bdf8', '#4ade80', '#facc15'];
      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 4;

      ctx.fillText(captchaCode[i], -8, 0);
      ctx.restore();
    }
  }, [captchaCode]);

  // Handle 1-Click Fill Test Account
  const handleFillTestAccount = () => {
    setUsername('admin');
    setPassword('admin123456');
    setCaptchaInput(captchaCode);
    setErrorMessage('');
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      setErrorMessage(
        language === 'ZH'
          ? '请输入管理员账号'
          : language === 'TL'
          ? 'Mangyaring ilagay ang username'
          : 'Please enter admin username'
      );
      return;
    }
    if (!password) {
      setErrorMessage(
        language === 'ZH'
          ? '请输入密码'
          : language === 'TL'
          ? 'Mangyaring ilagay ang password'
          : 'Please enter password'
      );
      return;
    }
    if (!captchaInput.trim()) {
      setErrorMessage(
        language === 'ZH'
          ? '请输入图形验证码'
          : language === 'TL'
          ? 'Mangyaring ilagay ang verification code'
          : 'Please enter captcha code'
      );
      return;
    }

    if (captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      setErrorMessage(
        language === 'ZH'
          ? '验证码输入错误，请重试'
          : language === 'TL'
          ? 'Maling verification code'
          : 'Incorrect verification code'
      );
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    // Validate Credentials
    if (
      (username.trim() === 'admin' || username.trim() === 'admin_root') &&
      password === 'admin123456'
    ) {
      setIsSubmitting(true);
      setSuccessMessage(
        language === 'ZH'
          ? '登录成功！正在跳转至管理后台...'
          : language === 'TL'
          ? 'Tagumpay ang pag-login! Pumupunta sa management console...'
          : 'Login successful! Redirecting to Management Console...'
      );

      setTimeout(() => {
        setIsAdminAuthenticated(true);
      }, 600);
    } else {
      setErrorMessage(
        language === 'ZH'
          ? '账号或密码错误。默认测试账号: admin / admin123456'
          : language === 'TL'
          ? 'Maling username o password. Test account: admin / admin123456'
          : 'Invalid username or password. Default test account: admin / admin123456'
      );
      generateCaptcha();
      setCaptchaInput('');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Header Toolbar for Admin Login */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 px-1">
        <button
          onClick={() => setIsAdminView(false)}
          className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ZH' ? '返回买家前台' : language === 'TL' ? 'Bumalik sa Tindahan' : 'Buyer Store'}</span>
        </button>

        {/* Internationalization Language Selector */}
        <div className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs transition-colors backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-[#FF8C61] shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="EN" className="bg-slate-900 text-slate-100">English (PH)</option>
            <option value="TL" className="bg-slate-900 text-slate-100">Tagalog (PH)</option>
            <option value="ZH" className="bg-slate-900 text-slate-100">简体中文</option>
          </select>
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative z-10 space-y-6">
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-purple-600 shadow-xl shadow-purple-500/20 mb-1">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {language === 'ZH' ? '吉诺电商后台管理系统' : language === 'TL' ? 'Ginno Admin Portal' : 'Ginno Admin Portal'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {language === 'ZH' ? 'RBAC 权限管理控制终端' : language === 'TL' ? 'RBAC Management System' : 'RBAC Security Terminal'}
          </p>
        </div>

        {/* Default Credentials Box */}
        <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-purple-300 font-extrabold">
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              {language === 'ZH' ? '系统演示测试账号' : language === 'TL' ? 'Test Credentials' : 'Default Test Credentials'}
            </span>
            <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-md border border-purple-500/30">
              Demo Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-500 block">{language === 'ZH' ? '账号:' : language === 'TL' ? 'Username:' : 'Username:'}</span>
              <strong className="text-amber-300 font-mono">admin</strong>
            </div>
            <div>
              <span className="text-slate-500 block">{language === 'ZH' ? '密码:' : language === 'TL' ? 'Password:' : 'Password:'}</span>
              <strong className="text-amber-300 font-mono">admin123456</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillTestAccount}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ZH' ? '一键自动填入测试账号' : language === 'TL' ? 'Awtomatikong Punan' : 'Auto-fill Test Credentials'}</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-2xl text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              {language === 'ZH' ? '管理员账号' : language === 'TL' ? 'Username' : 'Username'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder={language === 'ZH' ? '请输入管理员账号 (admin)' : language === 'TL' ? 'Ilagay ang username (admin)' : 'Enter admin username (admin)'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              {language === 'ZH' ? '登录密码' : language === 'TL' ? 'Password' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={language === 'ZH' ? '请输入密码 (admin123456)' : language === 'TL' ? 'Ilagay ang password (admin123456)' : 'Enter password (admin123456)'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Captcha Verification */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              {language === 'ZH' ? '图形验证码' : language === 'TL' ? 'Verification Code' : 'Verification Code'}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                required
                maxLength={6}
                placeholder={language === 'ZH' ? '请输入验证码' : language === 'TL' ? 'Ilagay ang code' : 'Enter code'}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 uppercase tracking-widest font-mono"
              />

              <div
                onClick={generateCaptcha}
                className="relative cursor-pointer group rounded-xl overflow-hidden border border-white/15 bg-slate-950 shrink-0"
                title={language === 'ZH' ? '点击刷新验证码' : language === 'TL' ? 'I-refresh ang code' : 'Click to refresh captcha'}
              >
                <canvas ref={canvasRef} width={100} height={38} className="block" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black py-3 rounded-2xl text-xs transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting
                ? (language === 'ZH' ? '正在验证...' : language === 'TL' ? 'Sinusuri...' : 'Authenticating...')
                : (language === 'ZH' ? '安全登录管理后台' : language === 'TL' ? 'Mag-login sa Console' : 'Sign In to Management Console')}
            </span>
          </button>
        </form>

        {/* Return to Store Action */}
        <div className="pt-2 text-center border-t border-white/10">
          <button
            onClick={() => setIsAdminView(false)}
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'ZH' ? '返回买家前台商城' : language === 'TL' ? 'Bumalik sa Tindahan' : 'Return to E-Commerce Store Front'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
