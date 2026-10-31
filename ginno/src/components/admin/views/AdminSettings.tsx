import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  Globe,
  UserCheck,
  History,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Users,
  Search,
  Mail,
  ShieldAlert,
  Sparkles,
  X,
  Check,
  Smartphone,
  CreditCard,
  Zap,
  Send,
  Save,
  Server,
  RefreshCw,
  BookOpen,
  FileText,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface AdminRole {
  id: string;
  nameZh: string;
  nameEn: string;
  nameTl: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionTl: string;
  permissions: {
    products: boolean;
    orders: boolean;
    groupbuy: boolean;
    auctions: boolean;
    users: boolean;
    finance: boolean;
    marketing: boolean;
    settings: boolean;
  };
}

interface AdminAccount {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  roleName: string;
  department: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

const MODULE_KEYS: Array<{
  key: keyof AdminRole['permissions'];
  labelZh: string;
  labelEn: string;
  labelTl: string;
}> = [
  { key: 'products', labelZh: '商品管理', labelEn: 'Products', labelTl: 'Mga Produkto' },
  { key: 'orders', labelZh: '订单与物流', labelEn: 'Orders & Shipping', labelTl: 'Mga Order at Kargamento' },
  { key: 'groupbuy', labelZh: '拼团与营销', labelEn: 'Group Buy', labelTl: 'Group Buy' },
  { key: 'auctions', labelZh: '拍卖会', labelEn: 'Auctions', labelTl: 'Mga Auction' },
  { key: 'users', labelZh: '用户与会员', labelEn: 'Users & VIP', labelTl: 'Mga User at VIP' },
  { key: 'finance', labelZh: '财务结算', labelEn: 'Finance', labelTl: 'Pinansyal' },
  { key: 'marketing', labelZh: '优惠券促销', labelEn: 'Marketing', labelTl: 'Posisyon ng Marketing' },
  { key: 'settings', labelZh: '系统设置与RBAC', labelEn: 'Settings & RBAC', labelTl: 'Setting at RBAC' },
];

export const AdminSettings: React.FC = () => {
  const { adminAuditLogs, language } = useApp();

  const [settingsTab, setSettingsTab] = useState<'basic' | 'payments' | 'rbac' | 'audit' | 'spec'>('payments');
  const [specDocTab, setSpecDocTab] = useState<'arch' | 'er' | 'flow' | 'routes' | 'api' | 'deploy'>('arch');

  // --- 1. BASIC SETTINGS STATE ---
  const [siteName, setSiteName] = useState('Ginno Philippines Store & Live Auctions');
  const [siteLogo, setSiteLogo] = useState('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&auto=format&fit=crop&q=80');
  const [currencySymbol, setCurrencySymbol] = useState('₱');
  const [supportEmail, setSupportEmail] = useState('support@ginnostore.ph');
  const [supportHotline, setSupportHotline] = useState('+63 (02) 8888-4466');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // --- 2. PAYMENT & SMS GATEWAY CONFIG STATE ---
  const [gcashConfig, setGcashConfig] = useState({
    enabled: true,
    env: 'production' as 'production' | 'sandbox',
    merchantId: 'GC-PH-8849102',
    apiKey: 'gc_live_992019382103',
    secretKey: 'gc_sec_ph_992011',
    webhookUrl: 'https://api.ginnostore.ph/v1/payments/gcash/callback',
    feeRate: '1.5',
    maxAmount: 50000,
  });

  const [mayaConfig, setMayaConfig] = useState({
    enabled: true,
    env: 'production' as 'production' | 'sandbox',
    publicKey: 'pk-MY-PH-88192091',
    secretKey: 'sk-MY-PH-33102910',
    webhookUrl: 'https://api.ginnostore.ph/v1/payments/maya/callback',
    feeRate: '2.0',
  });

  const [codConfig, setCodConfig] = useState({
    enabled: true,
    maxAmount: 10000,
    fee: 50,
    couriers: 'J&T Express Philippines, NinjaVan PH, Flash Express',
  });

  const [cardConfig, setCardConfig] = useState({
    enabled: true,
    provider: 'Stripe',
    publicKey: 'pk_live_51M9028190283',
    secretKey: 'sk_live_51M9028190283',
  });

  const [smsConfig, setSmsConfig] = useState({
    provider: 'semaphore' as 'semaphore' | 'twilio' | 'globe',
    apiKey: 'sem_ph_live_9012938201',
    senderId: 'GINNO_STORE',
    otpExpiryMinutes: 5,
    dailyQuota: 50000,
    sentToday: 12450,
    notifyOrderPaid: true,
    notifyOrderShipped: true,
    notifyAuctionWon: true,
    notifyGroupbuySuccess: true,
  });

  const [emailConfig, setEmailConfig] = useState({
    host: 'smtp.sendgrid.net',
    port: 587,
    username: 'apikey',
    senderEmail: 'noreply@ginnostore.ph',
    senderName: 'Ginno Philippines Store',
    useTls: true,
  });

  const [testSmsModal, setTestSmsModal] = useState(false);
  const [testPhone, setTestPhone] = useState('+63 917 000 0000');

  // --- 3. RBAC & ADMIN USERS STATE ---
  const [rbacSubTab, setRbacSubTab] = useState<'users' | 'roles'>('users');
  const [searchAdminQuery, setSearchAdminQuery] = useState('');

  const [roles, setRoles] = useState<AdminRole[]>([
    {
      id: 'role_super_admin',
      nameZh: '超级管理员',
      nameEn: 'Super Administrator',
      nameTl: 'Pinakakataasang Administrator',
      descriptionZh: '拥有系统全部功能、财务数据及权限管理的无限制操作权限。',
      descriptionEn: 'Full uninhibited access to all system modules, financial auditing, and RBAC configs.',
      descriptionTl: 'Ganap na access sa lahat ng module ng system, pinansyal, at RBAC.',
      permissions: {
        products: true,
        orders: true,
        groupbuy: true,
        auctions: true,
        users: true,
        finance: true,
        marketing: true,
        settings: true,
      },
    },
    {
      id: 'role_ops_manager',
      nameZh: '运营主管',
      nameEn: 'Operations Manager',
      nameTl: 'Tagapamahala ng Operasyon',
      descriptionZh: '负责商品上架、拼团活动策划、现场拍卖轮次及营销优惠券管理。',
      descriptionEn: 'Manages products, catalog, group buys, live auctions, and marketing coupons.',
      descriptionTl: 'Pangasiwaan ang mga produkto, group buy, live auction, at kupon.',
      permissions: {
        products: true,
        orders: true,
        groupbuy: true,
        auctions: true,
        users: true,
        finance: false,
        marketing: true,
        settings: false,
      },
    },
    {
      id: 'role_cs_lead',
      nameZh: '客服主管',
      nameEn: 'Customer Support Lead',
      nameTl: 'Pinuno ng Customer Support',
      descriptionZh: '负责买家咨询工单接待、订单履约跟进及广播系统通知发布。',
      descriptionEn: 'Handles order dispatching, refunds, user lookup, and system broadcast notifications.',
      descriptionTl: 'Pangasiwaan ang mga ticket ng kustomer, order refund, at mga anunsyo.',
      permissions: {
        products: false,
        orders: true,
        groupbuy: false,
        auctions: false,
        users: true,
        finance: false,
        marketing: false,
        settings: false,
      },
    },
  ]);

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([
    {
      id: 'adm_1001',
      username: 'admin_root',
      name: 'Ginno Master Operator',
      email: 'root@ginnostore.ph',
      phone: '+63 917 000 1111',
      roleId: 'role_super_admin',
      roleName: '超级管理员',
      department: 'Executive HQ (Manila)',
      status: 'active',
      lastLogin: '2026-08-05 09:20:14',
    },
    {
      id: 'adm_1002',
      username: 'ops_lead_mnl',
      name: 'Carlota Mendoza',
      email: 'carlota.m@ginnostore.ph',
      phone: '+63 918 222 3333',
      roleId: 'role_ops_manager',
      roleName: '运营主管',
      department: 'E-Commerce Operations',
      status: 'active',
      lastLogin: '2026-08-04 18:45:00',
    },
    {
      id: 'adm_1003',
      username: 'cs_cebu_supervisor',
      name: 'Ramon Bautista',
      email: 'ramon.b@ginnostore.ph',
      phone: '+63 920 444 5555',
      roleId: 'role_cs_lead',
      roleName: '客服主管',
      department: 'Cebu CS Center',
      status: 'active',
      lastLogin: '2026-08-05 08:10:22',
    },
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState<Partial<AdminAccount>>({
    username: '',
    name: '',
    email: '',
    phone: '',
    roleId: 'role_ops_manager',
    department: 'Metro Manila Hub',
  });

  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [newRoleData, setNewRoleData] = useState<Partial<AdminRole>>({
    nameZh: '',
    nameEn: '',
    nameTl: '',
    descriptionZh: '',
    descriptionEn: '',
    descriptionTl: '',
    permissions: {
      products: true,
      orders: true,
      groupbuy: false,
      auctions: false,
      users: false,
      finance: false,
      marketing: false,
      settings: false,
    },
  });

  // i18n Dictionary
  const text = {
    tabBasic: language === 'ZH' ? '基础参数与SEO' : language === 'TL' ? 'Batayang Setting' : 'Basic Site Config',
    tabGateways: language === 'ZH' ? '支付与短信网关' : language === 'TL' ? 'Bayad at SMS Gateway' : 'Payment & SMS Gateway',
    tabRbac: language === 'ZH' ? '角色与权限 (RBAC)' : language === 'TL' ? 'Mga Role at Admin' : 'Admin Roles & RBAC',
    tabAudit: language === 'ZH' ? '系统操作日志' : language === 'TL' ? 'Log ng Operasyon' : 'Operation Audit Logs',
    tabSpec: language === 'ZH' ? '系统架构与技术文档' : language === 'TL' ? 'Teknikal na Spec' : 'System Spec & Architecture',

    // Basic Config
    basicTitle: language === 'ZH' ? '商城与系统全局基础参数' : language === 'TL' ? 'Pangunahing Setting ng Marketplace' : 'Global Marketplace Basic Settings',
    siteTitleLabel: language === 'ZH' ? '商城前台展示名称' : language === 'TL' ? 'Pangalan ng Marketplace' : 'Storefront Name',
    logoUrlLabel: language === 'ZH' ? '品牌 Logo 图片 URL' : language === 'TL' ? 'Logo URL' : 'Brand Logo Image URL',
    currencyLabel: language === 'ZH' ? '结算主货币符号' : language === 'TL' ? 'Simbolo ng Pera' : 'Primary Currency Symbol',
    emailLabel: language === 'ZH' ? '官方客服邮箱' : language === 'TL' ? 'Email ng Suporta' : 'Official Support Email',
    hotlineLabel: language === 'ZH' ? '热线电话' : language === 'TL' ? 'Telepono ng Suporta' : 'Support Hotline',
    maintenanceLabel: language === 'ZH' ? '维护模式' : language === 'TL' ? 'Maintenance Mode' : 'System Maintenance Mode',
    saveBasicBtn: language === 'ZH' ? '保存基础参数' : language === 'TL' ? 'I-save ang Setting' : 'Save Basic Parameters',

    // Gateways Config
    paymentGatewaysTitle: language === 'ZH' ? '第三方支付网关与密钥管理' : language === 'TL' ? 'Mga Gateway ng Bayad' : 'Payment Gateway API Management',
    gcashTitle: 'GCash',
    mayaTitle: 'Maya Wallet / PayMaya',
    codTitle: language === 'ZH' ? '货到付款 (COD)' : language === 'TL' ? 'Cash On Delivery' : 'Cash On Delivery',
    cardsTitle: language === 'ZH' ? '国际信用卡 (Stripe / PayPal)' : language === 'TL' ? 'Kard ng Kredito' : 'International Credit Cards',
    smsTitle: language === 'ZH' ? 'SMS 短信网关配置' : language === 'TL' ? 'Setting ng SMS Gateway' : 'SMS Gateway Config',
    emailSmtpTitle: language === 'ZH' ? 'Email 网关配置' : language === 'TL' ? 'Setting ng Email Gateway' : 'Email Gateway Config',

    envLabel: language === 'ZH' ? '运行环境' : language === 'TL' ? 'Kapaligiran' : 'Environment',
    merchantIdLabel: language === 'ZH' ? '商户 ID' : language === 'TL' ? 'Merchant ID' : 'Merchant ID',
    apiKeyLabel: language === 'ZH' ? 'API 公钥' : language === 'TL' ? 'API Key' : 'API Public Key',
    secretKeyLabel: language === 'ZH' ? 'API 私钥' : language === 'TL' ? 'Secret Key' : 'API Secret Key',
    webhookLabel: language === 'ZH' ? '异步回调 Webhook 地址' : language === 'TL' ? 'Webhook Address' : 'Webhook Callback URL',
    feeRateLabel: language === 'ZH' ? '网关手续费率 (%)' : language === 'TL' ? 'Bayad sa Transeksyon (%)' : 'Transaction Fee Rate (%)',
    testConnectionBtn: language === 'ZH' ? '测试网关连通性' : language === 'TL' ? 'Subukan ang Koneksyon' : 'Test Connection',
    saveGatewaysBtn: language === 'ZH' ? '保存网关与接口参数' : language === 'TL' ? 'I-save ang Gateway Config' : 'Save Gateway Configurations',

    smsProviderLabel: language === 'ZH' ? '短信服务商' : language === 'TL' ? 'Provider ng SMS' : 'SMS Provider',
    senderIdLabel: language === 'ZH' ? '短信发送者 ID' : language === 'TL' ? 'Sender ID' : 'Sender ID',
    dailyQuotaLabel: language === 'ZH' ? '每日发送配额额度' : language === 'TL' ? 'Araw-araw na Quota' : 'Daily Quota',
    sendTestSmsBtn: language === 'ZH' ? '发送测试短信' : language === 'TL' ? 'Magpadala ng Test SMS' : 'Send Test SMS',

    // RBAC
    adminAccountsTitle: language === 'ZH' ? '管理员账号列表' : language === 'TL' ? 'Mga Account ng Admin' : 'Admin Accounts List',
    rolesMatrixTitle: language === 'ZH' ? '角色与权限矩阵' : language === 'TL' ? 'Mga Role at Permiso' : 'Roles & Permissions Matrix',
    addAdminBtn: language === 'ZH' ? '添加管理员账号' : language === 'TL' ? 'Magdagdag ng Admin' : 'Add Admin Account',
    createRoleBtn: language === 'ZH' ? '创建新角色' : language === 'TL' ? 'Gumawa ng Role' : 'Create Custom Role',

    // Audit
    auditTitle: language === 'ZH' ? '全站系统操作审计日志' : language === 'TL' ? 'Log ng Operasyon sa System' : 'System Operation Audit Logs',
    operator: language === 'ZH' ? '操作员' : language === 'TL' ? 'Operator' : 'Operator',
    module: language === 'ZH' ? '业务模块' : language === 'TL' ? 'Module' : 'Module',
    time: language === 'ZH' ? '操作时间' : language === 'TL' ? 'Oras' : 'Time',
  };

  // Test Gateway Connection handler
  const handleTestGatewayConnection = (gatewayName: string) => {
    alert(
      language === 'ZH'
        ? `[网络连通测试] ${gatewayName} Webhook 响应正常！延迟: 38ms，凭证验证通过。`
        : language === 'TL'
        ? `[Koneksyon OK] Ang ${gatewayName} ay gumagana nang maayos! Response: 38ms.`
        : `[Connection Check] ${gatewayName} Webhook responds OK! Latency: 38ms, credentials valid.`
    );
  };

  // Test SMS Sending
  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    setTestSmsModal(false);
    alert(
      language === 'ZH'
        ? `已通过 ${smsConfig.provider.toUpperCase()} 成功向 ${testPhone} 发送测试短信！`
        : language === 'TL'
        ? `Matagumpay na naipadala ang test SMS sa ${testPhone} gamit ang ${smsConfig.provider.toUpperCase()}!`
        : `Test SMS successfully dispatched to ${testPhone} via ${smsConfig.provider.toUpperCase()}!`
    );
  };

  // Global Save Gateways Handler
  const handleSaveGateways = () => {
    alert(
      language === 'ZH'
        ? '支付网关、API 密钥与 SMS 短信参数已安全更新保存！'
        : language === 'TL'
        ? 'Ligtas na na-update ang mga setting ng bayad at SMS gateway!'
        : 'Payment & SMS Gateway configurations successfully updated and saved!'
    );
  };

  // Create Admin User
  const handleCreateAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.name) return;

    const selectedRole = roles.find((r) => r.id === newAdmin.roleId) || roles[1];
    const createdUser: AdminAccount = {
      id: `adm_${Date.now().toString().slice(-4)}`,
      username: newAdmin.username,
      name: newAdmin.name,
      email: newAdmin.email || `${newAdmin.username}@ginnostore.ph`,
      phone: newAdmin.phone || '+63 900 000 0000',
      roleId: selectedRole.id,
      roleName: language === 'ZH' ? selectedRole.nameZh : language === 'TL' ? selectedRole.nameTl : selectedRole.nameEn,
      department: newAdmin.department || 'Operations HQ',
      status: 'active',
      lastLogin: 'Just registered',
    };

    setAdminAccounts([createdUser, ...adminAccounts]);
    setShowAddUserModal(false);
    setNewAdmin({
      username: '',
      name: '',
      email: '',
      phone: '',
      roleId: 'role_ops_manager',
      department: 'Metro Manila Operations',
    });
  };

