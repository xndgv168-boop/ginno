import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Award,
  CreditCard,
  Gift,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserProfile } from '../../../types';

export const AdminUsers: React.FC = () => {
  const { user, adminUpdateUser, adminSaveCoupon, language } = useApp();

  const [userTab, setUserTab] = useState<'list' | 'levels'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // User list mock data combined with real user
  const mockUsers: UserProfile[] = [
    user,
    {
      id: 'usr_8820',
      phone: '+63 917 888 9999',
      nickname: 'Juan Dela Cruz',
      email: 'juan.delacruz@example.ph',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      memberLevel: 'Gold',
      points: 4850,
      walletBalance: 12500,
      inviteCode: 'JUAN88',
      registerSource: 'phone',
      status: 'active',
      createdAt: '2026-01-15T00:00:00Z',
    },
    {
      id: 'usr_8821',
      phone: '+63 918 777 6666',
      nickname: 'Maria Santos',
      email: 'maria.santos@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      memberLevel: 'Diamond',
      points: 12900,
      walletBalance: 45000,
      inviteCode: 'MARIA99',
      registerSource: 'google',
      status: 'active',
      createdAt: '2025-11-20T00:00:00Z',
    },
  ];

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const handleGrantPoints = (u: UserProfile) => {
    const pts = prompt('Enter points to grant to user:', '500');
    if (pts && !isNaN(Number(pts))) {
      adminUpdateUser({ points: u.points + Number(pts) });
      alert(`Granted ${pts} points to ${u.nickname}`);
    }
  };

  const handleGrantWallet = (u: UserProfile) => {
    const amount = prompt('Enter wallet balance (₱) to add:', '1000');
    if (amount && !isNaN(Number(amount))) {
      adminUpdateUser({ walletBalance: u.walletBalance + Number(amount) });
      alert(`Added ₱${amount} to ${u.nickname}'s wallet balance`);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Sub-tabs header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-2xl border border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setUserTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              userTab === 'list'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {language === 'ZH' ? '用户数据列表' : language === 'TL' ? 'Pamamahala ng User' : 'User Management'}
            </span>
          </button>
          <button
            onClick={() => setUserTab('levels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              userTab === 'levels'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>
              {language === 'ZH' ? '会员 VIP 等级规则' : language === 'TL' ? 'Antas ng VIP' : 'VIP Levels Config'}
            </span>
          </button>
        </div>
      </div>

      {/* 1. USER LIST */}
      {userTab === 'list' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by phone, nickname, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Phone & Email</th>
                  <th className="p-3">VIP Level</th>
                  <th className="p-3">Wallet & Points</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        <div>
                          <span className="font-bold text-white text-xs block">{u.nickname}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-slate-200 block">{u.phone}</span>
                      <span className="text-[10px] text-slate-400">{u.email || 'N/A'}</span>
                    </td>
                    <td className="p-3">
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {u.memberLevel} VIP
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-black text-[#06D6A0] block">₱{(u.walletBalance ?? 0).toLocaleString()}</span>
                      <span className="text-[10px] text-amber-400 font-bold">{(u.points ?? 0).toLocaleString()} Points</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 font-bold rounded-lg text-[11px]"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleGrantPoints(u)}
                          className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold rounded-lg text-[11px]"
                        >
                          +Points
                        </button>
                        <button
                          onClick={() => handleGrantWallet(u)}
                          className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold rounded-lg text-[11px]"
                        >
                          +Wallet
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. VIP LEVELS CONFIG */}
      {userTab === 'levels' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white">
            {language === 'ZH' ? '会员 VIP 等级规则矩阵' : language === 'TL' ? 'Antas ng VIP Membership' : 'VIP Membership Levels Matrix'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {[
              { level: 'VIP 1 Bronze', minSpend: '₱0', perk: '1x Points Cashback' },
              { level: 'VIP 2 Silver', minSpend: '₱5,000', perk: '1.2x Points + Free Shipping Vouchers' },
              { level: 'VIP 3 Gold', minSpend: '₱20,000', perk: '1.5x Points + Priority Live Auction Bidding' },
              { level: 'VIP 4 Diamond', minSpend: '₱50,000', perk: '2.0x Points + VIP Concierge CS Support' },
            ].map((lvl) => (
              <div key={lvl.level} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="font-extrabold text-amber-300 text-sm block">{lvl.level}</span>
                <span className="text-[11px] text-slate-400 block">Min Spending: {lvl.minSpend}</span>
                <p className="text-xs text-slate-200 font-semibold pt-1 border-t border-white/10">{lvl.perk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">User Details: {selectedUser.nickname}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
                <img src={selectedUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-extrabold text-white text-sm">{selectedUser.nickname}</h4>
                  <p className="text-[10px] text-slate-400">{selectedUser.phone} | {selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center bg-slate-950/60 p-3 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 block">Wallet Balance</span>
                  <span className="text-sm font-black text-[#06D6A0]">₱{(selectedUser.walletBalance ?? 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Points Balance</span>
                  <span className="text-sm font-black text-amber-400">{selectedUser.points} Pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
