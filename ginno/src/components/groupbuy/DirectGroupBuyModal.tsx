import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Wallet,
  X,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GroupBuyTeam, Product } from '../../types';
import { getProductTitle } from '../../utils/i18nHelpers';

interface DirectGroupBuyModalProps {
  team: GroupBuyTeam | null;
  product: Product | null;
  onClose: () => void;
  onSuccess: (team: GroupBuyTeam, product: Product) => void;
}

export const DirectGroupBuyModal: React.FC<DirectGroupBuyModalProps> = ({
  team,
  product,
  onClose,
  onSuccess,
}) => {
  const { joinGroupBuy, addresses, user, language, t } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Wallet' | 'PayMaya'>('GCash');
  const [selectedAddrId, setSelectedAddrId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!team || !product) return null;

  const selectedAddr = addresses.find((a) => a.id === selectedAddrId) || addresses[0];
  const sku = product.skus[0];
  const savings = sku ? sku.price - team.tierPrice : 0;

  const handleConfirmGroupBuy = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const defaultAddr = selectedAddr || {
        id: 'default_addr',
        receiverName: user.nickname,
        phone: user.phone,
        province: 'Metro Manila',
        city: 'Quezon City',
        barangay: 'Central',
        streetDetail: 'Ginno Express Logistics Station',
        zipCode: '1100',
        isDefault: true,
      };

      const result = joinGroupBuy(team.id, sku.id, defaultAddr, paymentMethod);
      setIsSubmitting(false);

      if (result && result.team) {
        onSuccess(result.team, product);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-[#FF6B35]/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6B35]/30 via-slate-900 to-purple-900/40 p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#FF6B35]/20 border border-[#FF6B35]/40 rounded-xl text-[#FF8C61]">
              <Users className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{language === 'ZH' ? '🔥 全民拼团 · 极速成团' : 'Direct Group Buy'}</span>
                <span className="text-[10px] bg-[#FF6B35] text-white px-2 py-0.5 rounded-full font-bold">
                  SAMA-SAMA
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'ZH' ? '跳过详情页，直接完成拼团与极速配货' : 'Skip detail page, directly complete group buy'}
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
          {/* Team Info Banner */}
          {(() => {
            const requiredCount = Math.max(2, team.requiredCount || 3);
            const displayMembers = team.members.slice(0, requiredCount - 1);
            const neededCount = Math.max(1, requiredCount - displayMembers.length);

            return (
              <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-slate-900/30 border border-purple-500/30 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center -space-x-2">
                    {displayMembers.map((m, idx) => (
                      <img
                        key={idx}
                        src={m.avatar}
                        alt={m.nickname}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                        }}
                        className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover"
                      />
                    ))}
                    <div className="w-7 h-7 rounded-full bg-[#FF6B35]/20 text-[#FF8C61] text-[10px] font-black flex items-center justify-center border-2 border-slate-900">
                      +{neededCount}
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white">
                      {language === 'ZH' ? `还差 ${neededCount} 人拼成` : `Need ${neededCount} member(s)`}
                    </span>
                    <span className="text-[10px] text-purple-300 block">
                      {language === 'ZH' ? '已有成员期待您加入' : 'Join team now'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#FF8C61] bg-[#FF6B35]/20 border border-[#FF6B35]/30 px-2.5 py-1 rounded-xl">
                  {requiredCount}人拼团
                </span>
              </div>
            );
          })()}

          {/* Product Info Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex gap-3 items-center">
            <img
              src={product.mainImage}
              alt={getProductTitle(product, language)}
              className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0 bg-slate-950"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-white line-clamp-2">
                {getProductTitle(product, language)}
              </h4>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {sku?.titleZh || sku?.titleEn || '标准规格'}
              </div>

              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-base font-black text-[#FF8C61]">
                  ₱{team.tierPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 line-through">
                  ₱{sku?.price.toLocaleString()}
                </span>
                {savings > 0 && (
                  <span className="text-[10px] bg-[#FF6B35] text-white px-1.5 py-0.2 rounded font-extrabold">
                    {language === 'ZH' ? `立省 ₱${savings}` : `Save ₱${savings}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>{language === 'ZH' ? '收货地址' : 'Shipping Address'}</span>
              </span>
            </div>
            {selectedAddr ? (
              <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <div className="font-bold text-white">
                  {selectedAddr.receiverName} ({selectedAddr.phone})
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {selectedAddr.province}, {selectedAddr.city}, {selectedAddr.barangay}, {selectedAddr.streetDetail}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Ginno Express Logistics</div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#FF8C61]" />
              <span>{language === 'ZH' ? '选择支付方式' : 'Payment Method'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
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
                  {language === 'ZH' ? '推荐支付' : 'Popular'}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  paymentMethod === 'Wallet'
                    ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold flex items-center justify-between">
                  <span>{language === 'ZH' ? '钱包' : 'Wallet'}</span>
                  {paymentMethod === 'Wallet' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  ₱{user.walletBalance.toLocaleString()}
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
                  {language === 'ZH' ? '极速' : 'Instant'}
                </div>
              </button>
            </div>
          </div>

          {/* Direct Buy Button */}
          <button
            disabled={isSubmitting}
            onClick={handleConfirmGroupBuy}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black py-3.5 rounded-2xl text-sm shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>{language === 'ZH' ? '正在生成拼团订单...' : 'Joining Group Buy...'}</span>
            ) : (
              <>
                <Users className="w-4 h-4 text-white" />
                <span>
                  {language === 'ZH'
                    ? `支付 ₱${team.tierPrice.toLocaleString()} 确认直接拼团`
                    : `Pay ₱${team.tierPrice.toLocaleString()} & Complete Group Buy`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
