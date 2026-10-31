import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  ShieldCheck,
  Award,
  Wallet,
  CalendarCheck,
  Gift,
  MapPin,
  Bell,
  Ticket,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
  Share2,
  Copy,
  Folder,
  FolderOpen,
  FileText,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  Star,
  Settings,
  ListTree,
  UserCheck,
  Phone,
  Mail,
  ExternalLink,
  X,
  XCircle,
  RotateCcw,
  Filter,
  ChevronLeft,
  Coins,
  Calendar,
  History,
  Tag,
  Check,
  QrCode,
  Download,
  Users,
  Image,
  UserPlus,
  Percent,
  Flame,
  Camera,
  KeyRound,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Store,
  Building2,
  BarChart3,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, Address } from '../../types';
import { MerchantSettings } from './MerchantSettings';
import { MerchantDashboard } from './MerchantDashboard';

interface UserCenterProps {
  setActiveTab: (tab: string) => void;
}

type UserTreeNodeId =
  | 'overview'
  | 'security'
  | 'wallet'
  | 'vouchers'
  | 'checkin'
  | 'referral'
  | 'addresses'
  | 'notifications'
  | 'orders_all'
  | 'orders_to_pay'
  | 'orders_to_ship'
  | 'orders_to_receive'
  | 'orders_completed'
  | 'orders_aftersales'
  | 'merchant_overview'
  | 'merchant_products'
  | 'merchant_orders'
  | 'merchant_aftersales'
  | 'merchant_finance'
  | 'merchant_withdraw'
  | 'merchant_marketing'
  | 'merchant_settings';

