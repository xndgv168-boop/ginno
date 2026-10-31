import React, { useEffect } from 'react';
import { ShoppingCart, CheckCircle2, Info, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastNotification: React.FC = () => {
  const { toastNotice, setToastNotice, setActiveTab, t } = useApp();

  useEffect(() => {
    if (toastNotice) {
      const timer = setTimeout(() => {
        setToastNotice(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotice, setToastNotice]);

  if (!toastNotice) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-slate-900/95 border border-emerald-500/40 text-slate-100 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
        <ShoppingCart className="w-5 h-5 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
          <span>{toastNotice.message}</span>
        </h4>
        {toastNotice.submessage && (
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{toastNotice.submessage}</p>
        )}
        <button
          onClick={() => {
            setToastNotice(null);
            setActiveTab('cart');
          }}
          className="mt-2 text-[11px] font-extrabold text-[#FF8C61] hover:text-[#FF6B35] inline-flex items-center gap-1 transition-colors"
        >
          <span>{t('cart.viewCartAndCheckout')}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <button
        onClick={() => setToastNotice(null)}
        className="p-1 text-slate-400 hover:text-white rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
