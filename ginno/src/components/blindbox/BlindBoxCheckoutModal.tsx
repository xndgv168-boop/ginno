import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Package,
  RefreshCw,
  Truck,
  Wallet,
  CreditCard,
  X,
  Flame,
  ArrowRight,
  ChevronRight,
  DollarSign,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BlindBox, BlindBoxItem, UnboxingRecord } from '../../types';

interface BlindBoxCheckoutModalProps {
  box: BlindBox | null;
  onClose: () => void;
}

export const BlindBoxCheckoutModal: React.FC<BlindBoxCheckoutModalProps> = ({
  box,
  onClose,
}) => {
  const {
    openBlindBox,
    recycleUnboxedItem,
    user,
    setUser,
    addresses,
    language,
    t,
  } = useApp();

  const [step, setStep] = useState<'checkout' | 'opening' | 'result'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'Wallet' | 'GCash' | 'PayMaya'>('Wallet');
  const [selectedAddrId, setSelectedAddrId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [isOpening, setIsOpening] = useState(false);
  const [unboxedResult, setUnboxedResult] = useState<{
    prize: BlindBoxItem;
    record: UnboxingRecord;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recycleDone, setRecycleDone] = useState(false);

  useEffect(() => {
    if (box) {
      setStep('checkout');
      setIsOpening(false);
      setUnboxedResult(null);
      setErrorMsg(null);
      setRecycleDone(false);
    }
  }, [box]);

  if (!box) return null;

  const topPrize = box.items?.find((i) => i.rarity === 'SSR') || box.items?.[0];
  const selectedAddr = addresses.find((a) => a.id === selectedAddrId) || addresses[0];

  const handleConfirmCheckoutAndUnbox = () => {
    if (!user) return;

    setErrorMsg(null);

    // Auto-topup user balance if needed for simulated seamless payment
    if (user.walletBalance < box.price) {
      const needed = box.price - user.walletBalance + 500;
      setUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + needed,
      }));
    }

    setStep('opening');
    setIsOpening(true);

    // 2.2 second excitement unboxing animation
    setTimeout(() => {
      const res = openBlindBox(box.id);
      setIsOpening(false);
      if (res.success && res.prize && res.record) {
        setUnboxedResult({ prize: res.prize, record: res.record });
        setStep('result');
      } else {
        setErrorMsg(res.message || '开盒失败，请重试');
        setStep('checkout');
      }
    }, 2200);
  };

  const handleRecycleItem = () => {
    if (!unboxedResult) return;
    const res = recycleUnboxedItem(unboxedResult.record.id);
    if (res.success) {
      setRecycleDone(true);
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'SSR':
        return 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black border-amber-300';
      case 'SR':
        return 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold border-purple-300';
      default:
        return 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold border-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-600/30 border border-purple-400/40 rounded-xl text-purple-300">
              <Gift className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{language === 'ZH' ? '盲盒寻宝 · 模拟拆盒' : 'Mystery Blind Box Unboxing'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  100% WIN
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'ZH' ? '已为您锁定此专属盲盒，完成结算立即揭晓' : 'Exclusive box locked. Confirm payment to reveal prize.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: CHECKOUT PAGE & BOX LOCKED */}
          {step === 'checkout' && (
            <>
              {/* Lock Banner */}
              <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/40 border border-purple-500/30 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="font-bold text-amber-300">
                    {language === 'ZH' ? '🔒 专属盲盒已锁定保护中' : '🔒 Exclusive Box Locked'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30">
                  {language === 'ZH' ? '限时锁盒 14:59' : 'Time Left 14:59'}
                </span>
              </div>

              {/* Box Preview Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex gap-3 items-center">
                <img
                  src={box.coverImage}
                  alt={box.titleZh || box.titleEn}
                  className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0 bg-slate-950"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-purple-300 font-bold">
                    {language === 'ZH' ? '盲盒类型: 正品潮玩数码' : 'Category: Premium Tech & Toys'}
                  </div>
                  <h4 className="text-xs font-black text-white line-clamp-1 mt-0.5">
                    {box.titleZh || box.titleEn}
                  </h4>
                  {topPrize && (
                    <div className="text-[10px] text-amber-300 mt-1 flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">最高可得 SSR: {topPrize.name}</span>
                    </div>
                  )}

                  <div className="flex items-baseline space-x-2 mt-1.5">
                    <span className="text-base font-black text-[#FFD23F]">
                      ₱{box.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₱{box.originalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>{language === 'ZH' ? '收货地址 (中奖宝贝寄送)' : 'Shipping Address'}</span>
                  </span>
                  <span className="text-[10px] text-purple-400">
                    {language === 'ZH' ? '默认首选' : 'Default'}
                  </span>
                </div>
                {selectedAddr ? (
                  <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{selectedAddr.receiverName} ({selectedAddr.phone})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {selectedAddr.province}, {selectedAddr.city}, {selectedAddr.barangay}, {selectedAddr.streetDetail}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">{language === 'ZH' ? '无设置地址，将使用 Ginno 默认派送站' : 'Default Ginno Express Logistics'}</div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-[#FF8C61]" />
                  <span>{language === 'ZH' ? '支付方式 (模拟全额结算)' : 'Payment Method'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('Wallet')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'Wallet'
                        ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold flex items-center justify-between">
                      <span>{language === 'ZH' ? '钱包余额' : 'Wallet'}</span>
                      {paymentMethod === 'Wallet' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      ₱{user.walletBalance.toLocaleString()}
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('GCash')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'GCash'
                        ? 'bg-blue-600/30 border-blue-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold flex items-center justify-between">
                      <span>GCash</span>
                      {paymentMethod === 'GCash' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'ZH' ? '免手续费' : '0 Fee'}
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('PayMaya')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'PayMaya'
                        ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold flex items-center justify-between">
                      <span>Maya</span>
                      {paymentMethod === 'PayMaya' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'ZH' ? '极速确认' : 'Instant'}
                    </div>
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Confirm Pay Button */}
              <button
                onClick={handleConfirmCheckoutAndUnbox}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black py-3.5 rounded-2xl text-sm shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>
                  {language === 'ZH'
                    ? `确认支付 ₱${box.price.toLocaleString()} 并立即拆盒`
                    : `Pay ₱${box.price.toLocaleString()} & Unbox Now`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* STEP 2: OPENING ANIMATION */}
          {step === 'opening' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Glowing rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-30" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-400 animate-spin" />
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-900 via-slate-900 to-pink-900 border-2 border-amber-400 flex items-center justify-center shadow-2xl animate-bounce">
                  <Gift className="w-12 h-12 text-amber-300" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300">
                  {language === 'ZH' ? '✨ 欧气汇聚中... 正在解锁宝贝！' : '✨ Unlocking Mystery Treasure...'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'ZH' ? '已通过 Ginno 公开防篡改算法生成高阶算力随机数' : 'Verifying random hash algorithm on chain...'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 animate-pulse w-full" />
              </div>
            </div>
          )}

          {/* STEP 3: RESULT REVEALED */}
          {step === 'result' && unboxedResult && (
            <div className="space-y-4 text-center animate-fade-in">
              {/* Header Banner */}
              <div className="p-3 bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-pink-600/20 border border-amber-400/40 rounded-2xl flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="text-sm font-black text-amber-300">
                  {language === 'ZH'
                    ? `恭喜欧气爆发！抽中【${unboxedResult.prize.rarity}】爆款宝贝！`
                    : `Congratulations! Unboxed [${unboxedResult.prize.rarity}] Treasure!`}
                </span>
              </div>

              {/* Prize Image & Card */}
              <div className="bg-slate-950/80 border border-amber-400/30 rounded-3xl p-5 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[11px] px-3 py-1 rounded-full border shadow-md ${getRarityBadgeColor(
                      unboxedResult.prize.rarity
                    )}`}
                  >
                    {unboxedResult.prize.rarity} {language === 'ZH' ? '级限定' : 'Rarity'}
                  </span>
                </div>

                <img
                  src={unboxedResult.prize.image}
                  alt={unboxedResult.prize.name}
                  className="w-40 h-40 object-contain my-3 drop-shadow-[0_10px_20px_rgba(251,191,36,0.3)] animate-pulse"
                />

                <h3 className="text-base font-extrabold text-white">
                  {unboxedResult.prize.name}
                </h3>
                <p className="text-xs text-amber-400 font-bold mt-1">
                  {language === 'ZH' ? '专柜品牌估值' : 'Official Value'}: ₱{unboxedResult.prize.value.toLocaleString()}
                </p>
              </div>

              {/* Recycle / Action Section */}
              {recycleDone ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'ZH'
                      ? `已成功 8 折变现！₱${Math.floor(unboxedResult.prize.value * 0.8)} 已返还至您的钱包`
                      : `Successfully recycled! ₱${Math.floor(unboxedResult.prize.value * 0.8)} added to wallet.`}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleRecycleItem}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-bold text-amber-300 transition-all flex flex-col items-center justify-center gap-0.5"
                  >
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" />
                      {language === 'ZH' ? '8折变现回收' : '80% Cash Refund'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ₱{Math.floor(unboxedResult.prize.value * 0.8).toLocaleString()} {language === 'ZH' ? '返还钱包' : 'Returned to wallet'}
                    </span>
                  </button>

                  <button
                    onClick={onClose}
                    className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 rounded-2xl text-xs font-black text-white transition-all flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-emerald-500/20"
                  >
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      {language === 'ZH' ? '存入背包/安排发货' : 'Save to Warehouse'}
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      {language === 'ZH' ? '包邮送货上门' : 'Free Express Delivery'}
                    </span>
                  </button>
                </div>
              )}

              {/* Unbox Another */}
              <button
                onClick={() => {
                  setStep('checkout');
                  setUnboxedResult(null);
                  setRecycleDone(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <Gift className="w-4 h-4" />
                <span>{language === 'ZH' ? '🎁 欧气连抽 · 再拆一盒' : 'Unbox Another Box'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
