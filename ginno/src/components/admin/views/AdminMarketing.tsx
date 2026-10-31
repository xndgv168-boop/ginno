import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Tag, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Coupon } from '../../../types';

export const AdminMarketing: React.FC = () => {
  const { coupons, adminSaveCoupon, adminDeleteCoupon, language } = useApp();

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCpn, setNewCpn] = useState<Partial<Coupon>>({
    code: 'MEGA2026',
    title: 'Weekend Mega Discount Voucher',
    type: 'flat',
    value: 200,
    minOrderAmount: 1500,
    totalQuantity: 1000,
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    adminSaveCoupon(newCpn);
    setShowCouponModal(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-3xl border border-white/10">
        <div>
          <h3 className="text-sm font-black text-white">
            {language === 'ZH' ? '优惠券与营销促销' : language === 'TL' ? 'Mga Kupon at Promosyon' : 'Coupons & Promotion Vouchers'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'ZH' ? '管理全平台优惠券、折扣码及限时抢购活动' : language === 'TL' ? 'Pamahalaan ang mga voucher at discount code' : 'Manage promotional vouchers, discount codes, and flash campaigns'}
          </p>
        </div>
        <button
          onClick={() => setShowCouponModal(true)}
          className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>
            {language === 'ZH' ? '创建优惠券' : language === 'TL' ? 'Gumawa ng Kupon' : 'Create Coupon'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((cpn) => (
          <div key={cpn.id} className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl space-y-3 relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-purple-500/30">
                  {cpn.code}
                </span>
                <h4 className="font-extrabold text-white text-sm mt-1">{cpn.title}</h4>
              </div>
              <button
                onClick={() => adminDeleteCoupon(cpn.id)}
                className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {language === 'ZH' ? '优惠力度:' : language === 'TL' ? 'Bawas:' : 'Discount Value:'}
                </span>
                <span className="font-black text-[#FF8C61]">
                  {cpn.type === 'flat' ? `₱${cpn.value}` : `${cpn.value}% OFF`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {language === 'ZH' ? '最低使用门槛:' : language === 'TL' ? 'Minimong Order:' : 'Min Order:'}
                </span>
                <span className="font-bold text-white">₱{cpn.minOrderAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {language === 'ZH' ? '已领 / 总发行量:' : language === 'TL' ? 'Nakuha / Kabuuan:' : 'Issued / Total:'}
                </span>
                <span className="font-bold text-emerald-400">{cpn.claimedQuantity} / {cpn.totalQuantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <h3 className="text-base font-black text-white">
              {language === 'ZH' ? '创建促销优惠券与代金券' : language === 'TL' ? 'Gumawa ng Promosyong Kupon' : 'Create Promotional Voucher'}
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '优惠券代码 (折扣码)' : language === 'TL' ? 'Kupon Code (Promo Code)' : 'Coupon Code (Promo Code)'}
                </label>
                <input
                  type="text"
                  required
                  value={newCpn.code || ''}
                  onChange={(e) => setNewCpn({ ...newCpn, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '优惠券名称与说明' : language === 'TL' ? 'Pamagat ng Kupon' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newCpn.title || ''}
                  onChange={(e) => setNewCpn({ ...newCpn, title: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {language === 'ZH' ? '面值 / 折扣金额 (₱)' : language === 'TL' ? 'Halaga ng Bawas (₱)' : 'Discount Amount (₱)'}
                  </label>
                  <input
                    type="number"
                    value={newCpn.value || 0}
                    onChange={(e) => setNewCpn({ ...newCpn, value: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {language === 'ZH' ? '最低消费门槛 (₱)' : language === 'TL' ? 'Minimong Gastos (₱)' : 'Min Spend (₱)'}
                  </label>
                  <input
                    type="number"
                    value={newCpn.minOrderAmount || 0}
                    onChange={(e) => setNewCpn({ ...newCpn, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white font-black py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '保存优惠券' : language === 'TL' ? 'I-save ang Kupon' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
