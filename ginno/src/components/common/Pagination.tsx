import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
  itemLabel,
}) => {
  const { language } = useApp();
  const [jumpInput, setJumpInput] = useState('');

  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page array with intelligent ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpInput('');
    }
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-300 ${className}`}
    >
      {/* Items Range Summary */}
      <div className="flex items-center space-x-2 text-slate-400">
        <span>
          {language === 'ZH' ? (
            <>
              显示第 <strong className="text-white font-bold">{startItem}</strong> -{' '}
              <strong className="text-white font-bold">{endItem}</strong> 条，共{' '}
              <strong className="text-[#FF8C61] font-bold">{totalItems}</strong> 条
              {itemLabel ? ` ${itemLabel}` : '商品'}
            </>
          ) : (
            <>
              Showing <strong className="text-white font-bold">{startItem}</strong>–
              <strong className="text-white font-bold">{endItem}</strong> of{' '}
              <strong className="text-[#FF8C61] font-bold">{totalItems}</strong>{' '}
              {itemLabel || 'items'}
            </>
          )}
        </span>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400">
          {pageSize} / {language === 'ZH' ? '页' : 'page'}
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
          title={language === 'ZH' ? '第一页' : 'First Page'}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
          title={language === 'ZH' ? '上一页' : 'Previous Page'}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-semibold">
            {language === 'ZH' ? '上一页' : 'Prev'}
          </span>
        </button>

        {/* Numeric Pages */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-slate-500 font-bold select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[34px] h-[34px] px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6B35] to-purple-600 text-white shadow-lg shadow-purple-500/25 border border-white/20 scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
          title={language === 'ZH' ? '下一页' : 'Next Page'}
        >
          <span className="hidden sm:inline text-xs font-semibold">
            {language === 'ZH' ? '下一页' : 'Next'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
          title={language === 'ZH' ? '最后一页' : 'Last Page'}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jump to Page (when > 1 pages) */}
      {totalPages > 1 && (
        <form onSubmit={handleJumpSubmit} className="flex items-center space-x-1.5">
          <span className="text-slate-400 text-xs">
            {language === 'ZH' ? '跳至' : 'Go to'}
          </span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            placeholder={`${currentPage}`}
            className="w-12 h-8 text-center text-xs font-bold bg-slate-900/80 border border-white/15 rounded-lg text-white focus:outline-none focus:border-[#FF6B35] transition-colors"
          />
          <span className="text-slate-400 text-xs">
            {language === 'ZH' ? '页' : 'p.'}
          </span>
          <button
            type="submit"
            className="h-8 px-2.5 rounded-lg bg-white/10 hover:bg-[#FF6B35] text-slate-200 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
          >
            {language === 'ZH' ? '确定' : 'Go'}
          </button>
        </form>
      )}
    </div>
  );
};
