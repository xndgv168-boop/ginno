import React, { useState } from 'react';
import {
  Zap,
  Clock,
  Flame,
  TrendingUp,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Package,
  Percent,
  Search,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Product } from '../../../types';
import { getProductTitle } from '../../../utils/i18nHelpers';

export const AdminFlashSale: React.FC = () => {
  const { products, adminSaveProduct, language } = useApp();

  const [activeSession, setActiveSession] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product> | null>(null);

  // Filter flash sale products
  const flashProducts = products.filter((p) => p.isFlashSale);

  const filteredFlashProducts = flashProducts.filter((p) => {
    const title = getProductTitle(p as Product, language);
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculation Metrics
  const totalFlashItems = flashProducts.length;
  const totalFlashSold = flashProducts.reduce((acc, p) => acc + (p.flashSaleSold || p.salesCount || 0), 0);
  const totalFlashGMV = flashProducts.reduce((acc, p) => {
    const price = p.flashSalePrice || p.skus[0]?.price || 0;
    const sold = p.flashSaleSold || p.salesCount || 0;
    return acc + price * sold;
  }, 0);

  const averageDiscountPercent = flashProducts.length > 0
    ? Math.round(
        flashProducts.reduce((acc, p) => {
          const orig = p.skus[0]?.originalPrice || p.skus[0]?.price || 1;
          const flash = p.flashSalePrice || p.skus[0]?.price || 1;
          const disc = Math.max(0, ((orig - flash) / orig) * 100);
          return acc + disc;
        }, 0) / flashProducts.length
      )
    : 0;

  const handleOpenAddModal = () => {
    // Find a non-flash sale product as default, or first product
    const nonFlash = products.find((p) => !p.isFlashSale) || products[0];
    if (nonFlash) {
      setSelectedProduct({
        ...nonFlash,
        isFlashSale: true,
        flashSalePrice: Math.floor((nonFlash.skus[0]?.price || 1000) * 0.6),
        flashSaleStock: 100,
        flashSaleSold: 0,
      });
    }
    setShowConfigModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setSelectedProduct({ ...p });
    setShowConfigModal(true);
  };

  const handleRemoveFromFlashSale = (p: Product) => {
    if (confirm(`确定要将商品【${getProductTitle(p, language)}】移出限时秒杀活动吗？`)) {
      adminSaveProduct({
        ...p,
        isFlashSale: false,
      });
    }
  };

  const handleSaveFlashConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && selectedProduct.id) {
      adminSaveProduct({
        ...selectedProduct,
        isFlashSale: true,
      });
      setShowConfigModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-rose-600 rounded-2xl text-white shadow-lg shadow-rose-500/20 animate-pulse">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{language === 'ZH' ? '限时秒杀营销管理' : language === 'TL' ? 'Pamamahala ng Flash Sale' : 'Flash Sale Marketing Hub'}</span>
              <span className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                HOURLY CAMPAIGN
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {language === 'ZH' ? '配置整点特惠秒杀商品、秒杀直降力度、活动专属独立库存与抢购进度跟踪' : 'Configure hourly flash deals, special flash prices, allocated stock and flash sales pipeline'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ZH' ? '添加秒杀特惠商品' : language === 'TL' ? 'Magdagdag ng Flash Product' : 'Add Flash Sale Product'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">活动中秒杀商品</div>
          <div className="text-2xl font-black text-amber-400 font-mono">{totalFlashItems} 款</div>
          <div className="text-[10px] text-amber-300 font-bold">🔥 覆盖全站热门品类</div>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">秒杀平均折扣力度</div>
          <div className="text-2xl font-black text-rose-400 font-mono">-{averageDiscountPercent}% OFF</div>
          <div className="text-[10px] text-rose-300 font-bold">直降吸引大爆款</div>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">秒杀累计抢购销量</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{totalFlashSold.toLocaleString()} 件</div>
          <div className="text-[10px] text-emerald-300 font-bold">高频下单流量转化</div>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 font-medium">秒杀成交流水 (GMV)</div>
          <div className="text-2xl font-black text-purple-400 font-mono">₱{totalFlashGMV.toLocaleString()}</div>
          <div className="text-[10px] text-purple-300 font-bold">限时爆发拉动大盘</div>
        </div>
      </div>

      {/* Sessions & Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          {/* Time sessions */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setActiveSession('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSession === 'all'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              全部秒杀商品 ({flashProducts.length})
            </button>
            <button
              onClick={() => setActiveSession('10:00')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                activeSession === '10:00'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>10:00 场 (已开抢)</span>
            </button>
            <button
              onClick={() => setActiveSession('14:00')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                activeSession === '14:00'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>14:00 场 (疯抢中 LIVE)</span>
            </button>
            <button
              onClick={() => setActiveSession('18:00')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                activeSession === '18:00'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>18:00 场 (即将开始)</span>
            </button>
            <button
              onClick={() => setActiveSession('22:00')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                activeSession === '22:00'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>22:00 场 (晚间狂欢)</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索秒杀商品名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Flash Sale Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-black">
              <tr>
                <th className="p-3">秒杀商品信息</th>
                <th className="p-3">划线正价</th>
                <th className="p-3">秒杀直降价</th>
                <th className="p-3">折扣力度</th>
                <th className="p-3">秒杀库存/销量</th>
                <th className="p-3">抢购进度</th>
                <th className="p-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredFlashProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    暂无符合条件的秒杀商品，点击右上角【添加秒杀特惠商品】进行配置
                  </td>
                </tr>
              ) : (
                filteredFlashProducts.map((p) => {
                  const title = getProductTitle(p, language);
                  const origPrice = p.skus[0]?.price || 0;
                  const flashPrice = p.flashSalePrice || origPrice;
                  const discountPct = origPrice > 0 ? Math.round(((origPrice - flashPrice) / origPrice) * 100) : 0;
                  const flashStock = p.flashSaleStock || 100;
                  const flashSold = p.flashSaleSold || p.salesCount || 0;
                  const progressPct = Math.min(100, Math.round((flashSold / Math.max(1, flashStock + flashSold)) * 100));

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 flex items-center gap-3 min-w-[240px]">
                        <img
                          src={p.mainImage}
                          alt={title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10 bg-slate-950"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate max-w-[200px] text-xs">{title}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                              限时秒杀
                            </span>
                            <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-slate-400 line-through font-mono">
                        ₱{origPrice.toLocaleString()}
                      </td>

                      <td className="p-3 text-amber-400 font-extrabold font-mono text-sm">
                        ₱{flashPrice.toLocaleString()}
                      </td>

                      <td className="p-3">
                        <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                          -{discountPct}% OFF
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="text-xs font-mono">
                          <span className="text-emerald-400 font-bold">{flashSold}</span>
                          <span className="text-slate-400"> / {flashStock} 件</span>
                        </div>
                      </td>

                      <td className="p-3 min-w-[120px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-rose-400">{progressPct}% 已抢</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg border border-white/10 transition-colors"
                            title="修改秒杀参数"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveFromFlashSale(p)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                            title="移出秒杀"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIG / EDIT FLASH SALE MODAL */}
      {showConfigModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-6 text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>配置秒杀特惠商品参数</span>
              </h2>
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  setSelectedProduct(null);
                }}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFlashConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">选择商品 *</label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) {
                      setSelectedProduct({
                        ...found,
                        isFlashSale: true,
                        flashSalePrice: Math.floor((found.skus[0]?.price || 1000) * 0.6),
                        flashSaleStock: 100,
                        flashSaleSold: 0,
                      });
                    }
                  }}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-rose-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getProductTitle(p, language)} (正价: ₱{p.skus[0]?.price || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">划线原价 (₱)</label>
                  <input
                    type="number"
                    disabled
                    value={selectedProduct.skus?.[0]?.price || 0}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-slate-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">秒杀直降价 (₱) *</label>
                  <input
                    type="number"
                    required
                    value={selectedProduct.flashSalePrice || 0}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        flashSalePrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">分配秒杀专属库存 *</label>
                  <input
                    type="number"
                    required
                    value={selectedProduct.flashSaleStock || 100}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        flashSaleStock: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">已售数量累计</label>
                  <input
                    type="number"
                    value={selectedProduct.flashSaleSold || 0}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        flashSaleSold: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-medium">
                💡 开启秒杀后，该商品将高亮展示在商城首页【限时秒杀】专区，并享受独立倒计时与进度条锁存效果。
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all"
                >
                  保存并开启秒杀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
