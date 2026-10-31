import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  Flame,
  Gavel,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  PackageCheck,
  RotateCcw,
  MessageSquare,
  Search,
  Sparkles,
  Gift,
  Zap,
  ThumbsUp,
  Target,
  Percent,
  BarChart3,
  Eye,
  Award,
  CheckCircle2,
  Layers,
  Activity,
  RefreshCw,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const WEEKLY_SALES_DATA = [
  { day: 'Mon', gmv: 42000, orders: 120, visitors: 3400 },
  { day: 'Tue', gmv: 58000, orders: 165, visitors: 4200 },
  { day: 'Wed', gmv: 61000, orders: 180, visitors: 4800 },
  { day: 'Thu', gmv: 75000, orders: 210, visitors: 5600 },
  { day: 'Fri', gmv: 98000, orders: 290, visitors: 7200 },
  { day: 'Sat', gmv: 125000, orders: 380, visitors: 9100 },
  { day: 'Sun', gmv: 142000, orders: 420, visitors: 10400 },
];

const ORDER_STATUS_PIE = [
  { name: 'Completed', value: 68, color: '#10B981' },
  { name: 'To Ship', value: 18, color: '#FF6B35' },
  { name: 'To Receive', value: 10, color: '#3B82F6' },
  { name: 'Refunding', value: 4, color: '#EF4444' },
];

type MarketingModuleTab = 'all' | 'blindbox' | 'flashsale' | 'groupbuy' | 'auction' | 'recommendation';