  const handleToggleUserStatus = (id: string) => {
    setAdminAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, status: acc.status === 'active' ? 'suspended' : 'active' } : acc))
    );
  };

  const handleDeleteAdminUser = (id: string) => {
    if (confirm(language === 'ZH' ? '确定要注销此管理员账号吗？' : language === 'TL' ? 'Sigurado ka bang tanggalin ang admin na ito?' : 'Delete this admin user account?')) {
      setAdminAccounts((prev) => prev.filter((acc) => acc.id !== id));
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? editingRole : r)));
      setEditingRole(null);
    } else {
      if (!newRoleData.nameZh) return;
      const createdRole: AdminRole = {
        id: `role_${Date.now()}`,
        nameZh: newRoleData.nameZh,
        nameEn: newRoleData.nameEn || newRoleData.nameZh,
        nameTl: newRoleData.nameTl || newRoleData.nameZh,
        descriptionZh: newRoleData.descriptionZh || '自定义岗位权限',
        descriptionEn: newRoleData.descriptionEn || 'Custom administrative role',
        descriptionTl: newRoleData.descriptionTl || 'Kustom na tungkulin',
        permissions: newRoleData.permissions || {
          products: true,
          orders: true,
          groupbuy: false,
          auctions: false,
          users: false,
          finance: false,
          marketing: false,
          settings: false,
        },
      };
      setRoles([...roles, createdRole]);
      setShowAddRoleModal(false);
    }
  };

  const filteredAdmins = adminAccounts.filter(
    (a) =>
      a.username.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchAdminQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Settings Sub-Navigation Bar */}
      <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-2xl border border-white/10 overflow-x-auto">
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setSettingsTab('basic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              settingsTab === 'basic' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{text.tabBasic}</span>
          </button>
          <button
            onClick={() => setSettingsTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              settingsTab === 'payments' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>{text.tabGateways}</span>
          </button>
          <button
            onClick={() => setSettingsTab('rbac')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              settingsTab === 'rbac' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span>{text.tabRbac}</span>
          </button>
          <button
            onClick={() => setSettingsTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              settingsTab === 'audit' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-amber-300" />
            <span>{text.tabAudit} ({adminAuditLogs.length})</span>
          </button>
          <button
            onClick={() => setSettingsTab('spec')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              settingsTab === 'spec' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>{text.tabSpec}</span>
          </button>
        </div>
      </div>

      {/* 1. BASIC SETTINGS TAB */}
      {settingsTab === 'basic' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-5 text-xs">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FF6B35]" />
            <span>{text.basicTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.siteTitleLabel}</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.logoUrlLabel}</label>
              <input
                type="text"
                value={siteLogo}
                onChange={(e) => setSiteLogo(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.currencyLabel}</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.emailLabel}</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.hotlineLabel}</label>
              <input
                type="text"
                value={supportHotline}
                onChange={(e) => setSupportHotline(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <span className="font-bold text-white text-xs block">{text.maintenanceLabel}</span>
                <p className="text-[10px] text-slate-400">Restricts buyer app operations during upgrades</p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 cursor-pointer accent-[#FF6B35]"
              />
            </div>
          </div>

          <button
            onClick={() => alert(language === 'ZH' ? '基础参数已更新' : 'Basic settings updated!')}
            className="bg-[#FF6B35] hover:opacity-90 text-white font-black px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{text.saveBasicBtn}</span>
          </button>
        </div>
      )}

      {/* 2. PAYMENT & SMS GATEWAYS CONFIGURATION TAB */}
      {settingsTab === 'payments' && (
        <div className="space-y-6 text-xs">
          {/* Section A: Payment Gateways */}
          <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>{text.paymentGatewaysTitle}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* GCash Gateway */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <h4 className="font-extrabold text-blue-400 text-sm">{text.gcashTitle}</h4>
                  </div>
                  <input
                    type="checkbox"
                    checked={gcashConfig.enabled}
                    onChange={(e) => setGcashConfig({ ...gcashConfig, enabled: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <label className="block text-slate-400 mb-0.5">{text.envLabel}</label>
                    <select
                      value={gcashConfig.env}
                      onChange={(e) => setGcashConfig({ ...gcashConfig, env: e.target.value as any })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white"
                    >
                      <option value="production">Production Live</option>
                      <option value="sandbox">Sandbox Test</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">{text.merchantIdLabel}</label>
                    <input
                      type="text"
                      value={gcashConfig.merchantId}
                      onChange={(e) => setGcashConfig({ ...gcashConfig, merchantId: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">{text.secretKeyLabel}</label>
                    <input
                      type="password"
                      value={gcashConfig.secretKey}
                      onChange={(e) => setGcashConfig({ ...gcashConfig, secretKey: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">{text.webhookLabel}</label>
                    <input
                      type="text"
                      value={gcashConfig.webhookUrl}
                      onChange={(e) => setGcashConfig({ ...gcashConfig, webhookUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-slate-300 text-[10px] font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400">{text.feeRateLabel}: <strong>{gcashConfig.feeRate}%</strong></span>
                    <button
                      type="button"
                      onClick={() => handleTestGatewayConnection('GCash PH')}
                      className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-[10px] font-bold transition-all"
                    >
                      {text.testConnectionBtn}
                    </button>
                  </div>
                </div>
              </div>

              {/* Maya Wallet Gateway */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <h4 className="font-extrabold text-purple-300 text-sm">{text.mayaTitle}</h4>
                  </div>
                  <input
                    type="checkbox"
                    checked={mayaConfig.enabled}
                    onChange={(e) => setMayaConfig({ ...mayaConfig, enabled: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-purple-500"
                  />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <label className="block text-slate-400 mb-0.5">{text.apiKeyLabel}</label>
                    <input
                      type="text"
                      value={mayaConfig.publicKey}
                      onChange={(e) => setMayaConfig({ ...mayaConfig, publicKey: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">{text.secretKeyLabel}</label>
                    <input
                      type="password"
                      value={mayaConfig.secretKey}
                      onChange={(e) => setMayaConfig({ ...mayaConfig, secretKey: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">{text.webhookLabel}</label>
                    <input
                      type="text"
                      value={mayaConfig.webhookUrl}
                      onChange={(e) => setMayaConfig({ ...mayaConfig, webhookUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-slate-300 text-[10px] font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400">{text.feeRateLabel}: <strong>{mayaConfig.feeRate}%</strong></span>
                    <button
                      type="button"
                      onClick={() => handleTestGatewayConnection('Maya Gateway')}
                      className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-[10px] font-bold transition-all"
                    >
                      {text.testConnectionBtn}
                    </button>
                  </div>
                </div>
              </div>

              {/* COD & Bank Transfer */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <h4 className="font-extrabold text-amber-300 text-sm">{text.codTitle}</h4>
                  </div>
                  <input
                    type="checkbox"
                    checked={codConfig.enabled}
                    onChange={(e) => setCodConfig({ ...codConfig, enabled: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-amber-500"
                  />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Max COD Limit (₱)</label>
                    <input
                      type="number"
                      value={codConfig.maxAmount}
                      onChange={(e) => setCodConfig({ ...codConfig, maxAmount: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">COD Handling Surcharge (₱)</label>
                    <input
                      type="number"
                      value={codConfig.fee}
                      onChange={(e) => setCodConfig({ ...codConfig, fee: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">Supported Couriers</label>
                    <input
                      type="text"
                      value={codConfig.couriers}
                      onChange={(e) => setCodConfig({ ...codConfig, couriers: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-slate-300 text-[10px]"
                    />
                  </div>
                </div>
              </div>

              {/* Credit / Debit Cards (Stripe) */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <h4 className="font-extrabold text-emerald-300 text-sm">{text.cardsTitle}</h4>
                  </div>
                  <input
                    type="checkbox"
                    checked={cardConfig.enabled}
                    onChange={(e) => setCardConfig({ ...cardConfig, enabled: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Stripe Public Key</label>
                    <input
                      type="text"
                      value={cardConfig.publicKey}
                      onChange={(e) => setCardConfig({ ...cardConfig, publicKey: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-0.5">Stripe Secret Key</label>
                    <input
                      type="password"
                      value={cardConfig.secretKey}
                      onChange={(e) => setCardConfig({ ...cardConfig, secretKey: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleTestGatewayConnection('Stripe Credit Cards')}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold transition-all"
                    >
                      {text.testConnectionBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: SMS & Notification Gateway */}
          <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <span>{text.smsTitle}</span>
              </h3>

              <button
                type="button"
                onClick={() => setTestSmsModal(true)}
                className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{text.sendTestSmsBtn}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
              <div>
                <label className="block text-slate-300 font-bold mb-1">{text.smsProviderLabel}</label>
                <select
                  value={smsConfig.provider}
                  onChange={(e) => setSmsConfig({ ...smsConfig, provider: e.target.value as any })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="semaphore">Semaphore PH (Recommended Philippines API)</option>
                  <option value="twilio">Twilio Global SMS</option>
                  <option value="globe">Globe Telecom Direct Gateway</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">API Credentials Key</label>
                <input
                  type="password"
                  value={smsConfig.apiKey}
                  onChange={(e) => setSmsConfig({ ...smsConfig, apiKey: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{text.senderIdLabel}</label>
                <input
                  type="text"
                  value={smsConfig.senderId}
                  onChange={(e) => setSmsConfig({ ...smsConfig, senderId: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white font-mono uppercase"
                />
              </div>
            </div>

            {/* Daily Usage Progress */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">{text.dailyQuotaLabel}:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {smsConfig.sentToday.toLocaleString()} / {smsConfig.dailyQuota.toLocaleString()} Sent
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400"
                  style={{ width: `${(smsConfig.sentToday / smsConfig.dailyQuota) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveGateways}
              className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{text.saveGatewaysBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. RBAC & ADMIN USER CREATION TAB */}
      {settingsTab === 'rbac' && (
        <div className="space-y-6 text-xs">
          <div className="flex justify-between items-center bg-slate-900/90 p-3 rounded-2xl border border-white/10">
            <div className="flex gap-2">
              <button
                onClick={() => setRbacSubTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rbacSubTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{text.adminAccountsTitle} ({adminAccounts.length})</span>
              </button>
              <button
                onClick={() => setRbacSubTab('roles')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rbacSubTab === 'roles' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-300" />
                <span>{text.rolesMatrixTitle} ({roles.length})</span>
              </button>
            </div>

            {rbacSubTab === 'users' && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{text.addAdminBtn}</span>
              </button>
            )}

            {rbacSubTab === 'roles' && (
              <button
                onClick={() => setShowAddRoleModal(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{text.createRoleBtn}</span>
              </button>
            )}
          </div>

          {rbacSubTab === 'users' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search admin username, full name, email..."
                    value={searchAdminQuery}
                    onChange={(e) => setSearchAdminQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
                  />
                </div>
                <span className="text-xs text-slate-400 font-semibold shrink-0">
                  Total Admins: <strong className="text-white">{filteredAdmins.length}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">Admin Account</th>
                      <th className="p-3">Role Assigned</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Last Login</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredAdmins.map((acc) => (
                      <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                              {acc.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-extrabold text-white text-xs block">{acc.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">@{acc.username} • {acc.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {acc.roleName}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 text-xs font-semibold">
                          {acc.department}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] font-mono">
                          {acc.lastLogin}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              acc.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {acc.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleUserStatus(acc.id)}
                              className={`px-2.5 py-1 font-bold rounded-lg text-[11px] transition-colors ${
                                acc.status === 'active'
                                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              }`}
                            >
                              {acc.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteAdminUser(acc.id)}
                              className="p-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {rbacSubTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r) => {
                const roleName = language === 'ZH' ? r.nameZh : language === 'TL' ? r.nameTl : r.nameEn;
                const roleDesc = language === 'ZH' ? r.descriptionZh : language === 'TL' ? r.descriptionTl : r.descriptionEn;
                return (
                  <div key={r.id} className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-300" />
                          <h4 className="font-extrabold text-white text-sm">{roleName}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{roleDesc}</p>
                      </div>

                      <button
                        onClick={() => setEditingRole(r)}
                        className="bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-purple-300" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {MODULE_KEYS.map((mod) => {
                        const hasAccess = r.permissions[mod.key];
                        const modLabel = language === 'ZH' ? mod.labelZh : language === 'TL' ? mod.labelTl : mod.labelEn;
                        return (
                          <div
                            key={mod.key}
                            className={`p-2 rounded-xl flex items-center justify-between border text-[11px] ${
                              hasAccess
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                                : 'bg-slate-900 border-white/5 text-slate-500 opacity-60'
                            }`}
                          >
                            <span>{modLabel}</span>
                            {hasAccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. AUDIT LOGS TAB */}
      {settingsTab === 'audit' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-black text-white">{text.auditTitle}</h3>
          <div className="space-y-2">
            {adminAuditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-xs">{log.action}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {text.operator}: <strong className="text-purple-300">{log.operator}</strong> | {text.module}: <strong className="text-amber-300">{log.module}</strong>
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SYSTEM SPEC & ARCHITECTURE TAB */}
      {settingsTab === 'spec' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-6 text-xs text-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FF6B35] rounded-2xl text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {language === 'ZH' ? '吉诺电商微服务架构与系统技术规范' : language === 'TL' ? 'Teknikal na Dokumentasyon at Arkitektura' : 'Ginno Technical Specification & System Architecture'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'ZH'
                    ? '微服务系统架构、ER 数据库模型、核心业务流程图、RESTful API 规范与 Cloud Run 容器部署配置'
                    : language === 'TL'
                    ? 'Mga detalyadong detalye: Microservices, ER Database, Business Flows, at Cloud Run deployment'
                    : 'Detailed Specifications: Microservices, ER Database, Business Flows, API Spec & Cloud Run Deployment'}
                </p>
              </div>
            </div>
          </div>

          {/* Spec Navigation Sub-Tabs */}
          <div className="flex overflow-x-auto gap-2 text-xs font-bold shrink-0 bg-slate-950/60 p-2 rounded-2xl border border-white/10">
            {[
              { id: 'arch', label: language === 'ZH' ? '1. 系统微服务架构图' : language === 'TL' ? '1. Arkitektura' : '1. System Architecture' },
              { id: 'er', label: language === 'ZH' ? '2. 数据库 ER 模型' : language === 'TL' ? '2. ER Model' : '2. Database ER Models' },
              { id: 'flow', label: language === 'ZH' ? '3. 核心业务流程图' : language === 'TL' ? '3. Mga Process Flow' : '3. Core Business Processes' },
              { id: 'routes', label: language === 'ZH' ? '4. 前端页面路由表' : language === 'TL' ? '4. Route Map' : '4. Frontend Route Map' },
              { id: 'api', label: language === 'ZH' ? '5. API & WebSocket 规范' : language === 'TL' ? '5. API Spec' : '5. API & WebSocket Spec' },
              { id: 'deploy', label: language === 'ZH' ? '6. Cloud Run 部署配置' : language === 'TL' ? '6. Deployment' : '6. Cloud Run Deployment' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSpecDocTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  specDocTab === tab.id
                    ? 'bg-[#FF6B35] text-white shadow'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-Tab 1: Architecture */}
          {specDocTab === 'arch' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>{language === 'ZH' ? '1. 微服务系统整体架构图' : '1. Microservices System Architecture Diagram'}</span>
              </h4>
              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto leading-tight shadow-inner border border-white/10">
{`+-----------------------------------------------------------------------------------+
|                            CLIENT LAYERS (PWA / H5 / Native)                       |
|   React 18 + Tailwind CSS + PWA Service Worker + WebSocket Auction Ticker           |
+-----------------------------------------------------------------------------------+
                                          | HTTPS / WSS
                                          v
+-----------------------------------------------------------------------------------+
|                             API GATEWAY LAYER (Kong / Nginx)                       |
|  JWT Auth Validation | Rate Limiting (100 req/s) | SSL Termination | TLS 1.3        |
+-----------------------------------------------------------------------------------+
                                          |
     +-------------------+----------------+--------------------+--------------------+
     |                   |                |                    |                    |
     v                   v                v                    v                    v
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
| User      |      | Product   |    | Order     |        | Group-Buy |        | Auction   |
| Service   |      | Service   |    | Service   |        | Service   |        | Service   |
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
     |                   |                |                    |                    |
     v                   v                v                    v                    v
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
| Payment   |      | Logistics |    | Marketing |        | Search    |        | CMS       |
| Service   |      | Service   |    | Service   |        | Service   |        | Service   |
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                  DATA PERSISTENCE                                 |
|  - PostgreSQL 15: Users, Orders, Products, Group Deals, Auctions (Transactional)   |
|  - Redis Cluster: Session, Caching, Live Bids, Inventory Locks, Anti-Snipe Timers  |
|  - MongoDB: User Action Audit Logs, Product Reviews, Merchant Logs                |
|  - Elasticsearch: Full-text Product & Category Search Engine                      |
+-----------------------------------------------------------------------------------+`}
              </pre>
            </div>
          )}

          {/* Sub-Tab 2: Database ER Models */}
          {specDocTab === 'er' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>{language === 'ZH' ? '2. 核心数据库实体关系表 (ER Relationship)' : '2. Database ER Relationship Models'}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2">
                  <h5 className="font-extrabold text-amber-300 text-xs">Core Tables & Foreign Keys</h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px] font-mono">
                    <li><strong className="text-white">users</strong> (id PK, phone, member_level, wallet_balance)</li>
                    <li><strong className="text-white">products</strong> (id PK, category_id FK, title_en, title_zh, status)</li>
                    <li><strong className="text-white">product_skus</strong> (id PK, product_id FK, price, stock)</li>
                    <li><strong className="text-white">orders</strong> (id PK, user_id FK, pay_amount, status)</li>
                  </ul>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2">
                  <h5 className="font-extrabold text-purple-300 text-xs">Group Buy & Auction Tables</h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px] font-mono">
                    <li><strong className="text-white">group_buy_teams</strong> (id PK, leader_id FK, status)</li>
                    <li><strong className="text-white">auction_items</strong> (id PK, starting_bid, current_highest_bid)</li>
                    <li><strong className="text-white">auction_bids</strong> (id PK, auction_id FK, bid_amount)</li>
                    <li><strong className="text-white">auction_pool</strong> (id PK, last_highest_bid, no_sale_reason)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Process Flows */}
          {specDocTab === 'flow' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>{language === 'ZH' ? '3. 核心业务流程与防作弊机制' : '3. Core Business Process Flowcharts'}</span>
              </h4>
              <div className="space-y-3">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-1">
                  <h5 className="font-black text-amber-400 text-xs">🔥 Group Buy Process Flow (拼团流程)</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Select Product → Choose 2/3/5 Person Tier → Checkout & Pay → Receive Team Invite Link → Share on Messenger/Viber → Members Join → Threshold Met → Automatic Order Dispatch (or Virtual Fill Fallback).
                  </p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-1">
                  <h5 className="font-black text-purple-400 text-xs">🔨 Live Auction & Anti-Snipe Flow (拍卖防尾秒机制)</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Live Room Join → Place Bid / Auto-Bid Proxy → WebSocket Broadcasts Price → If bid in last 5 min, Extend Timer by 5 min → Auction Ends → Highest Bidder Wins → 24h Payment Timer → Unpaid items move to Auction Pool (流拍池).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Route Map */}
          {specDocTab === 'routes' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ZH' ? '4. 前端应用路由与页面映射表' : '4. Frontend Page Route Map'}</span>
              </h4>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px] bg-slate-950/80 p-4 rounded-2xl border border-white/10 text-emerald-300">
                <li>/ (Home Page)</li>
                <li>/categories (Category Tree)</li>
                <li>/products (Product Listing)</li>
                <li>/product/:id (Product Detail)</li>
                <li>/cart (Shopping Cart)</li>
                <li>/checkout (Checkout & Payment)</li>
                <li>/orders (Order Management)</li>
                <li>/group-buy (Group Buy Hub)</li>
                <li>/group-buy/team/:id (Waiting Room)</li>
                <li>/auctions (Auction Hall)</li>
                <li>/auction/:id (Live Auction Room)</li>
                <li>/user (User Center & Profile)</li>
                <li>/admin (Operations Dashboard)</li>
              </ul>
            </div>
          )}

          {/* Sub-Tab 5: API Spec */}
          {specDocTab === 'api' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-300" />
                <span>{language === 'ZH' ? '5. RESTful API 与 WebSocket 实时通道' : '5. RESTful API & WebSocket Spec'}</span>
              </h4>
              <pre className="bg-slate-950 text-amber-300 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto leading-tight shadow-inner border border-white/10">
{`POST /api/v1/auth/login                  -> Login with mobile OTP
GET  /api/v1/products/list               -> Fetch products with filters
POST /api/v1/orders/create               -> Create new order (GCash/COD/Cards)
POST /api/v1/group-buy/teams/create      -> Start group buy team
POST /api/v1/auctions/:id/bid            -> Place auction bid
WSS  /ws/auction/:id                     -> WebSocket live bid updates stream`}
              </pre>
            </div>
          )}

          {/* Sub-Tab 6: Cloud Run Deployment */}
          {specDocTab === 'deploy' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-[#FF6B35]" />
                <span>{language === 'ZH' ? '6. Cloud Run 容器集群高可用部署规范' : '6. High-Availability Cloud Run Deployment'}</span>
              </h4>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2 text-slate-300">
                <p><strong className="text-white">Cloud Region:</strong> asia-east1 (Taiwan / Hong Kong latency &lt; 30ms to Manila)</p>
                <p><strong className="text-white">Container Setup:</strong> Express + Vite bundle, Node 20 runtime, Port 3000 ingress routing</p>
                <p><strong className="text-white">Auto-scaling:</strong> 2 to 20 instances based on CPU threshold &gt; 70% during Flash Sales</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TEST SMS MODAL */}
      {testSmsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white">{text.sendTestSmsBtn}</h3>
              <button onClick={() => setTestSmsModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSendTestSms} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Philippines Phone Number</label>
                <input
                  type="text"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] text-slate-400">
                Provider: <strong className="text-purple-300">{smsConfig.provider.toUpperCase()}</strong> | Sender ID: <strong className="text-emerald-400">{smsConfig.senderId}</strong>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 rounded-xl shadow-lg"
              >
                Dispatch Test SMS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE ADMIN ACCOUNT */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <span>{text.addAdminBtn}</span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ops_manager_mnl"
                  value={newAdmin.username || ''}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={newAdmin.name || ''}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Role</label>
                <select
                  value={newAdmin.roleId}
                  onChange={(e) => setNewAdmin({ ...newAdmin, roleId: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {language === 'ZH' ? r.nameZh : language === 'TL' ? r.nameTl : r.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-90 text-white font-black py-2.5 rounded-xl shadow-lg transition-all"
                >
                  Confirm Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ROLE MATRIX */}
      {editingRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">
                Edit Matrix: {language === 'ZH' ? editingRole.nameZh : editingRole.nameEn}
              </h3>
              <button onClick={() => setEditingRole(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-4 rounded-2xl border border-white/10">
                {MODULE_KEYS.map((mod) => (
                  <label key={mod.key} className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions[mod.key]}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditingRole({
                          ...editingRole,
                          permissions: {
                            ...editingRole.permissions,
                            [mod.key]: checked,
                          },
                        });
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-white text-xs">
                      {language === 'ZH' ? mod.labelZh : language === 'TL' ? mod.labelTl : mod.labelEn}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 rounded-xl shadow-lg transition-all"
                >
                  Save Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW ROLE */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">{text.createRoleBtn}</h3>
              <button onClick={() => setShowAddRoleModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '角色名称（中文）' : language === 'TL' ? 'Pangalan ng Role (Chinese)' : 'Role Name (Chinese)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 质检审核员"
                  value={newRoleData.nameZh || ''}
                  onChange={(e) => setNewRoleData({ ...newRoleData, nameZh: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '角色名称（英文）' : language === 'TL' ? 'Pangalan ng Role (English)' : 'Role Name (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quality Auditor"
                  value={newRoleData.nameEn || ''}
                  onChange={(e) => setNewRoleData({ ...newRoleData, nameEn: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 rounded-xl shadow-lg"
                >
                  {language === 'ZH' ? '创建角色' : language === 'TL' ? 'Gumawa ng Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
