import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  User,
  Globe,
  LayoutDashboard,
  Store,
  FileText,
  X,
  ChevronRight,
  Flame,
  Sparkles,
  Users,
  Gavel,
  Gift,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenDocs,
}) => {
  const {
    language,
    setLanguage,
    t,
    isAdminView,
    setIsAdminView,
    setShowAuthModal,
    openAuthModal,
    user,
    cart,
    wishlist,
    notifications,
    markNotificationsRead,
    products,
  } = useApp();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const hotSearches = ['Anker Space Q45', 'Air Fryer XL', 'Centella Gel', 'PS5 Slim', 'AIRism Tee'];

  if (isAdminView) return null;

  return (
    <header className="sticky top-0 z-40 bg-[#020617]/70 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/30 text-slate-100">
      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setIsAdminView(false);
            setActiveTab('home');
          }}
          className="flex items-center space-x-2 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            G
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
                Ginno
              </span>
              <span className="text-xs bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 font-semibold px-1.5 py-0.5 rounded">
                吉诺
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Quality Chosen, Promise Kept
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        {!isAdminView && (
          <div className="relative flex-1 max-w-xl hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35] transition-all"
              />
              <button
                onClick={() => setActiveTab('products')}
                className="absolute right-1.5 p-1.5 bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Auto Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 z-50">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#FF6B35]" /> Hot Searches in PH
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hotSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          setActiveTab('products');
                        }}
                        className="text-xs bg-white/5 border border-white/10 hover:bg-[#FF6B35]/20 hover:text-[#FF8C61] hover:border-[#FF6B35]/40 text-slate-300 px-3 py-1 rounded-full transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Controls / Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Selector (国际化语言切换) */}
          <div className="flex items-center space-x-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-2.5 py-1 text-xs transition-colors backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-[#FF8C61] shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-slate-200 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="EN" className="bg-slate-900 text-slate-100">English (PH)</option>
              <option value="TL" className="bg-slate-900 text-slate-100">Tagalog (PH)</option>
              <option value="ZH" className="bg-slate-900 text-slate-100">简体中文</option>
            </select>
          </div>

          {/* Admin Switcher Button */}
          <button
            onClick={() => setIsAdminView(!isAdminView)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
              isAdminView
                ? 'bg-slate-800 border border-white/20 text-white hover:bg-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-orange-500/20'
            }`}
          >
            {isAdminView ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span>{t('nav.buyerStore')}</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t('nav.adminPortal')}</span>
              </>
            )}
          </button>

          {!isAdminView && (
            <>
              {/* Wishlist */}
              <button
                onClick={() => setActiveTab('user')}
                className="relative p-2 text-slate-300 hover:text-[#FF6B35] transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full shadow-sm shadow-[#FF6B35]" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifDropdown(!showNotifDropdown);
                    markNotificationsRead();
                  }}
                  className="relative p-2 text-slate-300 hover:text-[#FF6B35] transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#EF476F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popup */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-4 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h4 className="text-xs font-bold text-slate-200">Notifications</h4>
                      <button
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-white/5 mt-2">
                      {notifications.map((n) => (
                        <div key={n.id} className="py-2.5 text-xs">
                          <p className="font-semibold text-slate-100">{n.title}</p>
                          <p className="text-slate-400 mt-0.5 leading-relaxed">{n.content}</p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart */}
              <button
                onClick={() => setActiveTab('cart')}
                className="relative p-2 bg-white/5 border border-white/10 text-[#FF8C61] hover:bg-[#FF6B35] hover:text-white rounded-full transition-all"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-slate-950 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile / Auth */}
              {user?.id !== 'usr_guest' ? (
                <button
                  onClick={() => setActiveTab('user')}
                  className="flex items-center space-x-2 pl-2 border-l border-white/10 hover:opacity-90 transition-opacity"
                  title="View User Center"
                >
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/50"
                  />
                  <div className="hidden lg:block text-left">
                    <span className="block text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                      {user.nickname}
                    </span>
                    <span className="block text-[9px] text-[#FF8C61] font-bold">
                      {user.memberLevel} Member
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
                  >
                    {t('auth.signIn')}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="text-xs font-bold bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-90 text-white px-3 py-1.5 rounded-full transition-all shadow-md"
                  >
                    {t('auth.register')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Nav Links (Desktop) */}
      {!isAdminView && (
        <div className="hidden md:block bg-slate-950/40 border-t border-white/5 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold text-slate-300 h-10">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`h-10 flex items-center border-b-2 transition-colors ${
                  activeTab === 'home'
                    ? 'border-[#FF6B35] text-[#FF8C61]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`h-10 flex items-center border-b-2 transition-colors ${
                  activeTab === 'categories'
                    ? 'border-[#FF6B35] text-[#FF8C61]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                {t('nav.allCategories')}
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`h-10 flex items-center border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-[#FF6B35] text-[#FF8C61]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                {t('nav.categories')}
              </button>
              <button
                onClick={() => setActiveTab('group-buy')}
                className={`h-10 flex items-center space-x-1 border-b-2 transition-colors ${
                  activeTab === 'group-buy'
                    ? 'border-[#FF6B35] text-[#FF8C61]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>{t('nav.groupBuy')}</span>
              </button>
              <button
                onClick={() => setActiveTab('auctions')}
                className={`h-10 flex items-center space-x-1 border-b-2 transition-colors ${
                  activeTab === 'auctions'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                <Gavel className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
                <span>{t('nav.auctions')}</span>
              </button>
              <button
                onClick={() => setActiveTab('blind-box')}
                className={`h-10 flex items-center space-x-1 border-b-2 transition-colors relative ${
                  activeTab === 'blind-box'
                    ? 'border-pink-500 text-pink-400'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-pink-400" />
                <span>{t('nav.blindBox')}</span>
                <span className="ml-1 bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full animate-pulse">
                  HOT
                </span>
              </button>
            </div>

            {user?.role === 'merchant' ? (
              <button
                onClick={() => setActiveTab('user')}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-500/30 rounded-full text-xs font-bold transition-all shadow-sm"
                title={language === 'ZH' ? '进入店家经营工作台' : 'Store Merchant Dashboard'}
              >
                <Store className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'ZH' ? '🏪 店铺经营罗盘' : 'Merchant Hub'}</span>
              </button>
            ) : user?.role === 'buyer' ? (
              /* 购买用户不展示任何企业合作与开店入驻入口 */
              null
            ) : (
              <button
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold transition-all shadow-sm"
                title={language === 'ZH' ? '企业或个人店家合作入驻' : 'Become a Merchant Partner'}
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ZH' ? '合作开店入驻 ⚡' : 'Merchant Partner ⚡'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
