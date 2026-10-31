import React, { useState } from 'react';
import {
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Info,
  Star,
  Users,
  ChevronRight,
  Minus,
  Plus,
  MessageSquare,
  Check,
  MapPin,
  Ticket,
  Zap,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductSku } from '../../types';
import { INITIAL_REVIEWS } from '../../data/mockData';
import { getProductTitle } from '../../utils/i18nHelpers';

interface ProductDetailPageProps {
  product: Product;
  setActiveTab: (tab: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  setActiveTab,
}) => {
  const {
    addToCart,
    cart,
    wishlist,
    toggleWishlist,
    groupActivities,
    groupTeams,
    openDirectGroupBuyModal,
    addresses,
    claimCoupon,
    coupons,
    submitProductReview,
    language,
    t,
    openReturnPolicyModal,
  } = useApp();

  const [selectedImg, setSelectedImg] = useState<string>(product.mainImage);
  const [selectedSku, setSelectedSku] = useState<ProductSku>(product.skus[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeDetailTab, setActiveDetailTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isAdded, setIsAdded] = useState(false);

  React.useEffect(() => {
    setSelectedImg(product.mainImage);
    if (product.skus && product.skus.length > 0) {
      setSelectedSku(product.skus[0]);
    }
  }, [product.id, product.mainImage]);

  // Review form modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Shipping Calculator state
  const [selectedProvince, setSelectedProvince] = useState<string>('Metro Manila');

  const isLiked = wishlist.includes(product.id);
  const groupAct = groupActivities.find((g) => g.productId === product.id);

  const productReviews = INITIAL_REVIEWS.filter((r) => r.productId === product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: getProductTitle(product, language), url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(
        language === 'ZH'
          ? '商品链接已复制到剪贴板！'
          : language === 'TL'
          ? 'Kopyado na ang link ng produkto!'
          : 'Product link copied to clipboard!'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-28 text-slate-100">
      {/* Top Product Hero Block */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950/40 border border-white/10 group">
            <img
              src={selectedImg}
              alt={getProductTitle(product, language)}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleShare}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-900 text-slate-200 rounded-full shadow-md backdrop-blur-md transition-colors border border-white/10"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-colors border border-white/10 ${
                  isLiked ? 'bg-[#FF6B35] text-white' : 'bg-slate-900/80 text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(img)}
                className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                  selectedImg === img ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/30' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Information & Options */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {product.brandName || 'Ginno Official'}
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                {language === 'ZH' ? '100% 正品保障' : language === 'TL' ? '100% Tunay na Produkto' : '100% Authentic'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {getProductTitle(product, language)}
            </h1>
            <p className="text-xs text-slate-400 mt-1">{product.subtitle}</p>

            {/* Ratings & Sold */}
            <div className="flex items-center space-x-4 mt-3 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">
                  {language === 'ZH'
                    ? `(${product.reviewCount} 条评价)`
                    : language === 'TL'
                    ? `(${product.reviewCount} mga review)`
                    : `(${product.reviewCount} reviews)`}
                </span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <span className="text-xs text-slate-300 font-semibold">
                {language === 'ZH'
                  ? `已售 ${product.salesCount} 件`
                  : language === 'TL'
                  ? `Nai-benta: ${product.salesCount}`
                  : `${product.salesCount} Sold`}
              </span>
            </div>

            {/* Service Guarantees Bar including clickable 7天无理由退换 */}
            <div className="flex flex-wrap items-center gap-2 mt-3 p-2.5 bg-slate-900/60 rounded-2xl border border-white/10 text-xs">
              <span className="text-slate-400 font-bold text-[11px] uppercase mr-0.5">
                {language === 'ZH' ? '服务保障：' : 'Guarantees:'}
              </span>
              <button
                type="button"
                onClick={openReturnPolicyModal}
                className="inline-flex items-center gap-1.5 bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 border border-[#FF6B35]/40 text-[#FF8C61] px-2.5 py-1 rounded-xl font-extrabold transition-all group shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FF8C61]" />
                <span>{language === 'ZH' ? '7天无理由退换' : language === 'TL' ? '7-Araw Libreng Return' : '7-Day Free Return'}</span>
                <span className="text-[10px] bg-[#FF6B35]/40 px-1 py-0.2 rounded text-white font-normal group-hover:bg-[#FF6B35] transition-colors">
                  {language === 'ZH' ? '查看规则' : 'Rules'}
                </span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform opacity-80" />
              </button>
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-xl font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'ZH' ? '100% 正品' : '100% Authentic'}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-xl font-bold text-[11px]">
                <Truck className="w-3.5 h-3.5" />
                <span>{language === 'ZH' ? '极速包邮' : 'Fast Delivery'}</span>
              </span>
            </div>

            {/* Price Banner & Activity Banner */}
            {groupAct ? (
              <div className="bg-gradient-to-r from-[#FF6B35]/20 via-purple-600/20 to-indigo-600/20 border border-[#FF6B35]/40 rounded-2xl p-3.5 mt-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF6B35]/30 border border-[#FF6B35]/40 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#FF8C61]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#FF8C61] flex items-center gap-1.5">
                      <span>{language === 'ZH' ? '🔥 全民拼团特惠进行中' : language === 'TL' ? '🔥 Group Buy Active' : '🔥 Group Buy Active'}</span>
                      <span className="bg-purple-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">HOT</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      {language === 'ZH' ? `拼团阶梯价低至 ₱${groupAct.tiers[groupAct.tiers.length - 1].price.toLocaleString()} · 呼朋唤友拼团立省` : `Group price as low as ₱${groupAct.tiers[groupAct.tiers.length - 1].price.toLocaleString()}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#FF8C61] font-bold">{language === 'ZH' ? '拼团特惠价' : 'Group Price'}</div>
                  <div className="text-xl font-black text-[#FF8C61]">
                    ₱{groupAct.tiers[groupAct.tiers.length - 1].price.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : product.isFlashSale && product.flashSalePrice ? (
              <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-600/20 border border-amber-500/40 rounded-2xl p-3.5 mt-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <span>{language === 'ZH' ? '⚡ 限时秒杀活动进行中' : language === 'TL' ? '⚡ Live na Flash Sale' : '⚡ Flash Sale Live'}</span>
                      <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">HOT</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      {language === 'ZH' ? '秒杀特惠价 · 数量有限 售完即止' : language === 'TL' ? 'Presyong Flash Sale · Limitadong Stocks' : 'Flash Sale Special Price · Limited Quantity'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-amber-200 font-bold">{language === 'ZH' ? '秒杀特价' : language === 'TL' ? 'Presyong Flash' : 'Flash Price'}</div>
                  <div className="text-xl font-black text-[#FFD23F] animate-pulse">
                    ₱{product.flashSalePrice.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 mt-4 border border-white/10 shadow-lg space-y-3">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-black text-[#FF8C61]">
                  ₱{(
                    (product.isFlashSale && product.flashSalePrice)
                      ? product.flashSalePrice
                      : groupAct
                      ? groupAct.tiers[groupAct.tiers.length - 1].price
                      : selectedSku.price
                  ).toLocaleString()}
                </span>
                <span className="text-sm text-slate-500 line-through">
                  ₱{selectedSku.originalPrice.toLocaleString()}
                </span>
                <span className="bg-[#FF6B35] text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                  -{Math.round(((selectedSku.originalPrice - (
                    (product.isFlashSale && product.flashSalePrice)
                      ? product.flashSalePrice
                      : groupAct
                      ? groupAct.tiers[groupAct.tiers.length - 1].price
                      : selectedSku.price
                  )) / selectedSku.originalPrice) * 100)}%
                </span>
              </div>

              {product.isFlashSale ? (
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-[#FF6B35] h-full rounded-full animate-pulse"
                      style={{ width: `${Math.round(((product.flashSaleSold || 20) / (product.flashSaleStock || 50)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>
                      {language === 'ZH'
                        ? `已抢 ${product.flashSaleSold || 20} 件`
                        : language === 'TL'
                        ? `Nakuha na: ${product.flashSaleSold || 20}`
                        : `Claimed: ${product.flashSaleSold || 20}`}
                    </span>
                    <span className="text-amber-400 font-bold">
                      {Math.round(((product.flashSaleSold || 20) / (product.flashSaleStock || 50)) * 100)}%{' '}
                      {language === 'ZH' ? '已抢购' : language === 'TL' ? 'Naubos na' : 'Claimed'}
                    </span>
                  </div>
                </div>
              ) : groupAct ? (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>{language === 'ZH' ? '拼团阶梯优惠' : 'Group Tiers'}</span>
                    <span className="text-[#FF8C61]">{language === 'ZH' ? '最高省' : 'Save up to'} ₱{selectedSku.originalPrice - groupAct.tiers[groupAct.tiers.length - 1].price}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {groupAct.tiers.map((t, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                        <div className="text-[10px] text-slate-400 font-bold">{t.peopleCount} {language === 'ZH' ? '人团' : 'Person'}</div>
                        <div className="text-xs font-black text-[#FF8C61]">₱{t.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Vouchers Claim */}
            <div className="mt-4 flex items-center justify-between p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-[#FF8C61]" />
                <span className="text-xs font-bold text-slate-200">
                  {language === 'ZH'
                    ? '优惠券：新客首单立减 ₱500'
                    : language === 'TL'
                    ? 'Kupon: ₱500 Bawas sa Bagong Customer'
                    : 'Voucher: ₱500 Off New Customer'}
                </span>
              </div>
              <button
                onClick={() => claimCoupon(coupons[0].id)}
                className="text-xs bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white font-bold px-3 py-1 rounded-full shadow-md"
              >
                {language === 'ZH' ? '立即领取' : language === 'TL' ? 'Kumuha' : 'Claim'}
              </button>
            </div>

            {/* SKU Selector */}
            <div className="mt-6 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {language === 'ZH' ? '选择规格与配置：' : language === 'TL' ? 'Pumili ng Uri / Specs:' : 'Select Option / Specs:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.skus.map((sku) => {
                  const label = Object.values(sku.specs).join(' / ');
                  return (
                    <button
                      key={sku.id}
                      onClick={() => setSelectedSku(sku)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSku.id === sku.id
                          ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF8C61] ring-2 ring-[#FF6B35]/30'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {label} - ₱{sku.price.toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Stock */}
            <div className="mt-6 flex items-center space-x-6">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'ZH' ? '购买数量：' : language === 'TL' ? 'Dami:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-slate-900/60">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedSku.stock, quantity + 1))}
                  className="p-2 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {language === 'ZH'
                  ? `库存 ${selectedSku.stock} 件`
                  : language === 'TL'
                  ? `May ${selectedSku.stock} natitirang stock`
                  : `${selectedSku.stock} units available`}
              </span>
            </div>

            {/* Philippines Shipping Estimator */}
            <div className="mt-6 p-4 bg-white/5 backdrop-blur-md rounded-2xl space-y-2 border border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#FF8C61]" />
                  {language === 'ZH' ? '配送至菲律宾地区' : language === 'TL' ? 'Ipadala sa Lokasyon sa Pilipinas' : 'Delivery to Philippines Location'}
                </span>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="bg-slate-900 border border-white/10 text-slate-200 text-xs rounded-lg px-2 py-1 font-semibold"
                >
                  <option value="Metro Manila">
                    {language === 'ZH' ? '马尼拉首都圈 (1-2 天)' : language === 'TL' ? 'Metro Manila (1-2 Araw)' : 'Metro Manila (1-2 Days)'}
                  </option>
                  <option value="Luzon">
                    {language === 'ZH' ? '吕宋岛 (2-4 天)' : language === 'TL' ? 'Luzon (2-4 na Araw)' : 'Luzon (2-4 Days)'}
                  </option>
                  <option value="Visayas">
                    {language === 'ZH' ? '维萨亚斯群岛 (3-5 天)' : language === 'TL' ? 'Visayas (3-5 Araw)' : 'Visayas (3-5 Days)'}
                  </option>
                  <option value="Mindanao">
                    {language === 'ZH' ? '棉兰老岛 (4-7 天)' : language === 'TL' ? 'Mindanao (4-7 Araw)' : 'Mindanao (4-7 Days)'}
                  </option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'ZH'
                  ? '合作快递：极兔速递 J&T (₱80)、Ninja Van (₱75)、LBC Express (₱120)。单笔满 ₱999 免运费。'
                  : language === 'TL'
                  ? 'Mga courier: J&T Express (₱80), Ninja Van (₱75), LBC Express (₱120). Libreng padala sa order na higit sa ₱999.'
                  : 'Carrier options: J&T Express (₱80), Ninja Van (₱75), LBC Express (₱120). Free shipping applied on orders over ₱999.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description | Specs | Reviews */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10">
        <div className="flex border-b border-white/10 gap-8">
          <button
            onClick={() => setActiveDetailTab('desc')}
            className={`pb-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
              activeDetailTab === 'desc'
                ? 'border-[#FF6B35] text-[#FF8C61]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ZH' ? '商品详情图文' : language === 'TL' ? 'Deskripsyon ng Produkto' : 'Product Description'}
          </button>
          <button
            onClick={() => setActiveDetailTab('specs')}
            className={`pb-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
              activeDetailTab === 'specs'
                ? 'border-[#FF6B35] text-[#FF8C61]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ZH' ? '规格与参数' : language === 'TL' ? 'Ispekipikasyon' : 'Specifications'}
          </button>
          <button
            onClick={() => setActiveDetailTab('reviews')}
            className={`pb-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
              activeDetailTab === 'reviews'
                ? 'border-[#FF6B35] text-[#FF8C61]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ZH'
              ? `买家评价 (${productReviews.length + 2})`
              : language === 'TL'
              ? `Mga Review ng Bumili (${productReviews.length + 2})`
              : `Buyer Reviews (${productReviews.length + 2})`}
          </button>
        </div>

        <div className="mt-6">
          {activeDetailTab === 'desc' && (
            <div className="prose prose-sm max-w-none text-slate-300 space-y-4">
              <p>{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="rounded-2xl object-cover w-full h-64 border border-white/10"
                  />
                ))}
              </div>
            </div>
          )}

          {activeDetailTab === 'specs' && (
            <div className="divide-y divide-white/10 max-w-xl text-xs">
              {product.specsParams.map((sp, idx) => (
                <div key={idx} className="py-2.5 flex justify-between">
                  <span className="font-bold text-slate-400">{sp.key}</span>
                  <span className="font-semibold text-slate-200">{sp.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeDetailTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-white">
                    {language === 'ZH' ? '真实买家反馈与评价' : language === 'TL' ? 'Feedback ng mga Kustomer' : 'Customer Feedback'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'ZH'
                      ? '来自马尼拉、宿务等地区真实买家核验评价'
                      : language === 'TL'
                      ? 'Mga totoong review mula sa mga mamimili sa Metro Manila at Cebu'
                      : 'Real verified reviews from Ginno buyers in Metro Manila & Cebu'}
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-xl shadow border border-white/10"
                >
                  {language === 'ZH' ? '写评价 (+50积分)' : language === 'TL' ? 'Magsulat ng Review (+50 Puntos)' : 'Write Review (+50 Points)'}
                </button>
              </div>

              <div className="space-y-4">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl space-y-2 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                          <div className="flex text-amber-400 text-[10px]">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                    {rev.merchantReply && (
                      <div className="bg-[#FF6B35]/10 backdrop-blur-sm p-2.5 rounded-xl text-[11px] text-slate-200 border-l-2 border-[#FF6B35]">
                        <strong className="text-[#FF8C61]">
                          {language === 'ZH' ? '吉诺官方商家回复：' : language === 'TL' ? 'Sagot ng Ginno Merchant:' : 'Ginno Merchant Reply:'}
                        </strong>{' '}
                        {rev.merchantReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 text-slate-100 shadow-2xl">
            <h3 className="text-base font-black text-white">
              {language === 'ZH' ? '发布买家商品评价' : language === 'TL' ? 'Magsulat ng Review' : 'Write a Review'}
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'ZH' ? '打分星级' : language === 'TL' ? 'Rating' : 'Rating'}
              </label>
              <div className="flex text-amber-400 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setNewRating(s)}>
                    <Star
                      className={`w-6 h-6 ${s <= newRating ? 'fill-current' : 'text-slate-700'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'ZH' ? '评价留言' : language === 'TL' ? 'Komento' : 'Comment'}
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  language === 'ZH'
                    ? '分享您的使用体验与商品评价...'
                    : language === 'TL'
                    ? 'Ibahagi ang iyong karanasan sa produktong ito...'
                    : 'Share your experience with this item...'
                }
                className="w-full bg-slate-800/80 border border-white/10 rounded-xl p-3 text-xs text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-white/10 text-slate-300 text-xs font-bold py-2 rounded-xl hover:bg-white/20"
              >
                {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  submitProductReview(product.id, newRating, newComment);
                  setShowReviewModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white text-xs font-bold py-2 rounded-xl shadow"
              >
                {language === 'ZH' ? '提交评价' : language === 'TL' ? 'I-submit ang Review' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 p-3 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                alert(
                  language === 'ZH'
                    ? '正在连接吉诺在线客服 (Facebook Messenger / Viber)...'
                    : language === 'TL'
                    ? 'Kumokonekta sa Ginno Customer Service...'
                    : 'Connecting to Ginno Customer Service on Facebook Messenger / Viber...'
                )
              }
              className="flex flex-col items-center text-slate-400 hover:text-[#FF8C61] text-[10px] font-bold px-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{language === 'ZH' ? '在线客服' : language === 'TL' ? 'Suporta' : 'Support'}</span>
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className="flex flex-col items-center text-slate-400 hover:text-[#FF8C61] text-[10px] font-bold px-2 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-0.5 bg-[#FF6B35] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
              <span>{language === 'ZH' ? '购物车' : language === 'TL' ? 'Cart' : 'Cart'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-lg justify-end">
            <button
              onClick={() => {
                addToCart(product, selectedSku.id, quantity);
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }}
              className={`px-3 sm:px-4 font-bold py-3 rounded-2xl text-xs transition-all flex items-center gap-1.5 border ${
                isAdded
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-[#FF8C61] border-white/10'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{language === 'ZH' ? '已加购物车' : language === 'TL' ? 'Naidagdag' : 'Added!'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{language === 'ZH' ? '加购物车' : language === 'TL' ? 'Add Cart' : 'Add To Cart'}</span>
                </>
              )}
            </button>

            {groupAct ? (
              <>
                <button
                  onClick={() => {
                    addToCart(product, selectedSku.id, quantity, false);
                    setActiveTab('cart');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold py-3 rounded-2xl text-xs sm:text-sm border border-white/10 transition-all text-center"
                >
                  {language === 'ZH'
                    ? `单独购买 ₱${(selectedSku.price * quantity).toLocaleString()}`
                    : language === 'TL'
                    ? `Solo Buy ₱${(selectedSku.price * quantity).toLocaleString()}`
                    : `Solo Buy ₱${(selectedSku.price * quantity).toLocaleString()}`}
                </button>
                <button
                  onClick={() => {
                    const matchingTeam =
                      groupTeams.find((t) => t.productId === product.id && t.status === 'in_progress') || groupTeams[0];
                    if (matchingTeam) {
                      openDirectGroupBuyModal(matchingTeam, product);
                    } else {
                      setActiveTab('group-buy');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>
                    {language === 'ZH'
                      ? `立即拼团 ₱${(groupAct.tiers[groupAct.tiers.length - 1].price * quantity).toLocaleString()}`
                      : language === 'TL'
                      ? `Mag-Group Buy ₱${(groupAct.tiers[groupAct.tiers.length - 1].price * quantity).toLocaleString()}`
                      : `Group Buy ₱${(groupAct.tiers[groupAct.tiers.length - 1].price * quantity).toLocaleString()}`}
                  </span>
                </button>
              </>
            ) : product.isFlashSale && product.flashSalePrice ? (
              <button
                onClick={() => {
                  addToCart(product, selectedSku.id, quantity, false);
                  setActiveTab('checkout');
                }}
                className="flex-1 bg-gradient-to-r from-amber-500 via-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-200 fill-amber-200 animate-pulse" />
                <span>
                  {language === 'ZH'
                    ? `立即秒杀 ₱${(product.flashSalePrice * quantity).toLocaleString()}`
                    : language === 'TL'
                    ? `Mabilisang Bili ₱${(product.flashSalePrice * quantity).toLocaleString()}`
                    : `Flash Buy ₱${(product.flashSalePrice * quantity).toLocaleString()}`}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  addToCart(product, selectedSku.id, quantity, false);
                  setActiveTab('cart');
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold py-3 rounded-2xl text-xs sm:text-sm border border-white/10 transition-all"
              >
                {language === 'ZH'
                  ? `单独购买 ₱${(selectedSku.price * quantity).toLocaleString()}`
                  : language === 'TL'
                  ? `Solo ₱${(selectedSku.price * quantity).toLocaleString()}`
                  : `Solo Buy ₱${(selectedSku.price * quantity).toLocaleString()}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
