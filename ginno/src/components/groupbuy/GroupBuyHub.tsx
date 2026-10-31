import React, { useState } from 'react';
import { Users, Flame, Clock, Share2, ArrowRight, ShieldCheck, Check, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GroupBuyTeam, Product } from '../../types';
import { getProductTitle } from '../../utils/i18nHelpers';

interface GroupBuyHubProps {
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
  setSelectedTeam: (team: GroupBuyTeam) => void;
}

export const GroupBuyHub: React.FC<GroupBuyHubProps> = ({
  setActiveTab,
  setSelectedProduct,
  setSelectedTeam,
}) => {
  const { groupActivities, groupTeams, products, startGroupBuy, addresses, language, t } = useApp();
  const [peopleFilter, setPeopleFilter] = useState<number>(0);

  const filteredTeams = groupTeams.filter((t) => {
    if (peopleFilter > 0 && t.requiredCount !== peopleFilter) return false;
    return t.status === 'forming';
  });

  const handleCopyLink = (teamNo: string) => {
    navigator.clipboard.writeText(`https://ginno.ph/group-buy?team=${teamNo}`);
    alert(`${t('groupBuy.shareLinkCopied')} (${teamNo})`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-28 text-slate-100">
      {/* Top Banner Hero */}
      <div className="bg-gradient-to-r from-[#FF6B35] via-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-white/10 backdrop-blur-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider border border-white/20">
            {t('groupBuy.heroTag')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            {t('groupBuy.heroTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            {t('groupBuy.heroSubtitle')}
          </p>
        </div>
      </div>

      {/* Step Guide */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 text-center">
          {t('groupBuy.howItWorks')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { step: '01', title: t('groupBuy.step1Title'), desc: t('groupBuy.step1Desc') },
            { step: '02', title: t('groupBuy.step2Title'), desc: t('groupBuy.step2Desc') },
            { step: '03', title: t('groupBuy.step3Title'), desc: t('groupBuy.step3Desc') },
            { step: '04', title: t('groupBuy.step4Title'), desc: t('groupBuy.step4Desc') },
          ].map((s) => (
            <div key={s.step} className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="text-base font-black text-[#FF8C61]">{s.step}</span>
              <h4 className="text-xs font-bold text-white mt-1">{s.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter by Tier */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#FF8C61]" />
          {t('groupBuy.hotTeams')}
        </h3>
        <div className="flex items-center space-x-2">
          {[0, 2, 3, 5].map((count) => (
            <button
              key={count}
              onClick={() => setPeopleFilter(count)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                peopleFilter === count
                  ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              {count === 0 ? t('groupBuy.allTiers') : `${count}${t('groupBuy.personTier')}`}
            </button>
          ))}
        </div>
      </div>

      {/* Active Group Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => {
          const prod = products.find((p) => p.id === team.productId);
          if (!prod) return null;

          const remainingPeople = team.requiredCount - team.currentCount;

          return (
            <div
              key={team.id}
              onClick={() => {
                setSelectedProduct(prod);
                setActiveTab('product-detail');
              }}
              className="bg-white/5 backdrop-blur-2xl rounded-3xl p-5 shadow-xl border border-white/10 flex gap-4 items-center hover:border-[#FF6B35]/50 transition-all cursor-pointer group"
            >
              <div className="relative w-24 h-24 shrink-0">
                <img
                  src={prod.mainImage}
                  alt={getProductTitle(prod, language)}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 px-2 py-0.5 rounded-full">
                    {team.requiredCount}{t('groupBuy.personGroup')}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t('groupBuy.rushSlot')}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1 mt-1 group-hover:text-purple-300 transition-colors">
                  {getProductTitle(prod, language)}
                </h4>

                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-lg font-black text-[#FF8C61]">
                    ₱{team.tierPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    ₱{prod.skus[0].price.toLocaleString()}
                  </span>
                </div>

                {/* Leader & Member Avatars */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={team.leaderAvatar}
                      alt={team.leaderName}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-[#FF6B35]"
                    />
                    <span className="text-xs font-semibold text-slate-300 truncate max-w-[90px]">
                      {team.leaderName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(team.teamNo);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white bg-white/10 rounded-xl transition-colors border border-white/10"
                      title="Share Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                        setSelectedTeam(team);
                        setActiveTab('group-waiting');
                      }}
                      className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow transition-all shrink-0"
                    >
                      {t('groupBuy.joinGroupDeal')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
