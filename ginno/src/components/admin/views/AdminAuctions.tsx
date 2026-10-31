import React, { useState } from 'react';
import {
  Gavel,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AuctionItem } from '../../../types';

export const AdminAuctions: React.FC = () => {
  const {
    products,
    auctions,
    auctionPool,
    auctionBids,
    adminPublishAuction,
    adminReAuctionPoolItem,
    adminConvertPoolToSale,
    language,
  } = useApp();

  const [auctionSubTab, setAuctionSubTab] = useState<'live' | 'pool' | 'orders' | 'stats'>('live');
  const [showPublishModal, setShowPublishModal] = useState(false);

  // New Auction form
  const [newAuc, setNewAuc] = useState<Partial<AuctionItem>>({
    title: 'Limited Collector Live Auction',
    productId: products[0]?.id || 'prod_01',
    startingBid: 2500,
    reservePrice: 5000,
    bidIncrement: 200,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    antiSnipeMinutes: 5,
    paymentTimeoutHours: 24,
    depositRequiredAmount: 500,
  });

  const handlePublishAuction = (e: React.FormEvent) => {
    e.preventDefault();
    adminPublishAuction(newAuc);
    setShowPublishModal(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Sub-tabs header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-2xl border border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setAuctionSubTab('live')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              auctionSubTab === 'live'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>
              {language === 'ZH' ? `进行中拍卖 (${auctions.length})` : language === 'TL' ? `Mga Aktibong Auction (${auctions.length})` : `Live Auctions Monitor (${auctions.length})`}
            </span>
          </button>
          <button
            onClick={() => setAuctionSubTab('pool')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              auctionSubTab === 'pool'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'ZH' ? `流拍池管理 (${auctionPool.length})` : language === 'TL' ? `Auction Pool (${auctionPool.length})` : `Auction Pool (${auctionPool.length})`}
            </span>
          </button>
          <button
            onClick={() => setAuctionSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              auctionSubTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ZH' ? '竞拍中标订单' : language === 'TL' ? 'Mga Nanalo sa Bidding' : 'Won Bid Orders'}
            </span>
          </button>
          <button
            onClick={() => setAuctionSubTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              auctionSubTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-300" />
            <span>
              {language === 'ZH' ? '拍卖数据分析' : language === 'TL' ? 'Auction Analytics' : 'Auction Analytics'}
            </span>
          </button>
        </div>

        <button
          onClick={() => setShowPublishModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>
            {language === 'ZH' ? '发布新拍卖' : language === 'TL' ? 'Mag-publish ng Auction' : 'Publish Auction'}
          </span>
        </button>
      </div>

      {/* 1. LIVE AUCTIONS MONITOR */}
      {auctionSubTab === 'live' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auctions.map((auc) => {
              const bids = auctionBids[auc.id] || [];
              return (
                <div key={auc.id} className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 relative">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <img src={auc.mainImage} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30" />
                      <div>
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {auc.status}
                        </span>
                        <h4 className="text-sm font-extrabold text-white mt-1 line-clamp-1">{auc.title}</h4>
                        <p className="text-[10px] text-slate-400">
                          {language === 'ZH' ? '起拍价: ' : language === 'TL' ? 'Simulang Tawag: ' : 'Starting Bid: '}₱{(auc.startingBid ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Realtime Bidding Overview */}
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {language === 'ZH' ? '当前最高竞价' : language === 'TL' ? 'Pinakamataas na Tawag' : 'Current High Bid'}
                      </span>
                      <span className="text-base font-black text-[#FF8C61]">₱{(auc.currentHighestBid ?? 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {language === 'ZH' ? '累计出价次数' : language === 'TL' ? 'Kabuuan ng Bids' : 'Total Bids'}
                      </span>
                      <span className="text-base font-black text-white">
                        {(auc.totalBids ?? 0)} {language === 'ZH' ? '次' : language === 'TL' ? 'bids' : 'Bids'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {language === 'ZH' ? '防截胡延时规则' : language === 'TL' ? 'Panuntunan sa Pagpapalawig' : 'Anti-Snipe Rules'}
                      </span>
                      <span className="text-xs font-bold text-amber-300">
                        +{auc.antiSnipeMinutes || 5}{language === 'ZH' ? '分钟延时' : language === 'TL' ? 'm pinalawig' : 'm Extend'}
                      </span>
                    </div>
                  </div>

                  {/* Bid History Ticker */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      {language === 'ZH' ? '实时出价动态:' : language === 'TL' ? 'Live Stream ng Bids:' : 'Live Bid Stream:'}
                    </span>
                    {bids.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">
                        {language === 'ZH' ? '暂无买家参与出价' : language === 'TL' ? 'Wala pang bids sa item na ito' : 'No bids yet on this item.'}
                      </p>
                    ) : (
                      bids.slice(0, 3).map((b, idx) => (
                        <div key={`${b.id}_${idx}`} className="flex justify-between items-center text-[11px] bg-white/5 p-2 rounded-xl">
                          <span className="font-bold text-slate-200">{b.bidderName}</span>
                          <span className="font-black text-indigo-400">₱{(b.amount ?? 0).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. AUCTION POOL (流拍池) */}
      {auctionSubTab === 'pool' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-white">
                {language === 'ZH' ? '流拍池管理' : language === 'TL' ? 'Pamamahala ng Auction Pool' : 'Auction Pool Management'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ZH' ? '管理流拍或未接单商品，触发二次降价重拍或一键转转常规销售' : language === 'TL' ? 'Pamahalaan ang mga hindi nabentang auction at mag-trigger ng muling pagbebenta' : 'Manage un-sold or failed auctions and trigger secondary liquidation'}
              </p>
            </div>
          </div>

          {auctionPool.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              <p>
                {language === 'ZH' ? '流拍池暂无滞留拍品' : language === 'TL' ? 'Walang item sa auction pool' : 'No items currently in the auction pool.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {auctionPool.map((p) => (
                <div key={p.id} className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-amber-300 text-sm">
                      {language === 'ZH' ? `流拍商品 #${p.id}` : language === 'TL' ? `Item sa Pool #${p.id}` : `Pool Item #${p.id}`}
                    </span>
                    <p className="text-slate-300 text-xs mt-0.5">
                      {language === 'ZH' ? '末次最高竞价: ' : language === 'TL' ? 'Huling Pinakamataas na Tawag: ' : 'Last Highest Bid: '}
                      <span className="font-bold text-white">₱{(p.lastHighestBid ?? 0).toLocaleString()}</span>
                      {' | '}
                      {language === 'ZH' ? '流拍原因: ' : language === 'TL' ? 'Rason: ' : 'Reason: '}
                      <span className="text-amber-400 font-bold">{p.noSaleReason}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adminReAuctionPoolItem(p.id, Math.floor((p.lastHighestBid ?? 0) * 0.8))}
                      className="bg-gradient-to-r from-[#FF6B35] to-amber-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow transition-all"
                    >
                      {language === 'ZH' ? '8折八折重新开拍' : language === 'TL' ? 'Muling Auction (20% Off)' : 'Re-Auction at 20% Off'}
                    </button>
                    <button
                      onClick={() => adminConvertPoolToSale(p.id)}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-white/10 transition-all"
                    >
                      {language === 'ZH' ? '一键转为普通商品销售' : language === 'TL' ? 'Gawing Karaniwang Produkto' : 'Convert to Regular Sale'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PUBLISH AUCTION MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Gavel className="w-5 h-5 text-indigo-400" />
              <span>{language === 'ZH' ? '发布新拍品' : language === 'TL' ? 'Mag-publish ng Auction' : 'Publish Live Auction'}</span>
            </h3>

            <form onSubmit={handlePublishAuction} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '拍卖品标题' : language === 'TL' ? 'Pamagat ng Auction' : 'Auction Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newAuc.title || ''}
                  onChange={(e) => setNewAuc({ ...newAuc, title: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {language === 'ZH' ? '起拍价格 (₱)' : language === 'TL' ? 'Simulang Halaga (₱)' : 'Starting Bid (₱)'}
                  </label>
                  <input
                    type="number"
                    value={newAuc.startingBid || 0}
                    onChange={(e) => setNewAuc({ ...newAuc, startingBid: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {language === 'ZH' ? '保留价/底价 (₱)' : language === 'TL' ? 'Minimong Halaga (₱)' : 'Reserve Price (₱)'}
                  </label>
                  <input
                    type="number"
                    value={newAuc.reservePrice || 0}
                    onChange={(e) => setNewAuc({ ...newAuc, reservePrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {language === 'ZH' ? '加价加幅度 (₱)' : language === 'TL' ? 'Karagdagang Halaga (₱)' : 'Bid Step Increment (₱)'}
                  </label>
                  <input
                    type="number"
                    value={newAuc.bidIncrement || 100}
                    onChange={(e) => setNewAuc({ ...newAuc, bidIncrement: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {language === 'ZH' ? '参拍保证金 (₱)' : language === 'TL' ? 'Required Deposit (₱)' : 'Deposit Amount (₱)'}
                  </label>
                  <input
                    type="number"
                    value={newAuc.depositRequiredAmount || 500}
                    onChange={(e) => setNewAuc({ ...newAuc, depositRequiredAmount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-2.5 rounded-xl shadow-lg"
                >
                  {language === 'ZH' ? '确认发布拍卖' : language === 'TL' ? 'I-publish ang Auction' : 'Publish Auction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
