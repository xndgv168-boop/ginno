import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Truck,
  RotateCcw,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Store,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Check,
  X,
  CreditCard,
  Building2,
  DollarSign,
  Tag,
  Gift,
  ShieldCheck,
  Star,
  Users,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Send,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Order, Product } from '../../types';
import { MerchantSettings } from './MerchantSettings';

interface MerchantDashboardProps {
  activeNode: string;
  setActiveNode: (node: any) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  activeNode,
  setActiveNode,
}) => {
  const {
    language,
    user,
    products,
    orders,
    merchantShipOrder,
    merchantHandleRefund,
    merchantWithdraw,
    merchantToggleProduct,
    setActiveTab,
  } = useApp();

  // State for shipping modal
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [shippingCarrier, setShippingCarrier] = useState('J&T Express Logistics');
  const [shippingTrackingNo, setShippingTrackingNo] = useState('');

  // State for refund modal
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundAction, setRefundAction] = useState<'approve' | 'reject'>('approve');
  const [refundRemark, setRefundRemark] = useState('');

  // State for withdraw modal
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawChannel, setWithdrawChannel] = useState<'GCash' | 'Maya' | 'BDO Unibank' | 'BPI'>('GCash');
  const [withdrawAccount, setWithdrawAccount] = useState('0917-888-9999');

  // State for product search/filter
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'online'>('all');

  // State for editing product price/stock inline
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // State for new product modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Digital & Electronics',
    price: '',
    originalPrice: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    description: '',
  });

  // State for store coupons
  const [storeCoupons, setStoreCoupons] = useState([
    { id: 'sc_1', title: '旗舰店狂欢 满₱1,000减₱100', discount: 100, minSpend: 1000, collected: 482, used: 219, active: true },
    { id: 'sc_2', title: '数码尊享 满₱3,000减₱350', discount: 350, minSpend: 3000, collected: 290, used: 145, active: true },
    { id: 'sc_3', title: '全店包邮券 (最高抵扣₱150)', discount: 150, minSpend: 500, collected: 860, used: 612, active: true },
  ]);

  // Financial Ledger History
  const [financialLedger, setFinancialLedger] = useState([
    { id: 'tx_101', date: '2026-08-06 14:22', type: 'order_settle', desc: '买家完成确认收货 (订单 ORD-20260805-001)', amount: 4899, fee: -146.97, net: 4752.03 },
    { id: 'tx_102', date: '2026-08-06 11:05', type: 'order_settle', desc: '买家完成确认收货 (订单 ORD-20260804-002)', amount: 1699, fee: -50.97, net: 1648.03 },
    { id: 'tx_103', date: '2026-08-05 17:30', type: 'withdraw', desc: '提现至 BDO Unibank (尾号 6829)', amount: -50000, fee: 0, net: -50000 },
    { id: 'tx_104', date: '2026-08-05 09:18', type: 'order_settle', desc: '买家完成确认收货 (订单 ORD-20260803-088)', amount: 2799, fee: -83.97, net: 2715.03 },
    { id: 'tx_105', date: '2026-08-04 16:40', type: 'order_settle', desc: '买家完成确认收货 (订单 ORD-20260802-120)', amount: 899, fee: -26.97, net: 872.03 },
  ]);

  // Derived merchant orders
  const toShipOrders = orders.filter((o) => o.status === 'to_ship');
  const refundOrders = orders.filter((o) => ['cancelled', 'refunding'].includes(o.status));
  const inTransitOrders = orders.filter((o) => o.status === 'to_receive');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  // Handle Ship Order
  const handleOpenShipModal = (orderId: string) => {
    setShippingOrderId(orderId);
    setShippingTrackingNo(`JT-PH-${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handleConfirmShip = () => {
    if (!shippingOrderId) return;
    if (!shippingTrackingNo.trim()) {
      alert(language === 'ZH' ? '请输入快递运单号' : 'Please enter tracking number');
      return;
    }
    merchantShipOrder(shippingOrderId, shippingCarrier, shippingTrackingNo.trim());
    setShippingOrderId(null);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
    alert(
      language === 'ZH'
        ? `🚚 打单出库成功！\n承运快递: ${shippingCarrier}\n运单号: ${shippingTrackingNo}\n订单已进入【运输中】状态，买家已收到发货通知！`
        : `Order fulfilled! Tracking number: ${shippingTrackingNo}`
    );
  };

  // Handle Refund Request
  const handleOpenRefundModal = (orderId: string, action: 'approve' | 'reject') => {
    setRefundOrderId(orderId);
    setRefundAction(action);
    setRefundRemark(
      action === 'approve'
        ? language === 'ZH' ? '经核实符合售后保障，同意退款申请并全额原路返还。' : 'Refund approved and released.'
        : language === 'ZH' ? '商品已签收拆封使用，暂不符合无理由退换规则。' : 'Refund rejected.'
    );
  };

  const handleConfirmRefund = () => {
    if (!refundOrderId) return;
    merchantHandleRefund(refundOrderId, refundAction, refundRemark);
    setRefundOrderId(null);
    alert(
      refundAction === 'approve'
        ? language === 'ZH' ? '✅ 已同意售后退款申请，款项已原路全额退还至买家电子钱包！' : 'Refund approved!'
        : language === 'ZH' ? '⚠️ 已驳回买家售后退款申请，并已通知买家！' : 'Refund rejected.'
    );
  };

  // Handle Withdraw
  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) {
      alert(language === 'ZH' ? '请输入有效的提现金额' : 'Please enter valid amount');
      return;
    }
    const currentBalance = user?.walletBalance ?? 185600;
    if (val > currentBalance) {
      alert(language === 'ZH' ? `提现金额不能大于当前可用余额 (₱${currentBalance.toLocaleString()})` : 'Insufficient balance');
      return;
    }

    const res = merchantWithdraw(val, withdrawChannel, withdrawAccount);
    if (res.success) {
      setFinancialLedger((prev) => [
        {
          id: `tx_${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          type: 'withdraw',
          desc: `极速提现至 ${withdrawChannel} (${withdrawAccount})`,
          amount: -val,
          fee: 0,
          net: -val,
        },
        ...prev,
      ]);
      setWithdrawAmount('');
      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch (e) {}
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim() || !newProductForm.price) {
      alert(language === 'ZH' ? '请填写商品名称与销售价格' : 'Please enter name and price');
      return;
    }
    setShowAddProductModal(false);
    confetti({ particleCount: 60, spread: 60 });
    alert(
      language === 'ZH'
        ? `🎉 商品【${newProductForm.name}】已成功发布上架！即刻起在吉诺商城前台展示销售。`
        : `Product ${newProductForm.name} listed successfully!`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. NODE: OVERVIEW (店铺经营概览 / 经营数据罗盘) */}
      {activeNode === 'merchant_overview' && (
        <div className="space-y-6">
          {/* Top Live Status Bar */}
          <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900 text-white rounded-3xl p-6 border border-purple-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    {language === 'ZH' ? '店铺经营状态：正常营业中 (营业额高速增长中)' : 'Store Live: Operating Normally'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{user.storeName || 'TechVanguard 旗舰店'}</span>
                  <span className="bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    S级超规旗舰店
                  </span>
                </h2>
                <p className="text-xs text-purple-200/80">
                  {language === 'ZH'
                    ? '7天动销率 94.8% · 订单履约时效 14.2小时 · 客户咨询响应率 99.6%'
                    : '7-day sell-through 94.8% · Fulfillment speed 14.2h · Response rate 99.6%'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveNode('merchant_withdraw')}
                  className="bg-[#06D6A0] hover:bg-[#05b888] text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl transition-all shadow-lg flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{language === 'ZH' ? '极速收益提现' : 'Withdraw Earnings'}</span>
                </button>
                <button
                  onClick={() => setActiveNode('merchant_settings')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-2xl border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <Store className="w-4 h-4" />
                  <span>{language === 'ZH' ? '店铺设置与资质' : 'Store Settings'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Primary Operational Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {language === 'ZH' ? '今日营业额 (GMV)' : 'Today GMV'}
                </span>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900 font-mono">₱48,920</span>
                <span className="text-xs text-gray-400 font-bold">
                  {language === 'ZH' ? '昨日 ₱41,300' : 'Yesterday ₱41,300'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'ZH' ? '包含秒杀、拼团及店铺常规在售订单' : 'Includes flash deals, group buys & catalog sales'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {language === 'ZH' ? '今日付款订单数' : 'Paid Orders'}
                </span>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900 font-mono">
                  {language === 'ZH' ? '38 笔' : '38 orders'}
                </span>
                <span className="text-xs text-gray-400 font-bold">
                  {language === 'ZH' ? '客单价 ₱1,287.3' : 'AOV ₱1,287.3'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'ZH' ? '履约妥投率 99.2%，售后率 0.8%' : 'Fulfillment delivery rate 99.2%, refund rate 0.8%'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {language === 'ZH' ? '今日访客 (UV / PV)' : 'Store Traffic (UV / PV)'}
                </span>
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Users className="w-3 h-3" /> {language === 'ZH' ? '转化率 3.82%' : 'Conv. 3.82%'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900 font-mono">3,420</span>
                <span className="text-xs text-gray-400 font-bold">
                  {language === 'ZH' ? '浏览量 18,920' : 'PV 18,920'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'ZH' ? '大促主会场及精准类目引流访客' : 'Organic search and mega campaign referral visitors'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {language === 'ZH' ? '可提现收益余额' : 'Available Balance'}
                </span>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {language === 'ZH' ? '待结算 ₱24,800' : 'In Escrow ₱24,800'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#06D6A0] font-mono">
                  ₱{(user?.walletBalance ?? 185600).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 font-bold">
                  {language === 'ZH' ? '质保金 ₱20,000' : 'Deposit ₱20,000'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'ZH' ? '支持 GCash / Maya / 银行卡当日秒到账' : 'Instant payout to GCash, Maya & Philippine banks'}
              </p>
            </div>
          </div>

          {/* 4 Actionable Urgent Tasks (待办待处理工作项) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{language === 'ZH' ? '店家核心待办与履约提醒' : 'Operational Action Items'}</span>
              </h3>
              <span className="text-xs text-gray-400 font-bold">
                {language === 'ZH' ? '及时处理避免超时违规扣罚信用分' : 'Fulfill promptly to maintain seller rating'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                onClick={() => setActiveNode('merchant_orders')}
                className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 cursor-pointer hover:bg-amber-100/70 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-900 block">
                    {language === 'ZH' ? '待发货订单' : 'Pending Fulfillment'}
                  </span>
                  <span className="text-2xl font-black text-amber-600 font-mono">
                    {toShipOrders.length} <span className="text-xs font-bold text-amber-800">{language === 'ZH' ? '笔' : 'orders'}</span>
                  </span>
                  <span className="text-[10px] text-amber-700 block">
                    {language === 'ZH' ? '买家已付款，建议24h内完成发货' : 'Paid by buyer, dispatch within 24h'}
                  </span>
                </div>
                <div className="p-2.5 bg-amber-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              <div
                onClick={() => setActiveNode('merchant_aftersales')}
                className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 cursor-pointer hover:bg-rose-100/70 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black text-rose-900 block">
                    {language === 'ZH' ? '待处理退款售后' : 'Pending Refunds'}
                  </span>
                  <span className="text-2xl font-black text-rose-600 font-mono">
                    {refundOrders.length} <span className="text-xs font-bold text-rose-800">{language === 'ZH' ? '笔' : 'requests'}</span>
                  </span>
                  <span className="text-[10px] text-rose-700 block">
                    {language === 'ZH' ? '买家申请取消/退款，待审核处理' : 'Buyer refund requests awaiting review'}
                  </span>
                </div>
                <div className="p-2.5 bg-rose-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-5 h-5" />
                </div>
              </div>

              <div
                onClick={() => setActiveNode('merchant_products')}
                className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 cursor-pointer hover:bg-blue-100/70 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black text-blue-900 block">
                    {language === 'ZH' ? '库存预警商品' : 'Low Stock Warning'}
                  </span>
                  <span className="text-2xl font-black text-blue-600 font-mono">
                    2 <span className="text-xs font-bold text-blue-800">{language === 'ZH' ? '件' : 'SKUs'}</span>
                  </span>
                  <span className="text-[10px] text-blue-700 block">
                    {language === 'ZH' ? '库存低于 10 件，建议及时补仓' : 'Stock under 10 units, restock soon'}
                  </span>
                </div>
                <div className="p-2.5 bg-blue-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
              </div>

              <div
                onClick={() => setActiveNode('merchant_settings')}
                className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer hover:bg-emerald-100/70 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black text-emerald-900 block">
                    {language === 'ZH' ? '店铺商户信用分' : 'Merchant Trust Score'}
                  </span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    100 <span className="text-xs font-bold text-emerald-800">{language === 'ZH' ? '分满分' : '/100 Pts'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 block">
                    {language === 'ZH' ? '无任何违规记录，享受优先曝光' : 'Zero violations, top search visibility'}
                  </span>
                </div>
                <div className="p-2.5 bg-emerald-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day GMV Trend Chart (Visual Bar Display) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span>{language === 'ZH' ? '近7天营业额走势 (GMV 趋势罗盘)' : '7-Day Revenue Trend (GMV Compass)'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {language === 'ZH' ? '近7日累计营收 ₱324,520，环比上周增长 +22.4%' : 'Last 7 days total ₱324,520, +22.4% vs previous period'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="inline-flex items-center gap-1 text-purple-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> {language === 'ZH' ? '实付GMV' : 'Net GMV'}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-500 ml-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> {language === 'ZH' ? '净结算收益' : 'Settled Earnings'}
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG/CSS Bar Chart */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 border-b border-gray-100 px-2">
                {[
                  { day: language === 'ZH' ? '08-01 周一' : 'Mon 08-01', gmv: 38200, height: '62%' },
                  { day: language === 'ZH' ? '08-02 周二' : 'Tue 08-02', gmv: 42100, height: '70%' },
                  { day: language === 'ZH' ? '08-03 周三' : 'Wed 08-03', gmv: 39800, height: '66%' },
                  { day: language === 'ZH' ? '08-04 周四' : 'Thu 08-04', gmv: 45600, height: '78%' },
                  { day: language === 'ZH' ? '08-05 周五' : 'Fri 08-05', gmv: 51200, height: '88%' },
                  { day: language === 'ZH' ? '08-06 周六' : 'Sat 08-06', gmv: 58400, height: '98%' },
                  { day: language === 'ZH' ? '08-07 今日' : 'Today 08-07', gmv: 48920, height: '82%', isToday: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                      ₱{(item.gmv / 1000).toFixed(1)}k
                    </span>
                    <div
                      style={{ height: item.height }}
                      className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 relative ${
                        item.isToday
                          ? 'bg-gradient-to-t from-purple-600 to-[#FF6B35] shadow-lg shadow-purple-500/30'
                          : 'bg-gradient-to-t from-purple-500/70 to-indigo-400/80 group-hover:from-purple-600 group-hover:to-indigo-500'
                      }`}
                    >
                      {item.isToday && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          {language === 'ZH' ? '今日' : 'Today'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-2 truncate max-w-full">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 Bestselling Products Ranking */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>{language === 'ZH' ? '店铺热销爆款榜 Top 5' : 'Top 5 Bestsellers'}</span>
              </h3>
              <button
                onClick={() => setActiveNode('merchant_products')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>{language === 'ZH' ? '管理全部商品' : 'Manage Products'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {[
                {
                  rank: 1,
                  title: 'Anker Soundcore Space Q45 Wireless Noise-Cancelling Headphones',
                  sales: 1420,
                  gmv: 6956580,
                  stock: 45,
                  price: 4899,
                  rating: 4.9,
                  img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=120&auto=format&fit=crop&q=80',
                },
                {
                  rank: 2,
                  title: 'Philips Visual Touch Air Fryer XL Capacity 6.2L',
                  sales: 980,
                  gmv: 3518200,
                  stock: 28,
                  price: 3590,
                  rating: 4.8,
                  img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=120&auto=format&fit=crop&q=80',
                },
                {
                  rank: 3,
                  title: 'Sony PlayStation 5 Slim Digital / Disc Edition Console',
                  sales: 460,
                  gmv: 12875400,
                  stock: 8,
                  price: 27990,
                  rating: 5.0,
                  img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=120&auto=format&fit=crop&q=80',
                },
                {
                  rank: 4,
                  title: 'SKIN1004 Madagascar Centella Asiatica Ampoule Serum',
                  sales: 3210,
                  gmv: 2214900,
                  stock: 120,
                  price: 690,
                  rating: 4.9,
                  img: 'https://images.unsplash.com/photo-1608248597359-715779c16921?w=120&auto=format&fit=crop&q=80',
                },
                {
                  rank: 5,
                  title: 'Baseus 65W GaN Fast Charger Multi-Port Power Adapter',
                  sales: 2890,
                  gmv: 3728100,
                  stock: 65,
                  price: 1290,
                  rating: 4.9,
                  img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=120&auto=format&fit=crop&q=80',
                },
              ].map((prod) => (
                <div key={prod.rank} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        prod.rank === 1
                          ? 'bg-amber-400 text-gray-900 shadow-sm'
                          : prod.rank === 2
                          ? 'bg-slate-300 text-gray-900'
                          : prod.rank === 3
                          ? 'bg-amber-700/60 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {prod.rank}
                    </span>
                    <img src={prod.img} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 max-w-xs sm:max-w-md truncate">
                        {prod.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
                        <span>{language === 'ZH' ? '标价: ' : 'Price: '}<strong className="text-gray-900">₱{(prod?.price ?? 0).toLocaleString()}</strong></span>
                        <span>{language === 'ZH' ? '已售: ' : 'Sold: '}<strong className="text-purple-600 font-bold">{prod.sales} {language === 'ZH' ? '件' : 'units'}</strong></span>
                        <span>{language === 'ZH' ? '好评: ' : 'Rating: '}<strong className="text-amber-500">★ {prod.rating}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-gray-900 block font-mono">
                      ₱{(prod?.gmv ?? 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 block font-bold">
                      {language === 'ZH' ? `库存: ${prod.stock} 件` : `Stock: ${prod.stock} units`} {prod.stock < 10 && <span className="text-rose-500 font-bold">{language === 'ZH' ? '⚠️偏紧' : '⚠️Low'}</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. NODE: PRODUCTS (店铺商品管理与上下架) */}
      {activeNode === 'merchant_products' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span>{language === 'ZH' ? '店铺商品在售与库存管理' : 'Store Products Catalog'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {language === 'ZH'
                  ? '支持商品一键上下架、实时改价、库存盘点与新商品快速录入'
                  : 'Manage pricing, stock levels, and instant online/offline status'}
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ZH' ? '发布新商品' : 'Add New Product'}</span>
            </button>
          </div>

          {/* Search & Tabs Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'ZH' ? '搜索商品名称 / SKU...' : 'Search product...'}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto justify-center">
              {[
                { id: 'all', label: language === 'ZH' ? '全部商品' : 'All' },
                { id: 'online', label: language === 'ZH' ? '在售中' : 'Online' },
                { id: 'low_stock', label: language === 'ZH' ? '低库存预警' : 'Low Stock' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProductFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    productFilter === tab.id ? 'bg-white text-gray-900 shadow-sm font-black' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 font-extrabold uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">{language === 'ZH' ? '商品基础信息' : 'Product Details'}</th>
                  <th className="py-3 px-4">{language === 'ZH' ? '类目' : 'Category'}</th>
                  <th className="py-3 px-4">{language === 'ZH' ? '在售标价 (₱)' : 'Price (₱)'}</th>
                  <th className="py-3 px-4">{language === 'ZH' ? '当前库存' : 'Stock'}</th>
                  <th className="py-3 px-4">{language === 'ZH' ? '状态' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{language === 'ZH' ? '操作' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products
                  .filter((p) => {
                    if (productSearch) {
                      return p.title.toLowerCase().includes(productSearch.toLowerCase());
                    }
                    if (productFilter === 'low_stock') {
                      return p.stock < 20;
                    }
                    return true;
                  })
                  .slice(0, 10)
                  .map((product) => {
                    const isEditing = editingProductId === product.id;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                            />
                            <div>
                              <p className="font-extrabold text-gray-900 max-w-xs truncate">{product.title}</p>
                              <span className="text-[10px] text-gray-400 font-mono">ID: {product.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-gray-600">{product.category}</td>

                        <td className="py-3 px-4 font-bold">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-purple-400 rounded-lg text-xs font-bold"
                            />
                          ) : (
                            <span className="font-mono text-gray-900 font-extrabold">₱{(product?.price ?? 0).toLocaleString()}</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="w-16 px-2 py-1 border border-purple-400 rounded-lg text-xs font-bold"
                            />
                          ) : (
                            <span className={`font-mono font-bold ${product.stock < 15 ? 'text-rose-600 font-black' : 'text-gray-700'}`}>
                              {product.stock} {language === 'ZH' ? '件' : 'units'} {product.stock < 15 && <span className="text-[10px] bg-rose-50 px-1 rounded">{language === 'ZH' ? '告急' : 'Low'}</span>}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => merchantToggleProduct(product.id)}
                            className="flex items-center gap-1.5 cursor-pointer"
                            title={language === 'ZH' ? '点击切换上下架状态' : 'Click to toggle status'}
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                              {language === 'ZH' ? '正常在售中' : 'Active'}
                            </span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          {isEditing ? (
                            <button
                              onClick={() => {
                                setEditingProductId(null);
                                alert(language === 'ZH' ? '已更新商品价格与库存！' : 'Product updated successfully!');
                              }}
                              className="text-xs bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg"
                            >
                              {language === 'ZH' ? '保存' : 'Save'}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingProductId(product.id);
                                setEditPrice(product?.price ?? 0);
                                setEditStock(product.stock);
                              }}
                              className="text-xs text-purple-600 hover:text-purple-700 font-bold hover:underline"
                            >
                              {language === 'ZH' ? '编辑改价' : 'Edit'}
                            </button>
                          )}
                          <button
                            onClick={() => merchantToggleProduct(product.id)}
                            className="text-xs text-amber-600 hover:text-amber-700 font-bold hover:underline"
                          >
                            {language === 'ZH' ? '下架' : 'Delist'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. NODE: ORDERS (店铺交易履约与打单发货) */}
      {activeNode === 'merchant_orders' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                <span>{language === 'ZH' ? '买家订单履约与快速打单发货' : 'Merchant Order Fulfillment'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {language === 'ZH'
                  ? '对接 J&T Express、Ninja Van、Flash Express、LBC 物流，一键出库生成运单'
                  : 'Fulfill customer orders with live tracking numbers'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">
                {language === 'ZH' ? '待发货订单: ' : 'Pending Shipment: '}
                <strong className="text-amber-600 font-mono font-black">{toShipOrders.length}</strong> {language === 'ZH' ? '笔' : 'orders'}
              </span>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Truck className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>{language === 'ZH' ? '暂无店铺订单记录' : 'No orders found'}</p>
              </div>
            ) : (
              orders.map((order) => {
                const canShip = order.status === 'to_ship';
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900 font-mono">{language === 'ZH' ? '订单号: ' : 'Order: '}{order.id}</span>
                        <span className="text-[10px] text-gray-400">{order.createdAt}</span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                          {language === 'ZH' ? '买家: Elena Cruz' : 'Buyer: Elena Cruz'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'to_ship' && (
                          <span className="bg-amber-100 text-amber-700 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {language === 'ZH' ? '买家已付款·待发货' : 'Paid · To Ship'}
                          </span>
                        )}
                        {order.status === 'to_receive' && (
                          <span className="bg-blue-100 text-blue-700 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Truck className="w-3 h-3" /> {language === 'ZH' ? '已发货·运输中' : 'Shipped · In Transit'}
                          </span>
                        )}
                        {order.status === 'completed' && (
                          <span className="bg-emerald-100 text-emerald-700 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {language === 'ZH' ? '买家已妥投收货' : 'Delivered · Completed'}
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="bg-gray-200 text-gray-700 font-black text-xs px-2.5 py-0.5 rounded-full">
                            {language === 'ZH' ? '已取消/售后' : 'Cancelled / Refund'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        {(order.items || []).map((it: any, idx: number) => {
                          const itemImg =
                            it.image ||
                            it.product?.image ||
                            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=120&auto=format&fit=crop&q=80';
                          const itemTitle = it.productName || it.productTitle || it.product?.title || (language === 'ZH' ? '精选优品商品' : 'Featured Product');
                          const itemPrice = it.price ?? it.product?.price ?? 0;
                          const itemQty = it.quantity || 1;
                          return (
                            <div key={idx} className="flex items-center gap-3">
                              <img src={itemImg} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />
                              <div>
                                <p className="text-xs font-extrabold text-gray-900">{itemTitle}</p>
                                <span className="text-[10px] text-gray-500 font-bold">
                                  {language === 'ZH' ? '数量: ' : 'Qty: '}x{itemQty} · {language === 'ZH' ? '单价: ' : 'Unit: '}₱{(itemPrice).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                        <span className="text-xs text-gray-500 font-bold">{language === 'ZH' ? '实付总额' : 'Total Paid'}</span>
                        <span className="text-lg font-black text-gray-900 font-mono">
                          ₱{(order.payAmount ?? order.totalAmount ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Shipping Address info & Actions */}
                    <div className="pt-2 border-t border-gray-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-gray-500">
                        <span className="font-bold text-gray-700">{language === 'ZH' ? '收件地址: ' : 'Shipping Address: '}</span>
                        <span>
                          {order.receiverAddress
                            ? `${order.receiverAddress.receiverName} (${order.receiverAddress.phone}) - ${order.receiverAddress.streetDetail}, ${order.receiverAddress.city}`
                            : (order as any).address
                            ? `${(order as any).address.receiverName} (${(order as any).address.phone}) - ${(order as any).address.streetDetail}, ${(order as any).address.city}`
                            : 'Elena Cruz (0917-888-0000) - Manila Port Area, Manila'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {canShip && (
                          <button
                            onClick={() => handleOpenShipModal(order.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{language === 'ZH' ? '立即打单发货' : 'Dispatch Order'}</span>
                          </button>
                        )}
                        {(order.shippingNo || (order as any).trackingNumber) && (
                          <span className="text-indigo-600 font-mono font-bold bg-indigo-50 px-2.5 py-1 rounded-xl">
                            {order.shippingCarrier || (order as any).carrier || 'J&T'}: {order.shippingNo || (order as any).trackingNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. NODE: AFTERSALES (售后退款处理) */}
      {activeNode === 'merchant_aftersales' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                <span>{language === 'ZH' ? '店铺售后争议与退款审批' : 'Merchant Aftersales & Refunds'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {language === 'ZH'
                  ? '保障买卖双方权益，遵循吉诺平台退款退货规范审核买家申请'
                  : 'Review refund requests and approve or reject with reasons'}
              </p>
            </div>

            <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-xl">
              {language === 'ZH' ? '待处理售后: ' : 'Pending Requests: '}
              <strong>{refundOrders.length}</strong> {language === 'ZH' ? '笔' : 'cases'}
            </span>
          </div>

          <div className="space-y-4">
            {refundOrders.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-xs font-black text-gray-800">
                  {language === 'ZH' ? '目前没有待处理的退款或售后申请！' : 'No pending refund requests'}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">
                  {language === 'ZH'
                    ? '店铺整体退款率低于 0.6%，履约与商品好评表现优秀。'
                    : 'Overall store refund rate is under 0.6%, fulfillment rating is excellent.'}
                </p>
              </div>
            ) : (
              refundOrders.map((ro) => (
                <div key={ro.id} className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-black text-gray-900">{language === 'ZH' ? '订单号: ' : 'Order: '}{ro.id}</span>
                    <span className="text-rose-600 font-black bg-rose-100 px-2 py-0.5 rounded-full text-[10px]">
                      {language === 'ZH' ? '买家发起退款申请' : 'Refund Requested'}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-rose-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{language === 'ZH' ? '申请退款退回金额:' : 'Refund Amount:'}</span>
                      <strong className="text-rose-600 font-mono font-black">₱{(ro?.payAmount ?? ro?.totalAmount ?? 0).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{language === 'ZH' ? '买家退款诉求/理由:' : 'Reason / Note:'}</span>
                      <span className="font-bold text-gray-800">{language === 'ZH' ? '买家自主取消订单 / 规格选错申请退款' : 'Buyer requested cancellation / wrong size selected'}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleOpenRefundModal(ro.id, 'reject')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                    >
                      {language === 'ZH' ? '驳回申请' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleOpenRefundModal(ro.id, 'approve')}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow"
                    >
                      {language === 'ZH' ? '同意退款并原路划转' : 'Approve Refund'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. NODE: FINANCE & WITHDRAW (财务中心与对账流水) */}
      {(activeNode === 'merchant_finance' || activeNode === 'merchant_withdraw') && (
        <div className="space-y-6">
          {/* Balance Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 shadow-lg space-y-2">
              <span className="text-xs uppercase font-extrabold text-emerald-100 block">
                {language === 'ZH' ? '可用经营收益余额' : 'Available Balance'}
              </span>
              <div className="text-3xl font-black font-mono">
                ₱{(user?.walletBalance ?? 185600).toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-100">
                {language === 'ZH' ? '随时可提现至 GCash / 银行卡账户' : 'Withdraw anytime to GCash, Maya or bank account'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
              <span className="text-xs uppercase font-bold text-gray-400 block">
                {language === 'ZH' ? '担保在途待结算资金' : 'Escrow in Transit'}
              </span>
              <div className="text-2xl font-black font-mono text-gray-900">₱24,800</div>
              <p className="text-[11px] text-gray-500">
                {language === 'ZH' ? '买家确认收货或7天自动妥投后自动解冻结算' : 'Settled upon buyer delivery confirmation or 7 days'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
              <span className="text-xs uppercase font-bold text-gray-400 block">
                {language === 'ZH' ? '店铺质保金 (保全账户)' : 'Security Deposit'}
              </span>
              <div className="text-2xl font-black font-mono text-gray-900">₱20,000</div>
              <p className="text-[11px] text-gray-500">
                {language === 'ZH' ? '正常开店履约中，闭店或协议终止后原额退还' : 'Refundable upon store closing or contract expiration'}
              </p>
            </div>
          </div>

          {/* Instant Withdraw Form Modal/Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ZH' ? '极速收益提现申请' : 'Instant Balance Withdrawal'}</span>
              </h3>
              <span className="text-xs text-gray-400 font-bold">
                {language === 'ZH' ? '免提现手续费 · 资金急速到账' : '0% fee · Rapid transfer'}
              </span>
            </div>

            <form onSubmit={handleConfirmWithdraw} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '提现收款渠道 *' : 'Payout Method *'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['GCash', 'Maya', 'BDO Unibank', 'BPI'] as const).map((channel) => (
                      <button
                        type="button"
                        key={channel}
                        onClick={() => setWithdrawChannel(channel)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                          withdrawChannel === channel
                            ? 'bg-purple-50 border-purple-500 text-purple-700 font-black ring-1 ring-purple-300'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {channel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '收款账号 / 手机号 *' : 'Account Number / Mobile *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    placeholder="0917-123-4567"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <p className="text-[10px] text-gray-400">
                    {language === 'ZH' ? '户名需与店铺认证法人/实名姓名完全一致' : 'Account name must match verified business name'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700">
                    {language === 'ZH' ? '提现金额 (₱) *' : 'Withdrawal Amount (₱) *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(user?.walletBalance ?? 185600))}
                    className="text-xs text-purple-600 font-bold hover:underline"
                  >
                    {language === 'ZH' ? '全部提现' : 'Withdraw Max'}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-gray-500">₱</span>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={language === 'ZH' ? '输入提现金额 (最低 ₱100)' : 'Min ₱100'}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ZH' ? '提交提现申请' : 'Submit Withdrawal'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Financial Transactions Ledger */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>{language === 'ZH' ? '店铺收支对账流水明细' : 'Financial Ledger'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 font-extrabold uppercase border-y border-gray-100">
                  <tr>
                    <th className="py-2.5 px-4">{language === 'ZH' ? '流水时间' : 'Timestamp'}</th>
                    <th className="py-2.5 px-4">{language === 'ZH' ? '流水类型' : 'Type'}</th>
                    <th className="py-2.5 px-4">{language === 'ZH' ? '业务描述' : 'Description'}</th>
                    <th className="py-2.5 px-4">{language === 'ZH' ? '交易额' : 'Amount'}</th>
                    <th className="py-2.5 px-4">{language === 'ZH' ? '平台技术费 (3%)' : 'Fee (3%)'}</th>
                    <th className="py-2.5 px-4 text-right">{language === 'ZH' ? '净结算变动' : 'Net Change'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {financialLedger.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-gray-500">{tx.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            tx.type === 'order_settle' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {tx.type === 'order_settle'
                            ? (language === 'ZH' ? '订单结算入账' : 'Settlement')
                            : (language === 'ZH' ? '提现出金' : 'Withdrawal')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-800">{tx.desc}</td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        {(tx?.amount ?? 0) > 0 ? `+₱${(tx?.amount ?? 0).toLocaleString()}` : `-₱${Math.abs(tx?.amount ?? 0).toLocaleString()}`}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-400">{tx.fee ? `₱${tx.fee.toFixed(2)}` : '₱0.00'}</td>
                      <td className="py-3 px-4 text-right font-mono font-black">
                        <span className={tx.net > 0 ? 'text-emerald-600' : 'text-amber-600'}>
                          {tx.net > 0 ? `+₱${tx.net.toFixed(2)}` : `-₱${Math.abs(tx.net).toFixed(2)}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. NODE: MARKETING (营销促销与卡券提报) */}
      {activeNode === 'merchant_marketing' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                <span>{language === 'ZH' ? '店铺专属营销促销与优惠券' : 'Store Marketing & Promotions'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {language === 'ZH'
                  ? '发放店铺专属满减券、设置免运费门槛，提报吉诺超级购物节官方活动'
                  : 'Manage store vouchers and official campaign enrollment'}
              </p>
            </div>
          </div>

          {/* Active Store Vouchers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storeCoupons.map((coupon) => (
              <div key={coupon.id} className="p-5 rounded-2xl border border-purple-100 bg-purple-50/40 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      {language === 'ZH' ? '满减店铺券' : 'Store Voucher'}
                    </span>
                    <h4 className="font-extrabold text-sm text-gray-900 mt-1">{coupon.title}</h4>
                  </div>
                  <span className="text-2xl font-black text-purple-600 font-mono">₱{coupon.discount}</span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>{language === 'ZH' ? '使用门槛:' : 'Condition:'}</span>
                    <strong>{language === 'ZH' ? `满 ₱${coupon.minSpend} 可用` : `Min spend ₱${coupon.minSpend}`}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ZH' ? '已领取 / 已使用:' : 'Claimed / Used:'}</span>
                    <strong className="text-gray-900">{coupon.collected} / {coupon.used}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-100/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {language === 'ZH' ? '生效投放中' : 'Active'}
                  </span>
                  <button
                    onClick={() => alert(language === 'ZH' ? '优惠券已暂停发放' : 'Voucher paused')}
                    className="text-xs text-purple-700 hover:underline font-bold"
                  >
                    {language === 'ZH' ? '暂停发放' : 'Pause'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Official Mega Campaigns Enrollment */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="font-extrabold text-xs text-gray-900 uppercase">
              {language === 'ZH' ? '平台官方大促报名通道' : 'Platform Mega Campaign Enrollment'}
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FF6B35] text-white text-[10px] font-black px-2 py-0.2 rounded-full">HOT</span>
                  <h5 className="font-black text-xs text-gray-900">
                    {language === 'ZH' ? '8.8 超级大促 · 数码家电免息狂欢节' : '8.8 Mega Campaign · Electronics Carnival'}
                  </h5>
                </div>
                <p className="text-[11px] text-gray-500">
                  {language === 'ZH'
                    ? '平台主会场核心展位亿级曝光，全场补贴 ₱100 优惠券，旗舰店商家优先入选'
                    : 'Homepage hero banner promotion, platform subsidized vouchers for verified sellers'}
                </p>
              </div>
              <button
                onClick={() => {
                  confetti({ particleCount: 50, spread: 60 });
                  alert(
                    language === 'ZH'
                      ? '🎉 恭喜！店铺已成功提报 8.8 超级大促，运营小二将在1个工作日内审核分配会场资源！'
                      : '🎉 Success! Store enrolled in 8.8 Mega Campaign. Admin team will assign banner resources.'
                  );
                }}
                className="bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs font-black px-4 py-2 rounded-xl shrink-0 shadow"
              >
                {language === 'ZH' ? '免费提报报名' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. NODE: SETTINGS (店家设置与资质材料上传) */}
      {activeNode === 'merchant_settings' && <MerchantSettings />}

      {/* FULFILL / SHIP MODAL */}
      {shippingOrderId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-100 relative">
            <button
              onClick={() => setShippingOrderId(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-base text-gray-900">
                  {language === 'ZH' ? '订单打单出库与发货' : 'Dispatch & Ship Order'}
                </h4>
                <p className="text-xs text-gray-400">{language === 'ZH' ? '单号: ' : 'Order ID: '}{shippingOrderId}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {language === 'ZH' ? '合作物流公司 *' : 'Logistics Carrier *'}
                </label>
                <select
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  <option value="J&T Express Logistics">J&T Express Logistics (极兔速递)</option>
                  <option value="Ninja Van Philippines">Ninja Van Philippines (忍者快递)</option>
                  <option value="Flash Express PH">Flash Express PH (闪电速运)</option>
                  <option value="LBC Express Logistics">LBC Express Logistics (菲律宾专线)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {language === 'ZH' ? '快递运单号 *' : 'Tracking Number *'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shippingTrackingNo}
                    onChange={(e) => setShippingTrackingNo(e.target.value)}
                    placeholder="JT-PH-98213812"
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShippingTrackingNo(`JT-PH-${Math.floor(10000000 + Math.random() * 90000000)}`)
                    }
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
                  >
                    {language === 'ZH' ? '重新生成' : 'Regenerate'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShippingOrderId(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                {language === 'ZH' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmShip}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow"
              >
                {language === 'ZH' ? '确认出库并通知买家' : 'Confirm Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 relative">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-2xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-base text-gray-900">
                  {language === 'ZH' ? '录入发布新商品' : 'List New Product'}
                </h4>
                <p className="text-xs text-gray-400">
                  {language === 'ZH' ? '完善商品基础信息并即时在前台展示' : 'Fill in specifications to publish to mall instantly'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {language === 'ZH' ? '商品标题 *' : 'Product Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder={language === 'ZH' ? '如：Anker 新款超长续航主动降噪蓝牙耳机' : 'e.g., Anker Wireless Active Noise-Cancelling Headphones'}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '所属类目 *' : 'Category *'}
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Digital & Electronics">Digital & Electronics (数码电子)</option>
                    <option value="Home & Kitchen">Home & Kitchen (家居厨电)</option>
                    <option value="Fashion & Apparel">Fashion & Apparel (流行服饰)</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care (美妆个护)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '初始库存 (件) *' : 'Initial Stock (units) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '在售价格 (₱) *' : 'Selling Price (₱) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    placeholder="2999"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">
                    {language === 'ZH' ? '原价划线价 (₱)' : 'Original Price (₱)'}
                  </label>
                  <input
                    type="number"
                    value={newProductForm.originalPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: e.target.value })}
                    placeholder="3999"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  {language === 'ZH' ? '商品主图 URL' : 'Main Image URL'}
                </label>
                <input
                  type="text"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  {language === 'ZH' ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow"
                >
                  {language === 'ZH' ? '确认发布上架' : 'Publish & List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
