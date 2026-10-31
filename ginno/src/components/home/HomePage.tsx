import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Users,
  Gavel,
  Truck,
  Ticket,
  CalendarCheck,
  Gift,
  Award,
  ChevronRight,
  ChevronLeft,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Star,
  Plus,
  ArrowRight,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Wallet,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUICK_ENTRIES } from '../../data/mockData';
import { Product, AuctionItem } from '../../types';
import { getProductTitle, getQuickEntryTitle, getBlindBoxTitle } from '../../utils/i18nHelpers';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
  setSelectedAuction?: (auction: AuctionItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, setSelectedProduct, setSelectedAuction }) => {
  const {
    language,
    t,
    banners,
    products,
    groupActivities,
    groupTeams,
    auctions,
    placeAuctionBid,
    blindBoxes,
    addToCart,
    openQuickSpecModal,
    checkInToday,
    claimCoupon,
    coupons,
    user,
    openBlindBoxCheckout,
    openDirectGroupBuyModal,
  } = useApp();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const RECOMMENDED_PAGE_SIZE = 8;
  const recommendedRef = useRef<HTMLDivElement>(null);

  // Flash Sale pagination & per-item timer state
  const [flashSalePage, setFlashSalePage] = useState(1);
  const FLASH_SALE_PAGE_SIZE = 6;
  const flashSaleRef = useRef<HTMLDivElement>(null);
  const [flashItemTimes, setFlashItemTimes] = useState<Record<string, number>>({});

  // Group Deals pagination (6 per page)
  const [groupDealsPage, setGroupDealsPage] = useState(1);
  const GROUP_DEALS_PAGE_SIZE = 6;
  const groupDealsRef = useRef<HTMLDivElement>(null);

  // Auction Hall filter on HomePage
  const [auctionTabFilter, setAuctionTabFilter] = useState<'live' | 'upcoming'>('live');

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (recommendedRef.current) {
      recommendedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFlashSalePageChange = (newPage: number) => {
    setFlashSalePage(newPage);
    if (flashSaleRef.current) {
      flashSaleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGroupDealsPageChange = (newPage: number) => {
    setGroupDealsPage(newPage);
    if (groupDealsRef.current) {
      groupDealsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Banner auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const flashProducts = products.filter((p) => p.isFlashSale);
  const liveAuctions = auctions.filter((a) => a.status === 'live');
  const upcomingAuctions = auctions.filter((a) => a.status === 'upcoming');

  // Initialize and tick individual flash sale product timers
  useEffect(() => {
    const initialTimes: Record<string, number> = {};
    flashProducts.forEach((p, idx) => {
      const offsetSeconds = ((idx + 1) * 3420 + 1800) % 18000 + 1200;
      initialTimes[p.id] = offsetSeconds;
    });
    setFlashItemTimes(initialTimes);

    const timer = setInterval(() => {
      setFlashItemTimes((prev) => {
        const updated: Record<string, number> = { ...prev };
        let changed = false;
        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) {
            updated[id] -= 1;
            changed = true;
          } else {
            updated[id] = 7200;
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flashProducts.length]);

  // Flash Sale Pagination (6 per page)
  const totalFlashSalePages = Math.max(1, Math.ceil(flashProducts.length / FLASH_SALE_PAGE_SIZE));
  const currentFlashProducts = flashProducts.slice(
    (flashSalePage - 1) * FLASH_SALE_PAGE_SIZE,
    flashSalePage * FLASH_SALE_PAGE_SIZE
  );

  // Group Deals Pagination (6 per page)
  const totalGroupDealsPages = Math.max(1, Math.ceil(groupTeams.length / GROUP_DEALS_PAGE_SIZE));
  const currentGroupTeams = groupTeams.slice(
    (groupDealsPage - 1) * GROUP_DEALS_PAGE_SIZE,
    groupDealsPage * GROUP_DEALS_PAGE_SIZE
  );

  // Pagination for Recommended Products (8 per page)
  const totalRecommendedPages = Math.max(1, Math.ceil(products.length / RECOMMENDED_PAGE_SIZE));
  const currentRecommendedProducts = products.slice(
    (currentPage - 1) * RECOMMENDED_PAGE_SIZE,
    currentPage * RECOMMENDED_PAGE_SIZE
  );

  return (
    <div className="space-y-8 pb-12 bg-transparent text-slate-100">
      {/* Hero Banner Carousel */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative h-48 sm:h-72 lg:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-900/40 backdrop-blur-xl">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
                <span className="bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full w-max mb-2 shadow-lg shadow-purple-500/30 border border-white/20">
                  {t('home.featuredPromotion')}
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white max-w-2xl leading-tight drop-shadow-md">
                  {banner.title}
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[#FF6B35] text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-lg flex items-center gap-1.5"
                  >
                    <span>{t('home.shopNow')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute bottom-4 right-6 z-20 flex space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentBannerIndex ? 'bg-[#FF6B35] w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Icons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 shadow-xl border border-white/10 grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 text-center">
          {QUICK_ENTRIES.map((entry) => {
            const IconComp =
              entry.iconName === 'Zap'
                ? Zap
                : entry.iconName === 'Users'
                ? Users
                : entry.iconName === 'Gavel'
                ? Gavel
                : entry.iconName === 'Truck'
                ? Truck
                : entry.iconName === 'Ticket'
                ? Ticket
                : entry.iconName === 'CalendarCheck'
                ? CalendarCheck
                : entry.iconName === 'Gift'
                ? Gift
                : Award;

            return (
              <button
                key={entry.id}
                onClick={() => {
                  if (entry.linkTarget === '/flash-sale') setActiveTab('products');
                  else if (entry.linkTarget === '/group-buy') setActiveTab('group-buy');
                  else if (entry.linkTarget === '/auctions') setActiveTab('auctions');
                  else if (entry.linkTarget === '/blind-box') setActiveTab('blind-box');
                  else if (entry.linkTarget === '/checkin') checkInToday();
                  else if (entry.linkTarget === '/vouchers') claimCoupon(coupons[0].id);
                  else setActiveTab('products');
                }}
                className="flex flex-col items-center group relative cursor-pointer"
              >
                {entry.badge && (
                  <span className="absolute -top-1 right-1/2 translate-x-4 bg-[#EF476F] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full z-10 shadow-sm border border-slate-900">
                    {entry.badge}
                  </span>
                )}
                <div
                  className={`w-12 h-12 rounded-2xl ${entry.bgColor} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-1.5 border border-white/10`}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover:text-[#FF8C61] transition-colors">
                  {getQuickEntryTitle(entry, language)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blind Box Treasure Hunt Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-950/90 via-slate-900/90 to-indigo-950/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl text-white border border-purple-500/30 relative overflow-hidden">
          {/* Decorative Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white shadow-lg shadow-purple-500/30 animate-pulse">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>🎁 {t('home.blindBoxTitle')}</span>
                  <span className="text-xs bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-md">
                    {t('home.ssrGuaranteed')}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{t('home.blindBoxSubtitle')}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('blind-box')}
              className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-purple-600 px-4 py-2 rounded-2xl border border-purple-400/30 hover:border-purple-500 transition-all group shadow-md"
            >
              <span>{t('home.viewAllBlindBox')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Blind Box Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {blindBoxes.slice(0, 4).map((box) => {
              const topPrize = box.items?.find((i) => i.rarity === 'SSR') || box.items?.[0];
              const title = getBlindBoxTitle(box, language);

              return (
                <div
                  key={box.id}
                  onClick={() => openBlindBoxCheckout(box)}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-purple-400/60 hover:bg-white/10 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Image & Badges */}
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 border border-white/10 bg-slate-950/60">
                      <img
                        src={box.coverImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow border border-white/20">
                        100% WIN
                      </span>
                      {topPrize && (
                        <span className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-extrabold px-2 py-1 rounded-lg border border-amber-500/30 truncate flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">SSR: {topPrize.name}</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Tag */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold px-1.5 py-0.2 rounded">
                          ₱{box.originalValue} Value
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">
                          {box.salesCount} Unboxed
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                        {title}
                      </h4>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-[#FFD23F]">
                        ₱{box.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 line-through">
                        ₱{box.originalValue.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBlindBoxCheckout(box);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>{t('home.openBoxNow')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Flash Sale Section */}
      <div ref={flashSaleRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900/80 via-purple-950/40 to-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl text-white border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-r from-[#FF6B35] to-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/20">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>⚡ {t('home.flashSale')}</span>
                  <span className="text-xs bg-[#FFD23F] text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                    UP TO 70% OFF
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{t('home.flashSaleSubtitle')}</p>
              </div>
            </div>

            {/* View All Flash Sales Button */}
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-bold text-[#FF8C61] hover:text-white flex items-center gap-1 bg-white/5 hover:bg-[#FF6B35] px-3.5 py-1.5 rounded-2xl border border-white/10 hover:border-[#FF6B35] transition-all group shadow-sm"
            >
              <span>{t('home.viewAllFlashSales')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 6 Flash Sale Product Cards per page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFlashProducts.map((p) => {
              const sku = p.skus[0];
              const soldPct = Math.round(((p.flashSaleSold || 20) / (p.flashSaleStock || 50)) * 100);
              const itemSec = flashItemTimes[p.id] ?? 3600;
              const h = String(Math.floor(itemSec / 3600)).padStart(2, '0');
              const m = String(Math.floor((itemSec % 3600) / 60)).padStart(2, '0');
              const s = String(itemSec % 60).padStart(2, '0');

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setActiveTab('product-detail');
                  }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-3.5 flex gap-3 text-slate-100 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all border border-white/10 group shadow-lg flex-col sm:flex-row justify-between"
                >
                  <div className="relative w-full sm:w-28 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-950/40">
                    <img
                      src={p.mainImage}
                      alt={getProductTitle(p, language)}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-[#FF6B35] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow">
                      FLASH
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-xs font-bold line-clamp-2 text-slate-100 group-hover:text-[#FF8C61] transition-colors leading-snug">
                        {getProductTitle(p, language)}
                      </h4>

                      {/* Individual Countdown Timer Badge on Each Product */}
                      <div className="flex items-center gap-1.5 bg-slate-950/70 border border-amber-500/30 px-2 py-1 rounded-xl w-max my-1.5 backdrop-blur-md">
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                        <span className="text-[10px] text-amber-200 font-bold">{t('home.endsIn')}:</span>
                        <div className="flex items-center gap-0.5 font-mono text-white text-[10px] font-black">
                          <span className="bg-[#FF6B35] px-1 py-0.2 rounded shadow-xs">{h}</span>
                          <span className="text-[#FF6B35] font-black">:</span>
                          <span className="bg-[#FF6B35] px-1 py-0.2 rounded shadow-xs">{m}</span>
                          <span className="text-[#FF6B35] font-black">:</span>
                          <span className="bg-[#FF6B35] px-1 py-0.2 rounded shadow-xs">{s}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-base font-black text-[#FF8C61]">
                          ₱{p.flashSalePrice?.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ₱{sku.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="bg-gradient-to-r from-[#FF6B35] to-purple-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${soldPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                        <span>{t('home.sold')} {p.flashSaleSold}</span>
                        <span className="text-[#FF8C61] font-bold">{soldPct}% claimed</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flash Sale Pagination */}
          {totalFlashSalePages > 1 && (
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping"></span>
                {t('home.flashSaleSummary')
                  .replace('{start}', String((flashSalePage - 1) * FLASH_SALE_PAGE_SIZE + 1))
                  .replace('{end}', String(Math.min(flashSalePage * FLASH_SALE_PAGE_SIZE, flashProducts.length)))
                  .replace('{total}', String(flashProducts.length))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFlashSalePageChange(Math.max(1, flashSalePage - 1))}
                  disabled={flashSalePage === 1}
                  className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 hover:bg-[#FF6B35] hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-slate-200 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('home.prevPage')}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalFlashSalePages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handleFlashSalePageChange(pageNum)}
                      className={`min-w-[34px] h-9 px-2.5 rounded-xl font-black text-xs transition-all border ${
                        pageNum === flashSalePage
                          ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white border-white/40 shadow-lg shadow-purple-500/30 scale-105'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleFlashSalePageChange(Math.min(totalFlashSalePages, flashSalePage + 1))}
                  disabled={flashSalePage === totalFlashSalePages}
                  className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 hover:bg-[#FF6B35] hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-slate-200 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                >
                  <span className="hidden sm:inline">{t('home.nextPage')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hot Group Deals Section */}
      <div ref={groupDealsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>🔥 {t('home.groupDeals')}</span>
                  <span className="text-xs bg-[#FF6B35] text-white font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    SAMA-SAMA SALE
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {t('home.groupDealsSubtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('group-buy')}
              className="text-xs font-bold text-[#FF8C61] hover:underline flex items-center gap-1"
            >
              <span>{t('home.seeAllTeams')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Group Buy Deals per page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGroupTeams.map((team) => {
              const act = groupActivities.find((a) => a.id === team.activityId);
              const prod = products.find((p) => p.id === team.productId);

              if (!prod) return null;

              return (
                <div
                  key={team.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActiveTab('product-detail');
                  }}
                  className="border border-white/10 rounded-2xl p-4 flex gap-4 items-center bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-purple-500/40 transition-all shadow-lg cursor-pointer group relative overflow-hidden"
                >
                  <div className="relative w-20 h-20 shrink-0">
                    <img
                      src={prod.mainImage}
                      alt={getProductTitle(prod, language)}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-20 h-20 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 font-extrabold px-2 py-0.5 rounded-full">
                        {team.requiredCount}-Person Group
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mt-1 group-hover:text-purple-300 transition-colors">
                      {getProductTitle(prod, language)}
                    </h4>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-[#FF8C61]">
                        ₱{team.tierPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        ₱{prod.skus[0].price.toLocaleString()}
                      </span>
                    </div>

                    {/* Member Avatars and Action Buttons */}
                    {(() => {
                      const reqCount = Math.max(2, team.requiredCount || 3);
                      const displayM = team.members.slice(0, reqCount - 1);
                      const needed = Math.max(1, reqCount - displayM.length);

                      return (
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                          <div className="flex items-center -space-x-2">
                            {displayM.map((m, idx) => (
                              <img
                                key={idx}
                                src={m.avatar}
                                alt={m.nickname}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                                }}
                                className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover shadow-sm"
                              />
                            ))}
                            <div className="w-7 h-7 rounded-full bg-[#FF6B35]/20 text-[#FF8C61] text-[10px] font-black flex items-center justify-center border-2 border-slate-900">
                              +{needed}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDirectGroupBuyModal(team, prod);
                              }}
                              className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-90 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg shadow-purple-500/20 transition-all shrink-0"
                            >
                              {language === 'ZH' ? '直接拼团' : language === 'TL' ? 'Direktang Sumali' : 'Direct Group Buy'} ₱{team.tierPrice}
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Group Deals Pagination (6 per page) */}
          {totalGroupDealsPages > 1 && (
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping"></span>
                {t('home.groupDealsSummary')
                  .replace('{start}', String((groupDealsPage - 1) * GROUP_DEALS_PAGE_SIZE + 1))
                  .replace('{end}', String(Math.min(groupDealsPage * GROUP_DEALS_PAGE_SIZE, groupTeams.length)))
                  .replace('{total}', String(groupTeams.length))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGroupDealsPageChange(Math.max(1, groupDealsPage - 1))}
                  disabled={groupDealsPage === 1}
                  className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 hover:bg-[#FF6B35] hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-slate-200 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('home.prevPage')}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalGroupDealsPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handleGroupDealsPageChange(pageNum)}
                      className={`min-w-[34px] h-9 px-2.5 rounded-xl font-black text-xs transition-all border ${
                        pageNum === groupDealsPage
                          ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white border-white/40 shadow-lg shadow-purple-500/30 scale-105'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleGroupDealsPageChange(Math.min(totalGroupDealsPages, groupDealsPage + 1))}
                  disabled={groupDealsPage === totalGroupDealsPages}
                  className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 hover:bg-[#FF6B35] hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-slate-200 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                >
                  <span className="hidden sm:inline">{t('home.nextPage')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Auctions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-950/90 via-purple-950/60 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl text-white border border-purple-500/20 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-500/30">
                  <Gavel className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span>🔨 {t('home.liveAuctions')}</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-extrabold px-2.5 py-0.5 rounded-full border border-purple-500/40">
                      {language === 'ZH'
                        ? '透明竞拍 · 低至 ₱1 起拍'
                        : language === 'TL'
                        ? 'Maliwanag na Subasta · Nagsisimula sa ₱1'
                        : 'Transparent Bidding · Starts at ₱1'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t('home.liveAuctionsSubtitle')}
                  </p>
                </div>
              </div>

              {/* Live vs Upcoming Sub-Tabs */}
              <div className="flex items-center p-1 bg-white/10 rounded-2xl border border-white/10">
                <button
                  onClick={() => setAuctionTabFilter('live')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    auctionTabFilter === 'live'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  <span>
                    {language === 'ZH'
                      ? `正在热拍中 (${liveAuctions.length})`
                      : language === 'TL'
                      ? `Nagpe-peke Ngayon (${liveAuctions.length})`
                      : `Live Bidding (${liveAuctions.length})`}
                  </span>
                </button>
                <button
                  onClick={() => setAuctionTabFilter('upcoming')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    auctionTabFilter === 'upcoming'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-slate-950" />
                  <span>
                    {language === 'ZH'
                      ? `待开始活动 (${upcomingAuctions.length})`
                      : language === 'TL'
                      ? `Magsisimula Palang (${upcomingAuctions.length})`
                      : `Upcoming (${upcomingAuctions.length})`}
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('auctions')}
              className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1 bg-purple-600/30 hover:bg-purple-600 px-4 py-2 rounded-2xl border border-purple-400/30 transition-all group shrink-0 shadow-lg"
            >
              <span>
                {language === 'ZH'
                  ? '进入竞拍大厅'
                  : language === 'TL'
                  ? 'Pumunta sa Hall'
                  : 'Enter Auction Hall'}
              </span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Visual Banner Introduction Strips (图片图形化介绍) */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 p-3 rounded-2xl border border-purple-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center shrink-0 text-xl">
                ⚡
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH'
                    ? '秒级实时加价'
                    : language === 'TL'
                    ? 'Mabilis na Pag-alok'
                    : 'Real-Time Bidding'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH'
                    ? '公开透明 竞价直观'
                    : language === 'TL'
                    ? 'Lahat ay Maliwanag'
                    : 'Transparent & Live'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 p-3 rounded-2xl border border-indigo-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shrink-0 text-xl">
                🛡️
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH'
                    ? '100% 正品保障'
                    : language === 'TL'
                    ? '100% Orihinal'
                    : '100% Authentic'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH'
                    ? '官方渠道 验真发货'
                    : language === 'TL'
                    ? 'Inspeksyon Bago Ipadala'
                    : 'Verified Stocks'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/40 to-slate-900/60 p-3 rounded-2xl border border-amber-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-400/30 flex items-center justify-center shrink-0 text-xl">
                ⏳
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH'
                    ? '5分钟延时防踩'
                    : language === 'TL'
                    ? '5-Min Anti-Snipe'
                    : '5-Min Anti-Snipe'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH'
                    ? '尾秒出价 自动顺延'
                    : language === 'TL'
                    ? 'Patas na Pag-alok'
                    : 'Late Bids Extend'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-900/40 to-slate-900/60 p-3 rounded-2xl border border-rose-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-400/30 flex items-center justify-center shrink-0 text-xl">
                📦
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {language === 'ZH'
                    ? '24小时包邮交割'
                    : language === 'TL'
                    ? '24-Oras na Ipadala'
                    : '24h Fast Dispatch'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ZH'
                    ? '中拍付清 快速送达'
                    : language === 'TL'
                    ? 'Libreng Pagpapadala'
                    : 'Free Shipping'}
                </div>
              </div>
            </div>
          </div>

          {/* Auction Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(
              (auctionTabFilter === 'live' ? liveAuctions : upcomingAuctions).length > 0
                ? (auctionTabFilter === 'live' ? liveAuctions : upcomingAuctions).slice(0, 3)
                : auctions.slice(0, 3)
            ).map((auc) => {
              const prod = products.find((p) => p.id === auc.productId);
              const title = prod ? getProductTitle(prod, language) : auc.title;
              const nextMinBid = auc.currentHighestBid + auc.bidIncrement;
              const isLive = auc.status === 'live';

              return (
                <div
                  key={auc.id}
                  onClick={() => {
                    if (prod) setSelectedProduct(prod);
                    if (setSelectedAuction) setSelectedAuction(auc);
                    setActiveTab('auction-detail');
                  }}
                  className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-purple-500/60 hover:bg-slate-850 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Item Image with Badges */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10 bg-slate-950">
                      <img
                        src={auc.mainImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isLive ? (
                        <span className="absolute top-2 left-2 bg-red-600/95 text-white text-[9px] font-black px-2.5 py-0.5 rounded-md shadow flex items-center gap-1 border border-white/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          {language === 'ZH' ? '🔴 LIVE 正在竞拍' : language === 'TL' ? '🔴 LIVE Nagpe-peke' : '🔴 LIVE Bidding'}
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-amber-500/95 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-md shadow flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3 h-3 text-slate-950" />
                          {language === 'ZH' ? '⏰ 待开始 UPCOMING' : language === 'TL' ? '⏰ Magsisimula' : '⏰ UPCOMING'}
                        </span>
                      )}

                      <span className="absolute bottom-2 right-2 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border border-amber-500/30">
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

                    {/* Title */}
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                      {title}
                    </h4>

                    {/* Price Box */}
                    <div className="mt-2.5 bg-slate-950/70 p-2.5 rounded-xl border border-white/10 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>
                          {isLive
                            ? language === 'ZH'
                              ? '当前最高出价'
                              : language === 'TL'
                              ? 'Kasalukuyang Mataas'
                              : 'Current Highest Bid'
                            : language === 'ZH'
                            ? '开拍设定起拍价'
                            : language === 'TL'
                            ? 'Panimulang Halaga'
                            : 'Starting Price'}
                        </span>
                        <span>{t('home.startingPrice')}: ₱{auc.startingBid.toLocaleString()}</span>
                      </div>
                      <div className="text-xl font-black text-[#FFD23F] animate-pulse">
                        ₱{auc.currentHighestBid.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Top Bidder or Countdown & Quick Bid */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 gap-2">
                    {isLive ? (
                      <div className="flex items-center gap-1.5 truncate max-w-[50%]">
                        <img
                          src={auc.currentHighestBidderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                          }}
                          className="w-5 h-5 rounded-full object-cover border border-purple-400 shrink-0"
                        />
                        <span className="truncate text-slate-200 font-medium">
                          {auc.currentHighestBidderName || (language === 'ZH' ? '匿名买家' : 'Anonymous')}
                        </span>
                      </div>
                    ) : (
                      <div className="text-amber-300 font-bold truncate">
                        🕒 {language === 'ZH' ? '开拍: ' : language === 'TL' ? 'Magsisimula: ' : 'Starts: '}
                        {new Date(auc.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (prod) setSelectedProduct(prod);
                        if (setSelectedAuction) setSelectedAuction(auc);
                        setActiveTab('auction-detail');
                      }}
                      className={`font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1 shrink-0 ${
                        isLive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/30'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      <span>{isLive ? `🔨 ${language === 'ZH' ? '去竞拍' : language === 'TL' ? 'Mag-alok' : 'Bid Now'}` : '⏰ 关注提醒'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended For You (Waterfall Grid) */}
      <div ref={recommendedRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              {t('home.recommended')}
            </h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
              {products.length} {t('home.sold') !== 'sold' ? '' : ''}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-[#FF8C61] hover:underline flex items-center gap-1"
          >
            <span>{t('home.exploreAllStore')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Products per Page */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentRecommendedProducts.map((p) => {
            const sku = p.skus[0];

            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setActiveTab('product-detail');
                }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-slate-950/40">
                    <img
                      src={p.mainImage}
                      alt={getProductTitle(p, language)}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    {p.tags.includes('Free Shipping') && (
                      <span className="absolute top-2 left-2 bg-emerald-500/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-white/20">
                        {t('nav.freeShipping')}
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {p.brandName || 'Ginno Select'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2 mt-0.5 group-hover:text-[#FF8C61] transition-colors leading-snug">
                      {getProductTitle(p, language)}
                    </h4>

                    <div className="flex items-center space-x-1 mt-1.5 text-[11px] text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{p.rating}</span>
                      <span className="text-slate-400 font-normal">({p.salesCount} {t('home.sold')})</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                  <div>
                    <span className="text-base font-black text-[#FF8C61]">
                      ₱{sku.price.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-500 line-through">
                      ₱{sku.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickSpecModal(p);
                    }}
                    className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-90 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                    title={t('product.selectSpecs')}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{language === 'ZH' ? '购买' : language === 'TL' ? 'Bumili' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Professional Recommended Products Pagination */}
        {totalRecommendedPages > 1 && (
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
            {/* Left: Summary text */}
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse"></span>
              {t('home.showingSummary')
                .replace('{start}', String((currentPage - 1) * RECOMMENDED_PAGE_SIZE + 1))
                .replace('{end}', String(Math.min(currentPage * RECOMMENDED_PAGE_SIZE, products.length)))
                .replace('{total}', String(products.length))}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-200 disabled:hover:border-white/10 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t('home.prevPage')}</span>
              </button>

              <div className="flex items-center gap-1.5 px-1">
                {Array.from({ length: totalRecommendedPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[36px] h-9 px-2.5 rounded-xl font-black text-xs transition-all border ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white border-white/40 shadow-lg shadow-purple-500/30 scale-105'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalRecommendedPages, currentPage + 1))}
                disabled={currentPage === totalRecommendedPages}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-200 disabled:hover:border-white/10 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <span className="hidden sm:inline">{t('home.nextPage')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
