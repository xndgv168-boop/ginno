import React, { useState } from 'react';
import {
  BarChart2,
  Package,
  ShoppingBag,
  Zap,
  Flame,
  Gavel,
  Gift,
  Users,
  DollarSign,
  Truck,
  Ticket,
  FileText,
  TrendingUp,
  MessageSquare,
  Settings,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Menu,
  X,
  Globe,
  Store,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

import { AdminOverview } from './views/AdminOverview';
import { AdminProducts } from './views/AdminProducts';
import { AdminFlashSale } from './views/AdminFlashSale';
import { AdminGroupBuy } from './views/AdminGroupBuy';
import { AdminAuctions } from './views/AdminAuctions';
import { AdminBlindBox } from './views/AdminBlindBox';
import { AdminOrders } from './views/AdminOrders';
import { AdminUsers } from './views/AdminUsers';
import { AdminFinance } from './views/AdminFinance';
import { AdminLogistics } from './views/AdminLogistics';
import { AdminMarketing } from './views/AdminMarketing';
import { AdminCMS } from './views/AdminCMS';
import { AdminAnalytics } from './views/AdminAnalytics';
import { AdminMessages } from './views/AdminMessages';
import { AdminSettings } from './views/AdminSettings';
import { AdminMerchants } from './views/AdminMerchants';

type NavModuleId =
  | 'overview'
  | 'merchants'
  | 'products'
  | 'orders'
  | 'flashsale'
  | 'groupbuy'
  | 'auctions'
  | 'blindbox'
  | 'users'
  | 'finance'
  | 'logistics'
  | 'marketing'
  | 'cms'
  | 'analytics'
  | 'messages'
  | 'settings';

interface NavItem {
  id: NavModuleId;
  labelEn: string;
  labelTl: string;
  labelZh: string;
  icon: React.FC<{ className?: string }>;
  badge?: number | string;
}

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    auctions,
    groupTeams,
    blindBoxes,
    merchants,
    setIsAdminView,
    setIsAdminAuthenticated,
    language,
    setLanguage,
    t,
  } = useApp();

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
  };

  const [activeModule, setActiveModule] = useState<NavModuleId>('overview');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  const pendingShipCount = orders.filter((o) => o.status === 'to_ship').length;
  const flashSaleCount = products.filter((p) => p.isFlashSale).length;
  const pendingMerchantAudits = merchants.filter((m) => m.status === 'pending_review').length;

  const NAV_ITEMS: NavItem[] = [
    { id: 'overview', labelEn: 'Dashboard Overview', labelTl: 'Pangkalahatang Tanawin', labelZh: '控制台总览', icon: BarChart2 },
    {
      id: 'merchants',
      labelEn: 'Enterprise & Merchants',
      labelTl: 'Negosyo at Tindahan',
      labelZh: '企业合作 (店家平台)',
      icon: Store,
      badge: pendingMerchantAudits > 0 ? `${pendingMerchantAudits} 待审` : merchants.length,
    },
    { id: 'products', labelEn: 'Products Management', labelTl: 'Pamamahala ng Produkto', labelZh: '商品与库存管理', icon: Package, badge: products.length },
    { id: 'orders', labelEn: 'Orders & Shipping', labelTl: 'Pamamahala ng Order', labelZh: '订单与交易处理', icon: ShoppingBag, badge: pendingShipCount > 0 ? `${pendingShipCount} Ship` : orders.length },
    { id: 'flashsale', labelEn: 'Flash Sale Management', labelTl: 'Pamamahala ng Flash Sale', labelZh: '秒杀营销管理', icon: Zap, badge: flashSaleCount },
    { id: 'groupbuy', labelEn: 'Group Buy Operations', labelTl: 'Operasyon ng Group Buy', labelZh: '拼团营销管理', icon: Flame, badge: groupTeams.length },
    { id: 'auctions', labelEn: 'Live Auctions & Pool', labelTl: 'Auction at Pool', labelZh: '拍卖活动管理', icon: Gavel, badge: auctions.length },
    { id: 'blindbox', labelEn: 'Blind Box Marketing', labelTl: 'Pamamahala ng Misteryo Box', labelZh: '盲盒营销管理', icon: Gift, badge: blindBoxes.length },
    { id: 'users', labelEn: 'Users & VIP Levels', labelTl: 'Mga User at VIP Level', labelZh: '用户与会员中心', icon: Users },
    { id: 'finance', labelEn: 'Financial Revenue', labelTl: 'Pananalapi at Kita', labelZh: '财务与结算中心', icon: DollarSign },
    { id: 'logistics', labelEn: 'Logistics Carriers', labelTl: 'Kargamento at Delivery', labelZh: '物流与履约跟踪', icon: Truck },
    { id: 'marketing', labelEn: 'Marketing & Coupons', labelTl: 'Pemasaran at Kupon', labelZh: '营销与优惠券', icon: Ticket },
    { id: 'cms', labelEn: 'Content Management', labelTl: 'Pamamahala ng Nilalaman', labelZh: '内容与 Banner 运营', icon: FileText },
    { id: 'analytics', labelEn: 'Data Analytics', labelTl: 'Pagsusuri ng Datos', labelZh: '数据统计与报表', icon: TrendingUp },
    { id: 'messages', labelEn: 'System Messages', labelTl: 'Mensahe sa Sistema', labelZh: '客服与消息中心', icon: MessageSquare },
    { id: 'settings', labelEn: 'System Settings', labelTl: 'Mga Setting ng Sistema', labelZh: '系统参数设置', icon: Settings },
  ];

  const getModuleLabel = (item: NavItem) => {
    if (language === 'ZH') return item.labelZh;
    if (language === 'TL') return item.labelTl;
    return item.labelEn;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#FF6B35] selection:text-white">
      {/* Top Operations Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 lg:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
            className="lg:hidden p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300"
          >
            {sidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-purple-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-[#FF6B35]/25">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white tracking-wide">
                  {language === 'ZH' ? '吉诺电商后台管理系统' : language === 'TL' ? 'Ginno Admin Portal PH' : 'Ginno PH Operations Portal'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {language === 'ZH' ? '马尼拉与宿务核心电商引擎' : language === 'TL' ? 'E-Commerce Engine sa Manila at Cebu' : 'Metro Manila & Cebu E-Commerce Engine'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'ZH' ? '微服务架构: 100% 正常运行' : language === 'TL' ? 'Mga Serbisyo: 100% Gumagana' : 'Node Microservices: 100% Operational'}
            </span>
          </div>

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

          {/* Switch to Buyer Store */}
          <button
            onClick={() => setIsAdminView(false)}
            className="bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
            title={language === 'ZH' ? '返回前台商城' : language === 'TL' ? 'Bumalik sa Bilihan' : 'Return to Buyer Store'}
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {language === 'ZH' ? '返回前台商城' : language === 'TL' ? 'Bilihan' : 'Buyer Store'}
            </span>
          </button>

          {/* Admin Exit / Sign Out */}
          <button
            onClick={handleAdminLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-500/30 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>
              {language === 'ZH' ? '退出登录' : language === 'TL' ? 'Umalis sa Admin' : 'Exit Admin'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex relative">
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed lg:sticky top-[61px] left-0 bottom-0 z-30 w-64 bg-slate-900/95 border-r border-white/10 p-3 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ${
            sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ height: 'calc(100vh - 61px)' }}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'ZH' ? '管理系统架构' : language === 'TL' ? 'Pamamahala ng Modyul' : 'Management Modules'}
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg shadow-[#FF6B35]/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <div className="text-left truncate">
                      <span className="block font-bold text-xs truncate">{getModuleLabel(item)}</span>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 px-3 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>
                {language === 'ZH' ? '引擎版本' : language === 'TL' ? 'Bersyon ng Engine' : 'Engine Version'}
              </span>
              <span className="font-mono text-slate-200">v4.1.0-PRO</span>
            </div>
            <div className="flex items-center justify-between">
              <span>
                {language === 'ZH' ? '运行环境' : language === 'TL' ? 'Kapaligiran' : 'Environment'}
              </span>
              <span className="text-emerald-400 font-bold">Cloud Run PH</span>
            </div>
          </div>
        </aside>

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden min-h-[calc(100vh-61px)]">
          {activeModule === 'overview' && <AdminOverview />}
          {activeModule === 'merchants' && <AdminMerchants />}
          {activeModule === 'products' && <AdminProducts />}
          {activeModule === 'orders' && <AdminOrders />}
          {activeModule === 'flashsale' && <AdminFlashSale />}
          {activeModule === 'groupbuy' && <AdminGroupBuy />}
          {activeModule === 'auctions' && <AdminAuctions />}
          {activeModule === 'blindbox' && <AdminBlindBox />}
          {activeModule === 'users' && <AdminUsers />}
          {activeModule === 'finance' && <AdminFinance />}
          {activeModule === 'logistics' && <AdminLogistics />}
          {activeModule === 'marketing' && <AdminMarketing />}
          {activeModule === 'cms' && <AdminCMS />}
          {activeModule === 'analytics' && <AdminAnalytics />}
          {activeModule === 'messages' && <AdminMessages />}
          {activeModule === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
