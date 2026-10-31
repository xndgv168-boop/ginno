import React, { useState, useEffect } from 'react';
import { Gavel, Clock, ShieldCheck, Sparkles, ArrowLeft, Bot, AlertTriangle, Check, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AuctionItem, Product } from '../../types';
import { getProductTitle } from '../../utils/i18nHelpers';

interface AuctionDetailPageProps {
  auction: AuctionItem;
  product: Product;
  setActiveTab: (tab: string) => void;
}

const UserAvatar: React.FC<{ src?: string; name?: string }> = ({ src, name = 'User' }) => {
  const [imgError, setImgError] = useState(false);
  const cleanName = name ? name.trim().replace(/^[*]+/, '') : 'User';
  const initial = cleanName.charAt(0).toUpperCase() || 'U';

  if (!src || imgError) {
    return (
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-[10px] flex items-center justify-center shadow-xs shrink-0 ring-2 ring-white">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={cleanName}
      onError={() => setImgError(true)}
      className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
    />
  );
};

export const AuctionDetailPage: React.FC<AuctionDetailPageProps> = ({
  auction,
  product,
  setActiveTab,
}) => {
  const { placeAuctionBid, setAutoBid, auctionBids, language, t } = useApp();

  const [customBid, setCustomBid] = useState<number>(auction.currentHighestBid + auction.bidIncrement);
  const [showAutoBidModal, setShowAutoBidModal] = useState<boolean>(false);
  const [autoBidLimit, setAutoBidLimit] = useState<number>(auction.currentHighestBid + 2000);
  const [bidSuccessNotice, setBidSuccessNotice] = useState<string | null>(null);

  const bidsLog = auctionBids[auction.id] || [];
  const title = product ? getProductTitle(product, language) : auction.title;

  // Sync customBid when highest bid changes
  useEffect(() => {
    setCustomBid(auction.currentHighestBid + auction.bidIncrement);
  }, [auction.currentHighestBid, auction.bidIncrement]);

  const handlePlaceBid = (amount: number) => {
    if (amount <= auction.currentHighestBid) {
      alert(
        language === 'ZH'
          ? `出价金额必须高于当前最高价 ₱${auction.currentHighestBid.toLocaleString()}`
          : `Bid must be higher than current bid ₱${auction.currentHighestBid.toLocaleString()}`
      );
      return;
    }
    const res = placeAuctionBid(auction.id, amount);
    if (!res.success) {
      alert(res.message);
    } else {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } catch (e) {
        // ignore confetti failure
      }
      setBidSuccessNotice(
        language === 'ZH'
          ? `🎉 出价成功！您已成为最高竞拍者 ₱${amount.toLocaleString()}`
          : language === 'TL'
          ? `🎉 Matagumpay ang bid! ₱${amount.toLocaleString()}`
          : `🎉 Bid Placed Successfully! ₱${amount.toLocaleString()}`
      );
      setTimeout(() => setBidSuccessNotice(null), 4000);
    }
  };

  const msRemaining = Math.max(0, new Date(auction.endTime).getTime() - Date.now());
  const minutes = Math.floor(msRemaining / 60000);
  const seconds = Math.floor((msRemaining % 60000) / 1000);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
      <button
        onClick={() => setActiveTab('auctions')}
        className="flex items-center space-x-1 text-xs font-bold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('auctionDetail.back')}</span>
      </button>

      {/* Bid Success Banner Notice */}
      {bidSuccessNotice && (
        <div className="bg-emerald-500 text-white font-extrabold text-xs sm:text-sm p-4 rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 bg-white/20 p-1 rounded-full shrink-0" />
            <span>{bidSuccessNotice}</span>
          </div>
          <button onClick={() => setBidSuccessNotice(null)} className="text-white/80 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Main Auction Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={auction.mainImage}
          alt={title}
          className="w-full aspect-square object-cover rounded-2xl bg-gray-50 border border-gray-100"
        />

        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                {t('auctionDetail.liveBadge')}
              </span>
              <span className="text-xs text-gray-400 font-semibold">{auction.totalBids} {t('auctionDetail.totalBids')}</span>
            </div>

            <h1 className="text-lg font-black text-gray-900 mt-2 leading-snug">
              {title}
            </h1>
            <p className="text-xs text-gray-500 mt-1">{auction.description}</p>

            {/* Price Box */}
            <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-4 rounded-2xl mt-4 space-y-1">
              <span className="text-[10px] text-gray-300 uppercase tracking-wider block font-bold">
                {t('auction.currentHighest')}
              </span>
              <div className="text-3xl font-black text-[#FFD23F] animate-pulse">
                ₱{auction.currentHighestBid.toLocaleString()}
              </div>
              <p className="text-[10px] text-indigo-300">
                {t('auction.bidder')}: {auction.currentHighestBidderName || t('auctionDetail.noBidsYet')}
              </p>
            </div>

            {/* Timer Box */}
            <div className="mt-3 bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                {t('auctionDetail.timeRemaining')}:
              </span>
              <span className="text-base font-black text-amber-700">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            {auction.currentExtensions > 0 && (
              <p className="text-[10px] text-amber-700 font-semibold mt-1">
                {t('auctionDetail.antiSnipeTriggered')} ({auction.currentExtensions}x)
              </p>
            )}
          </div>

          {/* Quick Bid Buttons Console */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-700">{t('auctionDetail.quickIncrements')}:</span>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((inc) => (
                <button
                  key={inc}
                  onClick={() => handlePlaceBid(auction.currentHighestBid + inc)}
                  className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-extrabold py-2 rounded-xl text-xs transition-colors shadow-sm"
                >
                  +₱{inc}
                </button>
              ))}
            </div>

            {/* Custom Bid Input & Main Bid CTA */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customBid}
                  onChange={(e) => setCustomBid(Number(e.target.value))}
                  className="flex-1 bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 outline-none"
                />
                <button
                  onClick={() => handlePlaceBid(customBid)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Gavel className="w-4 h-4 text-amber-300" />
                  <span>{language === 'ZH' ? '出价' : language === 'TL' ? 'Mag-bid' : 'Bid'}</span>
                </button>
              </div>

              <button
                onClick={() => handlePlaceBid(customBid)}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Gavel className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>
                  {language === 'ZH'
                    ? `立即参与竞拍 ₱${customBid.toLocaleString()}`
                    : language === 'TL'
                    ? `Sumali sa Bidding ₱${customBid.toLocaleString()}`
                    : `Place Bid ₱${customBid.toLocaleString()}`}
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowAutoBidModal(true)}
              className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>{t('auctionDetail.autoBidBot')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Bid History Log */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
        <h3 className="text-sm font-black text-gray-900 flex items-center justify-between">
          <span>{t('auction.biddingHistory')} ({bidsLog.length})</span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {t('auctionDetail.realtimeFeed')}
          </span>
        </h3>

        <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
          {bidsLog.map((b, idx) => (
            <div key={`${b.id}_${idx}`} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <UserAvatar src={b.userAvatar} name={b.userNickname} />
                <span className="font-bold text-gray-800">{b.userNickname}</span>
                {b.isAutoBid && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 rounded">
                    {t('auctionDetail.autoTag')}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="font-black text-[#FF6B35] text-sm">
                  ₱{b.bidAmount.toLocaleString()}
                </span>
                <span className="block text-[10px] text-gray-400">
                  {new Date(b.bidTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto Bid Modal */}
      {showAutoBidModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              {t('auctionDetail.proxySetup')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('auctionDetail.proxyDesc')}
            </p>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('auctionDetail.maxBidLimit')}
              </label>
              <input
                type="number"
                value={autoBidLimit}
                onChange={(e) => setAutoBidLimit(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAutoBidModal(false)}
                className="flex-1 bg-gray-100 font-bold text-xs py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAutoBid(auction.id, autoBidLimit);
                  setShowAutoBidModal(false);
                }}
                className="flex-1 bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl"
              >
                {t('auctionDetail.confirmAutoBid')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sticky Bottom Action Bar for Bidding */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 p-3 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'ZH' ? '当前最高出价' : language === 'TL' ? 'Pinakamataas na Bid' : 'Current Highest Bid'}
            </span>
            <span className="text-lg sm:text-xl font-black text-[#FFD23F] animate-pulse">
              ₱{auction.currentHighestBid.toLocaleString()}
            </span>
          </div>

          <div className="flex-1 max-w-xs hidden sm:flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-2xl p-1.5">
            <span className="text-[10px] text-slate-400 font-bold px-2">{language === 'ZH' ? '出价金额' : 'Bid Amount'}:</span>
            <input
              type="number"
              value={customBid}
              onChange={(e) => setCustomBid(Number(e.target.value))}
              className="w-full bg-slate-800 text-white font-extrabold text-xs rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={() => handlePlaceBid(customBid)}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Gavel className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>
              {language === 'ZH'
                ? `立即竞拍 ₱${customBid.toLocaleString()}`
                : language === 'TL'
                ? `Mag-bid ₱${customBid.toLocaleString()}`
                : `Place Bid ₱${customBid.toLocaleString()}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