export const AdminOverview: React.FC = () => {
  const {
    products,
    orders,
    auctions,
    auctionBids,
    auctionPool,
    groupTeams,
    blindBoxes,
    unboxingRecords,
    language,
  } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d'>('7d');
  const [activeModuleTab, setActiveModuleTab] = useState<MarketingModuleTab>('all');

  const totalGMV = orders.reduce((acc, curr) => acc + curr.payAmount, 0) + 642000;
  const pendingShipCount = orders.filter((o) => o.status === 'to_ship').length + 5;
  const refundCount = orders.filter((o) => o.status === 'refunding').length + 2;

  // 1. 盲盒寻宝 Data
  const totalUnboxCount = unboxingRecords.length + 186;
  const blindBoxGMV = unboxingRecords.reduce((acc, r) => acc + (r.paidPrice || 299), 0) + 58400;
  const recycledCount = unboxingRecords.filter((r) => r.status === 'recycled').length + 124;
  const recycleRate = Math.round((recycledCount / totalUnboxCount) * 100);

  // 2. 限时秒杀 Data
  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const flashSaleSoldTotal = flashSaleProducts.reduce((acc, p) => acc + (p.flashSaleSold || 24), 0) + 380;
  const flashSaleStockTotal = flashSaleProducts.reduce((acc, p) => acc + (p.flashSaleStock || 50), 0) + 450;
  const flashSaleClaimRate = Math.round((flashSaleSoldTotal / Math.max(1, flashSaleStockTotal)) * 100);
  const flashSaleGMV =
    flashSaleProducts.reduce((acc, p) => acc + (p.flashSaleSold || 24) * (p.flashSalePrice || p.skus[0].price), 0) + 128000;

  // 3. 全民拼团精选 Data
  const activeTeamsCount = groupTeams.filter((t) => t.status === 'forming').length;
  const completedTeamsCount = groupTeams.filter((t) => t.status === 'completed').length + 158;
  const totalTeamsCount = activeTeamsCount + completedTeamsCount;
  const groupCompletionRate = Math.round((completedTeamsCount / Math.max(1, totalTeamsCount)) * 100);
  const groupBuyGMV = completedTeamsCount * 1850 + activeTeamsCount * 620 + 248000;

  // 4. 实时竞拍大厅 Data
  const liveAuctionsCount = auctions.filter((a) => a.status === 'live').length;
  const totalAuctionsCount = auctions.length + 28;
  const totalBidsCount = (Object.values(auctionBids || {}) as Array<any[]>).reduce((acc: number, b: any[]) => acc + (b ? b.length : 0), 0) + 420;
  const auctionPoolCount = auctionPool.length;
  const auctionGMV = 328000;

  // 5. 为你推荐 Data
  const recommendationCTR = 19.8;
  const recommendationGMV = 248500;
  const recommendationShare = 34.6;
  const aiAccuracy = 96.5;

  const labels = {
    todaySales: language === 'ZH' ? '今日销售额' : language === 'TL' ? 'Benta Ngayon' : "Today's Sales",
    todayOrders: language === 'ZH' ? '今日订单数' : language === 'TL' ? 'Mga Order Ngayon' : "Today's Orders",
    newUsers: language === 'ZH' ? '新注册用户' : language === 'TL' ? 'Mga Bagong User' : 'New Registered Users',
    todayVisitors: language === 'ZH' ? '今日访客数' : language === 'TL' ? 'Mga Bisita Ngayon' : "Today's Visitors",
    vsYesterday: language === 'ZH' ? '对比昨日' : language === 'TL' ? 'kumpara kahapon' : 'vs yesterday',
    avgSession: language === 'ZH' ? '平均停留时长: 6分42秒' : language === 'TL' ? 'Gitam-on: 6m 42s' : 'Avg Session: 6m 42s',
    pendingTasks: language === 'ZH' ? '待处理事项提醒' : language === 'TL' ? 'Mga Gawain na Isasagawa' : 'Pending Operational Tasks',
    pendingShip: language === 'ZH' ? '待发货订单' : language === 'TL' ? 'Mga Order na Ipadadala' : 'Pending Ship Orders',
    pendingRefunds: language === 'ZH' ? '待处理退款' : language === 'TL' ? 'Kahilingan sa Refund' : 'Pending Refund Requests',
    auctionPoolCount: language === 'ZH' ? '流拍池商品数' : language === 'TL' ? 'Item sa Auction Pool' : 'Auction Pool Items',
    activeGroupTeams: language === 'ZH' ? '进行中拼团' : language === 'TL' ? 'Aktibong Group Teams' : 'Active Group Teams',
    upcomingAuctions: language === 'ZH' ? '即将开始拍卖' : language === 'TL' ? 'Darating na Auction' : 'Upcoming Live Auctions',
    salesTrend: language === 'ZH' ? '销售额与订单趋势图' : language === 'TL' ? 'Serye ng Benta at Order' : 'Sales GMV & Order Trend',
    gmvSub: language === 'ZH' ? '商品交易总额实时监控' : language === 'TL' ? 'Pagsusubaybay sa kabuuang benta' : 'Realtime tracking of gross merchandise value',
    last7Days: language === 'ZH' ? '最近 7 天' : language === 'TL' ? 'Huling 7 Araw' : 'Last 7 Days',
    last30Days: language === 'ZH' ? '最近 30 天' : language === 'TL' ? 'Huling 30 Araw' : 'Last 30 Days',
    orderDist: language === 'ZH' ? '订单状态分布图' : language === 'TL' ? 'Distribusyon ng Order' : 'Order Status Distribution',
    orderDistSub: language === 'ZH' ? '订单履约占比统计' : language === 'TL' ? 'Bahagi ng bawat estado ng order' : 'Proportions of fulfillments',
    topProducts: language === 'ZH' ? '畅销商品榜单 TOP 5' : language === 'TL' ? 'Sikat na Produkto TOP 5' : 'Top Selling Products TOP 5',
    byVolume: language === 'ZH' ? '按销量排序' : language === 'TL' ? 'Ayon sa Dami ng Benta' : 'By Sales Volume',
    topSearch: language === 'ZH' ? '站内热门搜索词' : language === 'TL' ? 'Mabilisang Hanapin sa PH' : 'Top Search Keywords',
    searchesCount: language === 'ZH' ? '次搜索' : language === 'TL' ? 'na paghahanap' : 'searches',
    realtimeTicker: language === 'ZH' ? '平台实时交易动态' : language === 'TL' ? 'Realtime na Aksyon sa Store' : 'Realtime Activity Ticker',

    // New Marketing Section Labels
    marketingOverviewTitle:
      language === 'ZH' ? '核心营销模块概览与业绩监控' : language === 'TL' ? 'Pangunahing Modyul ng Marketing' : 'Core Marketing Modules Performance',
    marketingOverviewSub:
      language === 'ZH'
        ? '实时监控盲盒寻宝、限时秒杀、全民拼团精选、实时竞拍大厅与为你推荐模块的转化率及营销效果'
        : language === 'TL'
        ? 'Pagsusubaybay sa Misteryo Box, Flash Sale, Group Buy, Subasta, at Rekomendasyon'
        : 'Real-time performance analytics for Blind Box, Flash Sale, Group Buy, Auction Hall, and Recommended modules',
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* 1. Today Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-semibold">{labels.todaySales}</span>
            <div className="p-2 bg-[#FF6B35]/20 text-[#FF8C61] rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">₱{(totalGMV / 7).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% {labels.vsYesterday}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-semibold">{labels.todayOrders}</span>
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{orders.length + 184}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.6% {labels.vsYesterday}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-semibold">{labels.newUsers}</span>
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">428</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.1% {labels.vsYesterday}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-semibold">{labels.todayVisitors}</span>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">10,480</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-2">
            <span>{labels.avgSession}</span>
          </div>
        </div>
      </div>

      {/* 2. Pending Items Warning Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-indigo-600/10 border border-amber-500/30 rounded-3xl p-5 backdrop-blur-2xl shadow-xl">
        <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{labels.pendingTasks}</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">{labels.pendingShip}</span>
            <span className="text-base font-black text-[#FF8C61]">{pendingShipCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">{labels.pendingRefunds}</span>
            <span className="text-base font-black text-red-400">{refundCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">{labels.auctionPoolCount}</span>
            <span className="text-base font-black text-amber-400">{auctionPool.length}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">{labels.activeGroupTeams}</span>
            <span className="text-base font-black text-purple-300">{groupTeams.filter((t) => t.status === 'forming').length}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">{labels.upcomingAuctions}</span>
            <span className="text-base font-black text-blue-400">{auctions.filter((a) => a.status === 'upcoming').length}</span>
          </div>
        </div>
      </div>

      {/* 3. CORE MARKETING MODULES ANALYTICS SECTION (新增营销模块概览) */}
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FF8C61]" />
              <span>{labels.marketingOverviewTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">{labels.marketingOverviewSub}</p>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: language === 'ZH' ? '全部模块' : language === 'TL' ? 'Lahat' : 'All Modules' },
              { id: 'blindbox', label: language === 'ZH' ? '🎁 盲盒寻宝' : language === 'TL' ? '🎁 Misteryo Box' : '🎁 Blind Box' },
              { id: 'flashsale', label: language === 'ZH' ? '⚡ 限时秒杀' : language === 'TL' ? '⚡ Flash Sale' : '⚡ Flash Sale' },
              { id: 'groupbuy', label: language === 'ZH' ? '🔥 全民拼团' : language === 'TL' ? '🔥 Group Buy' : '🔥 Group Buy' },
              { id: 'auction', label: language === 'ZH' ? '🔨 实时竞拍' : language === 'TL' ? '🔨 Subasta' : '🔨 Auction' },
              { id: 'recommendation', label: language === 'ZH' ? '✨ 为你推荐' : language === 'TL' ? '✨ Rekomendasyon' : '✨ Recommended' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveModuleTab(tab.id as MarketingModuleTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeModuleTab === tab.id
                    ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Marketing Module KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: 盲盒寻宝 */}
          <div
            onClick={() => setActiveModuleTab('blindbox')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeModuleTab === 'blindbox' || activeModuleTab === 'all'
                ? 'bg-gradient-to-b from-purple-900/30 to-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1">
                <Gift className="w-4 h-4 text-purple-400" />
                {language === 'ZH' ? '盲盒寻宝' : 'Blind Box'}
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">
                +22.4%
              </span>
            </div>
            <div className="text-lg font-black text-white">₱{blindBoxGMV.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '累计拆盒:' : 'Unboxed:'}</span>
                <span className="font-bold text-slate-200">{totalUnboxCount} 盒</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '变现回收率:' : 'Recycle Rate:'}</span>
                <span className="font-bold text-purple-300">{recycleRate}%</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
              <span>{language === 'ZH' ? '查看详情数据' : 'View Analytics'}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2: 限时秒杀 */}
          <div
            onClick={() => setActiveModuleTab('flashsale')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeModuleTab === 'flashsale' || activeModuleTab === 'all'
                ? 'bg-gradient-to-b from-amber-900/30 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" />
                {language === 'ZH' ? '限时秒杀' : 'Flash Sale'}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                +31.8%
              </span>
            </div>
            <div className="text-lg font-black text-white">₱{flashSaleGMV.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '抢购完成率:' : 'Claim Rate:'}</span>
                <span className="font-bold text-amber-300">{flashSaleClaimRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '活动商品:' : 'Flash Items:'}</span>
                <span className="font-bold text-slate-200">{flashSaleProducts.length} 款</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
              <span>{language === 'ZH' ? '查看详情数据' : 'View Analytics'}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3: 全民拼团 */}
          <div
            onClick={() => setActiveModuleTab('groupbuy')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeModuleTab === 'groupbuy' || activeModuleTab === 'all'
                ? 'bg-gradient-to-b from-orange-900/30 to-slate-900 border-[#FF6B35]/50 shadow-lg shadow-orange-500/10'
                : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold text-[#FF8C61] flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#FF8C61]" />
                {language === 'ZH' ? '全民拼团' : 'Group Buy'}
              </span>
              <span className="text-[10px] bg-[#FF6B35]/20 text-[#FF8C61] px-1.5 py-0.5 rounded font-mono font-bold">
                +19.6%
              </span>
            </div>
            <div className="text-lg font-black text-white">₱{groupBuyGMV.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '拼团成功率:' : 'Completion Rate:'}</span>
                <span className="font-bold text-[#FF8C61]">{groupCompletionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '活跃开团队伍:' : 'Active Teams:'}</span>
                <span className="font-bold text-slate-200">{activeTeamsCount} 队</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#FF8C61] font-bold group-hover:translate-x-1 transition-transform">
              <span>{language === 'ZH' ? '查看详情数据' : 'View Analytics'}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 4: 实时竞拍 */}
          <div
            onClick={() => setActiveModuleTab('auction')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeModuleTab === 'auction' || activeModuleTab === 'all'
                ? 'bg-gradient-to-b from-indigo-900/30 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1">
                <Gavel className="w-4 h-4 text-indigo-400" />
                {language === 'ZH' ? '实时竞拍' : 'Auction Hall'}
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
                +42.1%
              </span>
            </div>
            <div className="text-lg font-black text-white">₱{auctionGMV.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '正在开拍:' : 'Live Auctions:'}</span>
                <span className="font-bold text-indigo-300">{liveAuctionsCount} 场</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '累计出价:' : 'Total Bids:'}</span>
                <span className="font-bold text-slate-200">{totalBidsCount} 次</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
              <span>{language === 'ZH' ? '查看详情数据' : 'View Analytics'}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 5: 为你推荐 */}
          <div
            onClick={() => setActiveModuleTab('recommendation')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeModuleTab === 'recommendation' || activeModuleTab === 'all'
                ? 'bg-gradient-to-b from-emerald-900/30 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {language === 'ZH' ? '为你推荐' : 'Recommended'}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                +15.2%
              </span>
            </div>
            <div className="text-lg font-black text-white">₱{recommendationGMV.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '推荐点击率:' : 'Rec CTR:'}</span>
                <span className="font-bold text-emerald-300">{recommendationCTR}%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ZH' ? '全站销售占比:' : 'GMV Share:'}</span>
                <span className="font-bold text-slate-200">{recommendationShare}%</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
              <span>{language === 'ZH' ? '查看详情数据' : 'View Analytics'}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Detailed Module Inspector Panel */}
        <div className="pt-2">
          {/* 1. Blind Box Deep Analytics */}
          {(activeModuleTab === 'all' || activeModuleTab === 'blindbox') && (
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-purple-500/20 space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span>
                    {language === 'ZH' ? '🎁 盲盒寻宝模块深度分析' : '🎁 Blind Box Module Detailed Analytics'}
                  </span>
                </h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">
                  {blindBoxes.length} 款在线盲盒活动
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '盲盒售出总量' : 'Total Boxes Sold'}</span>
                  <span className="text-lg font-black text-white">{totalUnboxCount} 盒</span>
                  <span className="text-[10px] text-purple-400 block mt-0.5">日均 32 盒爆单</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '变现回收比例' : 'Wallet Recycling Ratio'}</span>
                  <span className="text-lg font-black text-purple-300">{recycleRate}%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">即时提货占比 {100 - recycleRate}%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? 'SSR/UR稀有爆奖' : 'SSR/UR Prize Wins'}</span>
                  <span className="text-lg font-black text-amber-300">42 次</span>
                  <span className="text-[10px] text-amber-400 block mt-0.5">爆率控盘稳定在 8.5%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '盲盒产生的GMV' : 'Total Blind Box GMV'}</span>
                  <span className="text-lg font-black text-[#FF8C61]">₱{blindBoxGMV.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">+24.5% 高复购率</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="font-bold text-slate-200 block mb-2">{language === 'ZH' ? '🔥 最受欢迎盲盒排行' : 'Top Blind Boxes'}</span>
                  <div className="space-y-2">
                    {blindBoxes.slice(0, 3).map((box, idx) => (
                      <div key={box.id} className="flex items-center justify-between text-[11px] p-2 bg-slate-900/60 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-purple-400">#{idx + 1}</span>
                          <span className="font-bold text-white truncate max-w-[160px]">
                            {language === 'ZH' ? box.titleZh || box.titleEn : box.titleEn}
                          </span>
                        </div>
                        <span className="font-bold text-amber-300">₱{box.price} / 销 {box.salesCount + 45}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block mb-1">{language === 'ZH' ? '💡 盲盒营销策略建议' : 'Marketing Insights'}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'ZH'
                        ? '用户对“变现回收金币”功能粘性极高，建议在次周增加“限时SSR双倍爆率”主题盲盒，预计可再提升20%客单价。'
                        : 'Recycling feature drives high engagement. Adding double SSR rate events next week is recommended.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-[10px] text-purple-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>概率控盘合规正常 · 无超卖风控预警</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Flash Sale Deep Analytics */}
          {(activeModuleTab === 'all' || activeModuleTab === 'flashsale') && (
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-amber-500/20 space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>
                    {language === 'ZH' ? '⚡ 限时秒杀模块深度分析' : '⚡ Flash Sale Detailed Analytics'}
                  </span>
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  {flashSaleProducts.length} 款秒杀进行中
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '秒杀总售出数' : 'Flash Units Sold'}</span>
                  <span className="text-lg font-black text-white">{flashSaleSoldTotal} 件</span>
                  <span className="text-[10px] text-amber-400 block mt-0.5">平均 1.4 分钟卖出 1 件</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '库存抢购率' : 'Stock Claim Rate'}</span>
                  <span className="text-lg font-black text-amber-300">{flashSaleClaimRate}%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">剩余库存 {Math.max(0, flashSaleStockTotal - flashSaleSoldTotal)} 件</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '平均折扣力度' : 'Avg Discount'}</span>
                  <span className="text-lg font-black text-red-400">-52% OFF</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">平均每单帮用户省 ₱820</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '秒杀带货 GMV' : 'Flash Sale GMV'}</span>
                  <span className="text-lg font-black text-[#FF8C61]">₱{flashSaleGMV.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">转化率高达 28.4%</span>
                </div>
              </div>

              {/* Flash Items Live Progress */}
              <div className="space-y-2">
                <span className="font-bold text-slate-200 text-xs block">{language === 'ZH' ? '🔥 秒杀爆款实时抢购进度' : 'Live Flash Sale Items'}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {flashSaleProducts.slice(0, 4).map((p) => {
                    const sold = p.flashSaleSold || 24;
                    const stock = p.flashSaleStock || 50;
                    const pct = Math.round((sold / stock) * 100);
                    return (
                      <div key={p.id} className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                        <img src={p.mainImage} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="font-bold text-white truncate max-w-[140px]">
                              {language === 'ZH' ? p.titleZh || p.titleEn : p.titleEn}
                            </span>
                            <span className="font-black text-amber-300">₱{p.flashSalePrice || p.skus[0].price}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>{language === 'ZH' ? `已抢 ${sold} / 备货 ${stock}` : `Sold ${sold} / ${stock}`}</span>
                            <span className="text-amber-400 font-bold">{pct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. Group Buy Deep Analytics */}
          {(activeModuleTab === 'all' || activeModuleTab === 'groupbuy') && (
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-[#FF6B35]/20 space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-[#FF8C61] uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF6B35]" />
                  <span>
                    {language === 'ZH' ? '🔥 全民拼团精选模块深度分析' : '🔥 Group Buy Detailed Analytics'}
                  </span>
                </h3>
                <span className="text-[10px] bg-[#FF6B35]/20 text-[#FF8C61] px-2 py-0.5 rounded font-bold">
                  {activeTeamsCount} 队正在拼团中
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '拼团成功率' : 'Group Completion Rate'}</span>
                  <span className="text-lg font-black text-[#FF8C61]">{groupCompletionRate}%</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">极高社交裂变参团率</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '已成功成团队伍' : 'Completed Teams'}</span>
                  <span className="text-lg font-black text-white">{completedTeamsCount} 队</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">累计带货 480+ 件</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '社交传播系数' : 'Social Viral K-Factor'}</span>
                  <span className="text-lg font-black text-purple-300">K = 2.45</span>
                  <span className="text-[10px] text-purple-400 block mt-0.5">主要来源: Messenger & Viber</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '拼团总成交 GMV' : 'Total Group Buy GMV'}</span>
                  <span className="text-lg font-black text-amber-300">₱{groupBuyGMV.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">对比单买客单价提升 35%</span>
                </div>
              </div>

              {/* Active Teams Preview */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                <span className="font-bold text-slate-200 block mb-2">{language === 'ZH' ? '👥 当前热拼中队伍快照' : 'Hot Open Group Teams'}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {groupTeams.slice(0, 3).map((team) => (
                    <div key={team.id} className="p-2 bg-slate-900/60 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] bg-[#FF6B35]/20 text-[#FF8C61] px-1.5 py-0.5 rounded font-bold">
                          {team.requiredCount}-Person Group
                        </span>
                        <div className="text-xs font-bold text-white mt-1">₱{team.tierPrice.toLocaleString()}</div>
                      </div>
                      <div className="text-right text-[10px]">
                        <div className="text-emerald-400 font-bold">
                          {team.members.length} / {team.requiredCount} 人
                        </div>
                        <div className="text-slate-400">还差 {team.requiredCount - team.members.length} 人</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Auction Deep Analytics */}
          {(activeModuleTab === 'all' || activeModuleTab === 'auction') && (
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-indigo-500/20 space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-indigo-400" />
                  <span>
                    {language === 'ZH' ? '🔨 实时竞拍大厅模块深度分析' : '🔨 Auction Hall Detailed Analytics'}
                  </span>
                </h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">
                  {liveAuctionsCount} 场正在开拍
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '累计出价总次数' : 'Total Bids Placed'}</span>
                  <span className="text-lg font-black text-white">{totalBidsCount} 次</span>
                  <span className="text-[10px] text-indigo-400 block mt-0.5">平均每场竞拍 18 次叫价</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '平均起拍溢价率' : 'Avg Auction Premium'}</span>
                  <span className="text-lg font-black text-emerald-400">+168%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">远超起拍价底价</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '流拍池待转拍' : 'Unsold Auction Pool'}</span>
                  <span className="text-lg font-black text-amber-300">{auctionPoolCount} 件</span>
                  <span className="text-[10px] text-amber-400 block mt-0.5">可一键转拍或下架降价</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '竞拍成交 GMV' : 'Auction Total GMV'}</span>
                  <span className="text-lg font-black text-[#FF8C61]">₱{auctionGMV.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">用户参与互动率 42%</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Recommended Deep Analytics */}
          {(activeModuleTab === 'all' || activeModuleTab === 'recommendation') && (
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-emerald-500/20 space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'ZH' ? '✨ 为你推荐 (AI智能推荐) 模块深度分析' : '✨ Recommended For You Module Detailed Analytics'}
                  </span>
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  AI 算法精准度 {aiAccuracy}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '推荐位点击率 (CTR)' : 'Recommendation CTR'}</span>
                  <span className="text-lg font-black text-emerald-300">{recommendationCTR}%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">高于电商行业平均水平</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '推荐带来的成交GMV' : 'Recommendation GMV'}</span>
                  <span className="text-lg font-black text-[#FF8C61]">₱{recommendationGMV.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">占全站销售总额 {recommendationShare}%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '每日推荐曝光量' : 'Daily Impressions'}</span>
                  <span className="text-lg font-black text-white">84,200 次</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">平均每人曝光 8.2 个推荐商品</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px]">{language === 'ZH' ? '转化加购率' : 'Cart Conversion Rate'}</span>
                  <span className="text-lg font-black text-purple-300">14.2%</span>
                  <span className="text-[10px] text-purple-400 block mt-0.5">推荐至直接下单效率极高</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales GMV Trend Line Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-white">{labels.salesTrend}</h3>
              <p className="text-[11px] text-slate-400">{labels.gmvSub}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDateRange('7d')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  dateRange === '7d' ? 'bg-[#FF6B35] text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {labels.last7Days}
              </button>
              <button
                onClick={() => setDateRange('30d')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  dateRange === '30d' ? 'bg-[#FF6B35] text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {labels.last30Days}
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_SALES_DATA}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '16px', color: '#FFF' }}
                />
                <Area type="monotone" dataKey="gmv" stroke="#FF6B35" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-white">{labels.orderDist}</h3>
            <p className="text-[11px] text-slate-400">{labels.orderDistSub}</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ORDER_STATUS_PIE} innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                  {ORDER_STATUS_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {ORDER_STATUS_PIE.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 text-[11px] font-semibold">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. TOP Lists & Realtime Status Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hot Products TOP 5 */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF8C61]" />
              <span>{labels.topProducts}</span>
            </h3>
            <span className="text-[10px] text-slate-400">{labels.byVolume}</span>
          </div>

          <div className="space-y-3">
            {products.slice(0, 5).map((prod, idx) => (
              <div key={prod.id} className="flex items-center justify-between gap-3 p-2 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-500 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <img src={prod.mainImage} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {language === 'ZH' ? prod.titleZh || prod.titleEn : prod.titleEn}
                    </h4>
                    <span className="text-[10px] text-slate-400">Sales: {prod.salesCount + 120} pcs</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#FF8C61] shrink-0">₱{prod.skus[0].price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Search Keywords */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-400" />
              <span>{labels.topSearch}</span>
            </h3>
            <span className="text-[10px] text-slate-400">Philippines Queries</span>
          </div>

          <div className="space-y-2.5">
            {[
              { word: 'Group Buy Philippines', count: 18420, trend: '+34%' },
              { word: 'Smart Watch GCash', count: 14200, trend: '+28%' },
              { word: 'Live Auction Consoles', count: 11900, trend: '+52%' },
              { word: 'Air Fryer Sale', count: 9800, trend: '+15%' },
              { word: 'Wireless Earbuds', count: 8600, trend: '+9%' },
            ].map((kw, i) => (
              <div key={kw.word} className="flex items-center justify-between p-2.5 bg-white/5 rounded-2xl border border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-black text-xs">#{i + 1}</span>
                  <span className="font-bold text-slate-200">{kw.word}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px]">
                    {kw.count.toLocaleString()} {labels.searchesCount}
                  </span>
                  <span className="text-emerald-400 text-[10px] font-black">{kw.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Realtime Live Stream Ticker */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{labels.realtimeTicker}</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <p className="font-bold text-emerald-300">🛒 Order #ORD-9918 Paid via GCash</p>
              <p className="text-[10px] text-slate-400">Juan D. purchased SPU-001 • ₱2,499 • Manila</p>
            </div>
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
              <p className="font-bold text-purple-300">🎁 Blind Box Unboxed: Cyberpunk Box</p>
              <p className="text-[10px] text-slate-400">Won SSR Cyberpunk Drone • Converted to ₱8,800 Wallet</p>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p className="font-bold text-amber-300">⚡ Flash Sale Item Claimed!</p>
              <p className="text-[10px] text-slate-400">Air Fryer 4.5L snapped at ₱1,299 (Stock left: 2)</p>
            </div>
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <p className="font-bold text-indigo-300">🔨 New Bid Placed on PS5 Live Auction</p>
              <p className="text-[10px] text-slate-400">Bidder #8499 bid ₱16,500 (+₱500 extension)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
