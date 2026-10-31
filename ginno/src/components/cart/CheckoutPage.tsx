import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Ticket,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Address, PaymentMethod } from '../../types';
import { getProductTitle } from '../../utils/i18nHelpers';

interface CheckoutPageProps {
  setActiveTab: (tab: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setActiveTab }) => {
  const {
    cart,
    addresses,
    addAddress,
    createOrder,
    clearSelectedCart,
    userCoupons,
    language,
    openReturnPolicyModal,
  } = useApp();

  const selectedCartItems = cart.filter((i) => i.selected);

  const [selectedAddrId, setSelectedAddrId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('GCash');
  const [carrier, setCarrier] = useState<'J&T Express' | 'LBC Express' | 'Ninja Van'>('J&T Express');
  const [appliedCouponId, setAppliedCouponId] = useState<string>('');

  // Address Modal state
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    receiverName: 'Juan Dela Cruz',
    phone: '+63 917 888 9999',
    province: 'Metro Manila',
    city: 'Makati City',
    barangay: 'San Lorenzo',
    streetDetail: 'Unit 502 Tower A',
    zipCode: '1223',
    isDefault: true,
  });

  const selectedAddress = addresses.find((a) => a.id === selectedAddrId) || addresses[0];

  const subtotal = selectedCartItems.reduce((acc, curr) => acc + curr.sku.price * curr.quantity, 0);
  const shippingFee = subtotal >= 999 ? 0 : 80;

  const activeCoupon = userCoupons.find((uc) => uc.couponId === appliedCouponId && uc.status === 'unused');
  const discountAmount = activeCoupon ? activeCoupon.value : 0;

  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert(
        language === 'ZH'
          ? '请选择或添加收货地址'
          : language === 'TL'
          ? 'Pumili o magdagdag ng address sa pagpapadala'
          : 'Please select or add a shipping address'
      );
      return;
    }

    const items = selectedCartItems.map((c) => ({
      product: c.product,
      skuId: c.skuId,
      quantity: c.quantity,
    }));

    createOrder({
      type: 'normal',
      items,
      address: selectedAddress,
      paymentMethod,
      couponId: appliedCouponId,
      shippingFee,
      discountAmount,
    });

    clearSelectedCart();
    setActiveTab('orders');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddr);
    setShowAddrModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 text-slate-100">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('cart')}
          className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-black text-white">
          {language === 'ZH' ? '订单结算' : language === 'TL' ? 'Checkout ng Order' : 'Order Checkout'}
        </h2>
      </div>

      {/* 1. Address Selection */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF8C61]" />
            {language === 'ZH' ? '收货地址 (菲律宾)' : language === 'TL' ? 'Address sa Pagpapadala (Pilipinas)' : 'Shipping Address (Philippines)'}
          </h3>
          <button
            onClick={() => setShowAddrModal(true)}
            className="text-xs font-bold text-[#FF8C61] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {language === 'ZH' ? '添加新地址' : language === 'TL' ? 'Magdagdag ng Address' : 'Add New Address'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedAddrId(addr.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAddrId === addr.id
                  ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-white shadow-md'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-white">{addr.receiverName}</span>
                {addr.isDefault && (
                  <span className="bg-[#FF6B35] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow">
                    {language === 'ZH' ? '默认' : 'DEFAULT'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">{addr.phone}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {addr.streetDetail}, {addr.barangay}, {addr.city}, {addr.province} {addr.zipCode}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Order Items Review */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 space-y-3">
        <h3 className="text-sm font-black text-white">
          {language === 'ZH' ? '订单商品清单' : language === 'TL' ? 'Mga Item sa Order' : 'Order Items'}
        </h3>
        <div className="divide-y divide-white/10">
          {selectedCartItems.map((c) => (
            <div key={c.id} className="py-3 flex gap-3 items-center">
              <img src={c.product.mainImage} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-200">{getProductTitle(c.product, language)}</h4>
                <p className="text-[10px] text-slate-400">
                  {language === 'ZH' ? `数量: ${c.quantity}` : language === 'TL' ? `Dami: ${c.quantity}` : `Qty: ${c.quantity}`}
                </p>
              </div>
              <span className="text-xs font-black text-[#FF8C61]">
                ₱{(c.sku.price * c.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Logistics Carrier */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 space-y-3">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#FF8C61]" />
          {language === 'ZH' ? '物流快递服务' : language === 'TL' ? 'Koreor ng Logistika' : 'Logistics Courier'}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              name: 'J&T Express',
              desc: language === 'ZH' ? '全国极速 (1-2 天)' : language === 'TL' ? 'Mabilis Buong Bansa (1-2 Araw)' : 'Fast Nationwide (1-2 Days)',
            },
            {
              name: 'LBC Express',
              desc: language === 'ZH' ? '全国送货上门' : language === 'TL' ? 'Pinto sa Pinto Buong Bansa' : 'Door to Door Nationwide',
            },
            {
              name: 'Ninja Van',
              desc: language === 'ZH' ? '电商标准配送' : language === 'TL' ? 'Standard ng E-Commerce' : 'E-commerce Standard',
            },
          ].map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setCarrier(c.name as any)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                carrier === c.name
                  ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF8C61]'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              <span className="block font-bold text-xs">{c.name}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">{c.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Payment Method */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 space-y-3">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#FF8C61]" />
          {language === 'ZH' ? '支付方式' : language === 'TL' ? 'Paraan ng Pagbabayad' : 'Payment Gateway'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              id: 'GCash',
              label: language === 'ZH' ? 'GCash 钱包' : 'GCash (Popular)',
              badge: language === 'ZH' ? '热门推荐' : language === 'TL' ? 'INIREKOMENDA' : 'RECOMMENDED',
            },
            { id: 'Maya', label: 'Maya / PayMaya' },
            {
              id: 'COD',
              label: language === 'ZH' ? 'COD (货到付款)' : language === 'TL' ? 'COD (Bayad sa Pagpapadala)' : 'COD (Cash on Delivery)',
            },
            {
              id: 'Card',
              label: language === 'ZH' ? '信用卡 / 借记卡' : language === 'TL' ? 'Kard ng Krimen / Debit' : 'Credit/Debit Card',
            },
          ].map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id as any)}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                paymentMethod === pm.id
                  ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF8C61]'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              {pm.badge && (
                <span className="absolute -top-1 right-2 bg-[#06D6A0] text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded shadow">
                  {pm.badge}
                </span>
              )}
              <span className="block font-extrabold text-xs">{pm.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Vouchers Selection */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 space-y-2">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Ticket className="w-4 h-4 text-[#FF8C61]" />
          {language === 'ZH' ? '使用优惠券' : language === 'TL' ? 'Gamitin ang Voucher' : 'Apply Voucher'}
        </h3>
        <select
          value={appliedCouponId}
          onChange={(e) => setAppliedCouponId(e.target.value)}
          className="w-full bg-slate-900 border border-white/10 text-slate-200 text-xs font-bold rounded-xl p-3 focus:ring-2 focus:ring-[#FF6B35] outline-none"
        >
          <option value="">
            {language === 'ZH' ? '暂不使用优惠券' : language === 'TL' ? 'Walang Napiling Voucher' : 'No Voucher Selected'}
          </option>
          {userCoupons.map((uc) => (
            <option key={uc.id} value={uc.couponId}>
              {uc.title} (-₱{uc.value})
            </option>
          ))}
        </select>
      </div>

      {/* 6. Total Summary & Place Order */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 space-y-3">
        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>{language === 'ZH' ? '商品小计:' : language === 'TL' ? 'Subtotal:' : 'Subtotal:'}</span>
            <span className="font-bold text-white">₱{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>
              {language === 'ZH'
                ? `预估运费 (${carrier}):`
                : language === 'TL'
                ? `Bayad sa Pagpapadala (${carrier}):`
                : `Shipping Fee (${carrier}):`}
            </span>
            <span className="font-bold text-white">₱{shippingFee}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>
                {language === 'ZH' ? '优惠券折扣:' : language === 'TL' ? 'Diskwento sa Voucher:' : 'Voucher Discount:'}
              </span>
              <span>-₱{discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-[#FF8C61] pt-2 border-t border-white/10">
            <span>{language === 'ZH' ? '应付总额:' : language === 'TL' ? 'Pangkalahatang Kabuuan:' : 'Grand Total:'}</span>
            <span>₱{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-extrabold py-4 rounded-2xl text-base shadow-xl shadow-purple-500/20 transition-all"
        >
          {language === 'ZH'
            ? `提交订单 ₱${grandTotal.toLocaleString()}`
            : language === 'TL'
            ? `I-place ang Order ₱${grandTotal.toLocaleString()}`
            : `Place Order ₱${grandTotal.toLocaleString()}`}
        </button>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
          <button
            type="button"
            onClick={openReturnPolicyModal}
            className="inline-flex items-center gap-1.5 hover:text-[#FF8C61] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF8C61]" />
            <span>
              {language === 'ZH'
                ? '7天无理由退换（点击查看细则）'
                : language === 'TL'
                ? '7-Araw Libreng Return Guarantee'
                : '7-Day Free Returns Guarantee'}
            </span>
          </button>
        </div>
      </div>

      {/* New Address Modal */}
      {showAddrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 text-slate-100 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">
              {language === 'ZH' ? '添加菲律宾收货地址' : language === 'TL' ? 'Magdagdag ng Address sa Pilipinas' : 'Add Philippines Address'}
            </h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder={language === 'ZH' ? '收货人姓名' : 'Receiver Name'}
                value={newAddr.receiverName}
                onChange={(e) => setNewAddr({ ...newAddr, receiverName: e.target.value })}
                className="w-full bg-slate-800/80 border border-white/10 text-slate-100 p-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder={language === 'ZH' ? '手机号码 (+63 9xx xxx xxxx)' : 'Phone (+63 9xx xxx xxxx)'}
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full bg-slate-800/80 border border-white/10 text-slate-100 p-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={language === 'ZH' ? '省份 (Province)' : 'Province'}
                  value={newAddr.province}
                  onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })}
                  className="bg-slate-800/80 border border-white/10 text-slate-100 p-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder={language === 'ZH' ? '城市/市 (City)' : 'City / Municipality'}
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="bg-slate-800/80 border border-white/10 text-slate-100 p-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder={language === 'ZH' ? '街区/社区 (Barangay)' : 'Barangay'}
                value={newAddr.barangay}
                onChange={(e) => setNewAddr({ ...newAddr, barangay: e.target.value })}
                className="w-full bg-slate-800/80 border border-white/10 text-slate-100 p-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder={language === 'ZH' ? '详细地址 (门牌号/街道)' : 'Street / Unit / House #'}
                value={newAddr.streetDetail}
                onChange={(e) => setNewAddr({ ...newAddr, streetDetail: e.target.value })}
                className="w-full bg-slate-800/80 border border-white/10 text-slate-100 p-2.5 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddrModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-slate-300 font-bold py-2.5 rounded-xl transition-colors"
                >
                  {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white font-bold py-2.5 rounded-xl shadow transition-all"
                >
                  {language === 'ZH' ? '保存地址' : language === 'TL' ? 'I-save ang Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

