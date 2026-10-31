import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Mail,
  Lock,
  User,
  Gift,
  CheckCircle2,
  Sparkles,
  UserPlus,
  LogIn,
  Store,
  Building2,
  FileText,
  Upload,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MerchantType } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    loginUser,
    loginDemoUser,
    registerUser,
    registerMerchant,
    setActiveTab,
    setUserCenterActiveNode,
    language,
    t,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');

  // Registration Target: buyer vs merchant
  const [regTarget, setRegTarget] = useState<'buyer' | 'merchant'>('buyer');

  // Sync mode whenever modal opens
  useEffect(() => {
    if (showAuthModal) {
      setMode(authModalMode);
      setMerchantSubmitted(false);
    }
  }, [showAuthModal, authModalMode]);

  // Buyer Form fields
  const [phone, setPhone] = useState('09178889999');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginType, setLoginType] = useState<'otp' | 'password'>('otp');

  // Simplified Merchant Form fields (只需要用户名、手机号、电子邮箱，短信验证码)
  const [merchantUsername, setMerchantUsername] = useState('Manila_TechFlagship');
  const [merchantPhone, setMerchantPhone] = useState('09176668899');
  const [merchantEmail, setMerchantEmail] = useState('partner@ginno-store.ph');
  const [merchantOtp, setMerchantOtp] = useState('');
  const [merchantOtpSent, setMerchantOtpSent] = useState(false);
  const [merchantOtpCountdown, setMerchantOtpCountdown] = useState(0);
  const [merchantPassword, setMerchantPassword] = useState('123456');
  const [merchantSubmitted, setMerchantSubmitted] = useState(false);
  const [submittedStoreName, setSubmittedStoreName] = useState('');

  if (!showAuthModal) return null;

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('8888');
    alert(`Demo SMS Code sent to +63 ${phone}: 8888`);
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert('Please enter mobile phone number');
      return;
    }

    if (mode === 'login') {
      loginUser({
        phone,
        email,
      });
    } else {
      if (!nickname) {
        alert('Please enter a display nickname');
        return;
      }
      registerUser({
        phone,
        nickname,
        email,
        password,
      });
    }
  };

  const handleMerchantSendOtp = () => {
    if (!merchantPhone.trim()) {
      alert(language === 'ZH' ? '请先输入手机号' : 'Please enter mobile phone number');
      return;
    }
    setMerchantOtpSent(true);
    setMerchantOtp('8888');
    setMerchantOtpCountdown(60);
    alert(
      language === 'ZH'
        ? `【吉诺商家入驻】短信验证码 8888 已发送至 +63 ${merchantPhone}（已自动填充）`
        : `SMS verification code 8888 sent to +63 ${merchantPhone} (autofilled)`
    );
  };

  const handleMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantUsername.trim()) {
      alert(language === 'ZH' ? '请输入用户名' : 'Please enter username');
      return;
    }
    if (!merchantPhone.trim()) {
      alert(language === 'ZH' ? '请输入手机号' : 'Please enter mobile phone number');
      return;
    }
    if (!merchantEmail.trim()) {
      alert(language === 'ZH' ? '请输入电子邮箱' : 'Please enter email address');
      return;
    }
    if (!merchantOtp.trim()) {
      alert(language === 'ZH' ? '请输入短信验证码' : 'Please enter SMS verification code');
      return;
    }

    const res = registerMerchant({
      username: merchantUsername.trim(),
      storeName: merchantUsername.trim(),
      ownerName: merchantUsername.trim(),
      phone: merchantPhone.trim(),
      email: merchantEmail.trim(),
      password: merchantPassword || '123456',
    });

    if (res.success) {
      // 注册成功后，自动完成登录
      loginUser({
        phone: merchantPhone.trim(),
        email: merchantEmail.trim(),
        nickname: merchantUsername.trim(),
      });
      setSubmittedStoreName(merchantUsername.trim());
      setMerchantSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`bg-slate-900/95 backdrop-blur-2xl rounded-3xl w-full p-6 sm:p-8 relative shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 text-slate-100 max-h-[92vh] overflow-y-auto ${
          mode === 'register' && regTarget === 'merchant' ? 'max-w-xl' : 'max-w-md'
        }`}
      >
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-purple-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-500/25">
            G
          </div>
          <h3 className="text-xl font-black text-white">
            {mode === 'login'
              ? t('auth.userLogin')
              : regTarget === 'merchant'
              ? language === 'ZH'
                ? '合作店家入驻申请注册'
                : 'Merchant & Store Onboarding Registration'
              : t('auth.newUserRegister')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {regTarget === 'merchant' && mode === 'register'
              ? language === 'ZH'
                ? '自主开店 · 自由销售 · 享受平台流量与百万买家扶持'
                : 'Sell Freely on Ginno PH with Millions of Buyers'
              : 'Quality Chosen, Promise Kept'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setAuthModalMode('login');
              setMerchantSubmitted(false);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t('auth.signIn')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setAuthModalMode('register');
              setMerchantSubmitted(false);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('auth.register')}</span>
          </button>
        </div>

        {/* If Mode is REGISTER, offer choice between Buyer vs Merchant */}
        {mode === 'register' && !merchantSubmitted && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 mb-4">
            <button
              type="button"
              onClick={() => setRegTarget('buyer')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                regTarget === 'buyer'
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4 text-[#FF8C61]" />
              <span>{language === 'ZH' ? '普通买家注册' : 'Buyer Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRegTarget('merchant')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                regTarget === 'merchant'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span>{language === 'ZH' ? '店家入驻注册 ⚡' : 'Merchant Partner ⚡'}</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* CASE 1: Merchant Successfully Submitted View                      */}
        {/* ================================================================= */}
        {merchantSubmitted ? (
          <div className="bg-slate-950/60 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">
                {language === 'ZH' ? '🎉 店家入驻注册成功，已自动登录！' : '🎉 Merchant Registered & Logged In!'}
              </h4>
              <p className="text-xs text-amber-300 font-bold mt-1">
                「{submittedStoreName}」
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left text-xs space-y-2.5 text-slate-300">
              <div className="flex items-center gap-2 font-bold text-white text-xs border-b border-white/10 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'ZH' ? '店家资质上传与开店流程指引:' : 'Store Setup & Verification Guide:'}</span>
              </div>
              <p className="leading-relaxed text-amber-200">
                {language === 'ZH'
                  ? '• 简化入驻注册已完成！您现在可以在【店家设置】中，完成营业执照、法人身份证、店铺Logo与门头招牌等资质材料的上传和内容修订。'
                  : '• Registration complete! You can now upload business permits, IDs, and store branding in Store Settings.'}
              </p>
              <p className="leading-relaxed text-slate-400">
                {language === 'ZH'
                  ? '• 所有图片均具备实时本地文件上传功能。上传提交后将实时进入平台系统的【企业合作 -> 店家审核机制】。'
                  : '• All images support direct file upload. Materials will be synced to the admin review queue.'}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setUserCenterActiveNode('merchant_settings');
                  setActiveTab('user');
                  setShowAuthModal(false);
                  setMerchantSubmitted(false);
                }}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4 text-amber-300" />
                <span>{language === 'ZH' ? '立即前往【店家设置】上传资质材料 ⚡' : 'Go to Store Settings & Upload Credentials ⚡'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setMerchantSubmitted(false);
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-slate-300 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                {language === 'ZH' ? '返回商城首页' : 'Return to Home'}
              </button>
            </div>
          </div>
        ) : mode === 'register' && regTarget === 'merchant' ? (
          /* ================================================================= */
          /* CASE 2: Simplified Merchant Registration Form                     */
          /* 只需要：用户名、手机号、电子邮箱，短信验证码                        */
          /* ================================================================= */
          <form onSubmit={handleMerchantSubmit} className="space-y-3.5">
            {/* Guidance Notification Banner */}
            <div className="bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-[#FF6B35]/15 border border-purple-500/30 rounded-2xl p-3 text-xs text-purple-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{language === 'ZH' ? '极简入驻 · 快速开通' : 'Fast Onboarding'}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {language === 'ZH'
                  ? '开店仅需填写以下4项基础信息。注册成功后，登录即可在【店家设置】中完成营业执照、身份证件、店铺Logo与门头招牌等资质材料的上传和内容修订。'
                  : 'Registration only requires 4 fields. After signup, complete document uploads in Store Settings.'}
              </p>
            </div>

            {/* 1. 用户名 (Username) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'ZH' ? '1. 用户名 / 店铺账号名 (Username) *' : '1. Username / Store Account *'}
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={merchantUsername}
                  onChange={(e) => setMerchantUsername(e.target.value)}
                  placeholder="e.g. Manila_TechFlagship"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. 手机号 (Mobile Phone) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'ZH' ? '2. 手机号 (Mobile Phone) *' : '2. Mobile Phone Number *'}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-slate-400 border-r border-white/10 pr-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-[#FF8C61]" /> +63
                </span>
                <input
                  type="tel"
                  required
                  value={merchantPhone}
                  onChange={(e) => setMerchantPhone(e.target.value)}
                  placeholder="917 666 8899"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-18 pr-3 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. 电子邮箱 (Email Address) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'ZH' ? '3. 电子邮箱 (Email Address) *' : '3. Email Address *'}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-blue-400" />
                <input
                  type="email"
                  required
                  value={merchantEmail}
                  onChange={(e) => setMerchantEmail(e.target.value)}
                  placeholder="partner@ginno-store.ph"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. 短信验证码 (SMS Code) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'ZH' ? '4. 短信验证码 (SMS Verification Code) *' : '4. SMS Verification Code *'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-emerald-400" />
                  <input
                    type="text"
                    required
                    value={merchantOtp}
                    onChange={(e) => setMerchantOtp(e.target.value)}
                    placeholder={language === 'ZH' ? '请输入验证码 (点击获取)' : 'Enter SMS code'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleMerchantSendOtp}
                  className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-md shadow-purple-500/20"
                >
                  {merchantOtpSent
                    ? language === 'ZH'
                      ? '已发送 (8888)'
                      : 'Sent (8888)'
                    : language === 'ZH'
                    ? '获取验证码'
                    : 'Get Code'}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-[#FF6B35] hover:opacity-95 text-white font-black py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-all mt-4 flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'ZH'
                  ? '立即开通店家账号 (注册并登录) ⚡'
                  : 'Complete Merchant Registration & Sign In ⚡'}
              </span>
            </button>
          </form>
        ) : (
          /* ================================================================= */
          /* CASE 3: Standard Buyer Login / Registration Form                  */
          /* ================================================================= */
          <form onSubmit={handleBuyerSubmit} className="space-y-3.5">
            {/* Registration Perks Banner */}
            {mode === 'register' && (
              <div className="mb-4 bg-gradient-to-r from-amber-500/20 to-purple-600/20 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-200 flex items-center gap-2.5">
                <Gift className="w-6 h-6 text-[#FFD23F] shrink-0 animate-bounce" />
                <div>
                  <p className="font-extrabold text-amber-300">New Registration Benefit!</p>
                  <p className="text-[11px] text-amber-200/90">
                    Get ₱500 Voucher + 500 Reward Points + ₱1,000 Wallet Balance!
                  </p>
                </div>
              </div>
            )}

            {/* Registration Extra Fields */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Display Nickname / Username (用户昵称)
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Philippines Mobile Number (手机号码)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-slate-400 border-r border-white/10 pr-2">
                  +63
                </span>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="917 888 9999"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-16 pr-4 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Email Address (电子邮箱 - Optional)
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Verification Code or Password */}
            {mode === 'login' && (
              <div className="flex gap-2 text-[11px] mb-1 font-bold text-slate-400">
                <button
                  type="button"
                  onClick={() => setLoginType('otp')}
                  className={`pb-1 border-b-2 ${
                    loginType === 'otp' ? 'border-[#FF6B35] text-[#FF8C61]' : 'border-transparent'
                  }`}
                >
                  SMS Code Login
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setLoginType('password')}
                  className={`pb-1 border-b-2 ${
                    loginType === 'password' ? 'border-[#FF6B35] text-[#FF8C61]' : 'border-transparent'
                  }`}
                >
                  Password Login
                </button>
              </div>
            )}

            {mode === 'register' || loginType === 'otp' ? (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  SMS Verification Code (短信验证码)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter code (e.g. 8888)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-white/10 border border-white/15 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 transition-colors"
                  >
                    {otpSent ? 'Code: 8888' : 'Get Code'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Password (密码)
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-extrabold py-3 rounded-xl text-sm shadow-lg shadow-purple-500/25 transition-all mt-2 flex items-center justify-center gap-2"
            >
              {mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Confirm Login (确认登录)</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Complete Registration (完成买家注册)</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 1-Click Fast Demo Accounts (模拟账号极速登录: 购买用户 vs 店家) */}
        {mode === 'login' && (
          <div className="mt-5 border-t border-white/10 pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ZH' ? '模拟账号极速体验 (选择角色)' : 'Simulated Accounts (Select Role)'}</span>
              </p>
              <span className="text-[10px] text-slate-400">
                {language === 'ZH' ? '免验证码一键直达' : '1-Click Instant Login'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Buyer Demo Account */}
              <button
                type="button"
                onClick={() => {
                  loginDemoUser('buyer');
                  setActiveTab('user');
                }}
                className="group relative bg-gradient-to-br from-orange-500/10 to-amber-500/5 hover:from-orange-500/20 hover:to-amber-500/15 border border-orange-500/30 hover:border-orange-500/60 p-3 rounded-2xl text-left transition-all shadow-sm hover:shadow-orange-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-100 truncate">Elena Cruz</p>
                      <span className="text-[9px] bg-orange-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                        {language === 'ZH' ? '购买用户' : 'Buyer'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {language === 'ZH' ? '买家订单 · 积分 · 卡券包' : 'Orders · Points · Vouchers'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-black text-[#FF8C61] flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'ZH' ? '以购买用户登录 →' : 'Sign in as Buyer →'}</span>
                  <span className="text-[9px] text-slate-400">Gold VIP</span>
                </div>
              </button>

              {/* Merchant Demo Account */}
              <button
                type="button"
                onClick={() => {
                  loginDemoUser('merchant');
                  setActiveTab('user');
                }}
                className="group relative bg-gradient-to-br from-purple-500/15 to-blue-500/10 hover:from-purple-500/25 hover:to-blue-500/20 border border-purple-500/40 hover:border-purple-500/70 p-3 rounded-2xl text-left transition-all shadow-sm hover:shadow-purple-500/10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-100 truncate">Alexander Sy</p>
                      <span className="text-[9px] bg-purple-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                        {language === 'ZH' ? '店家商户' : 'Merchant'}
                      </span>
                    </div>
                    <p className="text-[10px] text-purple-300/80 mt-0.5 truncate">
                      {language === 'ZH' ? '经营看板 · 商品 · 发货 · 财务' : 'GMV · Orders · Finance'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-black text-purple-300 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'ZH' ? '以店家登录工作台 →' : 'Sign in as Merchant →'}</span>
                  <span className="text-[9px] text-amber-300 font-bold">S级旗舰店</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Quick Merchant Onboarding Prompt at Footer */}
        {mode === 'login' && (
          <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-slate-300 font-semibold">
                {language === 'ZH' ? '想在平台开店卖货？' : 'Want to sell on Ginno?'}
              </span>
            </div>
            <button
              onClick={() => {
                setMode('register');
                setRegTarget('merchant');
              }}
              className="text-[#FF8C61] hover:underline font-bold"
            >
              {language === 'ZH' ? '申请入驻开店 →' : 'Merchant Apply →'}
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              const newM = mode === 'login' ? 'register' : 'login';
              setMode(newM);
              setAuthModalMode(newM);
              setMerchantSubmitted(false);
            }}
            className="text-xs text-[#FF8C61] font-bold hover:underline"
          >
            {mode === 'login'
              ? "Don't have an account? Register now (立即注册)"
              : 'Already have an account? Login now (立即登录)'}
          </button>
        </div>
      </div>
    </div>
  );
};
