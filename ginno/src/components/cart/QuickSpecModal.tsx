import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart, Zap, Check, ShieldCheck, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductSku } from '../../types';
import { getProductTitle } from '../../utils/i18nHelpers';

export const QuickSpecModal: React.FC = () => {
  const {
    showQuickSpecModal,
    setShowQuickSpecModal,
    quickSpecProduct,
    addToCart,
    setActiveTab,
    language,
    t,
  } = useApp();

  const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (quickSpecProduct && quickSpecProduct.skus.length > 0) {
      setSelectedSku(quickSpecProduct.skus[0]);
      setQuantity(1);
    }
  }, [quickSpecProduct]);

  if (!showQuickSpecModal || !quickSpecProduct || !selectedSku) return null;

  const isZh = language === 'ZH';
  const isTl = language === 'TL';

  const currentPrice =
    quickSpecProduct.isFlashSale && quickSpecProduct.flashSalePrice
      ? quickSpecProduct.flashSalePrice
      : selectedSku.price;

  const handleConfirmAdd = () => {
    addToCart(quickSpecProduct, selectedSku.id, quantity);
    setShowQuickSpecModal(false);
  };

  const handleBuyNow = () => {
    addToCart(quickSpecProduct, selectedSku.id, quantity, false);
    setShowQuickSpecModal(false);
    setActiveTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between relative bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40">
          <div className="flex gap-3.5 items-center">
            <img
              src={quickSpecProduct.mainImage}
              alt={getProductTitle(quickSpecProduct, language)}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border border-white/10 bg-slate-950 shrink-0 shadow-md"
            />
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                {getProductTitle(quickSpecProduct, language)}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-[#FF8C61]">
                  ₱{currentPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 line-through">
                  ₱{selectedSku.originalPrice.toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {isZh ? `库存剩余 ${selectedSku.stock} 件` : `Stock: ${selectedSku.stock}`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowQuickSpecModal(false)}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spec Options & Quantity */}
        <div className="p-4 sm:p-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Spec List */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
              {t('cart.quickSpecTitle')}
            </label>
            <div className="flex flex-wrap gap-2">
              {quickSpecProduct.skus.map((sku) => {
                const label = Object.values(sku.specs).join(' / ');
                const isSelected = selectedSku.id === sku.id;
                return (
                  <button
                    key={sku.id}
                    onClick={() => setSelectedSku(sku)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF8C61] ring-2 ring-[#FF6B35]/30 shadow-md'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FF8C61]" />}
                    <span>{label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (₱{sku.price.toLocaleString()})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-slate-300">
              {language === 'ZH' ? '购买数量' : language === 'TL' ? 'Dami' : 'Quantity'}
            </span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white/10 text-slate-300 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-black text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedSku.stock, quantity + 1))}
                  className="p-2 hover:bg-white/10 text-slate-300 transition-colors"
                  disabled={quantity >= selectedSku.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Total Preview */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{isZh ? '合计计算：' : 'Subtotal:'}</span>
            <span className="text-base font-black text-[#FF8C61]">
              ₱{(currentPrice * quantity).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-white/10 flex items-center gap-3">
          <button
            onClick={handleConfirmAdd}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-[#FF8C61] border border-white/10 font-extrabold rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('cart.confirmAddToCart')}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
            <span>
              {quickSpecProduct.isFlashSale && quickSpecProduct.flashSalePrice
                ? (language === 'ZH' ? '⚡ 立即秒杀' : language === 'TL' ? '⚡ Mabilisang Bili' : '⚡ Flash Buy')
                : (language === 'ZH' ? '立即购买' : language === 'TL' ? 'Bumili Agad' : 'Buy Now')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
