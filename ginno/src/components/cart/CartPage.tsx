import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  MapPin,
  Tag,
  FileText,
  Star,
  CheckCircle2,
  ChevronRight,
  PackageCheck,
  Package,
  History,
  Clock,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductTitle } from '../../utils/i18nHelpers';
import { Address, Coupon, Order, OrderItem } from '../../types';
import { CartAddressDrawer } from './CartAddressDrawer';
import { CartCouponDrawer } from './CartCouponDrawer';
import { InvoiceModal } from './InvoiceModal';
import { CartReviewModal } from './CartReviewModal';

interface CartPageProps {
  setActiveTab: (tab: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setActiveTab }) => {
  const {
    cart,
    updateCartQty,
    toggleCartSelect,
    toggleSelectAllCart,
    removeCartItem,
    clearSelectedCart,
    addresses,
    coupons,
    orders,
    language,
    t,
    openReturnPolicyModal,
    openQuickSpecModal,
    setToastNotice,
  } = useApp();

  const isZh = language === 'ZH';
  const isTl = language === 'TL';

  // Sub-tab: 'cart' or 'purchased'
  const [activeSubTab, setActiveSubTab] = useState<'cart' | 'purchased'>('cart');

  // Return policy agreement state
  const [agreedReturnPolicy, setAgreedReturnPolicy] = useState<boolean>(false);
  const [policyWarning, setPolicyWarning] = useState<boolean>(false);

  // Address selection state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    () => addresses.find((a) => a.isDefault) || addresses[0] || null
  );
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);

  // Coupon selection state
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

  // Invoice modal state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Review modal state
  const [reviewModalState, setReviewModalState] = useState<{
    orderId: string | null;
    item: OrderItem | null;
    isOpen: boolean;
  }>({
    orderId: null,
    item: null,
    isOpen: false,
  });

  // Calculate cart selected subtotal
  const selectedItems = cart.filter((i) => i.selected);
  const selectedSubtotal = selectedItems.reduce((acc, curr) => acc + curr.sku.price * curr.quantity, 0);

  const freeShippingThreshold = 999;
  const progressPct = Math.min(100, Math.round((selectedSubtotal / freeShippingThreshold) * 100));
  const isFreeShipping = selectedSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : selectedSubtotal > 0 ? 100 : 0;

  // Calculate coupon discount
  const couponDiscount = useMemo(() => {
    if (!selectedCoupon || selectedSubtotal < selectedCoupon.minOrderAmount) return 0;
    if (selectedCoupon.type === 'flat') {
      return Math.min(selectedSubtotal, selectedCoupon.value);
    } else if (selectedCoupon.type === 'percent') {
      return Math.round((selectedSubtotal * selectedCoupon.value) / 100);
    } else if (selectedCoupon.type === 'free_shipping') {
      return shippingFee;
    }
    return 0;
  }, [selectedCoupon, selectedSubtotal, shippingFee]);

  const estimatedTotal = Math.max(0, selectedSubtotal - couponDiscount + shippingFee);
  const allSelected = cart.length > 0 && cart.every((i) => i.selected);

  // Open Invoice Modal handler
  const handleOpenInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  // Open Review Modal handler
  const handleOpenReview = (orderId: string, item: OrderItem) => {
    setReviewModalState({
      orderId,
      item,
      isOpen: true,
    });
  };

  // Proceed to Checkout Handler
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) return;
    if (!agreedReturnPolicy) {
      setPolicyWarning(true);
      setToastNotice(t('cart.returnPolicyMustAgree'));
      return;
    }
    setPolicyWarning(false);
    setActiveTab('checkout');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 text-slate-100">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>{t('cart.headerTitle')}</span>
            <span className="text-xs bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 px-2.5 py-0.5 rounded-full font-bold">
              Ginno Express
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('cart.headerSubtitle')}
          </p>
        </div>

        {/* Sub-Tab Navigation Pills */}
        <div className="flex items-center bg-slate-900 border border-white/10 rounded-2xl p-1 shrink-0">
          <button
            onClick={() => setActiveSubTab('cart')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'cart'
                ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{t('cart.tabActiveCart')} ({cart.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('purchased')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'purchased'
                ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>{t('cart.tabPurchasedHistory')} ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SHOPPING CART LIST (购物车列表) */}
      {activeSubTab === 'cart' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {cart.length === 0 ? (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl">
              <div className="w-20 h-20 bg-white/10 text-[#FF8C61] border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-xl backdrop-blur-md">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">{t('cart.empty')}</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isZh
                  ? '挑选菲国最热门的高性价比数码电子、时尚潮品、限时秒杀与拼团好物！'
                  : 'Explore Ginno Philippines for top electronics, fashion, home essentials, group buy deals and live auctions!'}
              </p>
              <button
                onClick={() => setActiveTab('products')}
                className="bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all"
              >
                {t('cart.goShopping')}
              </button>
            </div>
          ) : (
            <>
              {/* Delivery Address Bar (物流地址管理) */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                        {t('cart.shippingAddress')}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                        J&T Express 1-2 Days
                      </span>
                    </div>
                    {selectedAddress ? (
                      <p className="text-xs text-slate-300 truncate">
                        <strong className="text-white font-bold">{selectedAddress.receiverName}</strong> ({selectedAddress.phone}) —{' '}
                        {selectedAddress.streetDetail}, {selectedAddress.city}, {selectedAddress.province}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-300 font-medium">
                        {t('cart.needAddress')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsAddressDrawerOpen(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-[#FF8C61] rounded-xl text-xs font-extrabold transition-all shrink-0 self-end sm:self-center"
                >
                  {t('cart.changeAddress')}
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 backdrop-blur-xl border border-emerald-500/30 text-white rounded-3xl p-4 shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    {isFreeShipping
                      ? t('cart.freeShippingUnlocked')
                      : t('cart.freeShippingNeedMore').replace('{amount}', (freeShippingThreshold - selectedSubtotal).toLocaleString())}
                  </span>
                  <span className="text-amber-300 font-mono font-black">{progressPct}%</span>
                </div>
                <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-xl border border-white/10 space-y-4">
                {/* Select All Row */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10 text-xs font-bold text-slate-300">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleSelectAllCart(e.target.checked)}
                      className="rounded text-[#FF6B35] focus:ring-[#FF6B35] bg-slate-900 border-white/20 w-4 h-4 cursor-pointer"
                    />
                    <span>{t('cart.selectAll')} ({selectedItems.length}/{cart.length})</span>
                  </label>

                  {selectedItems.length > 0 && (
                    <button
                      onClick={clearSelectedCart}
                      className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('cart.deleteSelected')}</span>
                    </button>
                  )}
                </div>

                {/* Item Rows */}
                <div className="divide-y divide-white/10">
                  {cart.map((item) => {
                    const itemSubtotal = item.sku.price * item.quantity;
                    return (
                      <div key={item.id} className="py-4 flex gap-3.5 items-center">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleCartSelect(item.id)}
                          className="rounded text-[#FF6B35] focus:ring-[#FF6B35] bg-slate-900 border-white/20 w-4 h-4 shrink-0 cursor-pointer"
                        />

                        <img
                          src={item.product.mainImage}
                          alt={getProductTitle(item.product, language)}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/10 bg-slate-950 shadow"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                            {getProductTitle(item.product, language)}
                          </h4>

                          <button
                            onClick={() => openQuickSpecModal(item.product)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-lg transition-colors"
                          >
                            <span>
                              {isZh ? '已选规格: ' : isTl ? 'Uri: ' : 'Variant: '}
                              {Object.values(item.sku.specs).join(' / ')}
                            </span>
                          </button>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm sm:text-base font-black text-[#FF8C61]">
                                ₱{item.sku.price.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                Sub: ₱{itemSubtotal.toLocaleString()}
                              </span>
                            </div>

                            {/* Qty controls */}
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-slate-900/80">
                                <button
                                  onClick={() => updateCartQty(item.id, -1)}
                                  className="p-1.5 hover:bg-white/10 text-slate-300 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-xs font-black text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQty(item.id, 1)}
                                  className="p-1.5 hover:bg-white/10 text-slate-300 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeCartItem(item.id)}
                                className="text-slate-400 hover:text-red-400 p-1.5 transition-colors rounded-xl hover:bg-white/5"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coupons & Discounts Selector Card */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-5 shadow-xl border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white block">
                      {t('cart.couponsAndDiscounts')}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {selectedCoupon
                        ? `${selectedCoupon.title} (-₱${couponDiscount.toLocaleString()})`
                        : isZh
                        ? '可点击右侧按钮选择可用优惠券'
                        : 'Select available coupon for extra savings'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCouponDrawerOpen(true)}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  {selectedCoupon ? t('cart.appliedCoupon') : t('cart.selectCoupon')}
                </button>
              </div>

              {/* 7-Day Free Return Guarantee Confirmation Checkbox (查看退换规程确认框 - 不确认不能结算) */}
              <div className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 shadow-xl ${
                policyWarning && !agreedReturnPolicy
                  ? 'bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/50 animate-pulse'
                  : agreedReturnPolicy
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-white/5 backdrop-blur-2xl border-white/10'
              }`}>
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                    <input
                      type="checkbox"
                      checked={agreedReturnPolicy}
                      onChange={(e) => {
                        setAgreedReturnPolicy(e.target.checked);
                        if (e.target.checked) setPolicyWarning(false);
                      }}
                      className="w-5 h-5 rounded text-[#FF6B35] focus:ring-[#FF6B35] bg-slate-950 border-white/30 cursor-pointer shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-extrabold text-white block leading-tight">
                        {t('cart.returnPolicyAgree')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {isZh
                          ? '受 Ginno 7 天全无理由免费退换与先行赔付保障护航'
                          : 'Protected by Ginno 7-Day Free Return & Replacement Guarantee'}
                      </span>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={openReturnPolicyModal}
                    className="text-xs font-extrabold text-[#FF8C61] hover:underline shrink-0 flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#FF8C61]" />
                    <span>{t('cart.returnPolicyViewLink')}</span>
                  </button>
                </div>

                {policyWarning && !agreedReturnPolicy && (
                  <div className="mt-3 text-xs font-bold text-amber-300 flex items-center gap-2 pt-2 border-t border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t('cart.returnPolicyMustAgree')}</span>
                  </div>
                )}
              </div>

              {/* Cart Summary & Checkout Action Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/60 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/10 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>{t('cart.selectedSubtotal')} ({selectedItems.length} {isZh ? '件商品' : 'items'}):</span>
                    <span className="text-white font-mono font-bold">₱{selectedSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{t('cart.shippingFeeLabel')}:</span>
                    <span className={isFreeShipping ? 'text-emerald-400 font-bold' : 'text-white font-mono'}>
                      {isFreeShipping ? t('cart.freeShippingLabel') : `₱${shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>{t('cart.couponDiscountLabel')}:</span>
                      <span>-₱{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white">{t('cart.grandTotal')}:</span>
                    <span className="text-2xl font-black text-[#FF8C61]">
                      ₱{estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  disabled={selectedItems.length === 0}
                  onClick={handleProceedToCheckout}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                    selectedItems.length === 0
                      ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                      : !agreedReturnPolicy
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:opacity-95 text-white shadow-amber-500/20'
                      : 'bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white shadow-purple-500/30'
                  }`}
                >
                  <span>{t('cart.checkout')}</span>
                  {!agreedReturnPolicy && selectedItems.length > 0 ? (
                    <span className="text-[10px] bg-black/40 border border-amber-300/40 text-amber-200 px-2.5 py-0.5 rounded-full font-bold ml-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-300" />
                      <span>{t('cart.returnPolicyRequiredNotice')}</span>
                    </span>
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PURCHASED ITEMS & ORDER DETAILS (已购物详情/已购记录/发票/评价) */}
      {activeSubTab === 'purchased' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {orders.length === 0 ? (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl">
              <div className="w-20 h-20 bg-white/10 text-[#FF8C61] border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-xl backdrop-blur-md">
                <History className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">
                {t('cart.noPurchasedOrders')}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {t('cart.noPurchasedOrdersDesc')}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const isPaid = order.paymentStatus === 'paid';
                const hasInvoice = !!order.invoiceInfo;

                return (
                  <div
                    key={order.id}
                    className="bg-white/5 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-xl border border-white/10 space-y-4"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="font-extrabold text-white">Order #{order.orderNo}</span>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {order.status}
                        </span>
                        {hasInvoice && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            E-Invoice Issued
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="divide-y divide-white/5 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="pt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-14 h-14 rounded-xl object-cover border border-white/10 bg-slate-950 shrink-0"
                            />
                            <div className="min-w-0 space-y-0.5">
                              <h5 className="text-xs font-bold text-white line-clamp-1">{item.productName}</h5>
                              <p className="text-[11px] text-slate-400">{item.skuSpecs} x{item.quantity}</p>
                              <span className="text-xs font-black text-[#FF8C61]">
                                ₱{item.price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Review Action (是否评论) */}
                          <div>
                            {item.isReviewed ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{t('cart.alreadyReviewed')}</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenReview(order.id, item)}
                                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#FF8C61] bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 border border-[#FF6B35]/40 px-3 py-1.5 rounded-xl transition-all shadow"
                              >
                                <Star className="w-3.5 h-3.5" />
                                <span>{t('cart.reviewItem')}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Invoice Action (开发票) */}
                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="text-slate-400">
                        <span>Paid Total: </span>
                        <strong className="text-base font-black text-[#FF8C61] ml-1">
                          ₱{order.payAmount.toLocaleString()}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenInvoice(order)}
                          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 border ${
                            hasInvoice
                              ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/40'
                              : 'bg-white/10 hover:bg-white/20 text-[#FF8C61] border-white/10'
                          }`}
                        >
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span>{hasInvoice ? t('cart.viewInvoice') : t('cart.requestInvoice')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Drawers & Modals */}
      <CartAddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
      />

      <CartCouponDrawer
        isOpen={isCouponDrawerOpen}
        onClose={() => setIsCouponDrawerOpen(false)}
        selectedCoupon={selectedCoupon}
        onSelectCoupon={setSelectedCoupon}
        selectedSubtotal={selectedSubtotal}
      />

      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      <CartReviewModal
        orderId={reviewModalState.orderId}
        item={reviewModalState.item}
        isOpen={reviewModalState.isOpen}
        onClose={() => setReviewModalState({ orderId: null, item: null, isOpen: false })}
      />
    </div>
  );
};
