import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Bot,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { GroupBuyActivity } from '../../../types';

export const AdminGroupBuy: React.FC = () => {
  const {
    products,
    groupActivities,
    groupTeams,
    adminCreateGroupActivity,
    triggerVirtualGroupCompletion,
    language,
  } = useApp();

  const [groupTab, setGroupTab] = useState<'activities' | 'live_teams' | 'stats'>('activities');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newAct, setNewAct] = useState<Partial<GroupBuyActivity>>({
    title: 'Super Weekend Deal Group',
    productId: products[0]?.id || 'prod_01',
    groupExpireHours: 24,
    tiers: [
      { peopleCount: 2, price: 1299 },
      { peopleCount: 3, price: 1099 },
      { peopleCount: 5, price: 899 },
    ],
    virtualBuyEnabled: true,
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    adminCreateGroupActivity(newAct);
    setShowCreateModal(false);
  };

  const getTitle = (p: any) => {
    if (!p) return '';
    return language === 'ZH' ? p.titleZh : language === 'TL' ? p.titleTl : p.titleEn;
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Sub-tabs header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-2xl border border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setGroupTab('activities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              groupTab === 'activities'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>
              {language === 'ZH' ? `拼团活动列表 (${groupActivities.length})` : language === 'TL' ? `Mga Gawain sa Group Buy (${groupActivities.length})` : `Group Buy Activities (${groupActivities.length})`}
            </span>
          </button>
          <button
            onClick={() => setGroupTab('live_teams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              groupTab === 'live_teams'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>
              {language === 'ZH' ? `实时拼团监控 (${groupTeams.length})` : language === 'TL' ? `Subaybayan ang mga Koponan (${groupTeams.length})` : `Live Teams Monitor (${groupTeams.length})`}
            </span>
          </button>
          <button
            onClick={() => setGroupTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              groupTab === 'stats'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ZH' ? '拼团数据与机器人补齐' : language === 'TL' ? 'Pagsusuri at Virtual Match' : 'Analytics & Virtual Match'}
            </span>
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>
            {language === 'ZH' ? '新建拼团活动' : language === 'TL' ? 'Gumawa ng Group Buy' : 'Create Group Activity'}
          </span>
        </button>
      </div>

      {/* 1. ACTIVITIES LIST */}
      {groupTab === 'activities' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupActivities.map((act) => {
              const prod = products.find((p) => p.id === act.productId) || products[0];
              return (
                <div key={act.id} className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <img src={prod?.mainImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-white text-sm truncate">{act.title}</h4>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {language === 'ZH' ? '关联商品: ' : language === 'TL' ? 'Produkto: ' : 'Product: '}
                        {getTitle(prod)}
                      </span>
                    </div>
                  </div>

                  {/* Tier Pricing */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-white/10 space-y-1.5 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      {language === 'ZH' ? '阶梯组团价格:' : language === 'TL' ? 'Presyo ng Bawat Antas:' : 'Tier Pricing:'}
                    </span>
                    <div className="flex justify-between items-center">
                      {act.tiers.map((t) => (
                        <div key={t.peopleCount} className="text-center">
                          <span className="text-[10px] text-purple-300 font-extrabold block">
                            {t.peopleCount} {language === 'ZH' ? '人团' : language === 'TL' ? 'Tao' : 'Person'}
                          </span>
                          <span className="text-xs font-black text-[#FF8C61]">₱{t.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      <span>
                        {act.virtualBuyEnabled
                          ? (language === 'ZH' ? '已开启机器人凑团' : language === 'TL' ? 'May Virtual Match' : 'Virtual Match Enabled')
                          : (language === 'ZH' ? '仅限真实拼团' : language === 'TL' ? 'Manual Lamang' : 'Manual Only')}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {language === 'ZH' ? `时限: ${act.groupExpireHours}小时` : language === 'TL' ? `Oras: ${act.groupExpireHours} oras` : `Expiry: ${act.groupExpireHours}h`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. LIVE TEAMS MONITOR */}
      {groupTab === 'live_teams' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white">
              {language === 'ZH' ? '实时拼团组团监控流' : language === 'TL' ? 'Subaybayan ang mga Koponan sa Group Buy' : 'Active Group Teams Real-time Stream'}
            </h3>
            <span className="text-xs text-slate-400">
              {language === 'ZH' ? `团队总数: ${groupTeams.length}` : language === 'TL' ? `Kabuuan ng Koponan: ${groupTeams.length}` : `Total Teams: ${groupTeams.length}`}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {groupTeams.map((team) => (
              <div key={team.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{team.teamNo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      team.status === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {team.status === 'success' ? (language === 'ZH' ? '拼团成功' : language === 'TL' ? 'Kumpleto' : 'Completed') : (language === 'ZH' ? '拼团中' : language === 'TL' ? 'Nangangalap' : 'Forming')}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    {language === 'ZH'
                      ? `团长: ${team.leaderName} | 组团进度: ${team.currentCount}/${team.requiredCount} 人`
                      : language === 'TL'
                      ? `Lider: ${team.leaderName} | Progreso: ${team.currentCount}/${team.requiredCount} tao`
                      : `Leader: ${team.leaderName} | Progress: ${team.currentCount}/${team.requiredCount} members`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {team.status === 'forming' && (
                    <button
                      onClick={() => triggerVirtualGroupCompletion(team.id)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Bot className="w-4 h-4" />
                      <span>{language === 'ZH' ? '机器人一键凑团' : language === 'TL' ? 'Pilitin ang Pagtutugma' : 'Trigger Virtual Match'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GROUP BUY ANALYTICS & ROBOT POOL */}
      {groupTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10">
              <span className="text-slate-400 block mb-1">
                {language === 'ZH' ? '拼团成团转化率' : language === 'TL' ? 'Antas ng Pagtutugma' : 'Group Buy Conversion Rate'}
              </span>
              <span className="text-2xl font-black text-emerald-400">74.2%</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10">
              <span className="text-slate-400 block mb-1">
                {language === 'ZH' ? '机器人自动补齐率' : language === 'TL' ? 'Virtual Match Ratio' : 'Virtual Auto-Match Ratio'}
              </span>
              <span className="text-2xl font-black text-purple-300">18.5%</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10">
              <span className="text-slate-400 block mb-1">
                {language === 'ZH' ? '主要分享社交渠道' : language === 'TL' ? 'Pangunahing Channel ng Pag-share' : 'Top Share Channel'}
              </span>
              <span className="text-xl font-black text-blue-400">Facebook Messenger</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10">
              <span className="text-slate-400 block mb-1">
                {language === 'ZH' ? '拼团平均为买家节省' : language === 'TL' ? 'Karaniwang Bawas sa Bawat Order' : 'Avg Group Savings'}
              </span>
              <span className="text-2xl font-black text-[#FF8C61]">₱450 / Order</span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <h3 className="text-base font-black text-white">
              {language === 'ZH' ? '新建拼团活动' : language === 'TL' ? 'Gumawa ng Activity' : 'Create Group Buy Activity'}
            </h3>
            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '拼团活动标题' : language === 'TL' ? 'Pamagat ng Gawain' : 'Activity Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newAct.title || ''}
                  onChange={(e) => setNewAct({ ...newAct, title: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '选择关联商品' : language === 'TL' ? 'Pumili ng Produkto' : 'Select Product'}
                </label>
                <select
                  value={newAct.productId || ''}
                  onChange={(e) => setNewAct({ ...newAct, productId: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getTitle(p)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '拼团有效时限 (小时)' : language === 'TL' ? 'Oras ng Pag-expire (Oras)' : 'Group Expire Hours'}
                </label>
                <input
                  type="number"
                  value={newAct.groupExpireHours || 24}
                  onChange={(e) => setNewAct({ ...newAct, groupExpireHours: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white font-black py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '发布活动' : language === 'TL' ? 'I-publish' : 'Publish Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
