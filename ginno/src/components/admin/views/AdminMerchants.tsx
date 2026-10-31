import React, { useState } from 'react';
import {
  Store,
  Building2,
  UserCheck,
  ShieldAlert,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Lock,
  RefreshCw,
  ExternalLink,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  ChevronRight,
  Shield,
  Clock,
  ThumbsUp,
  Package,
  Key,
  Copy,
  Sparkles,
  Phone,
  Mail,
  User,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Merchant, MerchantRatingTier, MerchantType, MerchantViolationRecord } from '../../../types';

export const AdminMerchants: React.FC = () => {
  const {
    merchants,
    merchantViolations,
    adminApproveMerchant,
    adminRejectMerchant,
    adminToggleMerchantStatus,
    adminResetMerchantPassword,
    adminUpdateMerchantTier,
    adminAddMerchantViolation,
    adminHandleViolationAppeal,
    adminUpdateMerchantDetails,
    language,
  } = useApp();

  // Active sub-tab
  const [subTab, setSubTab] = useState<'audit' | 'management' | 'rating' | 'violation'>('audit');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MerchantType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'active' | 'suspended' | 'rejected'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | MerchantRatingTier>('all');

  // Modals state
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [merchantToReject, setMerchantToReject] = useState<string | null>(null);

  // Password Reset Modal
  const [passwordResetResult, setPasswordResetResult] = useState<{ merchantName: string; pass: string } | null>(null);

  // Edit / Tier Adjustment Modal
  const [showTierModal, setShowTierModal] = useState(false);
  const [tierEditTarget, setTierEditTarget] = useState<Merchant | null>(null);
  const [newTier, setNewTier] = useState<MerchantRatingTier>('A');
  const [newCommissionRate, setNewCommissionRate] = useState<number>(3.5);
  const [newBadges, setNewBadges] = useState<string>('');

  // Add Violation Modal
  const [showAddViolationModal, setShowAddViolationModal] = useState(false);
  const [violationMerchantId, setViolationMerchantId] = useState<string>('');
  const [violationType, setViolationType] = useState<MerchantViolationRecord['type']>('delayed_shipping');
  const [violationTitle, setViolationTitle] = useState('');
  const [violationSeverity, setViolationSeverity] = useState<MerchantViolationRecord['severity']>('moderate');
  const [violationPoints, setViolationPoints] = useState<number>(3);
  const [violationAction, setViolationAction] = useState<MerchantViolationRecord['actionTaken']>('warning');
  const [violationFine, setViolationFine] = useState<number>(0);
  const [violationDesc, setViolationDesc] = useState('');
  const [violationEvidence, setViolationEvidence] = useState('');

  // Summary Metrics
  const pendingAudits = merchants.filter((m) => m.status === 'pending_review');
  const activeMerchants = merchants.filter((m) => m.status === 'active');
  const suspendedMerchants = merchants.filter((m) => m.status === 'suspended');
  const enterpriseCount = merchants.filter((m) => m.type === 'enterprise');
  const individualCount = merchants.filter((m) => m.type === 'individual');

  // Filtered lists
  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.storeNameZh && m.storeNameZh.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesTier = tierFilter === 'all' || m.ratingTier === tierFilter;
    return matchesSearch && matchesType && matchesStatus && matchesTier;
  });

  const getTierColor = (tier: MerchantRatingTier) => {
    switch (tier) {
      case 'S':
        return 'from-amber-400 to-yellow-500 text-slate-950 font-black';
      case 'A':
        return 'from-purple-500 to-indigo-600 text-white font-black';
      case 'B':
        return 'from-blue-500 to-cyan-500 text-white font-bold';
      case 'C':
        return 'from-slate-600 to-slate-700 text-slate-200';
      case 'D':
        return 'from-rose-600 to-red-700 text-white font-bold animate-pulse';
      default:
        return 'from-slate-600 to-slate-700 text-slate-200';
    }
  };

  const getTierName = (tier: MerchantRatingTier) => {
    if (language === 'ZH') {
      switch (tier) {
        case 'S':
          return 'S-级 超级旗舰品牌';
        case 'A':
          return 'A-级 金牌优选店家';
        case 'B':
          return 'B-级 优质诚信店家';
        case 'C':
          return 'C-级 普通标准店家';
        case 'D':
          return 'D-级 风险观察店家';
      }
    }
    switch (tier) {
      case 'S':
        return 'S-Tier Flagship Enterprise';
      case 'A':
        return 'A-Tier Gold Merchant';
      case 'B':
        return 'B-Tier Verified Merchant';
      case 'C':
        return 'C-Tier Standard Merchant';
      case 'D':
        return 'D-Tier Under Watch / High Risk';
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Core Metrics Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{language === 'ZH' ? '企业合作与店家管理平台' : 'Enterprise Partnership & Merchant Operations'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    B2B & B2C
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {language === 'ZH'
                    ? '合作企业与个人开店自由销售全链路管理：资料审核、账号管理、多级评级与合规违规风控'
                    : 'Comprehensive platform merchant operations: audit vetting, account governance, rating tiers & compliance penalties.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViolationMerchantId(merchants[0]?.id || '');
                setShowAddViolationModal(true);
              }}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{language === 'ZH' ? '登记店家违规' : 'Record Violation'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-bold mb-1 flex items-center justify-between">
              <span>{language === 'ZH' ? '待审核入驻资料' : 'Pending Audits'}</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="text-2xl font-black text-[#FFD23F] flex items-baseline gap-1.5">
              <span>{pendingAudits.length}</span>
              <span className="text-[11px] font-normal text-slate-400">{language === 'ZH' ? '家待核验' : 'pending'}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {language === 'ZH' ? '需审核营业执照及身份证件' : 'Requires document vetting'}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-bold mb-1 flex items-center justify-between">
              <span>{language === 'ZH' ? '正常在营合作店家' : 'Active Merchants'}</span>
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-1.5">
              <span>{activeMerchants.length}</span>
              <span className="text-[11px] font-normal text-slate-400">{language === 'ZH' ? '家营业中' : 'stores'}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {enterpriseCount.length} {language === 'ZH' ? '企业' : 'Corp'} / {individualCount.length} {language === 'ZH' ? '个人' : 'Indiv'}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-bold mb-1 flex items-center justify-between">
              <span>{language === 'ZH' ? '已收录违规处罚' : 'Violations & Penalties'}</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 flex items-baseline gap-1.5">
              <span>{merchantViolations.length}</span>
              <span className="text-[11px] font-normal text-slate-400">{language === 'ZH' ? '起违规记分' : 'records'}</span>
            </div>
            <div className="text-[10px] text-rose-300 mt-1">
              {suspendedMerchants.length} {language === 'ZH' ? '家触发关店停用' : 'suspended'}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] text-slate-400 font-bold mb-1 flex items-center justify-between">
              <span>{language === 'ZH' ? '合作店家总成交 GMV' : 'Merchant Total GMV'}</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
              <span>₱{(merchants.reduce((acc, m) => acc + m.totalSalesAmount, 0) / 1000000).toFixed(1)}M</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {language === 'ZH' ? '平均平台抽佣率' : 'Avg Commission'} 4.2%
            </div>
          </div>
        </div>
      </div>

      {/* Professional Sub-Menu Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSubTab('audit')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            subTab === 'audit'
              ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{language === 'ZH' ? '1. 店家审核机制' : '1. Onboarding Audits'}</span>
          {pendingAudits.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-400 text-slate-950 animate-pulse">
              {pendingAudits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('management')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            subTab === 'management'
              ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === 'ZH' ? '2. 店家管理 (账号与权限)' : '2. Store Management'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-200">
            {merchants.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('rating')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            subTab === 'rating'
              ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'ZH' ? '3. 店家评级管理' : '3. Merchant Rating & Tiers'}</span>
        </button>

        <button
          onClick={() => setSubTab('violation')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            subTab === 'violation'
              ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{language === 'ZH' ? '4. 店家违规处理' : '4. Violations & Penalties'}</span>
          {merchantViolations.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {merchantViolations.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: 店家审核机制 (Merchant Auditing & Onboarding Reviews)           */}
      {/* ========================================================================= */}
      {subTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">
                {language === 'ZH' ? '审核状态筛选:' : 'Filter Status:'}
              </span>
              <div className="flex gap-1.5">
                {(['all', 'pending_review', 'active', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      statusFilter === st
                        ? 'bg-white/20 text-white border border-white/20 font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' && (language === 'ZH' ? '全部申请' : 'All')}
                    {st === 'pending_review' && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        {language === 'ZH' ? '待审核' : 'Pending'}
                      </span>
                    )}
                    {st === 'active' && (language === 'ZH' ? '审核通过' : 'Approved')}
                    {st === 'rejected' && (language === 'ZH' ? '已驳回' : 'Rejected')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-400">
              {language === 'ZH' ? '共找到' : 'Total'} <span className="text-white font-bold">{filteredMerchants.length}</span> {language === 'ZH' ? '条入驻记录' : 'applications'}
            </div>
          </div>

          {filteredMerchants.length === 0 ? (
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-12 text-center text-slate-400">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p className="text-sm font-bold">{language === 'ZH' ? '暂无符合筛选条件的店家申请' : 'No merchant applications match the criteria'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredMerchants.map((merchant) => {
                const isPending = merchant.status === 'pending_review';
                return (
                  <div
                    key={merchant.id}
                    className={`bg-slate-900 border rounded-3xl p-5 transition-all relative overflow-hidden ${
                      isPending ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-white/10'
                    }`}
                  >
                    {isPending && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                        {language === 'ZH' ? '待审核资料' : 'Awaiting Audit'}
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      {/* Left Store & Owner Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={merchant.logo || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200'}
                          alt={merchant.storeName}
                          className="w-14 h-14 rounded-2xl object-cover border border-white/10 bg-slate-800 shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-sm text-white">
                              {merchant.storeNameZh || merchant.storeName}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                merchant.type === 'enterprise'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {merchant.type === 'enterprise'
                                ? language === 'ZH'
                                  ? '🏢 企业合作入驻'
                                  : 'Enterprise Store'
                                : language === 'ZH'
                                ? '👤 个人店家入驻'
                                : 'Individual Store'}
                            </span>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                merchant.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : merchant.status === 'pending_review'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : merchant.status === 'suspended'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {merchant.status === 'active' && (language === 'ZH' ? '已审核通过' : 'Approved')}
                              {merchant.status === 'pending_review' && (language === 'ZH' ? '待审核' : 'Pending')}
                              {merchant.status === 'suspended' && (language === 'ZH' ? '已停用' : 'Suspended')}
                              {merchant.status === 'rejected' && (language === 'ZH' ? '已驳回' : 'Rejected')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2">{merchant.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-[11px] text-slate-300 pt-2">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-400">{language === 'ZH' ? '法人/申请人:' : 'Owner:'}</span>
                              <span className="font-bold text-white">{merchant.ownerName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-400">{language === 'ZH' ? '电话:' : 'Phone:'}</span>
                              <span className="font-mono text-slate-200">{merchant.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-400">{language === 'ZH' ? '邮箱:' : 'Email:'}</span>
                              <span className="font-mono text-slate-200 truncate">{merchant.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-400">{language === 'ZH' ? '主营类目:' : 'Category:'}</span>
                              <span className="text-indigo-300 font-semibold">{merchant.category}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-400">{language === 'ZH' ? '证件/执照:' : 'Doc No:'}</span>
                              <span className="font-mono text-slate-200">
                                {merchant.businessLicenseNumber || merchant.idCardNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-400">{language === 'ZH' ? '提交时间:' : 'Date:'}</span>
                              <span className="text-slate-300">
                                {new Date(merchant.registeredAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Verification Document Thumbnails & Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
                        {/* Qualification Documents Peek */}
                        <div className="flex items-center gap-2">
                          {merchant.licenseImage && (
                            <button
                              onClick={() => {
                                setSelectedMerchant(merchant);
                                setShowDetailModal(true);
                              }}
                              className="group relative rounded-xl overflow-hidden border border-white/20 hover:border-indigo-400 transition-colors w-14 h-14 bg-slate-950"
                              title={language === 'ZH' ? '点击查看营业资质证明' : 'View License Document'}
                            >
                              <img
                                src={merchant.licenseImage}
                                alt="License Document"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-3.5 h-3.5" />
                              </div>
                            </button>
                          )}
                          {merchant.idCardImage && (
                            <button
                              onClick={() => {
                                setSelectedMerchant(merchant);
                                setShowDetailModal(true);
                              }}
                              className="group relative rounded-xl overflow-hidden border border-white/20 hover:border-indigo-400 transition-colors w-14 h-14 bg-slate-950"
                              title={language === 'ZH' ? '点击查看法人身份证件' : 'View ID Document'}
                            >
                              <img
                                src={merchant.idCardImage}
                                alt="ID Document"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-3.5 h-3.5" />
                              </div>
                            </button>
                          )}
                        </div>

                        {/* Audit Action CTAs */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setShowDetailModal(true);
                            }}
                            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{language === 'ZH' ? '查阅完整资料' : 'View Dossier'}</span>
                          </button>

                          {isPending && (
                            <>
                              <button
                                onClick={() => {
                                  adminApproveMerchant(merchant.id, '资质审核合规，准予开店', 'B', 5.0);
                                }}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-colors shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{language === 'ZH' ? '审核通过开店' : 'Approve & Activate'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setMerchantToReject(merchant.id);
                                  setShowRejectModal(true);
                                }}
                                className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{language === 'ZH' ? '驳回' : 'Reject'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {merchant.status === 'rejected' && merchant.rejectReason && (
                      <div className="mt-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">{language === 'ZH' ? '驳回原因: ' : 'Rejection Reason: '}</span>
                          <span>{merchant.rejectReason}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: 店家管理 (Store Roster & Account Administration)               */}
      {/* ========================================================================= */}
      {subTab === 'management' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ZH' ? '搜索店家名称、法人、手机号、类目...' : 'Search store name, owner, phone, category...'}
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none cursor-pointer"
              >
                <option value="all">{language === 'ZH' ? '全部类型 (企业/个人)' : 'All Store Types'}</option>
                <option value="enterprise">{language === 'ZH' ? '企业合作店家' : 'Enterprise Stores'}</option>
                <option value="individual">{language === 'ZH' ? '个人入驻店家' : 'Individual Stores'}</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none cursor-pointer"
              >
                <option value="all">{language === 'ZH' ? '全部营业状态' : 'All Status'}</option>
                <option value="active">{language === 'ZH' ? '正常在营' : 'Active Stores'}</option>
                <option value="suspended">{language === 'ZH' ? '已停用/冻结' : 'Suspended'}</option>
                <option value="pending_review">{language === 'ZH' ? '待审核' : 'Pending'}</option>
              </select>
            </div>
          </div>

          {/* Merchants Table */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">{language === 'ZH' ? '店铺与法人信息' : 'Store & Owner'}</th>
                    <th className="p-4">{language === 'ZH' ? '入驻类型' : 'Type'}</th>
                    <th className="p-4">{language === 'ZH' ? '评级与分值' : 'Rating & Tier'}</th>
                    <th className="p-4">{language === 'ZH' ? '成交额 / 商品' : 'GMV / Products'}</th>
                    <th className="p-4">{language === 'ZH' ? '保证金 / 抽佣' : 'Deposit / Fee'}</th>
                    <th className="p-4">{language === 'ZH' ? '账号状态' : 'Status'}</th>
                    <th className="p-4 text-right">{language === 'ZH' ? '管理权限操作' : 'Admin Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-slate-200">
                  {filteredMerchants.map((merchant) => {
                    const isActive = merchant.status === 'active';
                    return (
                      <tr key={merchant.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={merchant.logo || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200'}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-xs">
                                {merchant.storeNameZh || merchant.storeName}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{merchant.ownerName}</span>
                                <span>•</span>
                                <span className="font-mono">{merchant.phone}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              merchant.type === 'enterprise'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {merchant.type === 'enterprise' ? '企业店家' : '个人店家'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{merchant.category.split(' ')[0]}</div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] bg-gradient-to-r ${getTierColor(
                                merchant.ratingTier
                              )}`}
                            >
                              Tier-{merchant.ratingTier}
                            </span>
                            <span className="font-bold text-[#FFD23F] font-mono">{merchant.compositeScore.toFixed(2)}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {language === 'ZH' ? '好评率' : 'Positive'} {merchant.positiveRate}%
                          </div>
                        </td>

                        <td className="p-4 font-mono">
                          <div className="font-bold text-white">₱{merchant.totalSalesAmount.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {merchant.activeProductsCount} {language === 'ZH' ? '款在售商品' : 'items'}
                          </div>
                        </td>

                        <td className="p-4 font-mono">
                          <div className="text-slate-300">₱{merchant.marginDeposit.toLocaleString()}</div>
                          <div className="text-[10px] text-indigo-300 font-sans">
                            {language === 'ZH' ? '费率' : 'Fee'}: {merchant.commissionRate}%
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : merchant.status === 'suspended'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-400' : merchant.status === 'suspended' ? 'bg-rose-400' : 'bg-amber-400'
                              }`}
                            />
                            {isActive && (language === 'ZH' ? '正常在售' : 'Active')}
                            {merchant.status === 'suspended' && (language === 'ZH' ? '已停用冻结' : 'Suspended')}
                            {merchant.status === 'pending_review' && (language === 'ZH' ? '待审核' : 'Pending')}
                            {merchant.status === 'rejected' && (language === 'ZH' ? '已驳回' : 'Rejected')}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reset Password */}
                            <button
                              onClick={() => {
                                const res = adminResetMerchantPassword(merchant.id);
                                setPasswordResetResult({
                                  merchantName: merchant.storeNameZh || merchant.storeName,
                                  pass: res.newPassword,
                                });
                              }}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title={language === 'ZH' ? '重置账号登录密码' : 'Reset Store Password'}
                            >
                              <Key className="w-3.5 h-3.5 text-amber-400" />
                            </button>

                            {/* Suspend or Reactivate Account */}
                            <button
                              onClick={() => adminToggleMerchantStatus(merchant.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                              }`}
                              title={
                                isActive
                                  ? language === 'ZH'
                                    ? '停用冻结店家账号'
                                    : 'Suspend Store'
                                  : language === 'ZH'
                                  ? '激活恢复正常营业'
                                  : 'Activate Store'
                              }
                            >
                              {isActive ? <Lock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>

                            {/* Adjust Tier / Edit */}
                            <button
                              onClick={() => {
                                setTierEditTarget(merchant);
                                setNewTier(merchant.ratingTier);
                                setNewCommissionRate(merchant.commissionRate);
                                setNewBadges(merchant.badges?.join(', ') || '');
                                setShowTierModal(true);
                              }}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title={language === 'ZH' ? '调整评级等级与费率' : 'Configure Tier & Fee'}
                            >
                              <Award className="w-3.5 h-3.5 text-purple-400" />
                            </button>

                            {/* View Full Dossier */}
                            <button
                              onClick={() => {
                                setSelectedMerchant(merchant);
                                setShowDetailModal(true);
                              }}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title={language === 'ZH' ? '查看店家档案详情' : 'View Full Details'}
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: 店家评级管理 (Merchant Rating & Tier Management)               */}
      {/* ========================================================================= */}
      {subTab === 'rating' && (
        <div className="space-y-6">
          {/* Rating Tiers Standards Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                tier: 'S' as const,
                title: language === 'ZH' ? 'S-级 超级旗舰' : 'S-Tier Flagship',
                dsr: '≥ 4.80',
                positive: '≥ 99.0%',
                perks: language === 'ZH' ? '费率 2.5% · 首页展位 · 权重+30%' : 'Fee 2.5% · VIP Traffic',
                color: 'from-amber-400 to-yellow-500 text-slate-950',
                border: 'border-amber-400/50',
              },
              {
                tier: 'A' as const,
                title: language === 'ZH' ? 'A-级 金牌优选' : 'A-Tier Gold',
                dsr: '≥ 4.50',
                positive: '≥ 97.0%',
                perks: language === 'ZH' ? '费率 3.5% · 极速发货认证' : 'Fee 3.5% · Fast Ship Tag',
                color: 'from-purple-500 to-indigo-600 text-white',
                border: 'border-purple-500/50',
              },
              {
                tier: 'B' as const,
                title: language === 'ZH' ? 'B-级 优质店家' : 'B-Tier Growth',
                dsr: '≥ 4.20',
                positive: '≥ 95.0%',
                perks: language === 'ZH' ? '费率 5.0% · 标准营销位' : 'Fee 5.0% · Standard',
                color: 'from-blue-500 to-cyan-500 text-white',
                border: 'border-blue-500/50',
              },
              {
                tier: 'C' as const,
                title: language === 'ZH' ? 'C-级 普通标准' : 'C-Tier Basic',
                dsr: '≥ 3.80',
                positive: '≥ 90.0%',
                perks: language === 'ZH' ? '费率 6.0% · 常规在售' : 'Fee 6.0% · General Listing',
                color: 'from-slate-600 to-slate-700 text-slate-100',
                border: 'border-white/10',
              },
              {
                tier: 'D' as const,
                title: language === 'ZH' ? 'D-级 风险观察' : 'D-Tier Under Watch',
                dsr: '< 3.80',
                positive: '< 90.0%',
                perks: language === 'ZH' ? '费率 8.0% · 搜索降权 · 警示整改' : 'Fee 8.0% · Penalized',
                color: 'from-rose-600 to-red-700 text-white',
                border: 'border-rose-500/50',
              },
            ].map((tierCard) => (
              <div
                key={tierCard.tier}
                className={`bg-slate-900 border rounded-2xl p-4 shadow-lg ${tierCard.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r ${tierCard.color}`}>
                    Tier {tierCard.tier}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {merchants.filter((m) => m.ratingTier === tierCard.tier).length} {language === 'ZH' ? '家' : 'stores'}
                  </span>
                </div>
                <div className="font-black text-xs text-white mb-2">{tierCard.title}</div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ZH' ? '综合 DSR:' : 'Min DSR:'}</span>
                    <span className="font-mono text-amber-300 font-bold">{tierCard.dsr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ZH' ? '好评率门槛:' : 'Positive:'}</span>
                    <span className="font-mono text-emerald-400 font-bold">{tierCard.positive}</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-white/10">
                  {tierCard.perks}
                </div>
              </div>
            ))}
          </div>

          {/* Store Rating Leaderboard & DSR Breakdown */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-black text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                {language === 'ZH' ? '合作店家 DSR 三维评分与评级配置明细' : 'Store DSR Breakdown & Rating Configuration'}
              </span>
              <span className="text-xs font-normal text-slate-400">
                {language === 'ZH' ? '综合分 = 商品质量(40%) + 服务态度(30%) + 物流履约(30%)' : 'Score = Quality(40%) + Service(30%) + Logistics(30%)'}
              </span>
            </h3>

            <div className="space-y-3">
              {merchants.map((merchant) => (
                <div
                  key={merchant.id}
                  className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={merchant.logo || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {merchant.storeNameZh || merchant.storeName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] bg-gradient-to-r ${getTierColor(
                            merchant.ratingTier
                          )}`}
                        >
                          Tier {merchant.ratingTier}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {merchant.badges &&
                          merchant.badges.map((b, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30"
                            >
                              {b}
                            </span>
                          ))}
                        <span className="text-[10px] text-slate-400">
                          {language === 'ZH' ? '累计销售' : 'Total Sales'}: ₱{merchant.totalSalesAmount.toLocaleString()} ({merchant.totalOrdersCount} 单)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DSR Bars */}
                  <div className="grid grid-cols-3 gap-4 text-center min-w-[280px]">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400">{language === 'ZH' ? '商品质量' : 'Quality'}</div>
                      <div className="text-sm font-black text-amber-300 font-mono mt-0.5">{merchant.qualityScore.toFixed(2)}</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400">{language === 'ZH' ? '商家服务' : 'Service'}</div>
                      <div className="text-sm font-black text-purple-300 font-mono mt-0.5">{merchant.serviceScore.toFixed(2)}</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400">{language === 'ZH' ? '物流时效' : 'Logistics'}</div>
                      <div className="text-sm font-black text-emerald-300 font-mono mt-0.5">{merchant.logisticsScore.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setTierEditTarget(merchant);
                        setNewTier(merchant.ratingTier);
                        setNewCommissionRate(merchant.commissionRate);
                        setNewBadges(merchant.badges?.join(', ') || '');
                        setShowTierModal(true);
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20"
                    >
                      {language === 'ZH' ? '调整评级 & 勋章' : 'Edit Tier & Badges'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: 店家违规处理 (Merchant Violations & Risk Penalties)             */}
      {/* ========================================================================= */}
      {subTab === 'violation' && (
        <div className="space-y-4">
          {/* Platform 12-point Deduction Governance Framework Banner */}
          <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-3xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>{language === 'ZH' ? '平台 12 分制店家合规与风控稽查体系' : '12-Point Merchant Compliance & Penalty System'}</span>
                    <span className="text-[10px] bg-rose-500 text-white font-mono px-2 py-0.2 rounded font-bold">
                      SLA RISK
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {language === 'ZH'
                      ? '严厉打击假冒伪劣、虚假发货、恶意骚扰、违禁品上架等行为。扣满12分系统自动清退并永久冻结店铺。'
                      : 'Zero-tolerance against counterfeits, shipping fraud, customer harassment, and contraband goods. Reaching 12 points results in permanent closure.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setViolationMerchantId(merchants[0]?.id || '');
                  setShowAddViolationModal(true);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-colors shadow-lg shadow-rose-600/25 flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'ZH' ? '+ 登记店家违规处罚' : '+ Record New Violation'}</span>
              </button>
            </div>

            {/* 4 Penalty Milestone Stages */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-rose-500/20 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <div className="text-amber-400 font-bold">{language === 'ZH' ? '扣 1 - 3 分 (轻度)' : '1-3 Pts (Mild)'}</div>
                <div className="text-[11px] text-slate-300 mt-1">{language === 'ZH' ? '平台红线警示，限期整改' : 'Official warning & rectify'}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <div className="text-orange-400 font-bold">{language === 'ZH' ? '扣 4 - 6 分 (中度)' : '4-6 Pts (Moderate)'}</div>
                <div className="text-[11px] text-slate-300 mt-1">{language === 'ZH' ? '下架违规商品，限制大促活动' : 'Delist goods & restrict promo'}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <div className="text-rose-400 font-bold">{language === 'ZH' ? '扣 7 - 11 分 (严重)' : '7-11 Pts (Severe)'}</div>
                <div className="text-[11px] text-slate-300 mt-1">{language === 'ZH' ? '冻结店铺7天，扣缴部分保证金' : '7-Day freeze & deposit fine'}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-rose-500/30">
                <div className="text-rose-500 font-black">{language === 'ZH' ? '累计 12 分 (清退)' : '12 Pts (Permanent Ban)'}</div>
                <div className="text-[11px] text-rose-300 mt-1">{language === 'ZH' ? '强制永久关店，没收全部保证金' : 'Permanent ban & deposit seized'}</div>
              </div>
            </div>
          </div>

          {/* Violation Records List */}
          <div className="space-y-3">
            {merchantViolations.map((record) => (
              <div
                key={record.id}
                className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black text-xs shrink-0">
                      -{record.pointsDeducted}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white">{record.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-indigo-300">{record.merchantName}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{new Date(record.occurredAt).toLocaleString()}</span>
                        <span>•</span>
                        <span className="text-slate-400">{record.operator}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        record.severity === 'critical'
                          ? 'bg-rose-500 text-white font-black'
                          : record.severity === 'severe'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : record.severity === 'moderate'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}
                    >
                      {record.severity.toUpperCase()}
                    </span>

                    {record.fineAmount && record.fineAmount > 0 && (
                      <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        {language === 'ZH' ? '罚款' : 'Fine'}: ₱{record.fineAmount.toLocaleString()}
                      </span>
                    )}

                    {record.appealStatus === 'accepted' && (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {language === 'ZH' ? '申诉成立(已撤销)' : 'Appeal Accepted'}
                      </span>
                    )}
                    {record.appealStatus === 'rejected' && (
                      <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {language === 'ZH' ? '申诉已驳回' : 'Appeal Rejected'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300">{record.description}</p>

                {record.evidence && (
                  <div className="text-[11px] text-slate-400 bg-white/5 rounded-xl p-2.5 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{language === 'ZH' ? '证据材料编号:' : 'Evidence:'}</span>
                    <span className="font-mono text-slate-200">{record.evidence}</span>
                  </div>
                )}

                {/* Appeal Handling Actions */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="text-[11px] text-slate-400">
                    {record.appealReason && (
                      <span>
                        <span className="font-bold text-slate-300">{language === 'ZH' ? '申诉说明: ' : 'Appeal Note: '}</span>
                        {record.appealReason}
                      </span>
                    )}
                  </div>

                  {record.appealStatus !== 'accepted' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adminHandleViolationAppeal(record.id, true, '核实不可抗力/证据不足，申诉成立，撤销扣分')}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
                      >
                        {language === 'ZH' ? '申诉成立 (撤销扣分)' : 'Accept Appeal'}
                      </button>
                      <button
                        onClick={() => adminHandleViolationAppeal(record.id, false, '证据确凿，维持原违规处罚')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                      >
                        {language === 'ZH' ? '驳回申诉' : 'Reject Appeal'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Full Merchant Dossier & Qualification Viewer                    */}
      {/* ========================================================================= */}
      {showDetailModal && selectedMerchant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 text-slate-100 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMerchant.logo || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200'}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover bg-slate-800 border border-white/10"
                />
                <div>
                  <h3 className="font-black text-base text-white">
                    {selectedMerchant.storeNameZh || selectedMerchant.storeName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedMerchant.type === 'enterprise' ? '企业店家合作档案' : '个人店家档案'} · ID: {selectedMerchant.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* Dossier Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">{language === 'ZH' ? '联系人/法人代表' : 'Owner Name'}</span>
                <span className="font-bold text-white text-sm">{selectedMerchant.ownerName}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">{language === 'ZH' ? '联系电话' : 'Phone'}</span>
                <span className="font-mono text-white text-sm">{selectedMerchant.phone}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">{language === 'ZH' ? '商业电子邮箱' : 'Email'}</span>
                <span className="font-mono text-white">{selectedMerchant.email}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">{language === 'ZH' ? '主营类目' : 'Category'}</span>
                <span className="font-semibold text-indigo-300">{selectedMerchant.category}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">{language === 'ZH' ? '身份证件号码' : 'ID Card Number'}</span>
                <span className="font-mono text-slate-200">{selectedMerchant.idCardNumber}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">
                  {language === 'ZH' ? '营业执照 / DTI / SEC' : 'Business Permit No'}
                </span>
                <span className="font-mono text-slate-200">
                  {selectedMerchant.businessLicenseNumber || 'N/A (个人入驻)'}
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">{language === 'ZH' ? '税号 TIN' : 'Tax TIN No'}</span>
                <span className="font-mono text-slate-200">{selectedMerchant.taxNumber || 'N/A'}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block mb-0.5">{language === 'ZH' ? '店铺保证金 / 费率' : 'Deposit / Commission'}</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ₱{selectedMerchant.marginDeposit.toLocaleString()} ({selectedMerchant.commissionRate}%)
                </span>
              </div>
            </div>

            {/* Description & Store Bio */}
            <div className="bg-white/5 p-3.5 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 font-bold block">{language === 'ZH' ? '店铺简介与经营承诺' : 'Store Bio & Pledge'}</span>
              <p className="text-slate-200 leading-relaxed">{selectedMerchant.description}</p>
            </div>

            {/* Attached Credentials & Photos */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                {language === 'ZH' ? '上传核验的资质凭证原件 (点击放大查阅):' : 'Uploaded Qualification Credentials:'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedMerchant.licenseImage && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">{language === 'ZH' ? '营业执照 / 经营许可' : 'Business License'}</span>
                    <div className="rounded-2xl overflow-hidden border border-white/20 bg-slate-950 aspect-video relative group">
                      <img src={selectedMerchant.licenseImage} alt="" className="w-full h-full object-cover" />
                      <a
                        href={selectedMerchant.licenseImage}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{language === 'ZH' ? '查看大图' : 'View Full'}</span>
                      </a>
                    </div>
                  </div>
                )}
                {selectedMerchant.idCardImage && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">{language === 'ZH' ? '法人身份证件原件' : 'ID Document'}</span>
                    <div className="rounded-2xl overflow-hidden border border-white/20 bg-slate-950 aspect-video relative group">
                      <img src={selectedMerchant.idCardImage} alt="" className="w-full h-full object-cover" />
                      <a
                        href={selectedMerchant.idCardImage}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{language === 'ZH' ? '查看大图' : 'View Full'}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Actions if pending */}
            {selectedMerchant.status === 'pending_review' && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setMerchantToReject(selectedMerchant.id);
                    setShowDetailModal(false);
                    setShowRejectModal(true);
                  }}
                  className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  {language === 'ZH' ? '驳回入驻申请' : 'Reject Application'}
                </button>
                <button
                  onClick={() => {
                    adminApproveMerchant(selectedMerchant.id, '资料齐全合规，审核通过', 'B', 5.0);
                    setShowDetailModal(false);
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-colors shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ZH' ? '审核通过并开通店铺' : 'Approve & Open Store'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Reject Reason Input Modal                                       */}
      {/* ========================================================================= */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>{language === 'ZH' ? '驳回店家入驻申请说明' : 'Reject Onboarding Application'}</span>
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'ZH'
                ? '请输入具体的驳回理由（例如：营业执照模糊、证件与法人不一致、类目未获许可等），该理由将同步通知申请人。'
                : 'Please state the rejection reason to notify the applicant.'}
            </p>

            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder={language === 'ZH' ? '请输入详细驳回原因...' : 'Enter rejection reason...'}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReasonInput('');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold"
              >
                {language === 'ZH' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (merchantToReject) {
                    adminRejectMerchant(merchantToReject, rejectReasonInput || '资质资料不符合平台开店要求');
                    setShowRejectModal(false);
                    setRejectReasonInput('');
                    setMerchantToReject(null);
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-colors"
              >
                {language === 'ZH' ? '确认驳回' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Reset Password Result Modal                                     */}
      {/* ========================================================================= */}
      {passwordResetResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-sm w-full p-6 text-slate-100 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">{language === 'ZH' ? '店家密码重置成功' : 'Password Reset Successfully'}</h3>
              <p className="text-xs text-slate-400 mt-1">{passwordResetResult.merchantName}</p>
            </div>

            <div className="bg-slate-950 border border-white/10 p-3 rounded-xl flex items-center justify-between">
              <span className="font-mono text-sm font-black text-amber-300 select-all">
                {passwordResetResult.pass}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(passwordResetResult.pass);
                  alert(language === 'ZH' ? '密码已复制到剪贴板！' : 'Password copied to clipboard!');
                }}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white"
                title="Copy Password"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              {language === 'ZH' ? '请将上述新临时密码通过安全渠道提供给店家法人。' : 'Please provide this temporary password securely to the merchant.'}
            </p>

            <button
              onClick={() => setPasswordResetResult(null)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-purple-600 text-white rounded-xl text-xs font-black"
            >
              {language === 'ZH' ? '我已记录并关闭' : 'Done & Close'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: Adjust Tier & Fee Modal                                         */}
      {/* ========================================================================= */}
      {showTierModal && tierEditTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>{language === 'ZH' ? '配置店家评级等级与商业权益' : 'Configure Rating Tier & Benefits'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {tierEditTarget.storeNameZh || tierEditTarget.storeName}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '店铺等级评分 (Rating Tier)' : 'Rating Tier'}
                </label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-bold outline-none"
                >
                  <option value="S">S-级 (超级旗舰店 · 费率 2.5%)</option>
                  <option value="A">A-级 (金牌店家 · 费率 3.5%)</option>
                  <option value="B">B-级 (优选成长店家 · 费率 5.0%)</option>
                  <option value="C">C-级 (普通标准店家 · 费率 6.0%)</option>
                  <option value="D">D-级 (风险观察预警 · 费率 8.0%)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '定制平台抽佣比例 (%)' : 'Platform Commission Rate (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newCommissionRate}
                  onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '授予荣誉勋章标签 (英文逗号隔开)' : 'Honorary Badges (comma separated)'}
                </label>
                <input
                  type="text"
                  value={newBadges}
                  onChange={(e) => setNewBadges(e.target.value)}
                  placeholder="官方认证旗舰店, 极速发货, 金牌口碑"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowTierModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold"
              >
                {language === 'ZH' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  const badgesArray = newBadges
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  adminUpdateMerchantTier(tierEditTarget.id, newTier, newCommissionRate, badgesArray);
                  setShowTierModal(false);
                }}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black"
              >
                {language === 'ZH' ? '保存评级配置' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: Add Merchant Violation Modal                                    */}
      {/* ========================================================================= */}
      {showAddViolationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>{language === 'ZH' ? '登记店家违规并执行处罚' : 'Record Violation & Impose Penalty'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '选择受罚店家' : 'Target Merchant'}
                </label>
                <select
                  value={violationMerchantId}
                  onChange={(e) => setViolationMerchantId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-bold outline-none"
                >
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.storeNameZh || m.storeName} ({m.ownerName} - {m.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '违规行为类型' : 'Violation Type'}
                </label>
                <select
                  value={violationType}
                  onChange={(e) => setViolationType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  <option value="counterfeit">{language === 'ZH' ? '销售假冒伪劣/高仿仿制品' : 'Counterfeit Goods'}</option>
                  <option value="delayed_shipping">{language === 'ZH' ? '严重延迟发货/虚假发货' : 'Delayed/Fraud Shipping'}</option>
                  <option value="harassment">{language === 'ZH' ? '恶意骚扰买家/索要好评' : 'Customer Harassment'}</option>
                  <option value="brushing">{language === 'ZH' ? '虚假交易刷单/虚构评价' : 'Order Brushing / Fake Reviews'}</option>
                  <option value="false_advertising">{language === 'ZH' ? '虚假宣传/夸大疗效功效' : 'False Advertising'}</option>
                  <option value="prohibited_goods">{language === 'ZH' ? '销售平台禁售违禁品' : 'Prohibited Contraband'}</option>
                  <option value="other">{language === 'ZH' ? '其它违规行为' : 'Other Violation'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '处罚事件标题' : 'Penalty Title'}
                </label>
                <input
                  type="text"
                  value={violationTitle}
                  onChange={(e) => setViolationTitle(e.target.value)}
                  placeholder="例如: 销售假冒品牌耳机配件"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {language === 'ZH' ? '扣减违规积分 (1-12分)' : 'Deduct Points (1-12)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={violationPoints}
                    onChange={(e) => setViolationPoints(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {language === 'ZH' ? '扣缴违约罚金 (₱)' : 'Penalty Fine (₱)'}
                  </label>
                  <input
                    type="number"
                    value={violationFine}
                    onChange={(e) => setViolationFine(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '执行制裁动作' : 'Sanction Action'}
                </label>
                <select
                  value={violationAction}
                  onChange={(e) => setViolationAction(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-bold outline-none"
                >
                  <option value="warning">{language === 'ZH' ? '下发红线警告警示函' : 'Issue Official Warning'}</option>
                  <option value="product_delisting">{language === 'ZH' ? '强制下架相关违规商品' : 'Delist Infringing Products'}</option>
                  <option value="fine">{language === 'ZH' ? '从保证金扣缴违规违约金' : 'Deduct Fine From Deposit'}</option>
                  <option value="freeze_7_days">{language === 'ZH' ? '冻结店铺全部交易权限 7 天' : 'Freeze Store For 7 Days'}</option>
                  <option value="permanent_ban">{language === 'ZH' ? '永久清退关店并没收保证金' : 'Permanent Ban & Seize Deposit'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '详细违规事实描述' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={violationDesc}
                  onChange={(e) => setViolationDesc(e.target.value)}
                  placeholder="详细记录违规经过、受影响订单号等..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {language === 'ZH' ? '凭据与工单单号 (Evidence ID)' : 'Evidence ID / Ticket'}
                </label>
                <input
                  type="text"
                  value={violationEvidence}
                  onChange={(e) => setViolationEvidence(e.target.value)}
                  placeholder="如: #EVID-2026-8812 / 品牌鉴定单号"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowAddViolationModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold"
              >
                {language === 'ZH' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  const targetM = merchants.find((m) => m.id === violationMerchantId) || merchants[0];
                  if (!targetM) return;
                  adminAddMerchantViolation({
                    merchantId: targetM.id,
                    merchantName: targetM.storeNameZh || targetM.storeName,
                    type: violationType,
                    title: violationTitle || `${violationType} 违规处理`,
                    severity: violationSeverity,
                    pointsDeducted: violationPoints,
                    actionTaken: violationAction,
                    fineAmount: violationFine,
                    description: violationDesc || '违反平台合规运营规则',
                    evidence: violationEvidence || `AuditLog#${Date.now()}`,
                  });
                  setShowAddViolationModal(false);
                  setViolationTitle('');
                  setViolationDesc('');
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/25"
              >
                {language === 'ZH' ? '确认执行处罚' : 'Impose Penalty'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
