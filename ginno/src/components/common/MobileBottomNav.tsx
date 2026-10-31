import React from 'react';
import { Home, Grid, Users, Gavel, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { isAdminView, t } = useApp();

  if (isAdminView) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 z-40 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around relative">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'home' ? 'text-[#FF8C61]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">{t('nav.home')}</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'categories' ? 'text-[#FF8C61]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">{t('nav.allCategories')}</span>
        </button>

        {/* Group Buy (CENTERED HIGHLIGHT) */}
        <button
          onClick={() => setActiveTab('group-buy')}
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B35] to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 border-4 border-slate-950 transform active:scale-95 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <span
            className={`text-[10px] font-extrabold mt-0.5 ${
              activeTab === 'group-buy' ? 'text-[#FF8C61]' : 'text-slate-300'
            }`}
          >
            {t('nav.groupBuy')}
          </span>
        </button>

        {/* Auction */}
        <button
          onClick={() => setActiveTab('auctions')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'auctions' ? 'text-purple-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gavel className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">{t('nav.auctions')}</span>
        </button>

        {/* Me */}
        <button
          onClick={() => setActiveTab('user')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'user' ? 'text-[#FF8C61]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">{t('nav.userCenter')}</span>
        </button>
      </div>
    </nav>
  );
};
