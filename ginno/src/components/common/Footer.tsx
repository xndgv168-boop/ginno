import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { t, openReturnPolicyModal } = useApp();

  return (
    <footer className="bg-slate-950/80 backdrop-blur-2xl text-slate-100 pt-12 pb-24 md:pb-12 border-t border-white/10 relative z-10">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">{t('footer.authenticTitle')}</h4>
            <p className="text-xs text-slate-400">{t('footer.authenticDesc')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">{t('footer.shippingTitle')}</h4>
            <p className="text-xs text-slate-400">{t('footer.shippingDesc')}</p>
          </div>
        </div>

        <div
          onClick={openReturnPolicyModal}
          className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer hover:border-[#FF6B35]/50 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 group-hover:scale-105 transition-transform">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-[#FF8C61] transition-colors">{t('footer.returnsTitle')}</h4>
            <p className="text-xs text-slate-400">{t('footer.returnsDesc')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">{t('footer.supportTitle')}</h4>
            <p className="text-xs text-slate-400">{t('footer.supportDesc')}</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-purple-600 flex items-center justify-center font-black text-xl text-white shadow-md shadow-purple-500/20">
              G
            </div>
            <span className="text-2xl font-black text-white">Ginno</span>
            <span className="text-xs bg-[#FF6B35]/20 border border-[#FF6B35]/30 text-[#FF8C61] px-2 py-0.5 rounded font-bold">
              吉诺
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3 max-w-sm leading-relaxed">
            {t('footer.slogan')}
          </p>

          <div className="mt-6">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t('footer.paymentPartners')}
            </h5>
            <div className="flex flex-wrap gap-2">
              {['GCash', 'Maya', 'DragonPay', 'COD', 'Visa', 'MasterCard', 'BDO Online'].map((p) => (
                <span
                  key={p}
                  className="bg-white/5 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10 hover:border-white/20 transition-all"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-100 mb-4">{t('footer.customerService')}</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.helpCenter')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.trackOrder')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.howGroupBuyWorks')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.auctionRules')}</a></li>
            <li>
              <button onClick={openReturnPolicyModal} className="hover:text-white transition-colors text-left">
                {t('footer.returnPolicy')}
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-100 mb-4">{t('footer.aboutUs')}</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.brandStory')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.careers')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('footer.sellerPortal')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-100 mb-4">{t('footer.logisticsTitle')}</h4>
          <div className="space-y-2 text-xs text-slate-400">
            <p>J&T Express Philippines</p>
            <p>LBC Express Nationwide</p>
            <p>Ninja Van Philippines</p>
            <p>Flash Express PH</p>
            <p>Lalamove Same-day (Metro Manila)</p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1">
          {t('footer.copyright')} {t('footer.builtWith')} <Heart className="w-3.5 h-3.5 text-[#FF6B35] fill-current inline mx-0.5" /> {t('footer.forPh')}
        </p>
      </div>
    </footer>
  );
};

