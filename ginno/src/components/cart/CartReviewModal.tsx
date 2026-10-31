import React, { useState } from 'react';
import { X, Star, Sparkles, Check, Image, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';

interface CartReviewModalProps {
  orderId: string | null;
  item: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CartReviewModal: React.FC<CartReviewModalProps> = ({ orderId, item, isOpen, onClose }) => {
  const { submitProductReview, language, t } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen || !item || !orderId) return null;

  const isZh = language === 'ZH';

  const availableTags = isZh
    ? ['质量过硬', '物流飞快', '包装完好', '正品保障', '性价比高']
    : ['High Quality', 'Fast Shipping', 'Great Value', 'Authentic Product', 'Well Packaged'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert(isZh ? '请填写您的评价内容' : 'Please enter your review comments');
      return;
    }
    const fullComment = selectedTags.length > 0 ? `[${selectedTags.join(', ')}] ${comment}` : comment;
    submitProductReview(item.productId, rating, fullComment, orderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full text-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-amber-950/30 to-purple-950/50 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={item.image}
              alt={item.productName}
              className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div>
              <h3 className="text-xs font-black text-white line-clamp-1">{item.productName}</h3>
              <p className="text-[11px] text-slate-400">{item.skuSpecs}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Star Selector */}
          <div className="text-center space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-slate-300 block">
              {isZh ? '请打分 (得50积分奖励)' : 'Rate Product (Earn +50 Points)'}
            </span>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-amber-300">
              {rating === 5
                ? isZh ? '非常满意，强烈推荐！' : 'Excellent, highly recommended!'
                : rating >= 3
                ? isZh ? '符合预期，还不错' : 'Good product'
                : isZh ? '需要改进' : 'Needs improvement'}
            </p>
          </div>

          {/* Preset Feature Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">{isZh ? '快捷评价标签' : 'Review Tags'}</label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF8C61]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">{isZh ? '详细心得评价' : 'Your Detailed Review'}</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isZh ? '分享您的使用感受、物流速度及使用细节...' : 'Share your experience with quality, shipping, and usage details...'}
              className="w-full bg-slate-950 border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isZh ? '提交评价 (+50 积分)' : 'Submit Review (+50 Points)'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
