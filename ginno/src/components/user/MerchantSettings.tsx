import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Store,
  Building2,
  User,
  ShieldCheck,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Eye,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Percent,
  Star,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Merchant, MerchantType, MerchantStatus } from '../../types';

export const MerchantSettings: React.FC = () => {
  const {
    language,
    user,
    merchants,
    adminUpdateMerchantDetails,
    registerMerchant,
    setToastNotice,
    addAuditLog,
    setActiveTab,
  } = useApp();

  // Find merchant linked to the current user (by phone, email, nickname, or ownerName)
  const currentMerchant: Merchant | undefined = merchants.find(
    (m) =>
      (user.phone && m.phone === user.phone) ||
      (user.email && m.email === user.email) ||
      (user.nickname && (m.ownerName === user.nickname || m.storeName === user.nickname))
  ) || merchants[0]; // fallback to first merchant if none explicitly matched

  // Form State
  const [storeName, setStoreName] = useState(currentMerchant?.storeName || '我的优选旗舰店');
  const [storeNameZh, setStoreNameZh] = useState(currentMerchant?.storeNameZh || '');
  const [merchantType, setMerchantType] = useState<MerchantType>(currentMerchant?.type || 'enterprise');
  const [category, setCategory] = useState(currentMerchant?.category || '数码家电 (Electronics & Gadgets)');
  const [ownerName, setOwnerName] = useState(currentMerchant?.ownerName || user.nickname || 'Rodrigo Cruz');
  const [phone, setPhone] = useState(currentMerchant?.phone || user.phone || '09176668899');
  const [email, setEmail] = useState(currentMerchant?.email || user.email || 'merchant@ginno-store.ph');
  const [idCardNumber, setIdCardNumber] = useState(currentMerchant?.idCardNumber || '110101199508182234');
  const [businessLicenseNumber, setBusinessLicenseNumber] = useState(
    currentMerchant?.businessLicenseNumber || 'SEC-CS202688991'
  );
  const [taxNumber, setTaxNumber] = useState(currentMerchant?.taxNumber || 'TIN-492-881-000');
  const [description, setDescription] = useState(
    currentMerchant?.description || 'Ginno官方直营认证，100%正品保障，支持7天无理由退换及极速发货。'
  );
  const [address, setAddress] = useState(
    currentMerchant?.address || 'Building 8, Global City Logistics Center, Taguig, Metro Manila, Philippines'
  );

  // Image Upload States (All with live Base64 previews)
  const [logo, setLogo] = useState(
    currentMerchant?.logo ||
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=80'
  );
  const [licenseImage, setLicenseImage] = useState(
    currentMerchant?.licenseImage ||
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
  );
  const [idCardImage, setIdCardImage] = useState(
    currentMerchant?.idCardImage ||
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80'
  );
  const [idCardBackImage, setIdCardBackImage] = useState(
    currentMerchant?.idCardBackImage ||
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'
  );
  const [bannerImage, setBannerImage] = useState(
    currentMerchant?.bannerImage ||
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80'
  );

  // Hidden file input refs
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const licenseInputRef = useRef<HTMLInputElement | null>(null);
  const idCardInputRef = useRef<HTMLInputElement | null>(null);
  const idCardBackInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  // Zoom preview modal for documents
  const [previewZoomImage, setPreviewZoomImage] = useState<{ url: string; title: string } | null>(null);

  // Status tracking
  const [currentStatus, setCurrentStatus] = useState<MerchantStatus>(currentMerchant?.status || 'pending_review');

  // Sync state if currentMerchant changes
  useEffect(() => {
    if (currentMerchant) {
      setStoreName(currentMerchant.storeName || '');
      setStoreNameZh(currentMerchant.storeNameZh || '');
      setMerchantType(currentMerchant.type || 'enterprise');
      setCategory(currentMerchant.category || '数码家电 (Electronics & Gadgets)');
      setOwnerName(currentMerchant.ownerName || '');
      setPhone(currentMerchant.phone || '');
      setEmail(currentMerchant.email || '');
      setIdCardNumber(currentMerchant.idCardNumber || '');
      setBusinessLicenseNumber(currentMerchant.businessLicenseNumber || '');
      setTaxNumber(currentMerchant.taxNumber || '');
      setDescription(currentMerchant.description || '');
      setAddress(currentMerchant.address || '');
      if (currentMerchant.logo) setLogo(currentMerchant.logo);
      if (currentMerchant.licenseImage) setLicenseImage(currentMerchant.licenseImage);
      if (currentMerchant.idCardImage) setIdCardImage(currentMerchant.idCardImage);
      if (currentMerchant.idCardBackImage) setIdCardBackImage(currentMerchant.idCardBackImage);
      if (currentMerchant.bannerImage) setBannerImage(currentMerchant.bannerImage);
      setCurrentStatus(currentMerchant.status);
    }
  }, [currentMerchant]);

  // Generic File Upload Handler using FileReader
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageSetter: (val: string) => void,
    fieldLabel: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(language === 'ZH' ? '图片文件大小不能超过8MB' : 'Image file size cannot exceed 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageSetter(result);
        setToastNotice({
          message:
            language === 'ZH'
              ? `【${fieldLabel}】上传成功！`
              : `${fieldLabel} uploaded successfully!`,
          type: 'success',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit and save handler
  const handleSaveSettings = (submitForReview: boolean) => {
    if (!storeName.trim()) {
      alert(language === 'ZH' ? '请输入店铺名称' : 'Please enter store name');
      return;
    }
    if (!ownerName.trim()) {
      alert(language === 'ZH' ? '请输入联系人/法人姓名' : 'Please enter owner name');
      return;
    }
    if (!phone.trim()) {
      alert(language === 'ZH' ? '请输入联系电话' : 'Please enter contact phone');
      return;
    }

    const nextStatus = submitForReview ? 'pending_review' : currentStatus;

    const updates: Partial<Merchant> = {
      storeName: storeName.trim(),
      storeNameZh: storeNameZh.trim() || undefined,
      type: merchantType,
      category,
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      idCardNumber: idCardNumber.trim(),
      businessLicenseNumber: businessLicenseNumber.trim() || undefined,
      taxNumber: taxNumber.trim() || undefined,
      description: description.trim(),
      address: address.trim(),
      logo,
      licenseImage,
      idCardImage,
      idCardBackImage,
      bannerImage,
      status: nextStatus,
    };

    if (currentMerchant) {
      adminUpdateMerchantDetails(currentMerchant.id, updates);
      setCurrentStatus(nextStatus);
    } else {
      // If merchant record doesn't exist yet, register a new one
      registerMerchant({
        storeName: storeName.trim(),
        type: merchantType,
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        idCardNumber: idCardNumber.trim(),
        businessLicenseNumber: businessLicenseNumber.trim(),
        taxNumber: taxNumber.trim(),
        category,
        description: description.trim(),
        licenseImage,
        idCardImage,
        idCardBackImage,
        bannerImage,
        address: address.trim(),
      });
      setCurrentStatus('pending_review');
    }

    if (submitForReview) {
      addAuditLog(
        '店家审核机制',
        `店家「${storeName}」提交了最新的资质上传文件与资料修订，等待后台复核。`
      );
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch (e) {}
      alert(
        language === 'ZH'
          ? '🎉 店家设置与资质材料已成功提交！后台【店家审核机制】已同步收到更新，平台运营将尽快复核。'
          : '🎉 Store settings & qualification materials submitted for review!'
      );
    } else {
      setToastNotice({
        message: language === 'ZH' ? '店家设置已保存！' : 'Store settings saved successfully!',
        type: 'success',
      });
    }
  };

  const CATEGORY_OPTIONS = [
    '数码家电 (Electronics & Gadgets)',
    '美妆个护 (Beauty & Skincare)',
    '潮流服饰 (Fashion & Apparel)',
    '潮玩盲盒 (Toys & Blind Box)',
    '生鲜食品 (Food & Groceries)',
    '家居百货 (Home & Living)',
    '母婴用品 (Maternity & Baby)',
    '运动户外 (Sports & Outdoors)',
    '钟表珠宝 (Watches & Jewelry)',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Card with Store Profile & Review Status Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img
                src={logo}
                alt={storeName}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-purple-500/30 bg-slate-800 shadow-xl"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold"
                title={language === 'ZH' ? '更换店铺Logo' : 'Change Logo'}
              >
                <Camera className="w-5 h-5 mb-0.5 text-purple-300" />
                <span>{language === 'ZH' ? '更换Logo' : 'Upload'}</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">{storeName || '我的合作店铺'}</h2>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    merchantType === 'enterprise'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}
                >
                  {merchantType === 'enterprise'
                    ? language === 'ZH'
                      ? '🏢 企业合作店家'
                      : 'Enterprise'
                    : language === 'ZH'
                    ? '👤 个人合作入驻'
                    : 'Individual'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {ownerName}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {phone}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {email}
                </span>
              </p>

              {/* Status Banner */}
              <div className="mt-3 flex items-center gap-2">
                {currentStatus === 'pending_review' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    {language === 'ZH'
                      ? '资质材料审核中 · 平台运营正在核验您的证件'
                      : 'Pending Review by Admin'}
                  </span>
                )}
                {currentStatus === 'active' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {language === 'ZH'
                      ? '资质审核已通过 · 自由销售正常营业中'
                      : 'Active & Verified for Selling'}
                  </span>
                )}
                {currentStatus === 'rejected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    <XCircle className="w-3.5 h-3.5" />
                    {language === 'ZH'
                      ? `资质审核已驳回: ${currentMerchant?.rejectReason || '证件模糊'}`
                      : 'Application Rejected - Please Revise'}
                  </span>
                )}
                {currentStatus === 'suspended' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-700/60 text-slate-300 border border-slate-600">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    {language === 'ZH' ? '店铺已被停用' : 'Store Suspended'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center bg-white/5 border border-white/10 p-3 rounded-2xl text-xs">
            <div>
              <span className="block text-[10px] text-slate-400">
                {language === 'ZH' ? '评级等级' : 'Rating Tier'}
              </span>
              <span className="text-base font-black text-amber-300">
                {currentMerchant?.ratingTier || 'C'} 级
              </span>
            </div>
            <div className="border-x border-white/10 px-2">
              <span className="block text-[10px] text-slate-400">
                {language === 'ZH' ? '综合评分' : 'Rating'}
              </span>
              <span className="text-base font-black text-white">
                {currentMerchant?.compositeScore?.toFixed(1) || '4.8'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">
                {language === 'ZH' ? '违规扣分' : 'Violations'}
              </span>
              <span
                className={`text-base font-black ${
                  (currentMerchant?.violationPoints || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {currentMerchant?.violationPoints || 0} / 12
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hidden Real File Upload Inputs */}
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, setLogo, '店铺Logo')}
      />
      <input
        type="file"
        ref={licenseInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, setLicenseImage, '营业执照/经营许可')}
      />
      <input
        type="file"
        ref={idCardInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, setIdCardImage, '法人身份证人像面')}
      />
      <input
        type="file"
        ref={idCardBackInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, setIdCardBackImage, '法人身份证国徽面/护照页')}
      />
      <input
        type="file"
        ref={bannerInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, setBannerImage, '店铺招牌横幅')}
      />

      {/* 3. Image Qualifications Upload Section (所有图片，都需要有上传功能) */}
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {language === 'ZH'
                  ? '店家资质与图像材料上传 (支持实时本地选取与替换)'
                  : 'Store Images & Qualification Documents Upload'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'ZH'
                  ? '所有证件及招牌均支持本地文件上传（JPG/PNG/WEBP，单张不超过8MB），上传后将自动同步至后台审核机制'
                  : 'All images support interactive file upload with live preview'}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">
            100% 真实上传支持
          </span>
        </div>

        {/* Image Grid: 5 Types of Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* A. 店铺 Logo */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-purple-400" />
                {language === 'ZH' ? '1. 店铺 Logo (Avatar)' : '1. Store Logo'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {language === 'ZH' ? '已配置' : 'Configured'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shrink-0 relative group">
                <img src={logo} alt="Store Logo" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewZoomImage({ url: logo, title: '店铺 Logo' })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 leading-tight">
                  {language === 'ZH' ? '建议 1:1 正方形，展示于商品详情与店铺主页' : 'Square 1:1 ratio'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{language === 'ZH' ? '点击上传' : 'Upload'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogo('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300')}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
                    title={language === 'ZH' ? '重置为默认Logo' : 'Reset to default'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* B. 营业执照扫描件 / 经营许可 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                {language === 'ZH' ? '2. 营业执照扫描件 / SEC / DTI' : '2. Business Permit / SEC'}
              </span>
              <span className="text-[10px] text-amber-300 font-bold">
                {merchantType === 'enterprise' ? (language === 'ZH' ? '企业必传' : 'Required') : (language === 'ZH' ? '个体选传' : 'Optional')}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shrink-0 relative group">
                {licenseImage ? (
                  <>
                    <img src={licenseImage} alt="Business License" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewZoomImage({ url: licenseImage, title: '营业执照 / 经营资质扫描件' })}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px]">
                    <Upload className="w-5 h-5 mb-1" />
                    <span>待上传</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 leading-tight">
                  {language === 'ZH' ? '企业营业执照原件清晰扫描件或DTI/SEC证件照' : 'Clear official permit document'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => licenseInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{language === 'ZH' ? '上传营业证照' : 'Upload Permit'}</span>
                  </button>
                  {licenseImage && (
                    <button
                      type="button"
                      onClick={() => setLicenseImage('')}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
                      title={language === 'ZH' ? '移除此图片' : 'Remove'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* C. 法人身份证人像面 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'ZH' ? '3. 法人身份证 (正面/人像面)' : '3. Legal ID Front'}
              </span>
              <span className="text-[10px] text-amber-300 font-bold">{language === 'ZH' ? '实名必传' : 'Required'}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shrink-0 relative group">
                {idCardImage ? (
                  <>
                    <img src={idCardImage} alt="ID Front" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewZoomImage({ url: idCardImage, title: '法定代表人身份证（人像面）' })}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px]">
                    <Upload className="w-5 h-5 mb-1" />
                    <span>待上传</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 leading-tight">
                  {language === 'ZH' ? '身份证正面人像页，字迹清晰无遮挡' : 'Front photo of government issued ID'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => idCardInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{language === 'ZH' ? '上传正面' : 'Upload Front'}</span>
                  </button>
                  {idCardImage && (
                    <button
                      type="button"
                      onClick={() => setIdCardImage('')}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
                      title={language === 'ZH' ? '移除此图片' : 'Remove'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* D. 法人身份证国徽面 / 护照页 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'ZH' ? '4. 法人身份证 (反面/国徽面/护照)' : '4. Legal ID Back / Passport'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{language === 'ZH' ? '推荐上传' : 'Recommended'}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shrink-0 relative group">
                {idCardBackImage ? (
                  <>
                    <img src={idCardBackImage} alt="ID Back" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewZoomImage({ url: idCardBackImage, title: '法定代表人身份证（国徽面/反面）' })}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px]">
                    <Upload className="w-5 h-5 mb-1" />
                    <span>待上传</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 leading-tight">
                  {language === 'ZH' ? '身份证反面国徽页，需在有效期内' : 'Back side of government ID or Passport'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => idCardBackInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{language === 'ZH' ? '上传反面' : 'Upload Back'}</span>
                  </button>
                  {idCardBackImage && (
                    <button
                      type="button"
                      onClick={() => setIdCardBackImage('')}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
                      title={language === 'ZH' ? '移除此图片' : 'Remove'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* E. 店铺招牌/横幅 (Store Banner) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-colors md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                {language === 'ZH' ? '5. 店铺招牌与门头横幅 (Store Header Banner)' : '5. Store Banner'}
              </span>
              <span className="text-[10px] text-purple-300 font-bold">{language === 'ZH' ? '提升店铺转化' : 'Visual Branding'}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-48 h-20 rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shrink-0 relative group">
                <img src={bannerImage} alt="Store Banner" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewZoomImage({ url: bannerImage, title: '店铺门头招牌横幅' })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 leading-tight">
                  {language === 'ZH' ? '宽屏全景横幅（建议 1200x400 像素），将作为店铺专属页面的主视觉招牌' : 'Wide aspect banner (1200x400px suggested)'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{language === 'ZH' ? '上传店铺横幅' : 'Upload Banner'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerImage('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200')}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
                    title={language === 'ZH' ? '恢复默认横幅' : 'Reset'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Store Basic & Legal Content Revision Form (内容修订) */}
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {language === 'ZH' ? '店铺基本信息与经营资质修订' : 'Store Details & Business Info Revision'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'ZH' ? '随时修订店铺名称、负责人、税务代码与经营类目' : 'Update your store profile and contact information'}
              </p>
            </div>
          </div>
        </div>

        {/* Entity Type Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            {language === 'ZH' ? '店家合作主体性质 (Merchant Entity Type) *' : 'Merchant Type *'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMerchantType('enterprise')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 ${
                merchantType === 'enterprise'
                  ? 'bg-purple-600/25 border-purple-500 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="text-left">
                <span className="block">{language === 'ZH' ? '企业店家 (Enterprise Store)' : 'Enterprise'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {language === 'ZH' ? '需提供营业执照 / SEC注册号' : 'Requires DTI / SEC permit'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMerchantType('individual')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 ${
                merchantType === 'individual'
                  ? 'bg-blue-600/25 border-blue-500 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-left">
                <span className="block">{language === 'ZH' ? '个人/创作者入驻 (Individual)' : 'Individual Store'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {language === 'ZH' ? '仅需个人有效身份证件' : 'Requires Government ID'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Store Name & Primary Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '店铺英文/国际名称 (Store Name) *' : 'Store Name *'}
            </label>
            <div className="relative flex items-center">
              <Store className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Manila Tech Hub Flagship"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '店铺中文名称 (可选)' : 'Store Name (Chinese)'}
            </label>
            <input
              type="text"
              value={storeNameZh}
              onChange={(e) => setStoreNameZh(e.target.value)}
              placeholder="例如：马尼拉潮玩数码专营店"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Primary Category & Legal Owner Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '主营类目 (Primary Category) *' : 'Primary Category *'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '联系人/法人姓名 (Legal Owner) *' : 'Legal Owner Name *'}
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Juan Rodrigo Dela Cruz"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '联系手机号码 (Mobile Phone) *' : 'Mobile Phone *'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-400 border-r border-white/10 pr-2">
                +63
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="917 888 9999"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-14 pr-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '商业电子邮箱 (Business Email) *' : 'Business Email *'}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@store.ph"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>
        </div>

        {/* ID Number & Business License & TIN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '法人身份证件号 (Government ID No.) *' : 'ID Card / Passport No. *'}
            </label>
            <input
              type="text"
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value)}
              placeholder="e.g. 110101199508182234 / PhilSys ID"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '营业执照 / SEC 登记号' : 'SEC / DTI Permit No.'}
            </label>
            <input
              type="text"
              value={businessLicenseNumber}
              onChange={(e) => setBusinessLicenseNumber(e.target.value)}
              placeholder="e.g. SEC-CS202688991"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ZH' ? '税务登记号 TIN (Tax No.)' : 'Tax Identification TIN'}
            </label>
            <input
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="e.g. TIN-492-881-000"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Warehouse & Return Address */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            {language === 'ZH' ? '发货与退换货物流地址 (Return & Warehouse Address)' : 'Logistics Address'}
          </label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Global City Logistics Park, Taguig City, Metro Manila"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Store Description & Quality Pledge */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            {language === 'ZH' ? '店铺简介与正品服务承诺 (Store Description & Warranty Statement)' : 'Store Description'}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="介绍您的品牌特色、商品来源与售后保障..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 leading-relaxed"
          />
        </div>

        {/* Action Buttons: Save Draft vs Submit for Audit */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {language === 'ZH'
                ? '点击「保存并提交审核」后，资质将直接提交至后台系统【企业合作 -> 店家审核机制】'
                : 'Submissions are linked to the admin audit queue'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSaveSettings(false)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{language === 'ZH' ? '仅保存修改' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveSettings(true)}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'ZH' ? '保存并提交平台审核 ⚡' : 'Save & Submit for Audit ⚡'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Document Image Zoom Preview Modal */}
      {previewZoomImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>{previewZoomImage.title}</span>
              </h4>
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-2xl bg-slate-950 border border-white/10 p-2 flex items-center justify-center">
              <img
                src={previewZoomImage.url}
                alt={previewZoomImage.title}
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
              >
                {language === 'ZH' ? '关闭预览' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
