import React, { useState } from 'react';
import { Image, Megaphone, LayoutGrid, FileText, Search, Star, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Banner } from '../../../types';

export const AdminCMS: React.FC = () => {
  const { banners, adminSaveBanner, adminDeleteBanner, language } = useApp();

  const [cmsTab, setCmsTab] = useState<'banners' | 'announcements' | 'pages' | 'reviews'>('banners');
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [newBn, setNewBn] = useState<Partial<Banner>>({
    title: 'Super Clearance Promo',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    targetType: 'category',
    targetValue: 'cat_electronics',
  });

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    adminSaveBanner(newBn);
    setShowBannerModal(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-2xl border border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setCmsTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsTab === 'banners' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>
              {language === 'ZH' ? `首页 Banner 轮播 (${banners.length})` : language === 'TL' ? `Mga Banner (${banners.length})` : `Homepage Banners (${banners.length})`}
            </span>
          </button>
          <button
            onClick={() => setCmsTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsTab === 'announcements' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>
              {language === 'ZH' ? '跑马灯公告管理' : language === 'TL' ? 'Mga Anunsyo' : 'Announcements'}
            </span>
          </button>
          <button
            onClick={() => setCmsTab('pages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsTab === 'pages' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>
              {language === 'ZH' ? '自定义页面配置' : language === 'TL' ? 'Mga Pahina ng CMS' : 'CMS Pages'}
            </span>
          </button>
        </div>

        {cmsTab === 'banners' && (
          <button
            onClick={() => setShowBannerModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === 'ZH' ? '添加 Banner' : language === 'TL' ? 'Magdagdag ng Banner' : 'Add Banner'}
            </span>
          </button>
        )}
      </div>

      {cmsTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-slate-900/80 p-4 rounded-3xl border border-white/10 space-y-3 relative">
              <img src={b.image} alt="" className="w-full h-32 rounded-2xl object-cover" />
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-white text-xs">{b.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {language === 'ZH' ? '跳转目标: ' : language === 'TL' ? 'Target: ' : 'Target: '}
                    {b.targetType} ({b.targetValue})
                  </span>
                </div>
                <button
                  onClick={() => adminDeleteBanner(b.id)}
                  className="p-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cmsTab === 'pages' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-black text-white">
            {language === 'ZH' ? '静态页面富文本配置' : language === 'TL' ? 'Modytor ng Pahina ng CMS' : 'Static Content Pages Editor'}
          </h3>
          <div className="space-y-2">
            {[
              { id: 'about', zh: '关于我们', tl: 'Tungkol sa Amin', en: 'About Us' },
              { id: 'terms', zh: '用户协议与条款', tl: 'Mga Tuntunin at Kasunduan', en: 'User Agreement & Terms' },
              { id: 'privacy', zh: '隐私政策声明', tl: 'Patakaran sa Privacy', en: 'Privacy Policy' },
              { id: 'help', zh: '帮助中心与FAQ', tl: 'Help Center at FAQ', en: 'Help Center & FAQ' },
            ].map((p) => {
              const pageTitle = language === 'ZH' ? p.zh : language === 'TL' ? p.tl : p.en;
              return (
                <div key={p.id} className="p-3 bg-white/5 rounded-2xl flex justify-between items-center border border-white/10">
                  <span className="font-bold text-white">{pageTitle}</span>
                  <button onClick={() => alert(`Editing ${pageTitle}`)} className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1 rounded-xl text-[11px] font-bold">
                    {language === 'ZH' ? '编辑富文本' : language === 'TL' ? 'I-edit' : 'Edit Rich Text'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE BANNER MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <h3 className="text-base font-black text-white">
              {language === 'ZH' ? '添加新 Banner 轮播图' : language === 'TL' ? 'Magdagdag ng Bagong Banner' : 'Add New Banner'}
            </h3>
            <form onSubmit={handleCreateBanner} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? 'Banner 标题/文案' : language === 'TL' ? 'Pamagat ng Banner' : 'Banner Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newBn.title || ''}
                  onChange={(e) => setNewBn({ ...newBn, title: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '图片链接 URL' : language === 'TL' ? 'URL ng Imahe' : 'Image URL'}
                </label>
                <input
                  type="text"
                  required
                  value={newBn.image || ''}
                  onChange={(e) => setNewBn({ ...newBn, image: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white font-black py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '保存 Banner' : language === 'TL' ? 'I-save ang Banner' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
