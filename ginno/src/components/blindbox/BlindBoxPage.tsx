import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Zap,
  TrendingUp,
  Package,
  RefreshCw,
  Truck,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  Filter,
  DollarSign,
  Info,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BlindBox, BlindBoxItem, UnboxingRecord } from '../../types';

export const BlindBoxPage: React.FC = () => {
  const {
    blindBoxes,
    unboxingRecords,
    categories,
    openBlindBox,
    recycleUnboxedItem,
    user,
    addresses,
    openAuthModal,
    openBlindBoxCheckout,
    language,
    t,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'hall' | 'warehouse'>('hall');

  // Unboxing Modal state
  const [selectedBox, setSelectedBox] = useState<BlindBox | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [unboxedResult, setUnboxedResult] = useState<{
    prize: BlindBoxItem;
    record: UnboxingRecord;
  } | null>(null);
  const [unboxingError, setUnboxingError] = useState<string | null>(null);

  // Detail Modal state
  const [detailBox, setDetailBox] = useState<BlindBox | null>(null);

  const filteredBoxes = blindBoxes.filter((box) => {
    if (selectedCategory === 'all') return true;
    return box.categoryId === selectedCategory;
  });

  const handleStartUnboxing = (box: BlindBox) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    openBlindBoxCheckout(box);
  };

  const handleRecycle = (recordId: string) => {
    const res = recycleUnboxedItem(recordId);
    if (res.success) {
      alert(`🎉 回收成功！已将 ₱${res.walletEarned} 返还至您的钱包，并奖励 ${res.pointsEarned} 积分！`);
      if (unboxedResult && unboxedResult.record.id === recordId) {
        setUnboxedResult({
          ...unboxedResult,
          record: { ...unboxedResult.record, status: 'recycled' },
        });
      }
    }
  };

  const myRecords = unboxingRecords.filter((r) => r.userId === user.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>兴趣购物 · 惊喜无限 · 盲盒寻宝专区</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {language === 'ZH' ? '吉诺盲盒寻宝 - 开启心动惊喜' : language === 'TL' ? 'Misteryo Box - Tuklasin ang Suwerte' : 'Mystery Box Treasure Hunt'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {language === 'ZH'
                  ? '分类寻宝，爆率透明！超值抽中旗舰手机、大牌潮鞋、限定潮玩手办与奢华美妆！不满意支持 8 折一键回收换现金！'
                  : 'Choose your category & unbox flagship phones, designer sneakers, anime figures or beauty sets! Guaranteed value with instant buyback option.'}
              </p>
            </div>

            {/* Quick Wallet Stats Card */}
            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 w-full md:w-auto min-w-[280px] shadow-2xl backdrop-blur-md flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">当前钱包余额</span>
                <span className="text-amber-400 font-extrabold font-mono text-base">₱{user.walletBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">寻宝已开盒</span>
                <span className="text-purple-400 font-extrabold font-mono text-base">{myRecords.length} 次</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => setActiveTab('hall')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'hall'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  寻宝大厅
                </button>
                <button
                  onClick={() => setActiveTab('warehouse')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'warehouse'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  我的盲盒仓 ({myRecords.length})
                </button>
              </div>
            </div>
          </div>

          {/* Live Winner Ticker */}
          <div className="mt-8 bg-slate-900/60 border border-white/5 rounded-2xl p-3 flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black rounded-lg shrink-0">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>实时欧气快报</span>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar text-xs whitespace-nowrap text-slate-300">
              {unboxingRecords.map((r) => (
                <div key={r.id} className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-white">{r.userName}</span>
                  <span className="text-slate-400">抽中</span>
                  <span className={`font-bold ${r.itemRarity === 'SSR' ? 'text-amber-400 font-black' : 'text-purple-300'}`}>
                    [{r.itemRarity}] {r.itemName}
                  </span>
                  <span className="text-amber-400 font-mono font-bold">(₱{r.itemValue.toLocaleString()})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {activeTab === 'hall' ? (
          <>
            {/* Category Selector bar */}
            <div className="flex items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  全部分类盲盒
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'ZH' ? cat.nameZh : language === 'TL' ? cat.nameTl : cat.nameEn}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 hidden lg:block shrink-0">
                共 <span className="text-pink-400 font-bold font-mono">{filteredBoxes.length}</span> 款分类热门盲盒
              </div>
            </div>

            {/* Blind Box Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBoxes.map((box) => {
                const categoryObj = categories.find((c) => c.id === box.categoryId);
                const ssrItem = box.items?.find((i) => i.rarity === 'SSR');

                return (
                  <div
                    key={box.id}
                    className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image header */}
                      <div className="relative h-52 overflow-hidden bg-slate-950">
                        <img
                          src={box.coverImage}
                          alt={box.titleZh}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                            {categoryObj?.nameZh || '兴趣盲盒'}
                          </span>
                          {box.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-slate-900/80 backdrop-blur-md text-pink-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-pink-500/30">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Rarity SSR Preview Badge */}
                        {ssrItem && (
                          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-2xl border border-amber-500/30 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] text-amber-400 font-extrabold uppercase">最高可抽 SSR 隐藏款</div>
                              <div className="text-xs font-bold text-white truncate">{ssrItem.name}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-extrabold text-base text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                          {language === 'ZH' ? box.titleZh : language === 'TL' ? box.titleTl : box.titleEn}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {language === 'ZH' ? box.descriptionZh : language === 'TL' ? box.descriptionTl : box.descriptionEn}
                        </p>

                        <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                          <span className="text-slate-400">已售出 <strong className="text-slate-200 font-mono">{box.salesCount}</strong> 次</span>
                          <span className="text-slate-400">活动库存 <strong className="text-emerald-400 font-mono">{box.stock}</strong> 件</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-5 pt-0 space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">开启盲盒价</div>
                          <div className="text-2xl font-black text-amber-400 font-mono">₱{box.price.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-bold">参考估值</div>
                          <div className="text-xs text-slate-400 line-through">₱{box.originalValue.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setDetailBox(box)}
                          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl transition-colors border border-white/10"
                        >
                          查看所有奖池
                        </button>
                        <button
                          onClick={() => handleStartUnboxing(box)}
                          className="py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                        >
                          <Gift className="w-4 h-4" />
                          <span>立即开启寻宝</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* TAB 2: MY WAREHOUSE / UNBOXED ITEMS */
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  <span>我的盲盒仓与奖品柜</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">这里记录了您抽中的所有商品，您可以随时申请【极速直发】或【8折转卖回收换现金】！</p>
              </div>
            </div>

            {myRecords.length === 0 ? (
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-12 text-center space-y-4">
                <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto text-purple-400 flex items-center justify-center">
                  <Gift className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-white">盲盒仓空空如也</h3>
                  <p className="text-xs text-slate-400">快去寻宝大厅开启属于您的首个兴趣盲盒吧！</p>
                </div>
                <button
                  onClick={() => setActiveTab('hall')}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-500/20"
                >
                  去寻宝大厅
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myRecords.map((rec) => (
                  <div key={rec.id} className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                    <img src={rec.itemImage} alt={rec.itemName} className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-950" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          rec.itemRarity === 'SSR'
                            ? 'bg-amber-500 text-slate-950'
                            : rec.itemRarity === 'SR'
                            ? 'bg-purple-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {rec.itemRarity}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">{rec.blindBoxTitle}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white truncate">{rec.itemName}</h4>
                      <div className="text-xs font-mono font-bold text-amber-400">价值 ₱{rec.itemValue.toLocaleString()}</div>

                      <div className="pt-2 flex gap-2">
                        {rec.status === 'recycled' ? (
                          <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                            已回收退款
                          </span>
                        ) : (
                          <>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                              <Truck className="w-3 h-3" /> 已生成配送单
                            </span>
                            <button
                              onClick={() => handleRecycle(rec.id)}
                              className="text-[10px] text-pink-300 font-bold bg-pink-500/20 hover:bg-pink-500/30 px-2.5 py-1 rounded-lg border border-pink-500/30 transition-colors"
                            >
                              申请 8 折回收 (₱{Math.floor(rec.itemValue * 0.8)})
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* UNBOXING ANIMATION & RESULT MODAL */}
      {(selectedBox || isOpening || unboxedResult || unboxingError) && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full text-center space-y-6 relative overflow-hidden shadow-2xl">
            <button
              onClick={() => {
                setSelectedBox(null);
                setUnboxedResult(null);
                setUnboxingError(null);
                setIsOpening(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl"
            >
              ✕
            </button>

            {/* State 1: Opening Animation */}
            {isOpening && (
              <div className="py-8 space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl animate-ping opacity-30" />
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                    <Gift className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white animate-pulse">正在拆解盲盒中...</h3>
                  <p className="text-xs text-slate-400">正在为您碰撞概率，祝您好运爆发抽中 SSR 大奖！</p>
                </div>
              </div>
            )}

            {/* State 2: Error (e.g. low balance) */}
            {unboxingError && !isOpening && (
              <div className="py-6 space-y-4">
                <div className="p-4 bg-rose-500/20 text-rose-400 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-white">充值与开盒提醒</h3>
                  <p className="text-xs text-rose-300 leading-relaxed">{unboxingError}</p>
                </div>
                <button
                  onClick={() => {
                    setUnboxingError(null);
                    setSelectedBox(null);
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl"
                >
                  知道了
                </button>
              </div>
            )}

            {/* State 3: Unboxed Result Prize */}
            {unboxedResult && !isOpening && (
              <div className="py-4 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-black">
                  <Sparkles className="w-4 h-4" />
                  <span>恭喜欧气爆发！抽中【{unboxedResult.prize.rarity}】奖品</span>
                </div>

                <div className="relative w-40 h-40 mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-slate-950">
                  <img
                    src={unboxedResult.prize.image}
                    alt={unboxedResult.prize.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow">
                    {unboxedResult.prize.rarity}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-white">{unboxedResult.prize.name}</h3>
                  <div className="text-base font-black text-amber-400 font-mono">
                    专柜估值 ₱{unboxedResult.prize.value.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-bold">已自动为您生成包邮发货订单！</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleRecycle(unboxedResult.record.id)}
                    className="w-full py-3 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 font-extrabold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>不想要？申请 8 折回退现金 (₱{Math.floor(unboxedResult.prize.value * 0.8)})</span>
                  </button>

                  <button
                    onClick={() => {
                      setUnboxedResult(null);
                      if (selectedBox) handleStartUnboxing(selectedBox);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-500/20"
                  >
                    再抽一次
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLIND BOX DETAIL PRIZE POOL MODAL */}
      {detailBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-6 text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <span>{detailBox.titleZh || detailBox.titleEn} - 奖池与概率明细</span>
              </h2>
              <button
                onClick={() => setDetailBox(null)}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-400">吉诺平台公开透明中奖概率与奖品专柜价值：</div>
              {detailBox.items?.map((item) => (
                <div key={item.id} className="bg-slate-800/80 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-950" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.rarity === 'SSR'
                          ? 'bg-amber-500 text-slate-950'
                          : item.rarity === 'SR'
                          ? 'bg-purple-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {item.rarity}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">专柜估值: <strong className="text-amber-400 font-mono">₱{item.value.toLocaleString()}</strong></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">爆率</div>
                    <div className="text-sm font-black text-emerald-400 font-mono">{item.probability}%</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const box = detailBox;
                setDetailBox(null);
                handleStartUnboxing(box);
              }}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-500/20"
            >
              开启盲盒 (₱{detailBox.price})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
