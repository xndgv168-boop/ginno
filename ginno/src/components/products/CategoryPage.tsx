import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { getCategoryName, getProductTitle } from '../../utils/i18nHelpers';
import { Pagination } from '../common/Pagination';

interface CategoryPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ setActiveTab, setSelectedProduct }) => {
  const { categories, products, language, t } = useApp();
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0].id);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const PAGE_SIZE = 18;

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((p) => p.categoryId === selectedCatId);
  const currentCategory = categories.find((c) => c.id === selectedCatId);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100">
      <h2 className="text-xl font-black text-white mb-6">{t('nav.allCategories')}</h2>

      <div className="flex flex-col md:flex-row gap-6 min-h-[500px]">
        {/* Category Sidebar */}
        <div className="w-full md:w-64 bg-white/5 backdrop-blur-2xl rounded-3xl p-3 shadow-xl border border-white/10 shrink-0 self-start sticky top-20">
          <div className="space-y-1">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                    selectedCatId === cat.id
                      ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg shadow-purple-500/25 border border-white/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{getCategoryName(cat, language)}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    selectedCatId === cat.id ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Content */}
        <div className="flex-1 bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="mb-6 pb-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{currentCategory ? getCategoryName(currentCategory, language) : ''}</span>
                  <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                    {language === 'ZH' ? '18件/页' : '18 items / page'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'ZH'
                    ? `共找到 ${filteredProducts.length} 件商品（第 ${currentPage} / ${totalPages} 页）`
                    : language === 'TL'
                    ? `May ${filteredProducts.length} na item (Pahina ${currentPage} ng ${totalPages})`
                    : `Found ${filteredProducts.length} items (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs font-bold text-[#FF8C61] hover:underline"
              >
                {language === 'ZH' ? '进入完整商城' : language === 'TL' ? 'Tingnan ang Buong Tindahan' : 'View Full Store'}
              </button>
            </div>

            {pagedProducts.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                {language === 'ZH' ? '暂无商品' : 'No products available in this category'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pagedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setActiveTab('product-detail');
                    }}
                    className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl p-3 cursor-pointer hover:border-white/20 hover:bg-white/10 transition-all group shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={p.mainImage}
                          alt={getProductTitle(p, language)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {p.tags.includes('Free Shipping') && (
                          <span className="absolute top-1.5 left-1.5 bg-emerald-500/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-white/20">
                            {language === 'ZH' ? '包邮' : 'FREE SHIP'}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-2 mt-2 group-hover:text-[#FF8C61] transition-colors leading-snug">
                        {getProductTitle(p, language)}
                      </h4>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <p className="text-sm font-black text-[#FF8C61]">
                        ₱{p.skus[0].price.toLocaleString()}
                      </p>
                      {p.skus[0].originalPrice && (
                        <p className="text-[10px] text-slate-500 line-through">
                          ₱{p.skus[0].originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Professional Pagination Component */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
              itemLabel={language === 'ZH' ? '商品' : 'products'}
            />
          )}
        </div>
      </div>
    </div>
  );
};
