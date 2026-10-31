import React, { useState } from 'react';
import {
  Package,
  Truck,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  CreditCard,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ListTree,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

type FilterKey = 'all' | 'processing' | 'to_pay' | 'to_ship' | 'to_receive' | 'completed' | 'aftersales' | 'cancelled' | 'refunding';

export const OrdersPage: React.FC = () => {
  const { language, orders, cancelOrder, confirmOrderReceipt, requestRefund, openReturnPolicyModal } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    processing: true,
    completed: true,
    aftersales: true,
  });

  const [selectedOrderTracking, setSelectedOrderTracking] = useState<Order | null>(null);

  const toggleNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Calculate badge counts
  const counts = {
    all: orders.length,
    to_pay: orders.filter((o) => o.status === 'to_pay').length,
    to_ship: orders.filter((o) => o.status === 'to_ship').length,
    to_receive: orders.filter((o) => o.status === 'to_receive').length,
    get processing() {
      return this.to_pay + this.to_ship + this.to_receive;
    },
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
    refunding: orders.filter((o) => o.status === 'refunding').length,
    get aftersales() {
      return this.cancelled + this.refunding;
    },
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'processing') return ['to_pay', 'to_ship', 'to_receive'].includes(o.status);
    if (activeFilter === 'aftersales') return ['cancelled', 'refunding'].includes(o.status);
    return o.status === activeFilter;
  });

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

  const getFilterTitle = (filter: FilterKey) => {
    switch (filter) {
      case 'all':
        return language === 'ZH' ? '全部订单' : language === 'TL' ? 'Lahat ng Order' : 'All Orders';
      case 'processing':
        return language === 'ZH' ? '进行中的订单' : language === 'TL' ? 'Mga Order na Ginagawa' : 'Processing Orders';
      case 'to_pay':
        return language === 'ZH' ? '待付款订单' : language === 'TL' ? 'Babayarang Order' : 'To Pay Orders';
      case 'to_ship':
        return language === 'ZH' ? '待发货订单' : language === 'TL' ? 'Ipapadalang Order' : 'To Ship Orders';
      case 'to_receive':
        return language === 'ZH' ? '待收货 / 运输中订单' : language === 'TL' ? 'Tatanggapin / On the Way' : 'In Transit Orders';
      case 'completed':
        return language === 'ZH' ? '已完成订单' : language === 'TL' ? 'Kumpletong Order' : 'Completed Orders';
      case 'aftersales':
        return language === 'ZH' ? '售后与取消订单' : language === 'TL' ? 'Kanselado at Refund' : 'After-sales & Cancelled';
      case 'cancelled':
        return language === 'ZH' ? '已取消订单' : language === 'TL' ? 'Kanseladong Order' : 'Cancelled Orders';
      case 'refunding':
        return language === 'ZH' ? '退款处理中订单' : language === 'TL' ? 'Refunding Orders' : 'Refunding Orders';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            {language === 'ZH' ? '我的订单管理' : language === 'TL' ? 'Pamamahala ng Order' : 'My Orders'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'ZH'
              ? '通过分类树快速筛选并跟踪您的所有商品订单状态'
              : language === 'TL'
              ? 'Suriin at sundan ang estado ng iyong mga order gamit ang kategoryang puno'
              : 'Filter and track your purchase orders via the structured category tree'}
          </p>
        </div>
      </div>

      {/* Main Layout: Left Tree Menu + Right Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Tree Navigation List */}
        <div className="md:col-span-4 lg:col-span-3 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-3 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-xs">
              <ListTree className="w-4 h-4 text-[#FF6B35]" />
              <span>{language === 'ZH' ? '订单三级分类树' : language === 'TL' ? 'Puno ng Kategorya' : 'Order Category Tree'}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-full">
              {orders.length} {language === 'ZH' ? '单' : 'Items'}
            </span>
          </div>

          {/* Tree Structure */}
          <div className="space-y-1 text-xs font-semibold text-gray-700">
            {/* 1. Root: All Orders */}
            <div
              onClick={() => setActiveFilter('all')}
              className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#FF6B35] text-white font-extrabold shadow-sm'
                  : 'hover:bg-gray-50 text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className={`w-4 h-4 ${activeFilter === 'all' ? 'text-white' : 'text-gray-500'}`} />
                <span>{language === 'ZH' ? '全部订单' : language === 'TL' ? 'Lahat ng Order' : 'All Orders'}</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {counts.all}
              </span>
            </div>

            {/* 2. Parent Branch: Processing Orders */}
            <div className="space-y-1 pt-1">
              <div
                onClick={() => setActiveFilter('processing')}
                className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all ${
                  activeFilter === 'processing'
                    ? 'bg-orange-50 text-[#FF6B35] font-extrabold border border-orange-200'
                    : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <button onClick={(e) => toggleNode('processing', e)} className="p-0.5 hover:bg-black/5 rounded">
                    {expandedNodes['processing'] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                  {expandedNodes['processing'] ? (
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Folder className="w-4 h-4 text-amber-500" />
                  )}
                  <span>{language === 'ZH' ? '进行中的订单' : language === 'TL' ? 'Ginagawa' : 'In Progress'}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {counts.processing}
                </span>
              </div>

              {/* Children Nodes of Processing */}
              {expandedNodes['processing'] && (
                <div className="pl-6 space-y-1 border-l-2 border-dashed border-gray-100 ml-3 my-1">
                  {/* Child: To Pay */}
                  <div
                    onClick={() => setActiveFilter('to_pay')}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all text-[11px] ${
                      activeFilter === 'to_pay'
                        ? 'bg-amber-50 text-amber-900 font-black border border-amber-200'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'ZH' ? '待付款' : language === 'TL' ? 'Babayaran' : 'To Pay'}</span>
                    </div>
                    {counts.to_pay > 0 && (
                      <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        {counts.to_pay}
                      </span>
                    )}
                  </div>

                  {/* Child: To Ship */}
                  <div
                    onClick={() => setActiveFilter('to_ship')}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all text-[11px] ${
                      activeFilter === 'to_ship'
                        ? 'bg-blue-50 text-blue-900 font-black border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Package className="w-3.5 h-3.5 text-blue-500" />
                      <span>{language === 'ZH' ? '待发货' : language === 'TL' ? 'Ipapadala' : 'To Ship'}</span>
                    </div>
                    {counts.to_ship > 0 && (
                      <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        {counts.to_ship}
                      </span>
                    )}
                  </div>

                  {/* Child: To Receive */}
                  <div
                    onClick={() => setActiveFilter('to_receive')}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all text-[11px] ${
                      activeFilter === 'to_receive'
                        ? 'bg-indigo-50 text-indigo-900 font-black border border-indigo-200'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{language === 'ZH' ? '待收货 / 运输中' : language === 'TL' ? 'Tatanggapin' : 'In Transit'}</span>
                    </div>
                    {counts.to_receive > 0 && (
                      <span className="bg-indigo-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        {counts.to_receive}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Parent Branch: Completed */}
            <div className="space-y-1 pt-1">
              <div
                onClick={() => setActiveFilter('completed')}
                className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all ${
                  activeFilter === 'completed'
                    ? 'bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-200'
                    : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <button onClick={(e) => toggleNode('completed', e)} className="p-0.5 hover:bg-black/5 rounded">
                    {expandedNodes['completed'] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                  {expandedNodes['completed'] ? (
                    <FolderOpen className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Folder className="w-4 h-4 text-emerald-500" />
                  )}
                  <span>{language === 'ZH' ? '已完成订单' : language === 'TL' ? 'Kumpleto' : 'Completed'}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {counts.completed}
                </span>
              </div>

              {expandedNodes['completed'] && (
                <div className="pl-6 space-y-1 border-l-2 border-dashed border-gray-100 ml-3 my-1">
                  <div
                    onClick={() => setActiveFilter('completed')}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all text-[11px] ${
                      activeFilter === 'completed'
                        ? 'bg-emerald-100/60 text-emerald-900 font-black'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'ZH' ? '确认收货与已完成' : language === 'TL' ? 'Natanggap na Order' : 'Fulfilled Orders'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Parent Branch: After-sales & Closed */}
            <div className="space-y-1 pt-1">
              <div
                onClick={() => setActiveFilter('aftersales')}
                className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all ${
                  activeFilter === 'aftersales'
                    ? 'bg-rose-50 text-rose-900 font-extrabold border border-rose-200'
                    : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <button onClick={(e) => toggleNode('aftersales', e)} className="p-0.5 hover:bg-black/5 rounded">
                    {expandedNodes['aftersales'] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                  {expandedNodes['aftersales'] ? (
                    <FolderOpen className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Folder className="w-4 h-4 text-rose-500" />
                  )}
                  <span>{language === 'ZH' ? '售后与关闭' : language === 'TL' ? 'Kanselado at Refund' : 'After-sales'}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  {counts.aftersales}
                </span>
              </div>

              {expandedNodes['aftersales'] && (
                <div className="pl-6 space-y-1 border-l-2 border-dashed border-gray-100 ml-3 my-1">
                  {/* Child: Cancelled */}
                  <div
                    onClick={() => setActiveFilter('cancelled')}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all text-[11px] ${
                      activeFilter === 'cancelled'
                        ? 'bg-gray-200 text-gray-900 font-black'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-3.5 h-3.5 text-gray-500" />
                      <span>{language === 'ZH' ? '已取消订单' : language === 'TL' ? 'Kanselado' : 'Cancelled'}</span>
                    </div>
                    {counts.cancelled > 0 && (
                      <span className="bg-gray-300 text-gray-800 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        {counts.cancelled}
                      </span>
                    )}
                  </div>

                  {/* Child: Refunding */}
                  <div
                    onClick={() => setActiveFilter('refunding')}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all text-[11px] ${
                      activeFilter === 'refunding'
                        ? 'bg-rose-100 text-rose-900 font-black'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                      <span>{language === 'ZH' ? '退款 / 售后中' : language === 'TL' ? 'Nagpaparefund' : 'Refunding'}</span>
                    </div>
                    {counts.refunding > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        {counts.refunding}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Filtered Orders Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Active Filter Header Indicator */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-xs text-gray-500 font-semibold">
                {language === 'ZH' ? '当前分类：' : language === 'TL' ? 'Kasalukuyang Kategorya: ' : 'Current View: '}
              </span>
              <span className="text-xs font-black text-gray-900 bg-orange-50 text-[#FF6B35] px-2.5 py-1 rounded-xl border border-orange-100">
                {getFilterTitle(activeFilter)}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {filteredOrders.length} {language === 'ZH' ? '个订单' : 'Orders Found'}
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400 space-y-2 border border-gray-100">
              <Package className="w-12 h-12 mx-auto text-gray-300" />
              <p className="text-sm font-bold text-gray-700">
                {language === 'ZH'
                  ? '该分类树节点下暂无订单记录'
                  : language === 'TL'
                  ? 'Walang nahanap na order sa kategoryang ito'
                  : 'No orders found under this category node'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 hover:border-gray-200 transition-all"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-gray-900">{order.orderNo}</span>
                      {order.orderType === 'group_buy' && (
                        <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          {language === 'ZH' ? '拼团' : 'GROUP BUY'}
                        </span>
                      )}
                      {order.orderType === 'auction' && (
                        <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          {language === 'ZH' ? '竞拍' : 'AUCTION WIN'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.productName}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.skuSpecs}</p>
                          <p className="text-xs text-gray-600 mt-1 font-semibold">
                            ₱{(item.price ?? 0).toLocaleString()} x {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 font-semibold">
                        {language === 'ZH' ? '实付金额: ' : language === 'TL' ? 'Kabuuang Bayad: ' : 'Total Paid: '}
                      </span>
                      <span className="text-base font-black text-[#FF6B35]">
                        ₱{(order.payAmount ?? order.totalAmount ?? 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-2">
                        ({order.paymentMethod || 'GCash'})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'to_ship' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="bg-gray-100 text-gray-700 font-bold px-3.5 py-1.5 rounded-xl hover:bg-gray-200 transition-all"
                        >
                          {language === 'ZH' ? '取消订单' : language === 'TL' ? 'Kanselahin ang Order' : 'Cancel Order'}
                        </button>
                      )}

                      {order.status === 'to_receive' && (
                        <>
                          <button
                            onClick={() => setSelectedOrderTracking(order)}
                            className="bg-gray-100 text-gray-800 font-bold px-3.5 py-1.5 rounded-xl hover:bg-gray-200 flex items-center gap-1 transition-all"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#FF6B35]" />
                            <span>
                              {language === 'ZH' ? '查看物流' : language === 'TL' ? 'Sundan ang Shipping' : 'Track Shipping'}
                            </span>
                          </button>
                          <button
                            onClick={() => confirmOrderReceipt(order.id)}
                            className="bg-[#FF6B35] text-white font-extrabold px-4 py-1.5 rounded-xl hover:bg-[#e05a2b] transition-all shadow-sm"
                          >
                            {language === 'ZH' ? '确认收货' : language === 'TL' ? 'Kumpirmahin ang Tanggap' : 'Confirm Receipt'}
                          </button>
                        </>
                      )}

                      {order.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={openReturnPolicyModal}
                            className="bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-200 transition-all border border-slate-200 flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#FF6B35]" />
                            <span>{language === 'ZH' ? '7天无理由退换规则' : '7-Day Return Policy'}</span>
                          </button>
                          <button
                            onClick={() => {
                              const promptMsg =
                                language === 'ZH'
                                  ? '请输入退款/退货原因:'
                                  : language === 'TL'
                                  ? 'Mangyaring ilagay ang dahilan para sa refund:'
                                  : 'Please enter reason for refund/return request:';
                              const reason = prompt(promptMsg);
                              if (reason) requestRefund(order.id, reason);
                            }}
                            className="bg-rose-50 text-rose-600 font-bold px-3.5 py-1.5 rounded-xl hover:bg-rose-100 transition-all border border-rose-100"
                          >
                            {language === 'ZH' ? '申请售后/退款' : language === 'TL' ? 'Humingi ng Refund' : 'Request Refund'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logistics Tracking Drawer Modal */}
      {selectedOrderTracking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 relative shadow-2xl border border-gray-100">
            <button
              onClick={() => setSelectedOrderTracking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#FF6B35]" />
              Shipping Timeline - {selectedOrderTracking.shippingCarrier || 'J&T Express'}
            </h3>
            <p className="text-xs text-gray-500 font-bold">
              Tracking #: {selectedOrderTracking.shippingNo || 'JT63920182901'}
            </p>

            <div className="space-y-4 pt-2 max-h-80 overflow-y-auto">
              {(selectedOrderTracking.trackingHistory || []).map((t, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B35] mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">{t.status}</p>
                    <p className="text-gray-500">{t.location}</p>
                    <p className="text-[10px] text-gray-400">{new Date(t.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

