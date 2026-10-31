import React from 'react';
import { X, Tag, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coupon } from '../../types';

interface CartCouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoupon: Coupon | null;
  onSelectCoupon: (coupon: Coupon | null) => void;
  selectedSubtotal: number;
}

export const CartCouponDrawer: React.FC<CartCouponDrawerProps> = ({
  isOpen,
  onClose,
  selectedCoupon,
  onSelectCoupon,
  selectedSubtotal,
}) => {
  const { coupons, userCoupons, claimCoupon, language, t } = useApp();

  if (!isOpen) return null;

  const isZh = language === 'ZH';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 via-amber-950/30 to-purple-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{isZh ? '可使用的优惠券' : 'Available Coupons'}</h3>
              <p className="text-xs text-slate-400">{isZh ? '为您的订单选择最佳优惠' : 'Choose best coupon for maximum savings'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coupon List */}
        <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
          {/* No Coupon Choice */}
          <button
            onClick={() => {
              onSelectCoupon(null);
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              selectedCoupon === null
                ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF8C61] font-extrabold'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
            }`}
          >
            <span className="text-xs">{isZh ? '不使用任何优惠券' : 'Do not use coupon'}</span>
            {selectedCoupon === null && <Check className="w-4 h-4 text-[#FF8C61]" />}
          </button>

          {coupons.map((coupon) => {
            const isQualified = selectedSubtotal >= coupon.minOrderAmount;
            const isSelected = selectedCoupon?.id === coupon.id;

            return (
              <div
                key={coupon.id}
                className={`p-4 rounded-2xl border relative overflow-hidden transition-all ${
                  isQualified
                    ? isSelected
                      ? 'border-[#FF6B35] bg-[#FF6B35]/15 ring-2 ring-[#FF6B35]/30'
                      : 'border-amber-500/30 bg-amber-500/10 hover:border-amber-500/50 cursor-pointer'
                    : 'border-white/5 bg-white/5 opacity-60'
                }`}
                onClick={() => {
                  if (isQualified) {
                    onSelectCoupon(coupon);
                    onClose();
                  }
                }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-[#FF8C61]">
                        {coupon.type === 'flat'
                          ? `₱${coupon.value}`
                          : coupon.type === 'percent'
                          ? `${coupon.value}% OFF`
                          : 'FREE SHIPPING'}
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                        {coupon.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      {isZh
                        ? `满 ₱${coupon.minOrderAmount.toLocaleString()} 可使用`
                        : `Min spend ₱${coupon.minOrderAmount.toLocaleString()}`}
                    </p>
                  </div>

                  {isQualified ? (
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-[#FF6B35] text-white shadow'
                          : 'bg-white/10 hover:bg-white/20 text-[#FF8C61]'
                      }`}
                    >
                      {isSelected ? (isZh ? '已套用' : 'Applied') : (isZh ? '使用' : 'Apply')}
                    </button>
                  ) : (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/5">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {isZh
                          ? `还差 ₱${(coupon.minOrderAmount - selectedSubtotal).toLocaleString()}`
                          : `Need ₱${(coupon.minOrderAmount - selectedSubtotal).toLocaleString()} more`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
