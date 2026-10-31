import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Star, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { getProductTitle, getCategoryName } from '../../utils/i18nHelpers';
import { Pagination } from '../common/Pagination';

interface ProductListPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
  searchQuery: string;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({
  setActiveTab,
  setSelectedProduct,
  searchQuery,
}) => {
  const { products, categories, addToCart, openQuickSpecModal, language, t } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'sales' | 'rating'>('featured');
  const [freeShippingOnly, setFreeShippingOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const PAGE_SIZE = 20;

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: any) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleFreeShippingChange = (checked: boolean) => {
    setFreeShippingOnly(checked);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  let filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (freeShippingOnly && !p.tags.includes('Free Shipping')) return false;
    if (
      searchQuery &&
      !getProductTitle(p, language).toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'price_low') return a.skus[0].price - b.skus[0].price;
    if (sortBy === 'price_high') return b.skus[0].price - a.skus[0].price;
    if (sortBy === 'sales') return b.salesCount - a.salesCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedProducts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100">
      {/* Filters & Sorting Controls Bar */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 shadow-xl border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-slate-900/80 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-white/10 focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-slate-100">{t('nav.allCategories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                {getCategoryName(c, language)}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="bg-slate-900/80 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-white/10 focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="featured" className="bg-slate-900 text-slate-100">
              {language === 'ZH' ? '排序：综合推荐' : language === 'TL' ? 'Ayos: Itinatampok' : 'Sort: Featured'}
            </option>
            <option value="price_low" className="bg-slate-900 text-slate-100">
              {language === 'ZH' ? '价格：从低到高' : language === 'TL' ? 'Presyo: Mababa hanggang Mataas' : 'Price: Low to High'}
            </option>
            <option value="price_high" className="bg-slate-900 text-slate-100">
              {language === 'ZH' ? '价格：从高到低' : language === 'TL' ? 'Presyo: Mataas hanggang Mababa' : 'Price: High to Low'}
            </option>
            <option value="sales" className="bg-slate-900 text-slate-100">
              {language === 'ZH' ? '销量排序' : language === 'TL' ? 'Pinakamabenta' : 'Best Selling'}
            </option>
            <option value="rating" className="bg-slate-900 text-slate-100">
              {language === 'ZH' ? '好评度排序' : language === 'TL' ? 'Pinakamataas na Rating' : 'Highest Rated'}
            </option>
          </select>

          {/* Checkbox Free Shipping */}
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={freeShippingOnly}
              onChange={(e) => handleFreeShippingChange(e.target.checked)}
              className="rounded text-[#FF6B35] focus:ring-[#FF6B35] bg-slate-900 border-white/20"
            />
            <span>
              {language === 'ZH' ? '仅看包邮商品' : language === 'TL' ? 'Libreng Padala Lamang' : 'Free Shipping Only'}
            </span>
          </label>
        </div>

        {/* Right Info & View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            {language === 'ZH'
              ? `共 ${filtered.length} 件（第 ${currentPage} / ${totalPages} 页）`
              : `Found ${filtered.length} (Page ${currentPage} of ${totalPages})`}
          </div>

          <div className="flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product List Render */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagedProducts.map((p) => {
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    {p.tags.includes('Free Shipping') && (
                      <span className="absolute top-2 left-2 bg-emerald-500/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-white/20">
                        {language === 'ZH' ? '包邮' : language === 'TL' ? 'LIBRENG PADALA' : 'FREE SHIP'}
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
                      <span className="text-slate-400 font-normal">
                        ({language === 'ZH' ? `已售 ${p.salesCount}` : language === 'TL' ? `${p.salesCount} nabenta` : `${p.salesCount} sold`})
                      </span>
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
                    className="p-2 bg-white/10 text-[#FF8C61] hover:bg-[#FF6B35] hover:text-white rounded-xl transition-colors shadow border border-white/10"
                    title={t('product.selectSpecs')}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {pagedProducts.map((p) => {
            const sku = p.skus[0];

            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setActiveTab('product-detail');
                }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer flex gap-4 items-center"
              >
                <img
                  src={p.mainImage}
                  alt={getProductTitle(p, language)}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-white/10"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{getProductTitle(p, language)}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{p.subtitle}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-lg font-black text-[#FF8C61]">
                      ₱{sku.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ₱{sku.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openQuickSpecModal(p);
                  }}
                  className="bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 shadow-lg shadow-purple-500/20 transition-all shrink-0"
                >
                  {language === 'ZH' ? '加入购物车' : language === 'TL' ? 'Idagdag sa Cart' : 'Add To Cart'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 mt-4">
          <p className="text-sm font-bold text-slate-300">
            {language === 'ZH' ? '未找到匹配的商品' : 'No matching products found'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'ZH' ? '请尝试切换分类或清除搜索关键词' : 'Try clearing filters or search keywords'}
          </p>
        </div>
      )}

      {/* Professional Pagination Component (20 items per page) */}
      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          itemLabel={language === 'ZH' ? '商品' : 'products'}
        />
      )}
    </div>
  );
};
