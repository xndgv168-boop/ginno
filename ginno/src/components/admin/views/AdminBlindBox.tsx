import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  TrendingUp,
  Package,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { BlindBox, BlindBoxItem } from '../../../types';

export const AdminBlindBox: React.FC = () => {
  const {
    blindBoxes,
    unboxingRecords,
    categories,
    adminSaveBlindBox,
    adminDeleteBlindBox,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'boxes' | 'records' | 'analytics'>('boxes');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBox, setEditingBox] = useState<Partial<BlindBox>>({
    titleZh: '',
    titleEn: '',
    titleTl: '',
    descriptionZh: '',
    price: 199,
    originalValue: 500,
    stock: 100,
    categoryId: categories[0]?.id || 'cat_electronics',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    status: 'active',
    items: [
      { id: 'i1', name: 'SSR 旗舰隐藏大奖', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', value: 50000, rarity: 'SSR', probability: 2 },
      { id: 'i2', name: 'SR 热门精选大礼', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', value: 12000, rarity: 'SR', probability: 8 },
      { id: 'i3', name: 'R 实用高品质周边', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', value: 2500, rarity: 'R', probability: 30 },
      { id: 'i4', name: 'N 基础阳光保底礼', image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500', value: 800, rarity: 'N', probability: 60 },
    ],
    tags: ['爆率超高', '正品推荐'],
  });

  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const openCreateModal = () => {
    setEditingBox({
      titleZh: '极客数码爆款盲盒',
      titleEn: 'Digital Cyberpunk Mystery Box',
      titleTl: 'Misteryosong Kahon ng Elektronika',
      descriptionZh: '高能抽选极客数码装备，100%保底高价值商品！',
      price: 299,
      originalValue: 880,
      stock: 100,
      categoryId: categories[0]?.id || 'cat_electronics',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      status: 'active',
      items: [
        { id: `i_${Date.now()}_1`, name: 'iPhone 15 Pro Max 256GB', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', value: 79990, rarity: 'SSR', probability: 2 },
        { id: `i_${Date.now()}_2`, name: 'Sony WH-1000XM5 耳机', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', value: 19990, rarity: 'SR', probability: 8 },
        { id: `i_${Date.now()}_3`, name: '客制化机械键盘', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', value: 4500, rarity: 'R', probability: 30 },
        { id: `i_${Date.now()}_4`, name: '磁吸快充移动电源', image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500', value: 1290, rarity: 'N', probability: 60 },
      ],
      tags: ['超高好评', '保底不亏'],
    });
    setShowEditModal(true);
  };

  const openEditModal = (box: BlindBox) => {
    setEditingBox({ ...box });
    setShowEditModal(true);
  };

  const handleSaveBox = (e: React.FormEvent) => {
    e.preventDefault();
    adminSaveBlindBox(editingBox);
    setShowEditModal(false);
  };

  const handleAddItem = () => {
    const newItems = [
      ...(editingBox.items || []),
      {
        id: `i_${Date.now()}`,
        name: '新奖品',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
        value: 1000,
        rarity: 'R' as const,
        probability: 10,
      },
    ];
    setEditingBox({ ...editingBox, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...(editingBox.items || [])];
    newItems.splice(index, 1);
    setEditingBox({ ...editingBox, items: newItems });
  };

  const handleUpdateItem = (index: number, field: keyof BlindBoxItem, value: any) => {
    const newItems = [...(editingBox.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingBox({ ...editingBox, items: newItems });
  };

  // Analytics Metrics
  const totalSalesVolume = blindBoxes.reduce((acc, b) => acc + b.salesCount * b.price, 0);
  const totalUnboxesCount = unboxingRecords.length;
  const recycledCount = unboxingRecords.filter((r) => r.status === 'recycled').length;
  const recycleRate = totalUnboxesCount > 0 ? ((recycledCount / totalUnboxesCount) * 100).toFixed(1) : '0.0';

  const filteredRecords = unboxingRecords.filter((r) => {
    if (rarityFilter === 'all') return true;
    return r.itemRarity === rarityFilter;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg shadow-purple-500/20">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{language === 'ZH' ? '盲盒营销管理中心' : language === 'TL' ? 'Kaban ng Pamamahala ng Blind Box' : 'Blind Box Marketing Hub'}</span>
              <span className="bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                FUN SHOPPING
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {language === 'ZH' ? '配置不同类目的兴趣盲盒、爆率配置、概率加权与回收转卖交易审计' : 'Configure category mystery boxes, probability weights, prizes & recycling audit'}
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ZH' ? '新建盲盒活动' : language === 'TL' ? 'Gumawa ng Blind Box' : 'Create Blind Box'}</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('boxes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'boxes'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gift className="w-4 h-4 text-pink-300" />
          <span>{language === 'ZH' ? `盲盒活动列表 (${blindBoxes.length})` : `Blind Box Activities (${blindBoxes.length})`}</span>
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'records'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span>{language === 'ZH' ? `开盒与回收日志 (${unboxingRecords.length})` : `Unboxing Logs (${unboxingRecords.length})`}</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ZH' ? '营销效果分析' : 'Marketing Analytics'}</span>
        </button>
      </div>

      {/* TAB 1: BLIND BOXES LIST */}
      {activeTab === 'boxes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blindBoxes.map((box) => {
            const categoryObj = categories.find((c) => c.id === box.categoryId);
            const ssrItem = box.items?.find((i) => i.rarity === 'SSR');
            const totalProb = box.items?.reduce((acc, i) => acc + i.probability, 0) || 0;

            return (
              <div
                key={box.id}
                className="bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-800">
                    <img
                      src={box.coverImage}
                      alt={box.titleZh}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="bg-purple-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                        {categoryObj?.nameZh || '数码3C'}
                      </span>
                      {box.tags?.map((tag, idx) => (
                        <span key={idx} className="bg-slate-900/80 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        box.status === 'active' ? 'bg-emerald-500/90 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {box.status === 'active' ? '上架中' : '已下架'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">抽一次价格</div>
                        <div className="text-xl font-black text-amber-400 font-mono">₱{box.price.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-medium">价值估算</div>
                        <div className="text-xs text-slate-300 line-through">₱{box.originalValue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-white line-clamp-1">{box.titleZh || box.titleEn}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{box.descriptionZh || box.descriptionEn}</p>
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">已售次数</div>
                        <div className="font-bold text-white font-mono">{box.salesCount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">库存剩余</div>
                        <div className="font-bold text-emerald-400 font-mono">{box.stock}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">奖品种类</div>
                        <div className="font-bold text-purple-400 font-mono">{box.items?.length || 0}款</div>
                      </div>
                    </div>

                    {/* SSR highlight */}
                    {ssrItem && (
                      <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="truncate">
                          <span className="text-amber-400 font-black text-[10px] mr-1">[SSR 隐藏款]</span>
                          <span className="text-slate-200 text-xs font-bold truncate">{ssrItem.name}</span>
                        </div>
                      </div>
                    )}

                    {totalProb !== 100 && (
                      <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold bg-rose-500/10 p-2 rounded-xl">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>当前奖品概率和为 {totalProb}%，建议调整为 100%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => openEditModal(box)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>编辑/奖池配置</span>
                  </button>
                  <button
                    onClick={() => adminDeleteBlindBox(box.id)}
                    className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: UNBOXING & RECYCLING LOGS */}
      {activeTab === 'records' && (
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>用户开盒与转卖回收记录审计</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">稀有度筛选:</span>
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-1.5 border border-white/10 focus:outline-none"
              >
                <option value="all">全部稀有度</option>
                <option value="SSR">SSR 欧皇金</option>
                <option value="SR">SR 紫色极品</option>
                <option value="R">R 蓝色品质</option>
                <option value="N">N 普通保底</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-black">
                <tr>
                  <th className="p-3">开盒用户</th>
                  <th className="p-3">盲盒名称</th>
                  <th className="p-3">抽中奖品</th>
                  <th className="p-3">专柜估值</th>
                  <th className="p-3">稀有度等级</th>
                  <th className="p-3">履约状态</th>
                  <th className="p-3">开盒时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 flex items-center gap-2">
                      <img src={rec.userAvatar} alt={rec.userName} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-white">{rec.userName}</span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-[150px] truncate">{rec.blindBoxTitle}</td>
                    <td className="p-3 font-bold text-white max-w-[200px] truncate flex items-center gap-2">
                      <img src={rec.itemImage} alt={rec.itemName} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <span className="truncate">{rec.itemName}</span>
                    </td>
                    <td className="p-3 font-mono text-amber-400 font-bold">₱{rec.itemValue.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        rec.itemRarity === 'SSR'
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : rec.itemRarity === 'SR'
                          ? 'bg-purple-500 text-white'
                          : rec.itemRarity === 'R'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {rec.itemRarity}
                      </span>
                    </td>
                    <td className="p-3">
                      {rec.status === 'recycled' ? (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <RefreshCw className="w-3 h-3" /> 已8折回收
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> 极速直发中
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] font-mono">
                      {new Date(rec.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MARKETING ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="text-xs text-slate-400 font-medium">盲盒销售流水 (GMV)</div>
              <div className="text-2xl font-black text-amber-400 font-mono">₱{totalSalesVolume.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400 font-bold">↑ 兴趣购物消费增势强劲</div>
            </div>

            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="text-xs text-slate-400 font-medium">累计开启盲盒数</div>
              <div className="text-2xl font-black text-purple-400 font-mono">{totalUnboxesCount} 次</div>
              <div className="text-[10px] text-purple-300 font-bold">高留存玩乐复购驱动</div>
            </div>

            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="text-xs text-slate-400 font-medium">转卖回收率</div>
              <div className="text-2xl font-black text-rose-400 font-mono">{recycleRate}%</div>
              <div className="text-[10px] text-slate-400 font-bold">{recycledCount} 件奖品申请退款回流</div>
            </div>

            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="text-xs text-slate-400 font-medium">平均复购率估算</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">68.4%</div>
              <div className="text-[10px] text-emerald-300 font-bold">爆率好评拉动用户活跃</div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT & PRIZE POOL MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <span>{editingBox.id ? '编辑盲盒活动与奖池配比' : '新建盲盒活动'}</span>
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBox} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">盲盒中文标题 *</label>
                  <input
                    type="text"
                    required
                    value={editingBox.titleZh || ''}
                    onChange={(e) => setEditingBox({ ...editingBox, titleZh: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">英文标题 (EN)</label>
                  <input
                    type="text"
                    value={editingBox.titleEn || ''}
                    onChange={(e) => setEditingBox({ ...editingBox, titleEn: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">所属自选分类 *</label>
                  <select
                    value={editingBox.categoryId}
                    onChange={(e) => setEditingBox({ ...editingBox, categoryId: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameZh} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">封面图片 URL</label>
                  <input
                    type="text"
                    value={editingBox.coverImage || ''}
                    onChange={(e) => setEditingBox({ ...editingBox, coverImage: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">单次购买抽盒价格 (₱) *</label>
                  <input
                    type="number"
                    required
                    value={editingBox.price || 0}
                    onChange={(e) => setEditingBox({ ...editingBox, price: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">盲盒估算参考价值 (₱)</label>
                  <input
                    type="number"
                    value={editingBox.originalValue || 0}
                    onChange={(e) => setEditingBox({ ...editingBox, originalValue: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">活动库存总量 *</label>
                  <input
                    type="number"
                    required
                    value={editingBox.stock || 0}
                    onChange={(e) => setEditingBox({ ...editingBox, stock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">上架状态</label>
                  <select
                    value={editingBox.status}
                    onChange={(e) => setEditingBox({ ...editingBox, status: e.target.value as any })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="active">正常上架</option>
                    <option value="inactive">暂时下架</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">盲盒文案描述</label>
                <textarea
                  rows={2}
                  value={editingBox.descriptionZh || ''}
                  onChange={(e) => setEditingBox({ ...editingBox, descriptionZh: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Prize Pool Config */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>奖池构成与中奖爆率配置</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">设置盲盒内部可抽中的各个奖品、价值与中奖概率(%)</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加新奖品</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingBox.items?.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="grid grid-cols-12 gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-white/5 items-center text-xs"
                    >
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="奖品名称"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>

                      <div className="col-span-2">
                        <select
                          value={item.rarity}
                          onChange={(e) => handleUpdateItem(idx, 'rarity', e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs font-black text-amber-400"
                        >
                          <option value="SSR">SSR 欧皇</option>
                          <option value="SR">SR 稀有</option>
                          <option value="R">R 优秀</option>
                          <option value="N">N 普通</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="价值 ₱"
                          value={item.value}
                          onChange={(e) => handleUpdateItem(idx, 'value', Number(e.target.value))}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-amber-300 font-mono"
                        />
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="概率 %"
                            value={item.probability}
                            onChange={(e) => handleUpdateItem(idx, 'probability', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono font-bold"
                          />
                          <span className="text-[10px] text-slate-400">%</span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="图片 URL"
                          value={item.image}
                          onChange={(e) => handleUpdateItem(idx, 'image', e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300"
                        />
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 hover:bg-rose-500/20 text-rose-400 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-500/20 transition-all"
                >
                  保存盲盒活动
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
