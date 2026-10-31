import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Order } from '../../../types';

export const AdminOrders: React.FC = () => {
  const { orders, adminShipOrder, adminUpdateOrderStatus, language } = useApp();

  const [orderSubTab, setOrderSubTab] = useState<'all' | 'refunds'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dispatch / Ship Modal
  const [selectedShipOrder, setSelectedShipOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState<'J&T Express' | 'LBC Express' | 'Ninja Van'>('J&T Express');
  const [trackingNo, setTrackingNo] = useState(`JT6392018${Math.floor(100 + Math.random() * 900)}`);

  // Order Detail Drawer/Modal
  const [viewDetailOrder, setViewDetailOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const receiverName = o.receiverAddress?.receiverName || (o as any).shippingAddress?.receiverName || '';
    const matchesSearch =
      o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const refundOrders = orders.filter((o) => o.status === 'refunding' || o.status === 'refunded');

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipOrder) return;
    adminShipOrder(selectedShipOrder.id, carrier, trackingNo);
    setSelectedShipOrder(null);
  };

  const handleExportOrders = () => {
    alert(
      language === 'ZH'
        ? `已成功导出 ${filteredOrders.length} 条订单数据至 CSV 文件！`
        : language === 'TL'
        ? `Matagumpay na na-export ang ${filteredOrders.length} order sa CSV!`
        : `Exported ${filteredOrders.length} orders to CSV format!`
    );
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Sub-tabs & Export header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-2xl border border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setOrderSubTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              orderSubTab === 'all'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {language === 'ZH' ? `订单列表 (${orders.length})` : language === 'TL' ? `Listahan ng Order (${orders.length})` : `Order Management (${orders.length})`}
            </span>
          </button>
          <button
            onClick={() => setOrderSubTab('refunds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              orderSubTab === 'refunds'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>
              {language === 'ZH' ? `退款售后 (${refundOrders.length})` : language === 'TL' ? `Refunds at After-Sales (${refundOrders.length})` : `After-Sales & Refunds (${refundOrders.length})`}
            </span>
          </button>
        </div>

        <button
          onClick={handleExportOrders}
          className="bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-white/10 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'ZH' ? '导出订单数据 CSV' : language === 'TL' ? 'I-export ang CSV' : 'Export Orders CSV'}
          </span>
        </button>
      </div>

      {/* 1. ORDER LIST VIEW */}
      {orderSubTab === 'all' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={
                  language === 'ZH' ? '搜索订单号或收货人姓名...' : language === 'TL' ? 'Maghanap ng Order No o Pangalan...' : 'Search Order No or Receiver Name...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="all">{language === 'ZH' ? '全部状态' : language === 'TL' ? 'Lahat ng Estado' : 'All Statuses'}</option>
              <option value="to_pay">{language === 'ZH' ? '待支付' : language === 'TL' ? 'Naghihintay ng Bayad' : 'Pending Payment'}</option>
              <option value="to_ship">{language === 'ZH' ? '待发货' : language === 'TL' ? 'Ipadadala' : 'To Ship'}</option>
              <option value="to_receive">{language === 'ZH' ? '待收货' : language === 'TL' ? 'Matatanggap' : 'To Receive'}</option>
              <option value="completed">{language === 'ZH' ? '已完成' : language === 'TL' ? 'Tapos Na' : 'Completed'}</option>
              <option value="refunding">{language === 'ZH' ? '退款中' : language === 'TL' ? 'Nasa Refund Process' : 'Refunding'}</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">{language === 'ZH' ? '订单号 / 日期' : language === 'TL' ? 'Order No / Petsa' : 'Order No / Date'}</th>
                  <th className="p-3">{language === 'ZH' ? '客户与地址' : language === 'TL' ? 'Kustomer at Lokasyon' : 'Customer & Location'}</th>
                  <th className="p-3">{language === 'ZH' ? '类型与支付' : language === 'TL' ? 'Uri at Bayad' : 'Type & Payment'}</th>
                  <th className="p-3">{language === 'ZH' ? '金额 (₱)' : language === 'TL' ? 'Halaga (₱)' : 'Amount (₱)'}</th>
                  <th className="p-3">{language === 'ZH' ? '状态' : language === 'TL' ? 'Estado' : 'Status'}</th>
                  <th className="p-3 text-right">{language === 'ZH' ? '操作' : language === 'TL' ? 'Mga Aksyon' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <span className="font-extrabold text-white text-xs block">{o.orderNo}</span>
                      <span className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-200 block">{o.receiverAddress?.receiverName || (o as any).shippingAddress?.receiverName || 'Guest'}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[180px] block">
                        {o.receiverAddress?.city || (o as any).shippingAddress?.city || ''}, {o.receiverAddress?.province || (o as any).shippingAddress?.province || ''}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {o.type}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">{o.paymentMethod.toUpperCase()}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-black text-[#FF8C61]">₱{o.payAmount.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.status === 'to_ship' ? 'bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30' :
                        o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        o.status === 'refunding' ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDetailOrder(o)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          {language === 'ZH' ? '详情' : language === 'TL' ? 'Detalye' : 'Detail'}
                        </button>
                        {o.status === 'to_ship' && (
                          <button
                            onClick={() => setSelectedShipOrder(o)}
                            className="px-2.5 py-1 bg-[#FF6B35] hover:opacity-90 text-white font-bold rounded-lg text-[11px] shadow transition-all"
                          >
                            {language === 'ZH' ? '去发货' : language === 'TL' ? 'Ipadala' : 'Dispatch / Ship'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. AFTER-SALES & REFUNDS VIEW */}
      {orderSubTab === 'refunds' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white">
            {language === 'ZH' ? '退款与售后申请列表' : language === 'TL' ? 'Aplikasyon para sa Refund' : 'Refund & After-Sales Applications'}
          </h3>
          {refundOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              {language === 'ZH' ? '暂无待处理退款申请。' : language === 'TL' ? 'Walang nakatambak na kahilingan sa refund.' : 'No refund requests pending review.'}
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {refundOrders.map((ro) => (
                <div key={ro.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="font-extrabold text-white text-sm">{ro.orderNo}</span>
                    <p className="text-slate-300 text-xs mt-0.5">
                      Customer: <span className="font-bold text-white">{ro.receiverAddress?.receiverName || (ro as any).shippingAddress?.receiverName || 'Guest'}</span> | Amount: <span className="text-[#FF8C61] font-bold">₱{ro.payAmount.toLocaleString()}</span>
                    </p>
                    <p className="text-[11px] text-amber-300 font-semibold mt-1">
                      Reason: Buyer requested cancellation / wrong size item.
                    </p>
                  </div>

                  {ro.status === 'refunding' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => adminUpdateOrderStatus(ro.id, 'refunded', true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition-all"
                      >
                        {language === 'ZH' ? '同意退款' : language === 'TL' ? 'Aprebahan ang Refund' : 'Approve Refund'}
                      </button>
                      <button
                        onClick={() => adminUpdateOrderStatus(ro.id, 'to_ship', false)}
                        className="bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                      >
                        {language === 'ZH' ? '拒绝申请' : language === 'TL' ? 'Tanggihan' : 'Reject Request'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DISPATCH ORDER MODAL */}
      {selectedShipOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Truck className="w-5 h-5 text-[#FF8C61]" />
              <span>{language === 'ZH' ? `发货处理 #${selectedShipOrder.orderNo}` : `Dispatch Order #${selectedShipOrder.orderNo}`}</span>
            </h3>

            <form onSubmit={handleShipSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '物流承运商' : language === 'TL' ? 'Courier ng Logistika' : 'Logistics Carrier'}
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="J&T Express">J&T Express PH</option>
                  <option value="LBC Express">LBC Express PH</option>
                  <option value="Ninja Van">Ninja Van PH</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '物流运单号' : language === 'TL' ? 'Tracking Number' : 'Tracking Number'}
                </label>
                <input
                  type="text"
                  required
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedShipOrder(null)}
                  className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white font-black py-2.5 rounded-xl shadow-lg"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAIL MODAL */}
      {viewDetailOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">Order Details #{viewDetailOrder.orderNo}</h3>
              <button onClick={() => setViewDetailOrder(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white/5 p-3 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Recipient Address</span>
                <p className="font-bold text-white">
                  {viewDetailOrder.receiverAddress?.receiverName || (viewDetailOrder as any).shippingAddress?.receiverName || 'Guest'} ({viewDetailOrder.receiverAddress?.phone || (viewDetailOrder as any).shippingAddress?.phone || 'N/A'})
                </p>
                <p className="text-slate-300">
                  {viewDetailOrder.receiverAddress?.streetDetail || (viewDetailOrder as any).shippingAddress?.streetDetail || ''}, {viewDetailOrder.receiverAddress?.city || (viewDetailOrder as any).shippingAddress?.city || ''}
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Order Items</span>
                {viewDetailOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-200 py-1 border-b border-white/5">
                    <span>{it.product.titleEn} x {it.quantity}</span>
                    <span className="font-bold text-[#FF8C61]">₱{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center font-bold text-sm pt-2">
                <span>Total Amount Paid:</span>
                <span className="text-xl font-black text-[#FF8C61]">₱{viewDetailOrder.payAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
