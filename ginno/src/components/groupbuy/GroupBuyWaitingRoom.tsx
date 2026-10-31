import React from 'react';
import { Users, Clock, Share2, CheckCircle2, Copy, Sparkles, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GroupBuyTeam, Product } from '../../types';
import { getProductTitle } from '../../utils/i18nHelpers';

interface GroupBuyWaitingRoomProps {
  team: GroupBuyTeam;
  product: Product;
  setActiveTab: (tab: string) => void;
}

export const GroupBuyWaitingRoom: React.FC<GroupBuyWaitingRoomProps> = ({
  team,
  product,
  setActiveTab,
}) => {
  const { joinGroupBuy, triggerVirtualGroupCompletion, addresses, language, t } = useApp();

  const isSuccess = team.status === 'success' || team.status === 'virtual_completed';
  const remainingSlots = Math.max(0, team.requiredCount - team.currentCount);

  const handleJoin = () => {
    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
    joinGroupBuy(team.id, product.skus[0].id, defaultAddr, 'GCash');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://ginno.ph/group-buy?team=${team.teamNo}`);
    alert(t('groupBuy.shareLinkCopied'));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      <button
        onClick={() => setActiveTab('group-buy')}
        className="flex items-center space-x-1 text-xs font-bold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('groupWaiting.back')}</span>
      </button>

      {/* Main Status Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center space-y-4">
        {isSuccess ? (
          <div className="space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">
              {t('groupWaiting.successTitle')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('groupWaiting.successDesc')} (Team {team.teamNo})
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-16 h-16 bg-orange-100 text-[#FF6B35] rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">
              {t('groupWaiting.waitingTitle')} ({remainingSlots})
            </h2>
            <p className="text-xs text-gray-500">
              {t('groupWaiting.expiresIn')} (₱{team.tierPrice.toLocaleString()})
            </p>
          </div>
        )}

        {/* Product Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 text-left border border-gray-100">
          <img src={product.mainImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{getProductTitle(product, language)}</h4>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-sm font-black text-[#FF6B35]">
                {t('groupWaiting.groupPrice')}: ₱{team.tierPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {t('groupWaiting.soloPrice')}: ₱{product.skus[0].price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            {t('groupWaiting.teamMembers')} ({team.currentCount}/{team.requiredCount})
          </h4>

          <div className="flex justify-center items-center gap-4">
            {team.members.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={m.avatar}
                    alt={m.nickname}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF6B35]"
                  />
                  {m.isLeader && (
                    <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[8px] font-black px-1 rounded-full">
                      {t('groupWaiting.leader')}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-700 mt-1">{m.nickname}</span>
              </div>
            ))}

            {Array.from({ length: remainingSlots }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50">
                  ?
                </div>
                <span className="text-[10px] text-gray-400 mt-1">{t('groupWaiting.waitingSlot')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {!isSuccess && (
          <div className="pt-4 space-y-3">
            <button
              onClick={handleCopyLink}
              className="w-full bg-[#FF6B35] hover:bg-[#e05a2b] text-white font-extrabold py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('groupWaiting.shareInvite')}</span>
            </button>

            <button
              onClick={handleJoin}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-2xl text-xs transition-colors"
            >
              {t('groupWaiting.joinTeamNow')} (₱{team.tierPrice})
            </button>

            {/* Virtual completion demo trigger */}
            <div className="pt-2">
              <button
                onClick={() => triggerVirtualGroupCompletion(team.id)}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('groupWaiting.demoTrigger')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
