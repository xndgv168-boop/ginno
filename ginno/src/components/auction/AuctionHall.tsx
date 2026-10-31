import React, { useState } from 'react';
import { Gavel, Clock, Flame, ShieldAlert, ChevronRight, Eye, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuctionItem, Product } from '../../types';
import { getProductTitle } from '../../utils/i18nHelpers';

interface AuctionHallProps {
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
  setSelectedAuction: (auction: AuctionItem) => void;
}

export const AuctionHall: React.FC<AuctionHallProps> = ({
  setActiveTab,
  setSelectedProduct,
  setSelectedAuction,
}) => {
  const { auctions, auctionPool, watchAuctionPool, products, language, t } = useApp();
  const [activeTab, setActiveTabTab] = useState<'live' | 'upcoming' | 'ended' | 'pool'>('live');

  const filteredAuctions = auctions.filter((a) => {
    if (activeTab === 'live') return a.status === 'live';
    if (activeTab === 'upcoming') return a.status === 'upcoming';
    if (activeTab === 'ended') return a.status === 'ended' || a.status === 'no_sale';
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-28 text-slate-100">
      {/* Top Banner Hero with Visual Feature Introduction */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-purple-950/90 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-purple-500/30 backdrop-blur-2xl">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Rule Badges */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 font-extrabold text-xs px-3.5 py-1 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>
                {t('auction.heroTag')} ·{' '}
                {language === 'ZH'
                  ? '实时透明公开竞拍'
                  : language === 'TL'
                  ? 'Maliwanag at Patas na Subasta'
                  : 'Transparent Real-Time Bidding'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
              {t('auction.heroTitle')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('auction.heroSubtitle')}
            </p>

            {/* Visual Process Flow Cards (图形化竞拍流程) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center space-y-1">
                <div className="text-xl">📱</div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH' ? '1. 看样选品' : language === 'TL' ? '1. Pumili ng Item' : '1. Select Items'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH' ? '大牌正品列队' : language === 'TL' ? '100% Orihinal' : 'Verified Brands'}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center space-y-1">
                <div className="text-xl">🔨</div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH' ? '2. 实时出价' : language === 'TL' ? '2. Mag-alok na' : '2. Place Bids'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH' ? '低门槛透明加价' : language === 'TL' ? 'Mababang Panimula' : 'Low Increments'}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center space-y-1">
                <div className="text-xl">⏳</div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH' ? '3. 尾秒延时' : language === 'TL' ? '3. Anti-Snipe' : '3. Anti-Snipe'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH' ? '防踩狗公平竞争' : language === 'TL' ? 'Patas para sa Lahat' : 'Fair Extensions'}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center space-y-1">
                <div className="text-xl">📦</div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH' ? '4. 闪电发货' : language === 'TL' ? '4. Mabilis Ipadala' : '4. Fast Shipping'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH' ? '24h中拍包邮交割' : language === 'TL' ? 'Libreng Pagpapadala' : '24h Free Delivery'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Collage Showcase */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"
                alt="Watch6"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 bg-slate-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                {language === 'ZH' ? '🔴 热拍中 ₱12,500' : language === 'TL' ? '🔴 LIVE ₱12,500' : '🔴 LIVE ₱12,500'}
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80"
                alt="PS5 Slim"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 bg-slate-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                {language === 'ZH' ? '🔴 热拍中 ₱19,800' : language === 'TL' ? '🔴 LIVE ₱19,800' : '🔴 LIVE ₱19,800'}
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80"
                alt="iPhone 15 Pro"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 bg-slate-950/90 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                {language === 'ZH' ? '⏰ 待开始 ₱38,000' : language === 'TL' ? '⏰ UPCOMING ₱38,000' : '⏰ UPCOMING ₱38,000'}
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80"
                alt="iPad Air"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 left-2 bg-slate-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                {language === 'ZH' ? '🔴 热拍中 ₱28,500' : language === 'TL' ? '🔴 LIVE ₱28,500' : '🔴 LIVE ₱28,500'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-white/10 gap-6 text-xs font-black text-slate-400">
        {[
          { id: 'live', label: t('auction.tabLive') },
          { id: 'upcoming', label: t('auction.tabUpcoming') },
          { id: 'ended', label: t('auction.tabEnded') },
          { id: 'pool', label: t('auction.tabPool') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabTab(tab.id as any)}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#FF6B35] text-[#FF8C61]'
                : 'border-transparent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live / Upcoming / Ended List */}
      {activeTab !== 'pool' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.length === 0 ? (
            <div className="col-span-full bg-slate-900/60 p-12 rounded-3xl text-center border border-white/10 space-y-3">
              <Gavel className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-slate-400">
                {activeTab === 'live' &&
                  (language === 'ZH'
                    ? '暂无正在进行的竞拍活动'
                    : language === 'TL'
                    ? 'Walang kasalukuyang nagpe-peke na subasta'
                    : 'No live auctions currently running')}
                {activeTab === 'upcoming' &&
                  (language === 'ZH'
                    ? '暂无待开始的竞拍活动'
                    : language === 'TL'
                    ? 'Walang darating na subasta'
                    : 'No upcoming auctions scheduled')}
                {activeTab === 'ended' &&
                  (language === 'ZH'
                    ? '暂无已结束的竞拍记录'
                    : language === 'TL'
                    ? 'Walang natapos na subasta'
                    : 'No ended auction records')}
              </p>
            </div>
          ) : (
            filteredAuctions.map((auc) => {
              const prod = products.find((p) => p.id === auc.productId);
              const title = prod ? getProductTitle(prod, language) : auc.title;
              const isLive = auc.status === 'live';
              const isUpcoming = auc.status === 'upcoming';

              return (
                <div
                  key={auc.id}
                  onClick={() => {
                    if (prod) setSelectedProduct(prod);
                    setSelectedAuction(auc);
                    setActiveTab('auction-detail');
                  }}
                  className="bg-white/5 backdrop-blur-2xl rounded-3xl p-5 shadow-xl border border-white/10 hover:border-purple-500/60 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10 bg-slate-950">
                      <img
                        src={auc.mainImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isLive && (
                        <span className="absolute top-2.5 left-2.5 bg-red-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center gap-1.5 border border-white/20">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          {language === 'ZH' ? '🔴 LIVE 正在竞拍' : language === 'TL' ? '🔴 LIVE Nagpe-peke' : '🔴 LIVE Bidding'}
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="absolute top-2.5 left-2.5 bg-amber-500/90 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3 h-3 text-slate-950" />
                          {language === 'ZH' ? '⏰ 待开始 UPCOMING' : language === 'TL' ? '⏰ Magsisimula UPCOMING' : '⏰ UPCOMING'}
                        </span>
                      )}
                      {!isLive && !isUpcoming && (
                        <span className="absolute top-2.5 left-2.5 bg-slate-800/90 text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                          {language === 'ZH' ? '已结束' : language === 'TL' ? 'Tapos Na' : 'Ended'}
                        </span>
                      )}

                      <span className="absolute bottom-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                        {isLive
                          ? language === 'ZH'
                            ? `🔥 ${auc.totalBids} 次出价`
                            : language === 'TL'
                            ? `🔥 ${auc.totalBids} Alok`
                            : `🔥 ${auc.totalBids} Bids`
                          : language === 'ZH'
                          ? `起拍价 ₱${auc.startingBid.toLocaleString()}`
                          : language === 'TL'
                          ? `Panimula ₱${auc.startingBid.toLocaleString()}`
                          : `Start ₱${auc.startingBid.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                        {title}
                      </h4>

                      {/* Pricing Block */}
                      <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10">
                        {isLive ? (
                          <>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                              <span>
                                {language === 'ZH'
                                  ? '当前最高出价'
                                  : language === 'TL'
                                  ? 'Kasalukuyang Mataas'
                                  : 'Current Highest Bid'}
                              </span>
                              <span>
                                {language === 'ZH' ? '起拍价:' : language === 'TL' ? 'Panimula:' : 'Start:'} ₱
                                {auc.startingBid.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xl font-black text-[#FFD23F] animate-pulse">
                              ₱{auc.currentHighestBid.toLocaleString()}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                              <span>
                                {language === 'ZH'
                                  ? '开拍设定起拍价'
                                  : language === 'TL'
                                  ? 'Panimulang Halaga'
                                  : 'Starting Bid Price'}
                              </span>
                              <span className="text-amber-400 font-bold">
                                {language === 'ZH' ? '加价幅度:' : language === 'TL' ? 'Karagdagang Alok:' : 'Min Increment:'} +₱
                                {auc.bidIncrement}
                              </span>
                            </div>
                            <div className="text-xl font-black text-amber-300">
                              ₱{auc.startingBid.toLocaleString()}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Info & Action */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs gap-2">
                    <div className="text-slate-400 text-[11px] truncate">
                      {isLive ? (
                        <>
                          {language === 'ZH' ? '买家: ' : language === 'TL' ? 'Mambibili: ' : 'Bidder: '}
                          <strong className="text-white">
                            {auc.currentHighestBidderName ||
                              (language === 'ZH'
                                ? '起拍价出价'
                                : language === 'TL'
                                ? 'Panimulang Alok'
                                : 'Starting Bid')}
                          </strong>
                        </>
                      ) : (
                        <span className="text-amber-300 font-medium">
                          🕒 {language === 'ZH' ? '开拍时间: ' : language === 'TL' ? 'Magsisimula: ' : 'Starts: '}
                          {new Date(auc.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (prod) setSelectedProduct(prod);
                        setSelectedAuction(auc);
                        setActiveTab('auction-detail');
                      }}
                      className={`font-black px-4 py-2 rounded-xl shadow transition-all text-xs shrink-0 flex items-center gap-1 ${
                        isLive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isLive ? (
                        <>
                          <span>🔨 {language === 'ZH' ? '立即竞拍' : language === 'TL' ? 'Mag-alok Na' : 'Bid Now'}</span>
                        </>
                      ) : (
                        <>
                          <span>⏰ {language === 'ZH' ? '关注开拍' : language === 'TL' ? 'Paalala' : 'Remind Me'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Auction Pool (流拍池) */
        <div className="space-y-4">
          <div className="bg-amber-500/10 backdrop-blur-md rounded-2xl p-4 border border-amber-500/30 text-xs text-amber-200 space-y-1">
            <h4 className="font-extrabold flex items-center gap-1.5 text-amber-400">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              {t('auction.poolWhat')}
            </h4>
            <p className="text-amber-200/90">
              {t('auction.poolDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auctionPool.map((item) => {
              const prod = products.find((p) => p.id === item.productId);
              return (
                <div key={item.id} className="bg-white/5 backdrop-blur-2xl rounded-3xl p-5 shadow-xl border border-white/10 flex gap-4 items-center">
                  <img src={prod?.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-white/10 text-slate-300 font-bold px-2 py-0.5 rounded-full border border-white/10">
                      {t('auction.awaitingReauction')} ({item.poolCount}x Pool)
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                      {prod ? getProductTitle(prod, language) : 'Collector Auction Item'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {t('auction.lastBid')}: ₱{item.lastHighestBid.toLocaleString()} | {t('auction.noSaleReason')}: {item.noSaleReason}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-300" /> {item.watchCount} {t('auction.watching')}
                      </span>
                      <button
                        onClick={() => watchAuctionPool(item.id)}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                      >
                        {t('auction.watchItem')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
