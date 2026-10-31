import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  User,
  ShoppingBag,
  Sparkles,
  Edit2,
  Smartphone,
  Mail,
  Sliders,
  X,
  Plus,
  RefreshCw,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface SupportTicket {
  id: string;
  customerName: string;
  customerAvatar?: string;
  phone: string;
  email: string;
  vipLevel: string;
  orderNo?: string;
  subject: string;
  status: 'pending' | 'in_progress' | 'resolved';
  unread: boolean;
  lastUpdated: string;
  messages: Array<{
    id: string;
    sender: 'customer' | 'agent';
    senderName: string;
    text: string;
    timestamp: string;
  }>;
}

interface NotificationTemplate {
  id: string;
  nameZh: string;
  nameEn: string;
  nameTl: string;
  triggerEvent: string;
  inApp: boolean;
  sms: boolean;
  email: boolean;
  contentZh: string;
  contentEn: string;
  contentTl: string;
  status: 'active' | 'inactive';
}

export const AdminMessages: React.FC = () => {
  const { language } = useApp();

  const [activeTab, setActiveTab] = useState<'support' | 'broadcast' | 'templates'>('support');

  // --- SUPPORT TICKETS STATE ---
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TCK-8812');
  const [replyText, setReplyText] = useState('');

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-8812',
      customerName: 'Maria Santos',
      phone: '+63 917 888 1234',
      email: 'maria.santos@gmail.com',
      vipLevel: 'VIP 2',
      orderNo: 'ORD-20260805-9918',
      subject: 'GCash Payment Verification Inquiry',
      status: 'pending',
      unread: true,
      lastUpdated: '10 mins ago',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          senderName: 'Maria Santos',
          text: 'Hi! I uploaded my GCash proof of payment for Order #ORD-20260805-9918. Can you confirm if my payment went through?',
          timestamp: '10:15 AM',
        },
        {
          id: 'm2',
          sender: 'agent',
          senderName: 'Ginno CS Assistant',
          text: 'Hello Maria! Thank you for contacting Ginno Support. Our finance team is currently verifying GCash reference #88192003.',
          timestamp: '10:18 AM',
        },
      ],
    },
    {
      id: 'TCK-8811',
      customerName: 'Juan Dela Cruz',
      phone: '+63 918 555 9876',
      email: 'juan.dc@yahoo.com',
      vipLevel: 'VIP 3',
      orderNo: 'ORD-20260804-4412',
      subject: 'J&T Express Delivery Tracking Delay',
      status: 'in_progress',
      unread: false,
      lastUpdated: '1 hour ago',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          senderName: 'Juan Dela Cruz',
          text: 'My order tracking says "In Transit to Cebu Hub" for 3 days now. Any update on delivery time?',
          timestamp: '09:00 AM',
        },
      ],
    },
    {
      id: 'TCK-8809',
      customerName: 'Chen Wei (陈伟)',
      phone: '+63 920 333 4455',
      email: 'chenwei@foxmail.com',
      vipLevel: 'VIP 4',
      orderNo: 'AUC-PS5-9012',
      subject: 'Live Auction Winning Claim Inquiry',
      status: 'resolved',
      unread: false,
      lastUpdated: 'Yesterday',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          senderName: 'Chen Wei',
          text: 'I won the PS5 Live Auction last night. How do I complete address confirmation?',
          timestamp: 'Yesterday 21:30',
        },
        {
          id: 'm2',
          sender: 'agent',
          senderName: 'Live Auction Desk',
          text: 'Congratulations Chen Wei! Please go to your Account > Auction Won Bids to settle the balance.',
          timestamp: 'Yesterday 21:35',
        },
      ],
    },
  ]);

  // Quick Preset Replies
  const quickPresets = [
    {
      zh: '您好！GCash 支付已确认完成，系统正准备包件发货。',
      en: 'Hello! Your GCash payment has been verified. We are packing your order now.',
      tl: 'Kumusta! Na-verify na ang iyong GCash payment. Inihahanda na ang order mo.',
    },
    {
      zh: '您好，相关包裹由 J&T Express 派送，预计 1-2 天内送达。',
      en: 'Hello, your parcel is with J&T Express and expected within 1-2 days.',
      tl: 'Kumusta, nasa J&T Express na ang parcel at inaasahang darating sa 1-2 araw.',
    },
    {
      zh: '您好！退款申请已通过审核，资金将在 24 小时内原路退回。',
      en: 'Hello! Your refund request has been approved and will process within 24h.',
      tl: 'Kumusta! Inaprubahan na ang refund at maibabalik sa loob ng 24 oras.',
    },
  ];

  // --- BROADCAST STATE ---
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [sendViaInApp, setSendViaInApp] = useState(true);
  const [sendViaSms, setSendViaSms] = useState(true);
  const [sendViaEmail, setSendViaEmail] = useState(false);

  const [broadcastHistory, setBroadcastHistory] = useState([
    {
      id: 'BC-901',
      title: 'Flash Group Buy Event: 50% Off Electronics!',
      audience: 'All Users',
      sentTime: '2026-08-04 18:00',
      recipients: 10480,
      openRate: '42.8%',
      channels: ['In-App', 'SMS'],
    },
    {
      id: 'BC-899',
      title: 'Live Auction Starting: PS5 & iPhone 15 Pro',
      audience: 'Active Bidders',
      sentTime: '2026-08-03 20:00',
      recipients: 3200,
      openRate: '68.1%',
      channels: ['In-App'],
    },
  ]);

  // --- NOTIFICATION TEMPLATES STATE ---
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'TPL-01',
      nameZh: '订单支付成功通知',
      nameEn: 'Order Payment Confirmation',
      nameTl: 'Kumpirmasyon ng Bayad sa Order',
      triggerEvent: 'order_paid',
      inApp: true,
      sms: true,
      email: true,
      contentZh: '尊贵的 {userName}，您的订单 {orderNo} 已支付 ₱{amount} 成功，我们将尽快为您发货！',
      contentEn: 'Dear {userName}, payment of ₱{amount} for Order {orderNo} is confirmed! Packing now.',
      contentTl: 'Mahal na {userName}, kumpirmado na ang bayad na ₱{amount} para sa Order {orderNo}!',
      status: 'active',
    },
    {
      id: 'TPL-02',
      nameZh: '包裹出库发货提醒',
      nameEn: 'Order Shipped Dispatch',
      nameTl: 'Order na Ipadadala Notification',
      triggerEvent: 'order_shipped',
      inApp: true,
      sms: true,
      email: false,
      contentZh: '您的订单 {orderNo} 已交由 {courierName} 发货，快递单号: {trackingNo}。',
      contentEn: 'Your Order {orderNo} has been dispatched via {courierName}. Tracking: {trackingNo}.',
      contentTl: 'Ang iyong Order {orderNo} ay naipadala na sa {courierName}. Tracking: {trackingNo}.',
      status: 'active',
    },
    {
      id: 'TPL-03',
      nameZh: '拍卖竞价被超越提醒',
      nameEn: 'Auction Outbid Alert',
      nameTl: 'Babala sa Outbid ng Auction',
      triggerEvent: 'auction_outbid',
      inApp: true,
      sms: true,
      email: false,
      contentZh: '提醒: 您在拍品 {productTitle} 的出价已被超越！最新出价为 ₱{amount}，点击加价！',
      contentEn: 'Alert: You have been outbid on {productTitle}! New highest bid is ₱{amount}. Bid now!',
      contentTl: 'Babala: May mas mataas na bid sa {productTitle}! Ang pinakabagong bid ay ₱{amount}.',
      status: 'active',
    },
    {
      id: 'TPL-04',
      nameZh: '拼团成功通知',
      nameEn: 'Group Buy Success',
      nameTl: 'Tagumpay sa Group Buy',
      triggerEvent: 'groupbuy_success',
      inApp: true,
      sms: false,
      email: false,
      contentZh: '恭喜！您的拼团团队已成团，解锁最低团购价 ₱{amount}，即将出库！',
      contentEn: 'Congrats! Your group team is formed! Lowest price of ₱{amount} unlocked.',
      contentTl: 'Mabuhay! Nabuo na ang inyong group team! Nakuha ang pinakamababang presyo na ₱{amount}.',
      status: 'active',
    },
  ]);

  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  // i18n Translations
  const text = {
    title: language === 'ZH' ? '客服与消息中心' : language === 'TL' ? 'Sentro ng CS at Mensahe' : 'Customer Service & Messages Center',
    sub: language === 'ZH' ? '在线客服工单接待、系统广播全员推送及多语言通知模板配置' : language === 'TL' ? 'Live na CS support, mga broadcast notification, at mga template ng abiso' : 'Live CS ticket desk, broadcast push notifications, and multi-language notification templates',
    tabSupport: language === 'ZH' ? '在线客服对话' : language === 'TL' ? 'Live Support at Ticket' : 'Live CS & Support Desk',
    tabBroadcast: language === 'ZH' ? '系统广播推送' : language === 'TL' ? 'Mga Broadcast sa System' : 'System Broadcasts',
    tabTemplates: language === 'ZH' ? '消息通知模板' : language === 'TL' ? 'Mga Template ng Abiso' : 'Notification Templates',

    // Support CS
    searchPlaceholder: language === 'ZH' ? '搜索客户姓名、电话或订单号...' : language === 'TL' ? 'Maghanap ng kustomer, phone o order...' : 'Search customer, phone or order no...',
    filterAll: language === 'ZH' ? '全部工单' : language === 'TL' ? 'Lahat ng Ticket' : 'All Tickets',
    filterPending: language === 'ZH' ? '待回复' : language === 'TL' ? 'Naghihintay' : 'Pending',
    filterInProgress: language === 'ZH' ? '处理中' : language === 'TL' ? 'Nasa Proseso' : 'In Progress',
    filterResolved: language === 'ZH' ? '已解决' : language === 'TL' ? 'Nalutas Na' : 'Resolved',
    quickPresetsTitle: language === 'ZH' ? '常用快捷回复' : language === 'TL' ? 'Mabilis na Sagot' : 'Quick Preset Replies',
    typeReply: language === 'ZH' ? '输入客服回复内容...' : language === 'TL' ? 'Isulat ang sagot...' : 'Type your customer reply...',
    sendReply: language === 'ZH' ? '发送回复' : language === 'TL' ? 'Ipadala ang Sagot' : 'Send Reply',
    markResolved: language === 'ZH' ? '标记为已解决' : language === 'TL' ? 'Markahan bilang Nalutas' : 'Mark as Resolved',
    customerProfile: language === 'ZH' ? '客户资料概览' : language === 'TL' ? 'Profile ng Kustomer' : 'Customer Profile',

    // Broadcast
    bcTitleLabel: language === 'ZH' ? '广播推送标题' : language === 'TL' ? 'Pamagat ng Broadcast' : 'Broadcast Title',
    bcBodyLabel: language === 'ZH' ? '消息详细内容' : language === 'TL' ? 'Nilalaman ng Mensahe' : 'Notification Content',
    targetLabel: language === 'ZH' ? '目标受众人群' : language === 'TL' ? 'Target na User' : 'Target Audience',
    targetAll: language === 'ZH' ? '全站所有注册用户' : language === 'TL' ? 'Lahat ng Rehistradong User' : 'All Registered Users',
    targetVip: language === 'ZH' ? 'VIP 2 及以上高价值会员' : language === 'TL' ? 'VIP 2+ na mga Miyembro' : 'VIP 2+ Premium Members',
    targetBidders: language === 'ZH' ? '近期参与竞拍买家' : language === 'TL' ? 'Mga Bidders sa Auction' : 'Active Auction Bidders',
    channelsLabel: language === 'ZH' ? '发送传输渠道' : language === 'TL' ? 'Mga Channel ng Pagpapadala' : 'Delivery Channels',
    inApp: language === 'ZH' ? 'App 站内弹窗' : language === 'TL' ? 'In-App Push Notification' : 'In-App Push',
    sms: language === 'ZH' ? '手机 SMS 短信' : language === 'TL' ? 'Mensahe sa SMS' : 'SMS Blast (Semaphore)',
    email: language === 'ZH' ? 'EDM 电子邮件' : language === 'TL' ? 'Email Broadcast' : 'Email Newsletter',
    sendBcNow: language === 'ZH' ? '立即全网广播' : language === 'TL' ? 'Ipadala ang Broadcast Ngayon' : 'Send Broadcast Now',
    historyTitle: language === 'ZH' ? '历史广播记录' : language === 'TL' ? 'Kasaysayan ng Broadcast' : 'Recent Broadcast History',

    // Templates
    tplName: language === 'ZH' ? '模板名称' : language === 'TL' ? 'Pangalan ng Template' : 'Template Name',
    trigger: language === 'ZH' ? '触发事件' : language === 'TL' ? 'Trigger na Kaganapan' : 'Trigger Event',
    channels: language === 'ZH' ? '推送通道' : language === 'TL' ? 'Mga Channel' : 'Channels',
    status: language === 'ZH' ? '状态' : language === 'TL' ? 'Estado' : 'Status',
    action: language === 'ZH' ? '操作' : language === 'TL' ? 'Aksyon' : 'Action',
    editTpl: language === 'ZH' ? '编辑模板' : language === 'TL' ? 'Baguhin ang Template' : 'Edit Template',
    saveTpl: language === 'ZH' ? '保存模板设置' : language === 'TL' ? 'I-save ang Template' : 'Save Template Settings',
    varsHint: language === 'ZH' ? '支持变量: {userName}, {orderNo}, {amount}, {trackingNo}, {courierName}' : language === 'TL' ? 'Mga Variable: {userName}, {orderNo}, {amount}, {trackingNo}, {courierName}' : 'Dynamic Tags: {userName}, {orderNo}, {amount}, {trackingNo}, {courierName}',
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.customerName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.phone.includes(ticketSearch) ||
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      (t.orderNo && t.orderNo.toLowerCase().includes(ticketSearch.toLowerCase()));
    if (ticketStatusFilter === 'all') return matchesSearch;
    return matchesSearch && t.status === ticketStatusFilter;
  });

  const handleSendCSMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === selectedTicketId) {
          return {
            ...t,
            status: 'in_progress',
            lastUpdated: 'Just now',
            unread: false,
            messages: [
              ...t.messages,
              {
                id: `m_${Date.now()}`,
                sender: 'agent',
                senderName: 'Ginno CS Specialist',
                text: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return t;
      })
    );
    setReplyText('');
  };

  const handleMarkResolved = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved', lastUpdated: 'Just now' } : t))
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;

    const newBc = {
      id: `BC-${Math.floor(100 + Math.random() * 900)}`,
      title: broadcastTitle,
      audience:
        targetAudience === 'all'
          ? 'All Registered Users'
          : targetAudience === 'vip'
          ? 'VIP 2+ Members'
          : 'Active Auction Bidders',
      sentTime: 'Just now',
      recipients: targetAudience === 'all' ? 10480 : targetAudience === 'vip' ? 1820 : 3200,
      openRate: '0.0%',
      channels: [
        sendViaInApp && 'In-App',
        sendViaSms && 'SMS',
        sendViaEmail && 'Email',
      ].filter(Boolean) as string[],
    };

    setBroadcastHistory([newBc, ...broadcastHistory]);
    setBroadcastTitle('');
    setBroadcastBody('');

    alert(
      language === 'ZH'
        ? `广播通知已成功推送给 ${newBc.recipients} 位用户！`
        : language === 'TL'
        ? `Naipadala na ang broadcast sa ${newBc.recipients} na mga user!`
        : `Broadcast message dispatched to ${newBc.recipients} users!`
    );
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#FF6B35]" />
            <span>{text.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{text.sub}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('support')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'support' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{text.tabSupport}</span>
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'broadcast' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-purple-300" />
            <span>{text.tabBroadcast}</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'templates' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>{text.tabTemplates}</span>
          </button>
        </div>
      </div>

      {/* 1. CUSTOMER LIVE CHAT & SUPPORT DESK */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[620px]">
          {/* Left List of Customer Tickets */}
          <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-xl flex flex-col space-y-3">
            {/* Search and Status Filters */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={text.searchPlaceholder}
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-semibold">
              <button
                onClick={() => setTicketStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  ticketStatusFilter === 'all' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {text.filterAll} ({tickets.length})
              </button>
              <button
                onClick={() => setTicketStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  ticketStatusFilter === 'pending' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {text.filterPending}
              </button>
              <button
                onClick={() => setTicketStatusFilter('in_progress')}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  ticketStatusFilter === 'in_progress' ? 'bg-blue-500/30 text-blue-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {text.filterInProgress}
              </button>
              <button
                onClick={() => setTicketStatusFilter('resolved')}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${
                  ticketStatusFilter === 'resolved' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {text.filterResolved}
              </button>
            </div>

            {/* Ticket Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredTickets.map((t) => {
                const isSelected = t.id === selectedTicketId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-[#FF6B35] shadow-lg'
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-xs">{t.customerName}</span>
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {t.vipLevel}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{t.lastUpdated}</span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium truncate mb-1.5">{t.subject}</p>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-mono">{t.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                          t.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : t.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Live Chat Thread & Customer Info */}
          <div className="lg:col-span-8 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between space-y-3">
            {/* Header with Customer Overview */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B35] to-purple-600 flex items-center justify-center font-black text-white text-sm">
                  {selectedTicket.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-sm">{selectedTicket.customerName}</h3>
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {selectedTicket.vipLevel}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedTicket.phone}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    Subject: <strong className="text-amber-300">{selectedTicket.subject}</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedTicket.status !== 'resolved' && (
                  <button
                    onClick={() => handleMarkResolved(selectedTicket.id)}
                    className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{text.markResolved}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Thread Message Area */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950/60 rounded-2xl border border-white/10">
              {selectedTicket.messages.map((m) => {
                const isAgent = m.sender === 'agent';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-slate-300">{m.senderName}</span>
                      <span>• {m.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isAgent
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/10'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Reply Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 block">{text.quickPresetsTitle}:</span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickPresets.map((p, idx) => {
                  const replyContent = language === 'ZH' ? p.zh : language === 'TL' ? p.tl : p.en;
                  return (
                    <button
                      key={idx}
                      onClick={() => setReplyText(replyContent)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-slate-300 rounded-xl text-[11px] shrink-0 border border-white/10 transition-colors"
                    >
                      "{replyContent.slice(0, 32)}..."
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendCSMessage} className="flex gap-2">
              <input
                type="text"
                placeholder={text.typeReply}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
              />
              <button
                type="submit"
                className="bg-[#FF6B35] hover:opacity-90 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{text.sendReply}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. BROADCAST & SYSTEM PUSH CENTER */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Send Broadcast Form */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <span>{text.tabBroadcast}</span>
            </h3>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.bcTitleLabel}</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. ⚡ Flash Group Buy Night Starting - 50% OFF!"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.bcBodyLabel}</label>
                <textarea
                  rows={4}
                  required
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="Details of the push notification sent to users in Manila, Cebu, and nationwide..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.targetLabel}</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="all">{text.targetAll} (~10,480 Users)</option>
                  <option value="vip">{text.targetVip} (~1,820 Users)</option>
                  <option value="bidders">{text.targetBidders} (~3,200 Users)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-slate-300">{text.channelsLabel}</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={sendViaInApp}
                      onChange={(e) => setSendViaInApp(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-white">{text.inApp}</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={sendViaSms}
                      onChange={(e) => setSendViaSms(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-white">{text.sms}</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={sendViaEmail}
                      onChange={(e) => setSendViaEmail(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-white">{text.email}</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-[#FF6B35] hover:opacity-95 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{text.sendBcNow}</span>
              </button>
            </form>
          </div>

          {/* Broadcast History Table */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white">{text.historyTitle}</h3>
            <div className="space-y-3">
              {broadcastHistory.map((bc) => (
                <div key={bc.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-white text-xs">{bc.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{bc.sentTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-300">
                    <span>Audience: <strong className="text-amber-300">{bc.audience}</strong></span>
                    <span>Recipients: <strong className="text-emerald-400">{bc.recipients.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {bc.channels.map((ch, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold rounded">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. NOTIFICATION TEMPLATES MANAGEMENT */}
      {activeTab === 'templates' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-white">{text.tabTemplates}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{text.varsHint}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">{text.tplName}</th>
                  <th className="p-3">{text.trigger}</th>
                  <th className="p-3">{text.channels}</th>
                  <th className="p-3">{text.status}</th>
                  <th className="p-3 text-right">{text.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-extrabold text-white">
                      {language === 'ZH' ? tpl.nameZh : language === 'TL' ? tpl.nameTl : tpl.nameEn}
                    </td>
                    <td className="p-3 font-mono text-amber-300 text-[11px]">
                      {tpl.triggerEvent}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {tpl.inApp && <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[9px] font-bold">In-App</span>}
                        {tpl.sms && <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px] font-bold">SMS</span>}
                        {tpl.email && <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-bold">Email</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold uppercase">
                        {tpl.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingTemplate(tpl)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        {text.editTpl}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">
                {text.editTpl}: {language === 'ZH' ? editingTemplate.nameZh : editingTemplate.nameEn}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Chinese (中文模板)</label>
                <textarea
                  rows={2}
                  value={editingTemplate.contentZh}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, contentZh: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">English Template</label>
                <textarea
                  rows={2}
                  value={editingTemplate.contentEn}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, contentEn: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Tagalog Template</label>
                <textarea
                  rows={2}
                  value={editingTemplate.contentTl}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, contentTl: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)));
                    setEditingTemplate(null);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 rounded-xl shadow-lg transition-all"
                >
                  {text.saveTpl}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
