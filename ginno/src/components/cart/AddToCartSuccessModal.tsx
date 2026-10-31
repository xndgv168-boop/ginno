import React from 'react';
import { ShoppingCart, CheckCircle2, X, ArrowRight, ShoppingBag, ChevronRight, PackageCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductTitle } from '../../utils/i18nHelpers';

export const AddToCartSuccessModal: React.FC = () => {
  const {
    showCartSuccessDrawer,
    setShowCartSuccessDrawer,
    lastAddedCartItem,
    cart,
    setActiveTab,
    language,
    t,
  } = useApp();

  if (!showCartSuccessDrawer || !lastAddedCartItem) return null;

  const { product, sku, quantity } = lastAddedCartItem;
  const isZh = language === 'ZH';
  const isTl = language === 'TL';

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.sku.price * item.quantity, 0);

  const specLabel = Object.values(sku.specs).join(' / ') || (isZh ? '默认规格' : 'Default Spec');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-purple-950/60 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span>{t('cart.addSuccessTitle')}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                  ✓ Success
                </span>
              </h3>
              <p className="text-xs text-slate-400">{t('cart.addSuccessDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCartSuccessDrawer(false)}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Added Product Preview */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center gap-3.5">
            <img
              src={product.mainImage}
              alt={getProductTitle(product, language)}
              referrerPolicy="no-referrer"
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0 bg-slate-950"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                {getProductTitle(product, language)}
              </h4>
              <div className="inline-flex items-center gap-1 text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-white/10">
                <PackageCheck className="w-3 h-3 text-[#FF8C61]" />
                <span className="truncate">{specLabel}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs font-bold text-[#FF8C61]">
                  ₱{sku.price.toLocaleString()} <span className="text-slate-400 font-normal">x {quantity}</span>
                </div>
                <div className="text-xs font-black text-white">
                  ₱{(sku.price * quantity).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Status Banner */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <ShoppingCart className="w-4 h-4 text-[#FF8C61]" />
              <span>
                {isZh
                  ? `购物车共有 ${totalCartCount} 件商品`
                  : isTl
                  ? `May ${totalCartCount} na item sa cart`
                  : `${totalCartCount} item(s) in your cart`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">{isZh ? '小计金额' : 'Subtotal'}</span>
              <span className="text-sm font-black text-[#FF8C61]">₱{totalCartAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setShowCartSuccessDrawer(false)}
            className="w-full sm:flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-slate-200 font-bold rounded-2xl text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('cart.continueBrowsing')}</span>
          </button>
          <button
            onClick={() => {
              setShowCartSuccessDrawer(false);
              setActiveTab('cart');
            }}
            className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('cart.viewCartAndCheckout')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