export const UserCenter: React.FC<UserCenterProps> = ({ setActiveTab }) => {
  const {
    language,
    user,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    checkInToday,
    lastCheckInDate,
    exchangeCouponWithPoints,
    userCoupons,
    notifications,
    orders,
    cancelOrder,
    confirmOrderReceipt,
    requestRefund,
    openAuthModal,
    logoutUser,
    loginDemoUser,
    adminUpdateUser,
    userCenterActiveNode,
    setUserCenterActiveNode,
    t,
  } = useApp();

  const isMerchant = user?.role === 'merchant';

  const [activeNode, setActiveNode] = useState<UserTreeNodeId>(() => {
    if (userCenterActiveNode) return userCenterActiveNode as UserTreeNodeId;
    return isMerchant ? 'merchant_overview' : 'overview';
  });

  useEffect(() => {
    if (userCenterActiveNode) {
      setActiveNode(userCenterActiveNode as UserTreeNodeId);
    }
  }, [userCenterActiveNode]);

  // Sync activeNode when user switches between merchant and buyer demo accounts
  useEffect(() => {
    if (user?.role === 'merchant') {
      if (!activeNode || !activeNode.startsWith('merchant_')) {
        setActiveNode('merchant_overview');
      }
    } else {
      if (activeNode && activeNode.startsWith('merchant_')) {
        setActiveNode('overview');
      }
    }
  }, [user?.role]);

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    account: true,
    assets: true,
    orders: true,
    growth: true,
    settings: true,
    m_overview: true,
    m_products: true,
    m_orders: true,
    m_finance: true,
    m_marketing: true,
    m_settings: true,
  });

  const [selectedOrderTracking, setSelectedOrderTracking] = useState<Order | null>(null);

  // Calendar Sign-In & Points Exchange State
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth()); // 0-indexed

  const [checkInHistory, setCheckInHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('ginno_checkin_dates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return [
      `${year}-${month}-01`,
      `${year}-${month}-02`,
      `${year}-${month}-03`,
      `${year}-${month}-04`,
      `${year}-${month}-05`,
    ];
  });

  const [pointsLog, setPointsLog] = useState<
    Array<{ id: string; title: string; points: number; date: string; type: 'gain' | 'spend' }>
  >(() => {
    const saved = localStorage.getItem('ginno_points_log');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'pl_1', title: '每日日历签到奖励', points: 100, date: '2026-08-05 09:12', type: 'gain' },
      { id: 'pl_2', title: '连续签到5天额外阶梯奖励', points: 200, date: '2026-08-05 09:12', type: 'gain' },
      { id: 'pl_3', title: '全场拼团订单支付送积分', points: 350, date: '2026-08-04 14:20', type: 'gain' },
      { id: 'pl_4', title: '吉诺新用户注册积分礼包', points: 500, date: '2026-08-01 10:00', type: 'gain' },
    ];
  });

  const [checkInTab, setCheckInTab] = useState<'calendar' | 'exchange' | 'history'>('calendar');

  const REDEEMABLE_COUPONS = [
    {
      id: 'pts_cp_50',
      title: '₱50 全场通用满减券',
      titleEn: '₱50 Off Storewide Voucher',
      titleTl: '₱50 Diskwento sa Lahat',
      type: 'flat' as const,
      value: 50,
      minOrderAmount: 500,
      pointsCost: 500,
      badge: '入门超值',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'pts_cp_ship',
      title: '全场包邮/免运费特惠券',
      titleEn: 'Free Shipping Voucher (Max ₱150)',
      titleTl: 'Libreng Shipping Kupon',
      type: 'free_shipping' as const,
      value: 150,
      minOrderAmount: 300,
      pointsCost: 800,
      badge: '极力推荐',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'pts_cp_100',
      title: '₱100 超值通用折扣券',
      titleEn: '₱100 Discount Voucher',
      titleTl: '₱100 Diskwento Kupon',
      type: 'flat' as const,
      value: 100,
      minOrderAmount: 1000,
      pointsCost: 1000,
      badge: '热门热销',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'pts_cp_250',
      title: '₱250 尊享大额满减券',
      titleEn: '₱250 VIP Premium Voucher',
      titleTl: '₱250 VIP Diskwento Kupon',
      type: 'flat' as const,
      value: 250,
      minOrderAmount: 2000,
      pointsCost: 2000,
      badge: '尊享大额',
      color: 'from-rose-500 to-pink-500',
    },
    {
      id: 'pts_cp_500',
      title: '₱500 奢享秒杀拼团狂欢券',
      titleEn: '₱500 Flash & Group Mega Voucher',
      titleTl: '₱500 Mega Diskwento Kupon',
      type: 'flat' as const,
      value: 500,
      minOrderAmount: 3500,
      pointsCost: 4000,
      badge: '神券狂欢',
      color: 'from-[#FF6B35] to-amber-600',
    },
  ];

  const todayStr = new Date().toISOString().slice(0, 10);
  const isCheckedInToday = checkInHistory.includes(todayStr) || lastCheckInDate === todayStr;

  // Streak calculations
  const calculateStreak = () => {
    let streak = 0;
    const curr = new Date();
    let currStr = curr.toISOString().slice(0, 10);
    if (!checkInHistory.includes(currStr)) {
      curr.setDate(curr.getDate() - 1);
      currStr = curr.toISOString().slice(0, 10);
    }
    while (checkInHistory.includes(currStr)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
      currStr = curr.toISOString().slice(0, 10);
    }
    return streak;
  };

  const streakCount = calculateStreak();

  // Calendar calculations
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 = Sun

  const currentMonthPrefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`;
  const monthCheckInCount = checkInHistory.filter((d) => d.startsWith(currentMonthPrefix)).length;

  const handleCalendarCheckIn = () => {
    if (isCheckedInToday) return;

    checkInToday();
    const updatedHistory = Array.from(new Set([...checkInHistory, todayStr]));
    setCheckInHistory(updatedHistory);
    localStorage.setItem('ginno_checkin_dates', JSON.stringify(updatedHistory));

    const newStreak = streakCount + 1;
    let bonus = 0;
    if (newStreak === 3) bonus = 100;
    else if (newStreak === 7) bonus = 300;
    else if (newStreak === 14) bonus = 500;
    else if (newStreak === 30) bonus = 1000;

    const nowStr = new Date().toLocaleString();
    const newLog = {
      id: `pl_${Date.now()}`,
      title: bonus > 0 ? `每日日历签到 (+100) 及 连续${newStreak}天连签奖励 (+${bonus})` : '每日日历签到成功',
      points: 100 + bonus,
      date: nowStr,
      type: 'gain' as const,
    };

    const newLogs = [newLog, ...pointsLog];
    setPointsLog(newLogs);
    localStorage.setItem('ginno_points_log', JSON.stringify(newLogs));
  };

  const handleExchangeCouponClick = (cItem: (typeof REDEEMABLE_COUPONS)[0]) => {
    const res = exchangeCouponWithPoints({
      id: cItem.id,
      title: language === 'ZH' ? cItem.title : language === 'TL' ? cItem.titleTl : cItem.titleEn,
      type: cItem.type,
      value: cItem.value,
      minOrderAmount: cItem.minOrderAmount,
      pointsCost: cItem.pointsCost,
    });

    if (res.success) {
      const nowStr = new Date().toLocaleString();
      const newLog = {
        id: `pl_${Date.now()}`,
        title: `积分兑换优惠券: ${cItem.title}`,
        points: cItem.pointsCost,
        date: nowStr,
        type: 'spend' as const,
      };
      const newLogs = [newLog, ...pointsLog];
      setPointsLog(newLogs);
      localStorage.setItem('ginno_points_log', JSON.stringify(newLogs));
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  // Referral & Invite Hub State
  const [referralTab, setReferralTab] = useState<'poster' | 'friends' | 'exchange' | 'rules'>('poster');
  const [posterTheme, setPosterTheme] = useState<'sunset' | 'cyber' | 'crimson' | 'emerald'>('sunset');
  const [showPosterModal, setShowPosterModal] = useState(false);

  const [invitedFriends, setInvitedFriends] = useState<
    Array<{
      id: string;
      name: string;
      phone: string;
      avatar: string;
      registeredAt: string;
      status: 'first_order' | 'registered';
      pointsEarned: number;
      cashEarned: number;
    }>
  >(() => {
    const saved = localStorage.getItem('ginno_invited_friends');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'f_1',
        name: 'Maria Santos',
        phone: '0917****882',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        registeredAt: '2026-08-04 14:32',
        status: 'first_order',
        pointsEarned: 300,
        cashEarned: 200,
      },
      {
        id: 'f_2',
        name: 'Juan Dela Cruz',
        phone: '0918****129',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        registeredAt: '2026-08-03 09:15',
        status: 'first_order',
        pointsEarned: 300,
        cashEarned: 200,
      },
      {
        id: 'f_3',
        name: 'Elena Ramos',
        phone: '0922****503',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        registeredAt: '2026-08-01 18:20',
        status: 'registered',
        pointsEarned: 100,
        cashEarned: 0,
      },
      {
        id: 'f_4',
        name: 'Mark Anthony',
        phone: '0939****918',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        registeredAt: '2026-07-28 11:45',
        status: 'first_order',
        pointsEarned: 300,
        cashEarned: 200,
      },
    ];
  });

  const REFERRAL_COUPONS = [
    {
      id: 'pts_ref_100',
      title: '邀请专属 ₱100 无门槛立减券',
      titleEn: 'Invite Exclusive ₱100 No-Min Voucher',
      titleTl: '₱100 Walang Minimum Diskwento',
      type: 'flat' as const,
      value: 100,
      minOrderAmount: 0,
      pointsCost: 500,
      badge: '无门槛热销',
      color: 'from-amber-500 via-orange-500 to-amber-600',
    },
    {
      id: 'pts_ref_ship',
      title: '邀请专属 全场免运费包邮卡',
      titleEn: 'Invite Free Shipping Pass',
      titleTl: 'Libreng Shipping Privilege Card',
      type: 'free_shipping' as const,
      value: 150,
      minOrderAmount: 0,
      pointsCost: 600,
      badge: '神级包邮',
      color: 'from-blue-500 via-indigo-500 to-cyan-500',
    },
    {
      id: 'pts_ref_200',
      title: '邀请专属 ₱200 满减大额券',
      titleEn: 'Invite ₱200 Off Voucher',
      titleTl: '₱200 Diskwento Kupon',
      type: 'flat' as const,
      value: 200,
      minOrderAmount: 1000,
      pointsCost: 1000,
      badge: '大额优惠',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'pts_ref_500',
      title: '邀请专属 ₱500 狂欢尊享神券',
      titleEn: 'Invite VIP ₱500 Mega Coupon',
      titleTl: '₱500 Mega VIP Kupon',
      type: 'flat' as const,
      value: 500,
      minOrderAmount: 2500,
      pointsCost: 2500,
      badge: '金牌专享',
      color: 'from-purple-600 via-pink-600 to-rose-600',
    },
  ];

  const handleCopyShareCaption = () => {
    const caption =
      language === 'ZH'
        ? `🎁【吉诺全球精选商城特别礼遇】\n输入我的专属邀请码【${user.inviteCode}】注册，即刻获得 ₱500 新人现金大礼包 + 首单包邮特权！\n点击专属链接开启优惠：https://ginno.ph/invite?code=${user.inviteCode}`
        : language === 'TL'
        ? `🎁【Ginno Special Privilege】\nGamitin ang aking referral code na 【${user.inviteCode}】 para makakuha ng ₱500 welcome voucher + free shipping!\nMag-register dito: https://ginno.ph/invite?code=${user.inviteCode}`
        : `🎁【Ginno Super Shopping Reward】\nUse my invite code 【${user.inviteCode}】 to claim ₱500 welcome voucher bundle + free shipping!\nJoin now: https://ginno.ph/invite?code=${user.inviteCode}`;

    navigator.clipboard.writeText(caption);
    alert(
      language === 'ZH'
        ? '🎉 包含邀请码与招募文案的社交推广精美文案已复制！可直接发送至 WeChat / Facebook / Viber！'
        : '🎉 Share caption with referral code copied to clipboard!'
    );
  };

  const handleSimulateInviteFriend = () => {
    const mockNames = ['Liza Soberano', 'Kathryn Bernardo', 'Daniel Padilla', 'James Reid', 'Nadine Lustre'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomPhone = `09${Math.floor(10 + Math.random() * 89)}****${Math.floor(100 + Math.random() * 899)}`;
    const nowStr = new Date().toLocaleString();

    const newFriend = {
      id: `f_${Date.now()}`,
      name: randomName,
      phone: randomPhone,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
      registeredAt: nowStr,
      status: 'first_order' as const,
      pointsEarned: 300,
      cashEarned: 200,
    };

    const updatedFriends = [newFriend, ...invitedFriends];
    setInvitedFriends(updatedFriends);
    localStorage.setItem('ginno_invited_friends', JSON.stringify(updatedFriends));

    // Award user +300 points and +₱200 wallet cash
    const pointsAwarded = 300;
    const updatedUser = { ...user, points: (user.points || 0) + pointsAwarded, walletBalance: (user.walletBalance || 0) + 200 };
    adminUpdateUser(updatedUser);

    // Points Log
    const newLog = {
      id: `pl_ref_${Date.now()}`,
      title: `成功邀请好友【${randomName}】完成首单`,
      points: pointsAwarded,
      date: nowStr,
      type: 'gain' as const,
    };
    const newLogs = [newLog, ...pointsLog];
    setPointsLog(newLogs);
    localStorage.setItem('ginno_points_log', JSON.stringify(newLogs));

    confetti({ particleCount: 100, spread: 80 });
    alert(`🎉 成功模拟邀请好友【${randomName}】注册并完成首单！获得 +300 积分 + ₱200 账户赠送金！`);
  };

  const handleSavePosterImage = () => {
    confetti({ particleCount: 60, spread: 60 });
    alert(
      language === 'ZH'
        ? '📸 专属高清晰度邀请海报图片已生成并成功保存至系统文件管理/相册！快去分享给朋友吧！'
        : '📸 Custom HD Share Poster generated and saved to photos!'
    );
  };

  const toggleFolder = (folderKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const PRESET_AVATARS = [
    { id: 'av1', label: 'Female 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    { id: 'av2', label: 'Male 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
    { id: 'av3', label: 'Female 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
    { id: 'av4', label: 'Male 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
    { id: 'av5', label: 'Cool Male', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80' },
    { id: 'av6', label: 'Fashion Female', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
    { id: 'av7', label: 'Casual Male', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
    { id: 'av8', label: 'Casual Female', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
    { id: 'av9', label: 'Creative', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80' },
    { id: 'av10', label: 'Modern 3D', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80' },
    { id: 'av11', label: 'Minimalist', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
    { id: 'av12', label: 'Executive', url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&auto=format&fit=crop&q=80' },
  ];

  // Profile & Avatar State
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [editNickname, setEditNickname] = useState(user.nickname || user.name || '');
  const [editGender, setEditGender] = useState<'male' | 'female' | 'other'>(user.gender || 'male');
  const [editBirthday, setEditBirthday] = useState(user.birthday || '1996-08-18');

  // Security Sub-Tab State
  const [securityTab, setSecurityTab] = useState<'profile' | 'password' | 'phone' | 'email'>('profile');

  // Modify Password State
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [showPwdCurrent, setShowPwdCurrent] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);

  // Phone Modification State
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [phoneSmsCodeInput, setPhoneSmsCodeInput] = useState('');
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [sentPhoneCode, setSentPhoneCode] = useState('');

  // Email Binding State
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [sentEmailCode, setSentEmailCode] = useState('');

  // Address Management State & Handlers
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState({
    receiverName: '',
    phone: '',
    province: 'Metro Manila',
    city: 'Quezon City',
    barangay: '',
    streetDetail: '',
    zipCode: '1100',
    isDefault: false,
  });

  const handleOpenAddAddr = () => {
    setEditingAddrId(null);
    setAddrForm({
      receiverName: user.nickname || user.name || '',
      phone: user.phone || '',
      province: 'Metro Manila',
      city: 'Quezon City',
      barangay: '',
      streetDetail: '',
      zipCode: '1100',
      isDefault: addresses.length === 0,
    });
    setIsAddrModalOpen(true);
  };

  const handleOpenEditAddr = (addr: Address) => {
    setEditingAddrId(addr.id);
    setAddrForm({
      receiverName: addr.receiverName,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      barangay: addr.barangay,
      streetDetail: addr.streetDetail,
      zipCode: addr.zipCode,
      isDefault: addr.isDefault,
    });
    setIsAddrModalOpen(true);
  };

  const handleSaveAddr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.receiverName.trim()) {
      alert(language === 'ZH' ? '请输入收货人姓名' : 'Please enter receiver name');
      return;
    }
    if (!addrForm.phone.trim()) {
      alert(language === 'ZH' ? '请输入联系电话' : 'Please enter phone number');
      return;
    }
    if (!addrForm.streetDetail.trim()) {
      alert(language === 'ZH' ? '请输入详细地址' : 'Please enter street detail');
      return;
    }

    if (editingAddrId) {
      updateAddress(editingAddrId, addrForm);
      if (addrForm.isDefault) {
        setDefaultAddress(editingAddrId);
      }
    } else {
      addAddress(addrForm);
    }
    setIsAddrModalOpen(false);
  };

  const handleDeleteAddr = (id: string, name: string) => {
    if (confirm(language === 'ZH' ? `确定要删除收货人为【${name}】的地址吗？` : `Are you sure you want to delete address for ${name}?`)) {
      deleteAddress(id);
    }
  };

  const handleSetDefaultAddr = (id: string) => {
    setDefaultAddress(id);
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch (e) {}
  };

  // Handlers
  const handleSelectPresetAvatar = (url: string) => {
    adminUpdateUser({ avatar: url });
    confetti({ particleCount: 50, spread: 60 });
    alert(
      language === 'ZH'
        ? '✨ 头像更换成功！已为您应用所选的系统推荐头像。'
        : '✨ Avatar updated successfully!'
    );
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'ZH' ? '图片文件过大，请选择5MB以内的图片' : 'File size too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          adminUpdateUser({ avatar: result });
          confetti({ particleCount: 80, spread: 70 });
          alert(
            language === 'ZH'
              ? '🎉 自定义本地头像上传成功！已同步至个人中心。'
              : '🎉 Custom avatar uploaded successfully!'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomAvatarUrl = () => {
    if (!customAvatarUrl.trim() || !customAvatarUrl.startsWith('http')) {
      alert(language === 'ZH' ? '请输入以 http:// 或 https:// 开头的有效图片URL' : 'Please enter a valid image URL starting with http://');
      return;
    }
    adminUpdateUser({ avatar: customAvatarUrl.trim() });
    setCustomAvatarUrl('');
    confetti({ particleCount: 60, spread: 60 });
    alert(
      language === 'ZH'
        ? '🌐 网络链接头像保存成功！'
        : '🌐 Network avatar saved successfully!'
    );
  };

  const handleSaveBasicProfile = () => {
    adminUpdateUser({
      nickname: editNickname,
      name: editNickname,
      gender: editGender,
      birthday: editBirthday,
    });
    confetti({ particleCount: 50, spread: 50 });
    alert(
      language === 'ZH'
        ? '✅ 个人基本资料保存成功！'
        : '✅ Profile details updated successfully!'
    );
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdCurrent.trim()) {
      alert(language === 'ZH' ? '请输入当前原密码' : 'Please enter current password');
      return;
    }
    if (pwdNew.length < 6) {
      alert(language === 'ZH' ? '新密码长度至少需为6个字符' : 'New password must be at least 6 characters');
      return;
    }
    if (pwdNew !== pwdConfirm) {
      alert(language === 'ZH' ? '两次输入的新密码不一致，请重新核对' : 'Passwords do not match');
      return;
    }
    setPwdCurrent('');
    setPwdNew('');
    setPwdConfirm('');
    confetti({ particleCount: 100, spread: 80 });
    alert(
      language === 'ZH'
        ? '🔐 登录密码修改成功！新密码已生效，请妥善保管。'
        : '🔐 Password changed successfully!'
    );
  };

  const handleSendPhoneSms = () => {
    if (!newPhoneInput.trim() || newPhoneInput.length < 8) {
      alert(language === 'ZH' ? '请输入正确的手机号码' : 'Please enter a valid phone number');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentPhoneCode(code);
    setPhoneCountdown(60);
    const timer = setInterval(() => {
      setPhoneCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    alert(
      language === 'ZH'
        ? `📱 [验证码模拟] 验证码已发送至 ${newPhoneInput}！\n您的短信验证码为: 【${code}】 (60秒内有效)`
        : `📱 SMS Code sent to ${newPhoneInput}: [ ${code} ]`
    );
  };

  const handleConfirmPhoneUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneInput.trim()) {
      alert(language === 'ZH' ? '请输入新手机号码' : 'Please enter new phone number');
      return;
    }
    if (!phoneSmsCodeInput.trim()) {
      alert(language === 'ZH' ? '请输入短信验证码' : 'Please enter verification code');
      return;
    }
    if (phoneSmsCodeInput !== sentPhoneCode && phoneSmsCodeInput !== '888888') {
      alert(language === 'ZH' ? '验证码错误，请重新输入（测试验证码填提示码或 888888）' : 'Invalid verification code');
      return;
    }
    adminUpdateUser({ phone: newPhoneInput.trim() });
    setNewPhoneInput('');
    setPhoneSmsCodeInput('');
    setPhoneCountdown(0);
    confetti({ particleCount: 80, spread: 70 });
    alert(
      language === 'ZH'
        ? `📲 手机号码修改成功！当前绑定手机已更新为: ${newPhoneInput}`
        : `📲 Phone number updated successfully to ${newPhoneInput}!`
    );
  };

  const handleSendEmailCode = () => {
    if (!newEmailInput.trim() || !newEmailInput.includes('@')) {
      alert(language === 'ZH' ? '请输入正确的电子邮箱地址' : 'Please enter a valid email address');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentEmailCode(code);
    setEmailCountdown(60);
    const timer = setInterval(() => {
      setEmailCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    alert(
      language === 'ZH'
        ? `📧 [验证码模拟] 验证码已发送至 ${newEmailInput}！\n您的邮箱验证码为: 【${code}】 (60秒内有效)`
        : `📧 Email Code sent to ${newEmailInput}: [ ${code} ]`
    );
  };

  const handleConfirmEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.trim()) {
      alert(language === 'ZH' ? '请输入新电子邮箱地址' : 'Please enter email address');
      return;
    }
    if (!emailCodeInput.trim()) {
      alert(language === 'ZH' ? '请输入邮箱验证码' : 'Please enter verification code');
      return;
    }
    if (emailCodeInput !== sentEmailCode && emailCodeInput !== '666888') {
      alert(language === 'ZH' ? '验证码错误，请重新输入（测试验证码填提示码或 666888）' : 'Invalid verification code');
      return;
    }
    adminUpdateUser({ email: newEmailInput.trim() });
    setNewEmailInput('');
    setEmailCodeInput('');
    setEmailCountdown(0);
    confetti({ particleCount: 80, spread: 70 });
    alert(
      language === 'ZH'
        ? `✉️ 电子邮箱绑定成功！当前绑定邮箱已更新为: ${newEmailInput}`
        : `✉️ Email bound successfully to ${newEmailInput}!`
    );
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://ginno.ph/invite?code=${user.inviteCode}`);
    const msg =
      language === 'ZH'
        ? `包含邀请码 ${user.inviteCode} 的专属链接已复制！快去 Facebook 或 Viber 分享吧。`
        : language === 'TL'
        ? `Ang referral link na may code na ${user.inviteCode} ay nakopya na! Ibahagi sa Facebook o Viber.`
        : `Referral link with code ${user.inviteCode} copied! Share on Facebook or Viber.`;
    alert(msg);
  };

  const handleLogout = () => {
    logoutUser();
    setActiveTab('home');
  };

  // Order Counts
  const orderCounts = {
    all: orders.length,
    to_pay: orders.filter((o) => o.status === 'to_pay').length,
    to_ship: orders.filter((o) => o.status === 'to_ship').length,
    to_receive: orders.filter((o) => o.status === 'to_receive').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    aftersales: orders.filter((o) => ['cancelled', 'refunding'].includes(o.status)).length,
  };

  const getFilteredOrders = (nodeId: UserTreeNodeId) => {
    switch (nodeId) {
      case 'orders_to_pay':
        return orders.filter((o) => o.status === 'to_pay');
      case 'orders_to_ship':
        return orders.filter((o) => o.status === 'to_ship');
      case 'orders_to_receive':
        return orders.filter((o) => o.status === 'to_receive');
      case 'orders_completed':
        return orders.filter((o) => o.status === 'completed');
      case 'orders_aftersales':
        return orders.filter((o) => ['cancelled', 'refunding'].includes(o.status));
      case 'orders_all':
      default:
        return orders;
    }
  };

  const getNodeTitle = (nodeId: UserTreeNodeId) => {
    switch (nodeId) {
      case 'overview':
        return language === 'ZH' ? '个人概览与仪表盘' : language === 'TL' ? 'Pangkalahatang Tanawin' : 'Account Overview';
      case 'security':
        return language === 'ZH' ? '账号安全与资料设置' : language === 'TL' ? 'Seguridad ng Akawnt' : 'Security & Info';
      case 'wallet':
        return language === 'ZH' ? '电子钱包与积分资产' : language === 'TL' ? 'Wallet at Puntos' : 'Wallet & Points';
      case 'vouchers':
        return language === 'ZH' ? '我的优惠券与卡券包' : language === 'TL' ? 'Mga Kupon at Diskwento' : 'Vouchers & Coupons';
      case 'checkin':
        return language === 'ZH' ? '每日签到领好礼' : language === 'TL' ? 'Araw-araw na Check-in' : 'Daily Check-in';
      case 'referral':
        return language === 'ZH' ? '邀请好友享赠金' : language === 'TL' ? 'Mag-imbita ng Kaibigan' : 'Referral & Rewards';
      case 'addresses':
        return language === 'ZH' ? '收货地址簿管理' : language === 'TL' ? 'Listahan ng Address' : 'Address Book';
      case 'notifications':
        return language === 'ZH' ? '系统与交易消息通知' : language === 'TL' ? 'mga Abiso' : 'Notifications';
      case 'orders_all':
        return language === 'ZH' ? '全部订单中心' : language === 'TL' ? 'Lahat ng Order' : 'All Orders';
      case 'orders_to_pay':
        return language === 'ZH' ? '待付款订单' : language === 'TL' ? 'Babayarang Order' : 'To Pay Orders';
      case 'orders_to_ship':
        return language === 'ZH' ? '待发货订单' : language === 'TL' ? 'Ipapadalang Order' : 'To Ship Orders';
      case 'orders_to_receive':
        return language === 'ZH' ? '待收货 / 物流跟踪' : language === 'TL' ? 'Tatanggapin' : 'In Transit Orders';
      case 'orders_completed':
        return language === 'ZH' ? '已完成订单记录' : language === 'TL' ? 'Kumpletong Order' : 'Completed Orders';
      case 'orders_aftersales':
        return language === 'ZH' ? '售后与退款取消' : language === 'TL' ? 'Pag-refund / Kanselado' : 'After-sales & Refunds';
      case 'merchant_overview':
        return language === 'ZH' ? '店铺经营数据罗盘 · 全面经营数据' : 'Store Operations Compass';
      case 'merchant_products':
        return language === 'ZH' ? '店铺商品在售与库存管理' : 'Store Products Catalog';
      case 'merchant_orders':
        return language === 'ZH' ? '买家订单履约与打单发货' : 'Store Order Fulfillment';
      case 'merchant_aftersales':
        return language === 'ZH' ? '售后争议与退款审批' : 'Merchant Aftersales';
      case 'merchant_finance':
        return language === 'ZH' ? '收益钱包与收支对账流水' : 'Store Financial Center';
      case 'merchant_withdraw':
        return language === 'ZH' ? '极速收益提现申请' : 'Instant Withdrawal';
      case 'merchant_marketing':
        return language === 'ZH' ? '店铺营销促销与大促提报' : 'Store Marketing & Promotions';
      case 'merchant_settings':
        return language === 'ZH' ? '店家设置 · 资质上传与内容修订' : language === 'TL' ? 'Setting ng Tindahan' : 'Store Settings & Verification';
      default:
        return '';
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'to_pay':
        return (
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {language === 'ZH' ? '待付款' : language === 'TL' ? 'Babayaran' : 'To Pay'}
          </span>
        );
      case 'to_ship':
        return (
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {language === 'ZH' ? '待发货' : language === 'TL' ? 'Ipapadala' : 'To Ship'}
          </span>
        );
      case 'to_receive':
        return (
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {language === 'ZH' ? '运输中' : language === 'TL' ? 'Nasa Daan' : 'In Transit'}
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {language === 'ZH' ? '已完成' : language === 'TL' ? 'Kumpleto' : 'Completed'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {language === 'ZH' ? '已取消' : language === 'TL' ? 'Kanselado' : 'Cancelled'}
          </span>
        );
      case 'refunding':
        return (
          <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {language === 'ZH' ? '退款中' : language === 'TL' ? 'Nagpaparefund' : 'Refunding'}
          </span>
        );
      default:
        return null;
    }
  };

  const isOrderNode = activeNode.startsWith('orders_');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
      {/* User Commercial Banner Card */}
      <div className={`text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border ${
        isMerchant
          ? 'bg-gradient-to-r from-[#170e2b] via-[#241442] to-[#0f172a] border-purple-500/30'
          : 'bg-gradient-to-r from-[#1B2845] via-[#24355a] to-[#0f172a] border-white/10'
      }`}>
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div
              className="relative group cursor-pointer shrink-0"
              title={language === 'ZH' ? '点击修改头像' : 'Click to edit avatar'}
              onClick={() => {
                if (isMerchant) {
                  setActiveNode('merchant_settings');
                } else {
                  setActiveNode('security');
                  setSecurityTab('profile');
                }
              }}
            >
              <img
                src={user.avatar}
                alt={user.nickname}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg group-hover:opacity-90 transition-all ring-4 ${
                  isMerchant ? 'ring-purple-500/80' : 'ring-[#FF6B35]/80'
                }`}
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                isMerchant ? 'bg-purple-400 border-[#170e2b]' : 'bg-emerald-500 border-[#1B2845]'
              }`} />
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                <Camera className="w-5 h-5 drop-shadow-md" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-xl font-black text-white tracking-wide">{user.nickname}</h2>
                {isMerchant ? (
                  <>
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Store className="w-3 h-3 text-amber-300" /> {language === 'ZH' ? 'S级企业旗舰店' : 'Tier-S Verified Store'}
                    </span>
                    <span className="bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {language === 'ZH' ? '💎 钻石信用 100分' : '💎 Diamond Rating 100'}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {language === 'ZH' ? '★ 4.95 高评' : '★ 4.95 Top Rated'}
                    </span>
                  </>
                ) : (
                  <span className="bg-[#FFD23F] text-gray-900 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {user.memberLevel} {language === 'ZH' ? 'VIP会员' : language === 'TL' ? 'Kasamang VIP' : 'VIP Member'}
                  </span>
                )}
              </div>

              {isMerchant ? (
                <div className="text-xs text-purple-200/90 mt-1 flex items-center gap-2">
                  <span className="font-bold text-white">{user.storeName || (language === 'ZH' ? 'TechVanguard 科技先锋数码超级旗舰店' : 'TechVanguard Digital Flagship Store')}</span>
                  <span className="text-purple-400 font-mono text-[10px]">ID: {user.merchantId || 'MCH-001'}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {user.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {user.email}</span>
                </p>
              )}

              {/* Quick Key Metrics */}
              <div className="flex items-center gap-4 mt-3 text-xs font-bold">
                {isMerchant ? (
                  <>
                    <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/10 flex items-center space-x-2">
                      <span className="text-slate-400 text-[10px] uppercase">
                        {language === 'ZH' ? '店铺可提现' : 'Balance'}:
                      </span>
                      <span className="text-[#06D6A0] font-black font-mono">₱{(user?.walletBalance ?? 185600).toLocaleString()}</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/10 flex items-center space-x-2">
                      <span className="text-slate-400 text-[10px] uppercase">
                        {language === 'ZH' ? '累计GMV' : 'Total GMV'}:
                      </span>
                      <span className="text-[#FFD23F] font-black font-mono">₱18,560,000</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/10 hidden sm:flex items-center space-x-2">
                      <span className="text-slate-400 text-[10px] uppercase">
                        {language === 'ZH' ? '今日访客' : 'Visitors'}:
                      </span>
                      <span className="text-purple-300 font-black font-mono">3,420 UV</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/10 flex items-center space-x-2">
                      <span className="text-slate-400 text-[10px] uppercase">
                        {language === 'ZH' ? '积分' : language === 'TL' ? 'Puntos' : 'Points'}:
                      </span>
                      <span className="text-[#FFD23F] font-black">{(user?.points ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/10 flex items-center space-x-2">
                      <span className="text-slate-400 text-[10px] uppercase">
                        {language === 'ZH' ? '钱包' : language === 'TL' ? 'Wallet' : 'Wallet'}:
                      </span>
                      <span className="text-[#06D6A0] font-black">₱{(user?.walletBalance ?? 0).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
            {user.id !== 'usr_guest' ? null : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  {t('auth.signIn')}
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg transition-all"
                >
                  {t('auth.signUp')}
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Main Container: Left Tree Navigation + Right Panel Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: Professional Tree Directory Navigation */}
        <div className="md:col-span-4 lg:col-span-3 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-3 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-xs">
              <ListTree className={`w-4 h-4 ${isMerchant ? 'text-purple-600' : 'text-[#FF6B35]'}`} />
              <span>
                {isMerchant
                  ? (language === 'ZH' ? '店家工作台树型目录' : 'Store Merchant Hub')
                  : (language === 'ZH' ? '个人中心树型目录' : language === 'TL' ? 'Puno ng Personal Center' : 'User Tree Directory')}
              </span>
            </div>
            {isMerchant && (
              <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                {language === 'ZH' ? 'S级店家' : 'Tier-S'}
              </span>
            )}
          </div>

          {/* Tree Navigation Menu */}
          <div className="space-y-1 text-xs font-semibold text-gray-700">
            {isMerchant ? (
              /* ======================= MERCHANT TREE STRUCTURE (店家的经营全面目录) ======================= */
              <>
                {/* M1. Store Overview Folder */}
                <div className="space-y-0.5">
                  <div
                    onClick={(e) => toggleFolder('m_overview', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-purple-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['m_overview'] ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      <Store className="w-4 h-4 text-purple-600" />
                      <span>{language === 'ZH' ? '店铺经营概览' : 'Store Overview'}</span>
                    </div>
                  </div>

                  {expandedFolders['m_overview'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-purple-200 ml-3">
                      <div
                        onClick={() => setActiveNode('merchant_overview')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_overview'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-purple-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>{language === 'ZH' ? '经营数据罗盘' : 'Business Compass'}</span>
                        </div>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                          activeNode === 'merchant_overview' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {language === 'ZH' ? '实时' : 'Live'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* M2. Store Products Management Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('m_products', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-purple-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['m_products'] ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>{language === 'ZH' ? '店铺商品管理' : 'Product Catalog'}</span>
                    </div>
                  </div>

                  {expandedFolders['m_products'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-blue-200 ml-3">
                      <div
                        onClick={() => setActiveNode('merchant_products')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_products'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-blue-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Tag className="w-3.5 h-3.5 text-blue-500" />
                          <span>{language === 'ZH' ? '在售商品与上下架' : 'All Products & Stock'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* M3. Store Order Fulfillment Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('m_orders', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-purple-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['m_orders'] ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>{language === 'ZH' ? '店铺交易履约' : 'Order Fulfillment'}</span>
                    </div>
                    {orders.filter(o => o.status === 'to_ship').length > 0 && (
                      <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">
                        {orders.filter(o => o.status === 'to_ship').length} {language === 'ZH' ? '待发货' : 'To Ship'}
                      </span>
                    )}
                  </div>

                  {expandedFolders['m_orders'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-amber-200 ml-3">
                      <div
                        onClick={() => setActiveNode('merchant_orders')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_orders'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-amber-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Truck className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'ZH' ? '买家订单与打单发货' : 'Ship Orders'}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveNode('merchant_aftersales')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_aftersales'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-rose-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                          <span>{language === 'ZH' ? '售后退款处理' : 'Refunds & Returns'}</span>
                        </div>
                        {orders.filter(o => ['cancelled', 'refunding'].includes(o.status)).length > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                            activeNode === 'merchant_aftersales' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {orders.filter(o => ['cancelled', 'refunding'].includes(o.status)).length}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* M4. Finance & Withdrawal Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('m_finance', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-purple-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['m_finance'] ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'ZH' ? '财务与收益结算' : 'Finance & Earnings'}</span>
                    </div>
                  </div>

                  {expandedFolders['m_finance'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-emerald-200 ml-3">
                      <div
                        onClick={() => setActiveNode('merchant_finance')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_finance'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-emerald-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{language === 'ZH' ? '收益钱包与对账流水' : 'Financial Ledger'}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveNode('merchant_withdraw')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_withdraw'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-emerald-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'ZH' ? '极速提现申请' : 'Instant Withdraw'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* M5. Marketing & Promotion Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('m_marketing', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-purple-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['m_marketing'] ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      <Tag className="w-4 h-4 text-[#FF6B35]" />
                      <span>{language === 'ZH' ? '店铺营销与促销' : 'Marketing Hub'}</span>
                    </div>
                  </div>

                  {expandedFolders['m_marketing'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-orange-200 ml-3">
                      <div
                        onClick={() => setActiveNode('merchant_marketing')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_marketing'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-orange-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Gift className="w-3.5 h-3.5 text-[#FF6B35]" />
                          <span>{language === 'ZH' ? '店铺优惠券与活动提报' : 'Promotions & Vouchers'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* M6. Store Settings & Qualification Material */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('m_settings', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-purple-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['m_settings'] ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      <Settings className="w-4 h-4 text-purple-700" />
                      <span>{language === 'ZH' ? '店家设置与资质材料' : 'Store Settings'}</span>
                    </div>
                  </div>

                  {expandedFolders['m_settings'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-purple-200 ml-3">
                      <div
                        onClick={() => setActiveNode('merchant_settings')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'merchant_settings'
                            ? 'bg-purple-600 text-white font-black shadow-sm'
                            : 'hover:bg-purple-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Store className="w-3.5 h-3.5 text-purple-600" />
                          <span>{language === 'ZH' ? '资质上传与内容修订' : 'Verification Materials'}</span>
                        </div>
                        <span className="text-[9px] bg-purple-100 text-purple-700 font-black px-1.5 py-0.2 rounded-full">
                          {language === 'ZH' ? '已核准' : 'Approved'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ======================= BUYER TREE STRUCTURE (购买用户目录，绝不包含任何企业合作与开店) ======================= */
              <>
                {/* 1. Account Folder */}
                <div className="space-y-0.5">
                  <div
                    onClick={(e) => toggleFolder('account', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-gray-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['account'] ? (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      {expandedFolders['account'] ? (
                        <FolderOpen className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Folder className="w-4 h-4 text-blue-500" />
                      )}
                      <span>{language === 'ZH' ? '个人账号管理' : language === 'TL' ? 'Pamamahala ng Akawnt' : 'Account Center'}</span>
                    </div>
                  </div>

                  {expandedFolders['account'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-gray-100 ml-3">
                      <div
                        onClick={() => setActiveNode('overview')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'overview'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-3.5 h-3.5" />
                          <span>{language === 'ZH' ? '概览仪表盘' : language === 'TL' ? 'Overview' : 'Overview'}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveNode('security')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'security'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{language === 'ZH' ? '账号与安全' : language === 'TL' ? 'Seguridad' : 'Security & Info'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Assets & Financial Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('assets', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-gray-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['assets'] ? (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      {expandedFolders['assets'] ? (
                        <FolderOpen className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Folder className="w-4 h-4 text-emerald-500" />
                      )}
                      <span>{language === 'ZH' ? '资产与卡券' : language === 'TL' ? 'mga Ari-arian' : 'Assets & Vouchers'}</span>
                    </div>
                  </div>

                  {expandedFolders['assets'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-gray-100 ml-3">
                      <div
                        onClick={() => setActiveNode('wallet')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'wallet'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{language === 'ZH' ? '钱包与积分' : language === 'TL' ? 'Wallet & Puntos' : 'Wallet & Points'}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveNode('vouchers')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'vouchers'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Ticket className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'ZH' ? '优惠券包' : language === 'TL' ? 'mga Kupon' : 'My Vouchers'}</span>
                        </div>
                        {userCoupons.length > 0 && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                              activeNode === 'vouchers' ? 'bg-white/20 text-white' : 'bg-orange-100 text-[#FF6B35]'
                            }`}
                          >
                            {userCoupons.length}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Orders Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('orders', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-gray-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['orders'] ? (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      {expandedFolders['orders'] ? (
                        <FolderOpen className="w-4 h-4 text-purple-500" />
                      ) : (
                        <Folder className="w-4 h-4 text-purple-500" />
                      )}
                      <span>{language === 'ZH' ? '全部订单列表' : language === 'TL' ? 'mga Order' : 'Orders'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {orderCounts.all}
                    </span>
                  </div>

                  {expandedFolders['orders'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-gray-100 ml-3">
                      <div
                        onClick={() => setActiveNode('orders_all')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'orders_all'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Package className="w-3.5 h-3.5 text-purple-500" />
                          <span>{language === 'ZH' ? '全部订单' : language === 'TL' ? 'Lahat ng Order' : 'All Orders'}</span>
                        </div>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${activeNode === 'orders_all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {orderCounts.all}
                        </span>
                      </div>

                      <div
                        onClick={() => setActiveNode('orders_to_pay')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'orders_to_pay'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'ZH' ? '待付款' : language === 'TL' ? 'Babayaran' : 'To Pay'}</span>
                        </div>
                        {orderCounts.to_pay > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${activeNode === 'orders_to_pay' ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'}`}>
                            {orderCounts.to_pay}
                          </span>
                        )}
                      </div>

                      <div
                        onClick={() => setActiveNode('orders_to_ship')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'orders_to_ship'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Package className="w-3.5 h-3.5 text-blue-500" />
                          <span>{language === 'ZH' ? '待发货' : language === 'TL' ? 'Ipapadala' : 'To Ship'}</span>
                        </div>
                        {orderCounts.to_ship > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${activeNode === 'orders_to_ship' ? 'bg-white/20 text-white' : 'bg-blue-500 text-white'}`}>
                            {orderCounts.to_ship}
                          </span>
                        )}
                      </div>

                      <div
                        onClick={() => setActiveNode('orders_to_receive')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'orders_to_receive'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Truck className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{language === 'ZH' ? '待收货 / 运输中' : language === 'TL' ? 'Tatanggapin' : 'In Transit'}</span>
                        </div>
                        {orderCounts.to_receive > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${activeNode === 'orders_to_receive' ? 'bg-white/20 text-white' : 'bg-indigo-500 text-white'}`}>
                            {orderCounts.to_receive}
                          </span>
                        )}
                      </div>

                      <div
                        onClick={() => setActiveNode('orders_completed')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'orders_completed'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{language === 'ZH' ? '已完成' : language === 'TL' ? 'Kumpleto' : 'Completed'}</span>
                        </div>
                        {orderCounts.completed > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${activeNode === 'orders_completed' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                            {orderCounts.completed}
                          </span>
                        )}
                      </div>

                      <div
                        onClick={() => setActiveNode('orders_aftersales')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'orders_aftersales'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                          <span>{language === 'ZH' ? '售后与退款' : language === 'TL' ? 'Pag-refund' : 'Refunds'}</span>
                        </div>
                        {orderCounts.aftersales > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${activeNode === 'orders_aftersales' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {orderCounts.aftersales}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Growth & Marketing Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('growth', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-gray-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['growth'] ? (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      {expandedFolders['growth'] ? (
                        <FolderOpen className="w-4 h-4 text-[#FF6B35]" />
                      ) : (
                        <Folder className="w-4 h-4 text-[#FF6B35]" />
                      )}
                      <span>{language === 'ZH' ? '会员权益与奖励' : language === 'TL' ? 'mga Premyo' : 'Rewards & Perks'}</span>
                    </div>
                  </div>

                  {expandedFolders['growth'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-gray-100 ml-3">
                      <div
                        onClick={() => setActiveNode('checkin')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'checkin'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <CalendarCheck className="w-3.5 h-3.5 text-blue-500" />
                          <span>{language === 'ZH' ? '每日签到' : language === 'TL' ? 'Daily Check-in' : 'Daily Check-in'}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveNode('referral')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'referral'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Gift className="w-3.5 h-3.5 text-purple-500" />
                          <span>{language === 'ZH' ? '邀请好友' : language === 'TL' ? 'Mag-imbita' : 'Referral'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Settings Folder */}
                <div className="space-y-0.5 pt-1">
                  <div
                    onClick={(e) => toggleFolder('settings', e)}
                    className="flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-gray-50 text-gray-800 font-extrabold"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolders['settings'] ? (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      {expandedFolders['settings'] ? (
                        <FolderOpen className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Folder className="w-4 h-4 text-slate-500" />
                      )}
                      <span>{language === 'ZH' ? '服务与地址' : language === 'TL' ? 'mga Setting' : 'Settings & Services'}</span>
                    </div>
                  </div>

                  {expandedFolders['settings'] && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-dashed border-gray-100 ml-3">
                      <div
                        onClick={() => setActiveNode('addresses')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'addresses'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{language === 'ZH' ? '收货地址簿' : language === 'TL' ? 'Address Book' : 'Address Book'}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveNode('notifications')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          activeNode === 'notifications'
                            ? 'bg-[#FF6B35] text-white font-black shadow-sm'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Bell className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'ZH' ? '消息与提醒' : language === 'TL' ? 'mga Abiso' : 'Notifications'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {user.id !== 'usr_guest' && (
              <div className="pt-3 mt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'ZH' ? '退出当前账号' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Active Tree Node Header */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-400 font-bold">
                {language === 'ZH' ? '当前目录节点：' : language === 'TL' ? 'Kasalukuyang Node: ' : 'Selected Node: '}
              </span>
              <span className={`font-black px-3 py-1 rounded-xl border ${
                isMerchant
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-orange-50 text-[#FF6B35] border-orange-100'
              }`}>
                {getNodeTitle(activeNode)}
              </span>
            </div>
            {isOrderNode && (
              <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
                {language === 'ZH' ? `共 ${getFilteredOrders(activeNode).length} 笔订单` : `${getFilteredOrders(activeNode).length} Orders`}
              </span>
            )}
          </div>

          {/* Conditional Rendering: Merchant Operations vs Buyer Center */}
          {isMerchant ? (
            <MerchantDashboard activeNode={activeNode} setActiveNode={setActiveNode} />
          ) : (
            <>

          {/* NODE 1: OVERVIEW / DASHBOARD */}
          {activeNode === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveNode('checkin')}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-2 cursor-pointer hover:border-amber-300 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold block uppercase">
                      {language === 'ZH' ? '可用积分余额' : language === 'TL' ? 'Puntos' : 'Points Balance'}
                    </span>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-all">
                      {language === 'ZH' ? '日历打卡/兑换 →' : 'Redeem →'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#FFD23F]">{(user?.points ?? 0).toLocaleString()}</span>
                    <Sparkles className="w-6 h-6 text-[#FFD23F]" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveNode('wallet')}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-2 cursor-pointer hover:border-emerald-300 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold block uppercase">
                      {language === 'ZH' ? '钱包可用余额' : language === 'TL' ? 'Wallet' : 'Wallet Balance'}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {language === 'ZH' ? '充值/明细 →' : 'Top-up / History →'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#06D6A0]">₱{(user?.walletBalance ?? 0).toLocaleString()}</span>
                    <Wallet className="w-6 h-6 text-[#06D6A0]" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveNode('vouchers')}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-2 cursor-pointer hover:border-orange-300 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold block uppercase">
                      {language === 'ZH' ? '我的优惠券' : language === 'TL' ? 'mga Kupon' : 'Claimed Vouchers'}
                    </span>
                    <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full group-hover:bg-[#FF6B35] group-hover:text-white transition-all">
                      {language === 'ZH' ? '卡券包 →' : 'Vouchers →'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#FF6B35]">{userCoupons.length}</span>
                    <Ticket className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                </div>
              </div>

              {/* Order Quick Shortcuts within Overview */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                    {language === 'ZH' ? '我的订单目录' : language === 'TL' ? 'Aking mga Order' : 'My Orders Overview'}
                  </h3>
                  <button
                    onClick={() => setActiveNode('orders_all')}
                    className="text-xs font-bold text-[#FF6B35] hover:underline"
                  >
                    {language === 'ZH' ? '展开全部订单' : language === 'TL' ? 'Tingnan Lahat ng Order' : 'View All Orders'}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-gray-700">
                  <button onClick={() => setActiveNode('orders_to_pay')} className="p-2.5 hover:bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <CreditCard className="w-5 h-5 text-amber-500 mb-1" />
                    <span className="text-[11px]">
                      {language === 'ZH' ? '待付款' : language === 'TL' ? 'Babayaran' : 'To Pay'}
                    </span>
                    {orderCounts.to_pay > 0 && (
                      <span className="text-[10px] text-amber-600 font-black mt-0.5">({orderCounts.to_pay})</span>
                    )}
                  </button>

                  <button onClick={() => setActiveNode('orders_to_ship')} className="p-2.5 hover:bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <Package className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-[11px]">
                      {language === 'ZH' ? '待发货' : language === 'TL' ? 'Ipapadala' : 'To Ship'}
                    </span>
                    {orderCounts.to_ship > 0 && (
                      <span className="text-[10px] text-blue-600 font-black mt-0.5">({orderCounts.to_ship})</span>
                    )}
                  </button>

                  <button onClick={() => setActiveNode('orders_to_receive')} className="p-2.5 hover:bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <Truck className="w-5 h-5 text-indigo-500 mb-1" />
                    <span className="text-[11px]">
                      {language === 'ZH' ? '待收货' : language === 'TL' ? 'Tatanggapin' : 'To Receive'}
                    </span>
                    {orderCounts.to_receive > 0 && (
                      <span className="text-[10px] text-indigo-600 font-black mt-0.5">({orderCounts.to_receive})</span>
                    )}
                  </button>

                  <button onClick={() => setActiveNode('orders_completed')} className="p-2.5 hover:bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className="text-[11px]">
                      {language === 'ZH' ? '已完成' : language === 'TL' ? 'Kumpleto' : 'Completed'}
                    </span>
                    {orderCounts.completed > 0 && (
                      <span className="text-[10px] text-emerald-600 font-black mt-0.5">({orderCounts.completed})</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Fast Actions Grid */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-sm font-black text-gray-900">
                  {language === 'ZH' ? '快捷操作与常用功能' : language === 'TL' ? 'Mabilis na Aksyon' : 'Quick Actions'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button
                    onClick={() => setActiveNode('checkin')}
                    className="p-4 bg-blue-50/60 hover:bg-blue-100/60 rounded-2xl border border-blue-100 text-left transition-all space-y-2"
                  >
                    <CalendarCheck className="w-6 h-6 text-blue-600" />
                    <span className="font-bold text-gray-900 block">
                      {language === 'ZH' ? '每日签到' : language === 'TL' ? 'Check-in' : 'Daily Check-in'}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {language === 'ZH' ? '领 100 积分' : 'Get +100 PTS'}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveNode('referral')}
                    className="p-4 bg-purple-50/60 hover:bg-purple-100/60 rounded-2xl border border-purple-100 text-left transition-all space-y-2"
                  >
                    <Gift className="w-6 h-6 text-purple-600" />
                    <span className="font-bold text-gray-900 block">
                      {language === 'ZH' ? '邀请好友' : language === 'TL' ? 'Mag-imbita' : 'Invite Friends'}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {language === 'ZH' ? '各得 ₱200 赠金' : 'Get ₱200 Credit'}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveNode('addresses')}
                    className="p-4 bg-rose-50/60 hover:bg-rose-100/60 rounded-2xl border border-rose-100 text-left transition-all space-y-2"
                  >
                    <MapPin className="w-6 h-6 text-rose-600" />
                    <span className="font-bold text-gray-900 block">
                      {language === 'ZH' ? '地址管理' : language === 'TL' ? 'Address' : 'Address Book'}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {addresses.length} {language === 'ZH' ? '个地址' : 'Saved'}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveNode('orders_all')}
                    className="p-4 bg-orange-50/60 hover:bg-orange-100/60 rounded-2xl border border-orange-100 text-left transition-all space-y-2"
                  >
                    <Package className="w-6 h-6 text-[#FF6B35]" />
                    <span className="font-bold text-gray-900 block">
                      {language === 'ZH' ? '我的订单' : language === 'TL' ? 'Orders' : 'My Orders'}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {orderCounts.all} {language === 'ZH' ? '笔记录' : 'Orders'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATED ORDERS LIST PANEL (Renders inline without leaving page) */}
          {isOrderNode && (
            <div className="space-y-4">
              {/* Internal Filter Tabs bar for quick switching */}
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex overflow-x-auto gap-1 text-xs font-bold">
                {[
                  { id: 'orders_all', label: language === 'ZH' ? '全部订单' : 'All Orders', count: orderCounts.all },
                  { id: 'orders_to_pay', label: language === 'ZH' ? '待付款' : 'To Pay', count: orderCounts.to_pay },
                  { id: 'orders_to_ship', label: language === 'ZH' ? '待发货' : 'To Ship', count: orderCounts.to_ship },
                  { id: 'orders_to_receive', label: language === 'ZH' ? '待收货 / 运输' : 'In Transit', count: orderCounts.to_receive },
                  { id: 'orders_completed', label: language === 'ZH' ? '已完成' : 'Completed', count: orderCounts.completed },
                  { id: 'orders_aftersales', label: language === 'ZH' ? '售后/退款' : 'Refunds', count: orderCounts.aftersales },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveNode(tab.id as UserTreeNodeId)}
                    className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                      activeNode === tab.id
                        ? 'bg-[#FF6B35] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeNode === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Order List */}
              {getFilteredOrders(activeNode).length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 space-y-4">
                  <Package className="w-16 h-16 text-gray-300 mx-auto" />
                  <div>
                    <h4 className="text-base font-black text-gray-800">
                      {language === 'ZH' ? '暂无相关订单记录' : language === 'TL' ? 'Walang nahanap na order' : 'No orders found'}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {language === 'ZH' ? '该选项目录下没有任何订单，快去选购心仪的商品吧！' : 'There are no orders in this category.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs font-black px-6 py-2.5 rounded-2xl shadow-md transition-all inline-block"
                  >
                    {language === 'ZH' ? '去首页选购商品' : 'Browse Products'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredOrders(activeNode).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4 transition-all hover:shadow-md"
                    >
                      {/* Order Card Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-gray-900">{order.id}</span>
                          <span className="text-gray-400 text-[11px]">{order.createdAt}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {(order.items || []).map((item: any, idx: number) => {
                          const title = item.productTitle || item.productName || item.product?.title || '精选商品';
                          const price = item.price ?? item.product?.price ?? 0;
                          const qty = item.quantity || 1;
                          return (
                            <div key={idx} className="flex items-center space-x-3 text-xs">
                              <img
                                src={item.image || item.product?.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=120&auto=format&fit=crop&q=80'}
                                alt={title}
                                className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-gray-900 truncate">{title}</h5>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  {language === 'ZH' ? '单价' : 'Price'}: ₱{price.toLocaleString()} × {qty}
                                </p>
                              </div>
                              <div className="text-right font-black text-gray-900 font-mono">
                                ₱{(price * qty).toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Receiver & Payment Details */}
                      {(() => {
                        const addr = order.receiverAddress || (order as any).shippingAddress;
                        return (
                          <div className="bg-gray-50 p-3 rounded-2xl text-[11px] text-gray-600 flex flex-wrap justify-between gap-2 border border-gray-100">
                            <div>
                              <span className="font-bold text-gray-800">{language === 'ZH' ? '收货人' : 'Recipient'}: </span>
                              <span>{addr?.receiverName || 'Guest'} ({addr?.phone || 'N/A'})</span>
                              <span className="block text-gray-500 text-[10px] mt-0.5">
                                {[addr?.streetDetail, addr?.barangay, addr?.city].filter(Boolean).join(', ') || 'Standard Shipping'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-gray-800">{language === 'ZH' ? '支付方式' : 'Payment'}: </span>
                              <span className="uppercase text-purple-700 font-bold">{order.paymentMethod || 'Online'}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Order Bottom Actions & Total */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
                        <div>
                          <span className="text-gray-500">{language === 'ZH' ? '实付款: ' : 'Total Paid: '}</span>
                          <span className="text-base font-black text-[#FF6B35]">₱{(order.payAmount ?? order.totalAmount ?? 0).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Status Specific Actions */}
                          {order.status === 'to_pay' && (
                            <>
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-all text-[11px]"
                              >
                                {language === 'ZH' ? '取消订单' : 'Cancel Order'}
                              </button>
                              <button
                                onClick={() => alert(language === 'ZH' ? '正转接收银台支付...' : 'Redirecting to payment...')}
                                className="px-3.5 py-1.5 rounded-xl bg-[#FF6B35] text-white font-black hover:bg-[#e05a2b] transition-all shadow-sm text-[11px]"
                              >
                                {language === 'ZH' ? '立即付款' : 'Pay Now'}
                              </button>
                            </>
                          )}

                          {order.status === 'to_ship' && (
                            <>
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-all text-[11px]"
                              >
                                {language === 'ZH' ? '取消订单' : 'Cancel Order'}
                              </button>
                              <button
                                onClick={() => setSelectedOrderTracking(order)}
                                className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold hover:bg-blue-100 transition-all text-[11px] flex items-center gap-1"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>{language === 'ZH' ? '配货状态' : 'Packing Status'}</span>
                              </button>
                            </>
                          )}

                          {order.status === 'to_receive' && (
                            <>
                              <button
                                onClick={() => setSelectedOrderTracking(order)}
                                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 transition-all text-[11px] flex items-center gap-1"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>{language === 'ZH' ? '查看物流' : 'Track Package'}</span>
                              </button>
                              <button
                                onClick={() => confirmOrderReceipt(order.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all shadow-sm text-[11px]"
                              >
                                {language === 'ZH' ? '确认收货' : 'Confirm Receipt'}
                              </button>
                            </>
                          )}

                          {order.status === 'completed' && (
                            <>
                              <button
                                onClick={() => requestRefund(order.id, 'Customer request')}
                                className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-all text-[11px]"
                              >
                                {language === 'ZH' ? '申请售后/退款' : 'Request Refund'}
                              </button>
                              <button
                                onClick={() => setSelectedOrderTracking(order)}
                                className="px-3.5 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all text-[11px]"
                              >
                                {language === 'ZH' ? '查看物流轨迹' : 'Logistics Detail'}
                              </button>
                            </>
                          )}

                          {['cancelled', 'refunding'].includes(order.status) && (
                            <button
                              onClick={() => alert(language === 'ZH' ? '退款处理进度：售后审核中 / 赠金退回中' : 'Refund request under review.')}
                              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-[11px]"
                            >
                              {language === 'ZH' ? '查看售后进度' : 'View Refund Status'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NODE 2: PROFILE & ACCOUNT SECURITY */}
          {activeNode === 'security' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
              {/* Header Title & Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#FF6B35]" />
                    <span>
                      {language === 'ZH'
                        ? '账号安全与基本资料设置'
                        : language === 'TL'
                        ? 'Seguridad at Profile ng Akawnt'
                        : 'Security & Profile Management'}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'ZH'
                      ? '管理您的个性化头像、个人基本资料、登录密码、绑定手机号码及电子邮箱'
                      : 'Manage your avatar, profile details, password, phone number, and email address.'}
                  </p>
                </div>
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'ZH' ? '账号安全等级：高' : 'Security Level: High'}</span>
                  </span>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setSecurityTab('profile')}
                  className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                    securityTab === 'profile'
                      ? 'bg-white text-[#FF6B35] shadow-sm border border-gray-200/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{language === 'ZH' ? '个人资料与头像' : 'Profile & Avatar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('password')}
                  className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                    securityTab === 'password'
                      ? 'bg-white text-[#FF6B35] shadow-sm border border-gray-200/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{language === 'ZH' ? '修改登录密码' : 'Change Password'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('phone')}
                  className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                    securityTab === 'phone'
                      ? 'bg-white text-[#FF6B35] shadow-sm border border-gray-200/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{language === 'ZH' ? '修改手机号码' : 'Update Phone'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecurityTab('email')}
                  className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                    securityTab === 'email'
                      ? 'bg-white text-[#FF6B35] shadow-sm border border-gray-200/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>{language === 'ZH' ? '绑定/修改邮箱' : 'Bind / Change Email'}</span>
                </button>
              </div>

              {/* Hidden File Input for Avatar */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCustomAvatarUpload}
                accept="image/*"
                className="hidden"
              />

              {/* TAB 1: PROFILE & AVATAR */}
              {securityTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Current Avatar Card & Upload Trigger */}
                  <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 rounded-2xl p-5 border border-orange-100/80 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                          alt="avatar"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-orange-400/30 group-hover:opacity-90 transition-all"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                          <Camera className="w-6 h-6 drop-shadow-md" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-[#FF6B35] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="space-y-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-2">
                          <h4 className="text-base font-black text-gray-900">{user.nickname || user.name || 'Gino Member'}</h4>
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {user.memberLevel} VIP
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          ID: <span className="font-mono text-gray-700 font-bold">{user.id}</span> · {language === 'ZH' ? '绑定手机' : 'Phone'}: <span className="font-mono text-gray-700 font-bold">{user.phone}</span>
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {language === 'ZH' ? '点击头像框或右侧按钮，即可自主上传本地高清图像' : 'Click avatar or upload button to pick custom photo'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#e05928] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{language === 'ZH' ? '自主上传头像' : 'Upload Image'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset Avatars Selection Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{language === 'ZH' ? '默认推荐系统头像' : 'Default Preset Avatars'}</span>
                      </h4>
                      <span className="text-[11px] text-gray-400">
                        {language === 'ZH' ? '点击任意头像直接更新应用' : 'Click to apply immediately'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {PRESET_AVATARS.map((preset) => {
                        const isSelected = user.avatar === preset.url;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectPresetAvatar(preset.url)}
                            className={`relative rounded-2xl p-2 border-2 cursor-pointer transition-all flex flex-col items-center space-y-1.5 group ${
                              isSelected
                                ? 'border-[#FF6B35] bg-orange-50/50 shadow-md scale-105 ring-2 ring-orange-200'
                                : 'border-gray-100 bg-gray-50/80 hover:border-orange-300 hover:bg-white hover:shadow-sm'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-14 h-14 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                            />
                            <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">
                              {preset.label}
                            </span>
                            {isSelected && (
                              <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B35] text-white p-0.5 rounded-full shadow-md">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Network Image URL Direct Input */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <label className="text-xs font-black text-gray-800 block">
                      {language === 'ZH' ? '输入网络图片 URL 地址更新头像' : 'Enter Network Image URL'}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSaveCustomAvatarUrl}
                        className="bg-gray-900 hover:bg-black text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                      >
                        {language === 'ZH' ? '应用URL' : 'Apply URL'}
                      </button>
                    </div>
                  </div>

                  {/* Basic Profile Form */}
                  <div className="p-5 bg-white rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                      {language === 'ZH' ? '修改基本资料' : 'Modify Basic Details'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          {language === 'ZH' ? '用户昵称' : 'Nickname / Name'}
                        </label>
                        <input
                          type="text"
                          value={editNickname}
                          onChange={(e) => setEditNickname(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold text-gray-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          {language === 'ZH' ? '性别设置' : 'Gender'}
                        </label>
                        <select
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold text-gray-900 bg-white"
                        >
                          <option value="male">{language === 'ZH' ? '男 (Male)' : 'Male'}</option>
                          <option value="female">{language === 'ZH' ? '女 (Female)' : 'Female'}</option>
                          <option value="other">{language === 'ZH' ? '保密 (Secret)' : 'Secret'}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          {language === 'ZH' ? '出生日期' : 'Birthday'}
                        </label>
                        <input
                          type="date"
                          value={editBirthday}
                          onChange={(e) => setEditBirthday(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold text-gray-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          {language === 'ZH' ? '注册来源与状态' : 'Account Status'}
                        </label>
                        <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 flex items-center justify-between">
                          <span className="capitalize">{user.registerSource || 'Phone'} Registration</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveBasicProfile}
                        className="bg-[#FF6B35] hover:bg-[#e05928] text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'ZH' ? '保存基本资料' : 'Save Details'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHANGE PASSWORD */}
              {securityTab === 'password' && (
                <form onSubmit={handleUpdatePassword} className="space-y-5 animate-fade-in max-w-xl">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-amber-900 text-xs flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">{language === 'ZH' ? '密码安全防范提示' : 'Password Security Notice'}</span>
                      <span className="text-amber-800 text-[11px] mt-0.5 block">
                        {language === 'ZH'
                          ? '建议使用包含大写字母、小写字母、数字及特殊字符的组合密码，长度不少于6位。定期修改密码可全面提升账号防护。'
                          : 'Password should be at least 6 characters. Use a combination of letters and numbers for higher security.'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                    {/* Current Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        {language === 'ZH' ? '当前原密码' : 'Current Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPwdCurrent ? 'text' : 'password'}
                          value={pwdCurrent}
                          onChange={(e) => setPwdCurrent(e.target.value)}
                          placeholder={language === 'ZH' ? '请输入您目前的登录原密码' : 'Enter current password'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none pr-10 font-bold"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwdCurrent(!showPwdCurrent)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPwdCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        {language === 'ZH' ? '设置新密码' : 'New Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPwdNew ? 'text' : 'password'}
                          value={pwdNew}
                          onChange={(e) => setPwdNew(e.target.value)}
                          placeholder={language === 'ZH' ? '请输入至少6位字符的新密码' : 'Enter at least 6 characters'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none pr-10 font-bold"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwdNew(!showPwdNew)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPwdNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Password strength bar */}
                      {pwdNew && (
                        <div className="pt-1 flex items-center space-x-2">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                            <div
                              className={`h-full ${
                                pwdNew.length >= 10
                                  ? 'w-full bg-emerald-500'
                                  : pwdNew.length >= 6
                                  ? 'w-2/3 bg-amber-500'
                                  : 'w-1/3 bg-rose-500'
                              }`}
                            />
                          </div>
                          <span className="text-[10px] font-extrabold text-gray-500">
                            {pwdNew.length >= 10
                              ? (language === 'ZH' ? '强度：强' : 'Strong')
                              : pwdNew.length >= 6
                              ? (language === 'ZH' ? '强度：中' : 'Medium')
                              : (language === 'ZH' ? '强度：弱' : 'Weak')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        {language === 'ZH' ? '重复确认新密码' : 'Confirm New Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPwdConfirm ? 'text' : 'password'}
                          value={pwdConfirm}
                          onChange={(e) => setPwdConfirm(e.target.value)}
                          placeholder={language === 'ZH' ? '请再次输入一遍新密码' : 'Re-enter new password'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none pr-10 font-bold"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwdConfirm(!showPwdConfirm)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPwdConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {pwdConfirm && pwdNew !== pwdConfirm && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                          {language === 'ZH' ? '⚠️ 两次输入的新密码不一致' : '⚠️ Passwords do not match'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#FF6B35] hover:bg-[#e05928] text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{language === 'ZH' ? '保存修改新密码' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: MODIFY PHONE NUMBER */}
              {securityTab === 'phone' && (
                <form onSubmit={handleConfirmPhoneUpdate} className="space-y-5 animate-fade-in max-w-xl">
                  {/* Current Phone Banner */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-gray-500 block">
                        {language === 'ZH' ? '当前绑定手机号码' : 'Currently Bound Phone'}
                      </span>
                      <span className="text-base font-black text-gray-900 font-mono mt-0.5 block">{user.phone}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'ZH' ? '已通过实名认证' : 'Verified'}</span>
                    </span>
                  </div>

                  <div className="space-y-4 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        {language === 'ZH' ? '输入新手机号码' : 'New Phone Number'}
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-2.5 bg-gray-200 text-gray-700 font-black text-xs rounded-xl border border-gray-300">
                          +63 (PH) / +86
                        </div>
                        <input
                          type="tel"
                          value={newPhoneInput}
                          onChange={(e) => setNewPhoneInput(e.target.value)}
                          placeholder="0917 888 8888"
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        {language === 'ZH' ? '短信验证码' : 'SMS Verification Code'}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={phoneSmsCodeInput}
                          onChange={(e) => setPhoneSmsCodeInput(e.target.value)}
                          placeholder={language === 'ZH' ? '请输入6位短信验证码' : '6-digit code'}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-mono font-black"
                          required
                        />
                        <button
                          type="button"
                          disabled={phoneCountdown > 0}
                          onClick={handleSendPhoneSms}
                          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm shrink-0 ${
                            phoneCountdown > 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-amber-500 text-gray-950'
                          }`}
                        >
                          {phoneCountdown > 0 ? `${phoneCountdown}s` : (language === 'ZH' ? '发送验证码' : 'Send Code')}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {language === 'ZH'
                          ? '💡 点击【发送验证码】弹窗将显示测试验证码，也可直接输入默认万能码 888888 快速校验'
                          : '💡 Click Send Code to view test code popup or enter 888888'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#FF6B35] hover:bg-[#e05928] text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{language === 'ZH' ? '确认更换手机号码' : 'Confirm Phone Update'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: BIND / UPDATE EMAIL */}
              {securityTab === 'email' && (
                <form onSubmit={handleConfirmEmailUpdate} className="space-y-5 animate-fade-in max-w-xl">
                  {/* Current Email Banner */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-gray-500 block">
                        {language === 'ZH' ? '当前绑定电子邮箱' : 'Currently Bound Email'}
                      </span>
                      <span className="text-base font-black text-gray-900 font-mono mt-0.5 block">{user.email}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'ZH' ? '邮箱已关联' : 'Bound'}</span>
                    </span>
                  </div>

                  <div className="space-y-4 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        {language === 'ZH' ? '输入新电子邮箱地址' : 'New Email Address'}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={newEmailInput}
                          onChange={(e) => setNewEmailInput(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-800 block">
                        {language === 'ZH' ? '邮箱验证码' : 'Email Verification Code'}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={emailCodeInput}
                          onChange={(e) => setEmailCodeInput(e.target.value)}
                          placeholder={language === 'ZH' ? '请输入6位邮箱验证码' : '6-digit code'}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-mono font-black"
                          required
                        />
                        <button
                          type="button"
                          disabled={emailCountdown > 0}
                          onClick={handleSendEmailCode}
                          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm shrink-0 ${
                            emailCountdown > 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-amber-500 text-gray-950'
                          }`}
                        >
                          {emailCountdown > 0 ? `${emailCountdown}s` : (language === 'ZH' ? '发送验证码' : 'Send Code')}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {language === 'ZH'
                          ? '💡 点击【发送验证码】弹窗将显示测试验证码，也可直接输入默认万能码 666888 快速校验'
                          : '💡 Click Send Code to view test code popup or enter 666888'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#FF6B35] hover:bg-[#e05928] text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{language === 'ZH' ? '确认绑定/更新邮箱' : 'Confirm Bind Email'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* NODE 3: WALLET */}
          {activeNode === 'wallet' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-black text-gray-900">
                {language === 'ZH' ? '我的电子钱包与积分详情' : language === 'TL' ? 'Aking Wallet at Puntos' : 'Wallet & Points Overview'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl space-y-2">
                  <span className="text-emerald-800 font-bold block">
                    {language === 'ZH' ? '电子钱包可用余额' : language === 'TL' ? 'Balanse sa E-Wallet' : 'E-Wallet Available Balance'}
                  </span>
                  <span className="text-3xl font-black text-emerald-600">₱{(user?.walletBalance ?? 0).toLocaleString()}</span>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    {language === 'ZH'
                      ? '可直接用于支付全部类目的选购商品、秒杀活动及拼团特惠。'
                      : language === 'TL'
                      ? 'Gagamitin para sa pagbabayad ng mga order.'
                      : 'Can be directly used for checkout, flash deals & group buy.'}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl space-y-2">
                  <span className="text-amber-800 font-bold block">
                    {language === 'ZH' ? '吉诺会员积分' : language === 'TL' ? 'Ginno Member Points' : 'Ginno Member Points'}
                  </span>
                  <span className="text-3xl font-black text-amber-600">{(user?.points ?? 0).toLocaleString()}</span>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    {language === 'ZH'
                      ? '可通过每日签到及购物消费累积积分，兑换全场免运券或满减卷。'
                      : language === 'TL'
                      ? 'Nakukuha sa araw-araw na check-in at pagbili.'
                      : 'Earned via daily check-ins & shopping.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NODE 4: VOUCHERS */}
          {activeNode === 'vouchers' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-black text-gray-900">
                {language === 'ZH'
                  ? `已领取的卡券 (${userCoupons.length})`
                  : language === 'TL'
                  ? `Mga Nakuha mong Kupon (${userCoupons.length})`
                  : `My Claimed Vouchers (${userCoupons.length})`}
              </h3>
              {userCoupons.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  {language === 'ZH' ? '暂未领取优惠券' : language === 'TL' ? 'Walang nakuha na kupon' : 'No claimed vouchers yet'}
                </p>
              ) : (
                <div className="space-y-3">
                  {userCoupons.map((uc) => (
                    <div
                      key={uc.id}
                      className="p-4 bg-orange-50/70 rounded-2xl border border-orange-100 flex justify-between items-center text-xs shadow-sm"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{uc.title}</h4>
                        <span className="text-[11px] text-gray-500 mt-0.5 block">
                          {language === 'ZH'
                            ? `满 ₱${uc.minOrderAmount} 可用`
                            : language === 'TL'
                            ? `Minimong Gastos ₱${uc.minOrderAmount}`
                            : `Min Spend ₱${uc.minOrderAmount}`}
                        </span>
                      </div>
                      <span className="bg-[#FF6B35] text-white text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider">
                        {uc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NODE 5: CALENDAR CHECK-IN & POINTS VOUCHER EXCHANGE */}
          {activeNode === 'checkin' && (
            <div className="space-y-6">
              {/* Top Banner: Total Points Summary */}
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-md">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-amber-200" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                        {language === 'ZH' ? '吉诺积分总余额' : language === 'TL' ? 'Kabuuan na Puntos' : 'Total Points Balance'}
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-black tracking-tight">{(user?.points ?? 0).toLocaleString()}</span>
                      <span className="text-xs font-bold text-amber-100">
                        Pts (≈ ₱{((user?.points ?? 0) / 10).toFixed(2)} 购物抵扣金)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                    <div className="text-center border-r border-white/20 pr-3">
                      <span className="text-[10px] text-amber-100 block">连续打卡</span>
                      <span className="text-sm font-black">{streakCount} 天</span>
                    </div>
                    <div className="text-center pl-1">
                      <span className="text-[10px] text-amber-100 block">本月已签</span>
                      <span className="text-sm font-black">{monthCheckInCount} 天</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tabs inside checkin node */}
                <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap gap-2">
                  <button
                    onClick={() => setCheckInTab('calendar')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      checkInTab === 'calendar'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{language === 'ZH' ? '日历打卡签到' : language === 'TL' ? 'Kalendaryo Check-in' : 'Calendar Check-in'}</span>
                  </button>

                  <button
                    onClick={() => setCheckInTab('exchange')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      checkInTab === 'exchange'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>{language === 'ZH' ? '积分兑换优惠券' : language === 'TL' ? 'Ipampalit sa Kupon' : 'Redeem Vouchers'}</span>
                  </button>

                  <button
                    onClick={() => setCheckInTab('history')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      checkInTab === 'history'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>{language === 'ZH' ? '积分明细日志' : language === 'TL' ? 'Kasaysayan' : 'Points Log'}</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: CALENDAR CHECK-IN MODE */}
              {checkInTab === 'calendar' && (
                <div className="space-y-6">
                  {/* Calendar Grid Container */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                    {/* Month Navigator Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CalendarCheck className="w-5 h-5 text-[#FF6B35]" />
                        <h3 className="font-black text-gray-900 text-base">
                          {calendarYear}年 {calendarMonth + 1}月 打卡日历
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (calendarMonth === 0) {
                              setCalendarMonth(11);
                              setCalendarYear((y) => y - 1);
                            } else {
                              setCalendarMonth((m) => m - 1);
                            }
                          }}
                          className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-gray-700 min-w-[70px] text-center">
                          {calendarYear}-{String(calendarMonth + 1).padStart(2, '0')}
                        </span>
                        <button
                          onClick={() => {
                            if (calendarMonth === 11) {
                              setCalendarMonth(0);
                              setCalendarYear((y) => y + 1);
                            } else {
                              setCalendarMonth((m) => m + 1);
                            }
                          }}
                          className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 text-center border-b border-gray-100 pb-2">
                      {['日', '一', '二', '三', '四', '五', '六'].map((dayName, idx) => (
                        <span
                          key={dayName}
                          className={`text-xs font-bold ${idx === 0 || idx === 6 ? 'text-amber-500' : 'text-gray-400'}`}
                        >
                          {dayName}
                        </span>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                      {/* Empty leading slots */}
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`empty_${i}`} className="h-12 sm:h-14 rounded-2xl bg-gray-50/40" />
                      ))}

                      {/* Days of current month */}
                      {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                        const dayNum = dayIndex + 1;
                        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(
                          dayNum
                        ).padStart(2, '0')}`;
                        const isChecked = checkInHistory.includes(dateStr);
                        const isTodayCell = dateStr === todayStr;

                        return (
                          <div
                            key={dateStr}
                            onClick={() => {
                              if (isTodayCell && !isChecked) {
                                handleCalendarCheckIn();
                              }
                            }}
                            className={`h-12 sm:h-14 rounded-2xl p-1 sm:p-2 flex flex-col justify-between items-center transition-all relative border ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : isTodayCell
                                ? 'bg-orange-50 border-[#FF6B35] text-[#FF6B35] border-2 cursor-pointer shadow-sm hover:scale-105'
                                : 'bg-gray-50/80 border-transparent text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span
                                className={`text-xs font-black ${
                                  isTodayCell ? 'text-[#FF6B35]' : isChecked ? 'text-emerald-700' : 'text-gray-700'
                                }`}
                              >
                                {dayNum}
                              </span>
                              {isTodayCell && (
                                <span className="text-[8px] font-black bg-[#FF6B35] text-white px-1 py-0.2 rounded-full">
                                  Today
                                </span>
                              )}
                            </div>

                            {isChecked ? (
                              <div className="flex items-center space-x-0.5 text-emerald-600">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span className="text-[9px] font-black">+100</span>
                              </div>
                            ) : isTodayCell ? (
                              <span className="text-[9px] font-black bg-[#FF6B35] text-white px-1.5 py-0.5 rounded-lg shadow-sm">
                                签到
                              </span>
                            ) : (
                              <span className="text-[9px] text-gray-300 font-bold">+100</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Main Action Bar */}
                    <div className="pt-2 text-center">
                      <button
                        onClick={handleCalendarCheckIn}
                        disabled={isCheckedInToday}
                        className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2 mx-auto ${
                          isCheckedInToday
                            ? 'bg-emerald-500 text-white cursor-default shadow-emerald-200'
                            : 'bg-gradient-to-r from-[#FF6B35] to-orange-500 hover:from-[#e05a2b] hover:to-orange-600 text-white shadow-orange-200 hover:scale-[1.02]'
                        }`}
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>
                          {isCheckedInToday
                            ? language === 'ZH'
                              ? '✓ 今日已完成日历打卡 (+100 积分已到账)'
                              : language === 'TL'
                              ? '✓ Naka-check in na Ngayon (+100 Puntos)'
                              : '✓ Checked-in Today (+100 Points Awarded)'
                            : language === 'ZH'
                            ? '立即完成今日打卡 (+100 积分)'
                            : language === 'TL'
                            ? 'Mag-check in Na (+100 Puntos)'
                            : 'Check-in Now (+100 Points)'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Streak Progress Milestones */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h4 className="font-black text-gray-900 text-sm">连续签到阶梯大奖</h4>
                      </div>
                      <span className="text-xs text-gray-500 font-bold">
                        当前已连续 <span className="text-[#FF6B35] font-black">{streakCount}</span> 天
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {[
                        { days: 3, bonus: 100, label: '3天连签礼包' },
                        { days: 7, bonus: 300, label: '7天连签礼包' },
                        { days: 14, bonus: 500, label: '14天连签礼包' },
                        { days: 30, bonus: 1000, label: '30天满勤礼包' },
                      ].map((m) => {
                        const isReached = streakCount >= m.days;
                        return (
                          <div
                            key={m.days}
                            className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                              isReached
                                ? 'bg-amber-50/60 border-amber-300 text-amber-900 shadow-sm'
                                : 'bg-gray-50/60 border-gray-100 text-gray-500'
                            }`}
                          >
                            <span className="text-[10px] font-bold block">{m.label}</span>
                            <div className="flex items-center justify-center space-x-1">
                              <Coins className={`w-3.5 h-3.5 ${isReached ? 'text-amber-500' : 'text-gray-400'}`} />
                              <span className="text-xs font-black">+{m.bonus} 积分</span>
                            </div>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block mt-1 ${
                                isReached ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isReached ? '已达标 ✓' : `还差 ${m.days - streakCount} 天`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COUPON EXCHANGE HUB */}
              {checkInTab === 'exchange' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="font-black text-gray-900 text-base flex items-center space-x-2">
                          <Ticket className="w-5 h-5 text-[#FF6B35]" />
                          <span>{language === 'ZH' ? '吉诺积分兑换优惠券专区' : 'Redeem Vouchers with Points'}</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          消耗吉诺积分，即刻兑换全场通用现金券与免运费特权券！
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block font-bold">可用余额</span>
                        <span className="text-sm font-black text-[#FF6B35]">
                          {(user?.points ?? 0).toLocaleString()} Pts
                        </span>
                      </div>
                    </div>

                    {/* Voucher Exchange Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {REDEEMABLE_COUPONS.map((cp) => {
                        const canAfford = (user?.points ?? 0) >= cp.pointsCost;
                        return (
                          <div
                            key={cp.id}
                            className="bg-gray-50/70 rounded-2xl p-4 border border-gray-200/80 hover:border-orange-300 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${cp.color}`}>
                                  {cp.badge}
                                </span>
                                <h4 className="font-black text-gray-900 text-sm">
                                  {language === 'ZH' ? cp.title : language === 'TL' ? cp.titleTl : cp.titleEn}
                                </h4>
                                <p className="text-[11px] text-gray-500 font-medium">
                                  {cp.type === 'free_shipping'
                                    ? `满 ₱${cp.minOrderAmount} 可享免运费 (最高抵扣 ₱${cp.value})`
                                    : `满 ₱${cp.minOrderAmount} 可用，立减 ₱${cp.value}`}
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="text-lg font-black text-gray-900 block">
                                  {cp.type === 'free_shipping' ? '免运费' : `₱${cp.value}`}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold">现金抵扣</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                              <div className="flex items-center space-x-1.5 text-amber-600 font-black text-xs">
                                <Coins className="w-4 h-4 text-amber-500" />
                                <span>{cp.pointsCost.toLocaleString()} 积分</span>
                              </div>

                              <button
                                onClick={() => handleExchangeCouponClick(cp)}
                                disabled={!canAfford}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                  canAfford
                                    ? 'bg-[#FF6B35] hover:bg-[#e05a2b] text-white shadow-sm hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                {canAfford ? '立即兑换' : `还差 ${cp.pointsCost - (user?.points ?? 0)} 积分`}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: POINTS LOG / HISTORY */}
              {checkInTab === 'history' && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-black text-gray-900 text-base flex items-center space-x-2">
                      <History className="w-5 h-5 text-[#FF6B35]" />
                      <span>{language === 'ZH' ? '积分明细记录' : 'Points Transaction History'}</span>
                    </h3>
                    <span className="text-xs text-gray-400 font-bold">共 {pointsLog.length} 条记录</span>
                  </div>

                  <div className="space-y-2">
                    {pointsLog.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between hover:bg-gray-100/50 transition-all"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-800 text-xs block">{log.title}</span>
                          <span className="text-[10px] text-gray-400 block">{log.date}</span>
                        </div>

                        <span
                          className={`text-sm font-black ${
                            log.type === 'gain' ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {log.type === 'gain' ? `+${log.points}` : `-${log.points}`} Pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NODE 6: REFERRAL & INVITE HUB */}
          {activeNode === 'referral' && (
            <div className="space-y-6">
              {/* Top Banner: Referral Stats & Level */}
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 rounded-3xl p-6 text-white shadow-md">
                <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-2.5 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                        <Award className="w-3 h-3 fill-current" />
                        <span>{language === 'ZH' ? '金牌推荐官' : language === 'TL' ? 'Gold Ambassador' : 'Gold Ambassador'}</span>
                      </span>
                      <span className="text-xs text-purple-200 font-medium">
                        {language === 'ZH' ? '每拉1人获 300 积分 + ₱200' : language === 'TL' ? '300 Puntos + ₱200 bawat kaibigan' : '300 Pts + ₱200 per friend'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">
                      {language === 'ZH' ? '邀请好友·裂变享多重好礼' : language === 'TL' ? 'Mag-imbita ng Kaibigan & Manalo' : 'Invite Friends & Earn Big Rewards'}
                    </h3>
                    <p className="text-xs text-purple-200 max-w-md">
                      {language === 'ZH'
                        ? '好友使用您的专属邀请码注册，即可领 ₱500 礼包！好友完成首单后，您可立享 300 积分与 ₱200 赠送金。'
                        : language === 'TL'
                        ? 'Kumuha ng ₱500 welcome gift para sa iyong kaibigan! Pagkatapos ng unang order nila, makakakuha ka ng 300 puntos at ₱200 wallet cash.'
                        : 'Friends get a ₱500 welcome pack using your invite code! Earn 300 points + ₱200 wallet cash when they complete their first order.'}
                    </p>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
                      <span className="text-[10px] text-purple-200 block">{language === 'ZH' ? '累计邀请' : language === 'TL' ? 'Na-imbita' : 'Total Invited'}</span>
                      <span className="text-xl font-black text-amber-300">{invitedFriends.length} {language === 'ZH' ? '人' : ''}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
                      <span className="text-[10px] text-purple-200 block">{language === 'ZH' ? '邀请获得积分' : language === 'TL' ? 'Nakuha na Puntos' : 'Points Earned'}</span>
                      <span className="text-xl font-black text-amber-300">
                        {invitedFriends.reduce((acc, f) => acc + f.pointsEarned, 0)} Pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Referral Sub-Nav Tabs */}
                <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap gap-2">
                  <button
                    onClick={() => setReferralTab('poster')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      referralTab === 'poster'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Image className="w-3.5 h-3.5" />
                    <span>{t('referral.posterTitle')}</span>
                  </button>

                  <button
                    onClick={() => setReferralTab('friends')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      referralTab === 'friends'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t('referral.invitedList')}</span>
                  </button>

                  <button
                    onClick={() => setReferralTab('exchange')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      referralTab === 'exchange'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>{t('referral.pointsExchange')}</span>
                  </button>

                  <button
                    onClick={() => setReferralTab('rules')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      referralTab === 'rules'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ZH' ? '阶梯大奖规则' : language === 'TL' ? 'Mga Ganti' : 'Milestones'}</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: 🎨 SHARE POSTER GENERATOR */}
              {referralTab === 'poster' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Theme Selector & Quick Actions */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                      <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                        <Image className="w-5 h-5 text-purple-600" />
                        <h4 className="font-black text-gray-900 text-sm">
                          {language === 'ZH' ? '选择专属海报视觉主题' : language === 'TL' ? 'Pumili ng Tema ng Poster' : 'Select Poster Theme'}
                        </h4>
                      </div>

                      {/* Theme Options */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: 'sunset', name: language === 'ZH' ? '日落金辉' : 'Sunset Gold', bg: 'from-amber-500 via-orange-500 to-rose-600' },
                          { id: 'cyber', name: language === 'ZH' ? '赛博霓虹' : 'Cyber Neon', bg: 'from-purple-900 via-indigo-900 to-slate-900' },
                          { id: 'crimson', name: language === 'ZH' ? '狂欢盛典' : 'Warm Crimson', bg: 'from-rose-600 via-red-600 to-amber-600' },
                          { id: 'emerald', name: language === 'ZH' ? '奢华翡翠' : 'Luxe Emerald', bg: 'from-emerald-700 via-teal-800 to-slate-900' },
                        ].map((th) => (
                          <button
                            key={th.id}
                            onClick={() => setPosterTheme(th.id as any)}
                            className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                              posterTheme === th.id
                                ? 'border-purple-600 ring-2 ring-purple-100 bg-purple-50/50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span className="text-xs font-bold text-gray-800">{th.name}</span>
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${th.bg} shadow-sm`} />
                          </button>
                        ))}
                      </div>

                      {/* User's Invite Code Box */}
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-center shadow-inner">
                        <span className="text-[10px] text-gray-400 font-bold block tracking-wider uppercase">
                          {t('referral.myInviteCode')}
                        </span>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-3xl font-black text-[#FF6B35] tracking-widest">{user.inviteCode}</span>
                          <button
                            onClick={handleCopyReferral}
                            className="p-1.5 rounded-xl bg-orange-100 text-[#FF6B35] hover:bg-orange-200 transition-all"
                            title="复制邀请码"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <button
                          onClick={() => setShowPosterModal(true)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>{language === 'ZH' ? '放大预览与全屏高清保存' : language === 'TL' ? 'Tingnan ang Full Screen Poster' : 'Full Screen Preview & Download'}</span>
                        </button>

                        <button
                          onClick={handleSavePosterImage}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>{t('referral.posterDownload')}</span>
                        </button>

                        <button
                          onClick={handleCopyShareCaption}
                          className="w-full border-2 border-purple-600 text-purple-700 hover:bg-purple-50 font-black text-xs py-3 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{t('referral.shareText')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Rendered Poster Canvas Mockup */}
                  <div className="lg:col-span-7 flex justify-center">
                    <div
                      className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden transition-all duration-300 border border-white/20 bg-gradient-to-b ${
                        posterTheme === 'sunset'
                          ? 'from-amber-500 via-orange-600 to-rose-700'
                          : posterTheme === 'cyber'
                          ? 'from-purple-900 via-indigo-950 to-slate-950'
                          : posterTheme === 'crimson'
                          ? 'from-rose-600 via-red-700 to-amber-700'
                          : 'from-emerald-800 via-teal-900 to-slate-950'
                      }`}
                    >
                      {/* Decorative Background Accents */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

                      {/* Poster Content */}
                      <div className="relative z-10 space-y-5 text-center">
                        {/* Brand Top Header */}
                        <div className="flex items-center justify-between border-b border-white/20 pb-3 text-left">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-xl bg-white text-[#FF6B35] flex items-center justify-center font-black text-sm shadow-md">
                              G
                            </div>
                            <div>
                              <span className="font-black text-sm tracking-wide block leading-none">GINNO STORE</span>
                              <span className="text-[9px] text-white/70 block uppercase">Super Shopping Fest</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/30 backdrop-blur-md">
                            VIP INVITE
                          </span>
                        </div>

                        {/* Banner Promotion Message */}
                        <div className="space-y-1.5 py-2">
                          <span className="text-[10px] font-black bg-amber-400 text-purple-950 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm inline-block">
                            🎉 {language === 'ZH' ? '注册即领 ₱500 购物礼金' : 'Claim ₱500 Welcome Pack'}
                          </span>
                          <h3 className="text-2xl font-black tracking-tight drop-shadow-md leading-tight">
                            {language === 'ZH' ? '吉诺全场拼团秒杀' : 'Ginno Global Shopping'}
                            <br />
                            {language === 'ZH' ? '首单立享 8 折 + 全场免邮' : '20% OFF + FREE SHIPPING'}
                          </h3>
                        </div>

                        {/* User Profile Snippet */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center space-x-3 text-left">
                          <img
                            src={
                              user.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                            }
                            alt="avatar"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow"
                          />
                          <div>
                            <span className="text-xs font-black block">{user.name} {language === 'ZH' ? '诚挚邀请您' : 'Invites You'}</span>
                            <span className="text-[10px] text-white/80 block">{language === 'ZH' ? '吉诺金牌推荐官 · 专属通道' : 'Ginno Gold Ambassador'}</span>
                          </div>
                        </div>

                        {/* Big Invite Code Block */}
                        <div className="bg-white text-gray-900 rounded-2xl p-4 shadow-lg space-y-1">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                            {language === 'ZH' ? '专属邀请码' : 'Exclusive Referral Code'}
                          </span>
                          <span className="text-3xl font-black text-[#FF6B35] tracking-widest block">
                            {user.inviteCode}
                          </span>
                          <span className="text-[9px] text-gray-500 font-medium block">
                            {language === 'ZH' ? '注册时填写邀请码或扫描下方二维码' : 'Enter code on registration or scan QR code'}
                          </span>
                        </div>

                        {/* Simulated QR Code Graphic */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2 flex flex-col items-center justify-center">
                          <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center shadow-inner relative">
                            <QrCode className="w-full h-full text-gray-900" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-6 h-6 rounded-md bg-[#FF6B35] text-white flex items-center justify-center font-black text-[10px] shadow">
                                G
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-white/90 font-bold">
                            {language === 'ZH' ? '扫码或长按识别 领取 ₱500 礼包' : 'Scan QR code to claim ₱500 bonus'}
                          </span>
                        </div>

                        <div className="pt-1 text-[9px] text-white/60">
                          © Ginno Global Ecommerce Inc. All Rights Reserved.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 👥 INVITED FRIENDS LIST */}
              {referralTab === 'friends' && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-black text-gray-900 text-base flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span>{language === 'ZH' ? `已成功邀请好友列表 (${invitedFriends.length} 人)` : language === 'TL' ? `Listahan ng Na-imbita (${invitedFriends.length})` : `Invited Friends List (${invitedFriends.length})`}</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {language === 'ZH'
                          ? '当好友成功完成首单后，系统自动为您注入 +300 积分与 ₱200 赠送金'
                          : language === 'TL'
                          ? 'Kapag natapos ng kaibigan ang unang order, makakakuha ka ng +300 puntos at ₱200'
                          : 'Get +300 points and ₱200 credits automatically when a friend completes their first order'}
                      </p>
                    </div>

                    <button
                      onClick={handleSimulateInviteFriend}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{language === 'ZH' ? '模拟邀请新好友 (+300Pts)' : language === 'TL' ? 'Mag-imbita ng bago (+300 Puntos)' : 'Simulate Invite (+300Pts)'}</span>
                    </button>
                  </div>

                  {/* Friends Cards */}
                  <div className="space-y-2.5">
                    {invitedFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-100/50 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-black text-gray-900 text-sm">{friend.name}</span>
                              <span className="text-xs text-gray-400 font-medium">({friend.phone})</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block">{friend.registeredAt} {language === 'ZH' ? '注册' : 'Registered'}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-200/60 pt-2 sm:pt-0">
                          <span
                            className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                              friend.status === 'first_order'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {friend.status === 'first_order'
                              ? language === 'ZH' ? '✓ 首单已完成' : '✓ First Order Completed'
                              : language === 'ZH' ? '已注册 (待首单)' : 'Registered (Pending)'}
                          </span>

                          <div className="text-right">
                            <span className="text-xs font-black text-purple-700 block">
                              +{friend.pointsEarned} Pts {friend.cashEarned > 0 && `+ ₱${friend.cashEarned}`}
                            </span>
                            <span className="text-[9px] text-gray-400">{language === 'ZH' ? '系统结算发放' : 'Settled'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: 🎟️ REFERRAL POINTS COUPON REDEMPTION */}
              {referralTab === 'exchange' && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-black text-gray-900 text-base flex items-center space-x-2">
                        <Ticket className="w-5 h-5 text-purple-600" />
                        <span>{language === 'ZH' ? '邀请积分专属优惠券兑换专区' : language === 'TL' ? 'Ipampalit sa Kupon ng Referral' : 'Referral Points Voucher Redemption'}</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {language === 'ZH'
                          ? '使用邀请好友积累的积分，兑换无门槛高额满减券与免邮特权卡'
                          : language === 'TL'
                          ? 'Gamitin ang iyong referral puntos para sa mga libreng voucher'
                          : 'Use points earned from inviting friends to redeem high-value discount vouchers'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block font-bold">{t('user.totalPoints')}</span>
                      <span className="text-sm font-black text-purple-600">
                        {(user?.points ?? 0).toLocaleString()} Pts
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {REFERRAL_COUPONS.map((cp) => {
                      const canAfford = (user?.points ?? 0) >= cp.pointsCost;
                      return (
                        <div
                          key={cp.id}
                          className="bg-gray-50/70 rounded-2xl p-4 border border-gray-200 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${cp.color}`}>
                                {cp.badge}
                              </span>
                              <h4 className="font-black text-gray-900 text-sm">
                                {language === 'ZH' ? cp.title : language === 'TL' ? cp.titleTl : cp.titleEn}
                              </h4>
                              <p className="text-[11px] text-gray-500 font-medium">
                                {cp.minOrderAmount === 0
                                  ? language === 'ZH' ? '无门槛立减，全场通用' : 'No Minimum Order Required'
                                  : language === 'ZH' ? `满 ₱${cp.minOrderAmount} 可用，立减 ₱${cp.value}` : `Min spend ₱${cp.minOrderAmount}`}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-lg font-black text-gray-900 block">
                                {cp.type === 'free_shipping' ? (language === 'ZH' ? '包邮' : 'Free Ship') : `₱${cp.value}`}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold">{language === 'ZH' ? '邀请专属' : 'Invite VIP'}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-1.5 text-purple-700 font-black text-xs">
                              <Coins className="w-4 h-4 text-amber-500" />
                              <span>{cp.pointsCost.toLocaleString()} Pts</span>
                            </div>

                            <button
                              onClick={() => handleExchangeCouponClick(cp)}
                              disabled={!canAfford}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                canAfford
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:scale-105'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {canAfford
                                ? (language === 'ZH' ? '立即兑换' : 'Redeem Now')
                                : (language === 'ZH' ? `还差 ${cp.pointsCost - (user?.points ?? 0)} 积分` : `Need ${cp.pointsCost - (user?.points ?? 0)} Pts`)}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: 📜 MILESTONES & RULES */}
              {referralTab === 'rules' && (
                <div className="space-y-6">
                  {/* Milestones Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                      <Flame className="w-5 h-5 text-rose-500" />
                      <h3 className="font-black text-gray-900 text-base">
                        {language === 'ZH' ? '邀请阶梯人头大奖' : language === 'TL' ? 'Mga Milestone ng Pag-imbita' : 'Referral Milestone Rewards'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[
                        { count: 1, reward: '+300积分 + ₱200', title: language === 'ZH' ? '首战告捷' : 'First Invite' },
                        { count: 3, reward: '额外 +500积分 + ₱100券', title: language === 'ZH' ? '新星推荐官' : 'Rising Star' },
                        { count: 5, reward: '额外 +1000积分 + 盲盒礼', title: language === 'ZH' ? '达人推广官' : 'Super Ambassador' },
                        { count: 10, reward: '解锁 2% 永久消费分红', title: language === 'ZH' ? '金牌合伙人' : 'Gold Partner' },
                      ].map((m) => {
                        const isUnlocked = invitedFriends.length >= m.count;
                        return (
                          <div
                            key={m.count}
                            className={`p-4 rounded-2xl border text-center space-y-1.5 ${
                              isUnlocked
                                ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase text-purple-600 block">{m.title}</span>
                            <span className="text-base font-black text-gray-900 block">{language === 'ZH' ? `拉 ${m.count} 人` : `${m.count} Friends`}</span>
                            <span className="text-xs font-bold block text-[#FF6B35]">{m.reward}</span>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block ${
                                isUnlocked ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isUnlocked
                                ? (language === 'ZH' ? '已解锁 ✓' : 'Unlocked ✓')
                                : (language === 'ZH' ? `还差 ${m.count - invitedFriends.length} 人` : `${m.count - invitedFriends.length} left`)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rules & FAQ Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                    <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2">
                      {language === 'ZH' ? '邀请好友规则及奖励说明' : 'Referral Program Rules & Conditions'}
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside leading-relaxed">
                      <li>{language === 'ZH' ? '生成专属海报或复制专属邀请链接分享给好友。' : 'Generate custom poster or copy your unique referral link.'}</li>
                      <li>{language === 'ZH' ? '好友通过您的邀请码注册，即可领 ₱500 新人专属礼包。' : 'Friends get a ₱500 welcome pack upon registering with your code.'}</li>
                      <li>{language === 'ZH' ? '好友完成首笔订单支付后，系统自动向您的账户注入 300 吉诺积分及 ₱200 赠送金。' : 'Earn +300 points and ₱200 wallet cash when your friend completes their first order.'}</li>
                      <li>{language === 'ZH' ? '邀请积分可随时在本模块中兑换全场无门槛优惠券及包邮特权。' : 'Use referral points to redeem exclusive vouchers and free shipping cards anytime.'}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NODE 7: ADDRESSES */}
          {activeNode === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-3">
                <div>
                  <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#FF6B35]" />
                    <span>{language === 'ZH' ? '保存的收货地址簿' : language === 'TL' ? 'Listahan ng mga Address' : 'Saved Address Book'}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {language === 'ZH'
                      ? '支持管理常用收货地址，下单结算时可快速选择使用'
                      : 'Manage your saved shipping addresses for quick checkout.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddAddr}
                  className="bg-[#FF6B35] hover:bg-[#e05928] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ZH' ? '添加新收货地址' : 'Add New Address'}</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-12 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200 space-y-3">
                  <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500 font-bold">
                    {language === 'ZH' ? '暂无保存的收货地址，快来添加一个吧！' : language === 'TL' ? 'Walang nakatagong address' : 'No saved addresses yet'}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddAddr}
                    className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    {language === 'ZH' ? '立即新增地址' : 'Add Address Now'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
                        addr.isDefault
                          ? 'border-[#FF6B35] bg-orange-50/30 shadow-md ring-1 ring-orange-200'
                          : 'border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm text-gray-900">{addr.receiverName}</span>
                            <span className="text-xs font-mono font-bold text-gray-600">({addr.phone})</span>
                          </div>
                          {addr.isDefault ? (
                            <span className="text-[#FF6B35] text-[10px] font-black bg-orange-100 border border-orange-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-[#FF6B35]" />
                              <span>{language === 'ZH' ? '默认地址' : 'DEFAULT'}</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddr(addr.id)}
                              className="text-[10px] font-bold text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 px-2 py-0.5 rounded-full transition-all"
                            >
                              {language === 'ZH' ? '设为默认' : 'Set Default'}
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed font-medium pt-1">
                          {addr.streetDetail}
                          {addr.barangay ? `, ${addr.barangay}` : ''}, {addr.city}, {addr.province} {addr.zipCode}
                        </p>
                      </div>

                      {/* Actions Bar */}
                      <div className="pt-3 border-t border-gray-100/80 flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddr(addr)}
                          className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 font-extrabold text-xs rounded-xl border border-gray-200 transition-all flex items-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                          <span>{language === 'ZH' ? '编辑修改' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddr(addr.id, addr.receiverName)}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 font-extrabold text-xs rounded-xl border border-rose-100 hover:border-rose-200 transition-all flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>{language === 'ZH' ? '删除' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NODE 8: NOTIFICATIONS */}
          {activeNode === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-black text-gray-900">
                {language === 'ZH' ? '系统与交易提醒' : language === 'TL' ? 'mga Abiso' : 'Notifications'}
              </h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  {language === 'ZH' ? '暂无新通知消息' : 'No new notifications'}
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.createdAt}</span>
                      </div>
                      <p className="text-gray-600">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

            </>
          )}
        </div>
      </div>

      {/* Embedded Logistics Modal inside User Center */}
      {selectedOrderTracking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 relative">
            <button
              onClick={() => setSelectedOrderTracking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-gray-900">
              <Truck className="w-6 h-6 text-[#FF6B35]" />
              <div>
                <h3 className="font-extrabold text-sm">{language === 'ZH' ? '包裹物流实时轨迹' : 'Live Package Tracking'}</h3>
                <span className="text-xs text-gray-400">单号: {selectedOrderTracking.id}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-1.5 border border-gray-100">
              <div className="flex justify-between text-gray-700">
                <span>{language === 'ZH' ? '承运物流公司' : 'Carrier'}:</span>
                <span className="font-bold text-gray-900">{selectedOrderTracking.carrier || 'J&T Express Logistics'}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{language === 'ZH' ? '快递运单号' : 'Tracking Number'}:</span>
                <span className="font-bold text-indigo-600 font-mono">{selectedOrderTracking.trackingNumber || 'JT-98234710293'}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1 ring-4 ring-emerald-100" />
                <div className="flex-1">
                  <span className="font-bold text-gray-900 block">{language === 'ZH' ? '包裹派送中 (Manila Express Sorting)' : 'Out for Delivery'}</span>
                  <span className="text-gray-400 text-[10px]">2026-08-06 09:30</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mt-1 ml-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-gray-700 block">{language === 'ZH' ? '到达吉诺马尼拉转运中心' : 'Arrived at Manila Sorting Center'}</span>
                  <span className="text-gray-400 text-[10px]">2026-08-05 18:20</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mt-1 ml-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-gray-700 block">{language === 'ZH' ? '商家已发货，快递员打包发车' : 'Dispatched from Warehouse'}</span>
                  <span className="text-gray-400 text-[10px]">2026-08-05 10:15</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderTracking(null)}
              className="w-full py-3 bg-[#FF6B35] text-white font-black text-xs rounded-2xl hover:bg-[#e05a2b] transition-all"
            >
              {language === 'ZH' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Full Screen High-Res Share Poster Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative max-w-md w-full my-auto space-y-4">
            {/* Modal Close Button */}
            <button
              onClick={() => setShowPosterModal(false)}
              className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Poster Card Render */}
            <div
              className={`w-full rounded-3xl p-7 shadow-2xl text-white relative overflow-hidden border border-white/20 bg-gradient-to-b ${
                posterTheme === 'sunset'
                  ? 'from-amber-500 via-orange-600 to-rose-700'
                  : posterTheme === 'cyber'
                  ? 'from-purple-900 via-indigo-950 to-slate-950'
                  : posterTheme === 'crimson'
                  ? 'from-rose-600 via-red-700 to-amber-700'
                  : 'from-emerald-800 via-teal-900 to-slate-950'
              }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6 text-center">
                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-white/20 pb-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-white text-[#FF6B35] flex items-center justify-center font-black text-lg shadow-lg">
                      G
                    </div>
                    <div>
                      <span className="font-black text-base tracking-wide block leading-none">GINNO GLOBAL STORE</span>
                      <span className="text-[10px] text-white/80 block uppercase tracking-wider">Super Shopping Fest 2026</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-gray-950 px-3 py-1 rounded-full shadow-md">
                    VIP INVITATION
                  </span>
                </div>

                {/* Main Offer Headline */}
                <div className="space-y-2 py-1">
                  <span className="text-xs font-black bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm inline-block backdrop-blur-md">
                    🎁 {language === 'ZH' ? '新人专属 · 注册送 ₱500 礼金' : 'Register for ₱500 Gift Pack'}
                  </span>
                  <h3 className="text-3xl font-black tracking-tight drop-shadow-lg leading-tight">
                    {language === 'ZH' ? '吉诺全场拼团秒杀' : 'Ginno Shopping Festival'}
                    <br />
                    <span className="text-amber-300">{language === 'ZH' ? '首单8折 + 全场包邮' : '20% OFF + FREE SHIPPING'}</span>
                  </h3>
                </div>

                {/* User Card */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/30 flex items-center space-x-3.5 text-left shadow-lg">
                  <img
                    src={
                      user.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
                  />
                  <div>
                    <span className="text-sm font-black block">{user.name} {language === 'ZH' ? '诚挚邀请您' : 'Invites You'}</span>
                    <span className="text-xs text-amber-200 block font-bold">{language === 'ZH' ? '吉诺金牌推荐官 · 专属礼包通道' : 'Ginno Gold Ambassador'}</span>
                  </div>
                </div>

                {/* Big Code Box */}
                <div className="bg-white text-gray-900 rounded-2xl p-5 shadow-2xl space-y-1.5 border border-white">
                  <span className="text-xs text-gray-400 font-extrabold block uppercase tracking-wider">
                    {language === 'ZH' ? '您的专属邀请码' : 'Exclusive Invite Code'}
                  </span>
                  <span className="text-4xl font-black text-[#FF6B35] tracking-widest block font-mono">
                    {user.inviteCode}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium block">
                    {language === 'ZH' ? '长按识别二维码或注册时填入此码' : 'Scan QR code or enter code when registering'}
                  </span>
                </div>

                {/* Big Styled QR Code */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/30 space-y-3 flex flex-col items-center justify-center">
                  <div className="w-36 h-36 bg-white rounded-2xl p-3 flex items-center justify-center shadow-2xl relative">
                    <QrCode className="w-full h-full text-gray-900" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center font-black text-xs shadow-md">
                        G
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-white font-black tracking-wide">
                    {language === 'ZH' ? '长按或扫描二维码 领取 ₱500 礼包包邮券' : 'Scan QR code to claim ₱500 voucher'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer inside Modal */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleSavePosterImage}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ZH' ? '保存海报到相册' : 'Save Poster'}</span>
              </button>

              <button
                onClick={handleCopyShareCaption}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-xs py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'ZH' ? '复制分享文案' : 'Copy Caption'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Add / Edit Modal */}
      {isAddrModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-gray-100 relative">
            <button
              onClick={() => setIsAddrModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-orange-100 text-[#FF6B35] rounded-2xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {editingAddrId
                    ? language === 'ZH'
                      ? '编辑修改收货地址'
                      : 'Edit Shipping Address'
                    : language === 'ZH'
                    ? '添加新收货地址'
                    : 'Add New Shipping Address'}
                </h3>
                <p className="text-xs text-gray-500">
                  {language === 'ZH' ? '请填写准确的收货人及详细地址信息' : 'Please fill in accurate delivery contact details'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAddr} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '收货人姓名' : 'Receiver Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.receiverName}
                    onChange={(e) => setAddrForm({ ...addrForm, receiverName: e.target.value })}
                    placeholder={language === 'ZH' ? '如：张三 / Juan Dela Cruz' : 'e.g. Juan Dela Cruz'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '联系电话' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                    placeholder="0917 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '省份 / 大区' : 'Province / Region'}
                  </label>
                  <input
                    type="text"
                    value={addrForm.province}
                    onChange={(e) => setAddrForm({ ...addrForm, province: e.target.value })}
                    placeholder="Metro Manila"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '城市' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    placeholder="Quezon City"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '社区 / 街区' : 'Barangay'}
                  </label>
                  <input
                    type="text"
                    value={addrForm.barangay}
                    onChange={(e) => setAddrForm({ ...addrForm, barangay: e.target.value })}
                    placeholder="Brgy. Socorro"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {language === 'ZH' ? '详细地址 (街道/门牌/楼层/大厦)' : 'Street Detail / Building'} *
                </label>
                <input
                  type="text"
                  required
                  value={addrForm.streetDetail}
                  onChange={(e) => setAddrForm({ ...addrForm, streetDetail: e.target.value })}
                  placeholder={language === 'ZH' ? '如：123号 Katipunan Avenue, Unit 4B' : 'e.g. 123 Katipunan Ave, Unit 4B'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '邮政编码' : 'Zip Code'}
                  </label>
                  <input
                    type="text"
                    value={addrForm.zipCode}
                    onChange={(e) => setAddrForm({ ...addrForm, zipCode: e.target.value })}
                    placeholder="1100"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                  />
                </div>

                <div className="pt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefaultAddrCheck"
                    checked={addrForm.isDefault}
                    onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                    className="w-4 h-4 text-[#FF6B35] accent-[#FF6B35] rounded focus:ring-orange-400"
                  />
                  <label htmlFor="isDefaultAddrCheck" className="font-bold text-gray-800 cursor-pointer select-none">
                    {language === 'ZH' ? '设为默认收货地址' : 'Set as default address'}
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddrModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs rounded-xl transition-all"
                >
                  {language === 'ZH' ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#e05928] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'ZH' ? '保存收货地址' : 'Save Address'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
