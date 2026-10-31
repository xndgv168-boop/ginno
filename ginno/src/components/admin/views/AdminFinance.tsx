import React from 'react';
import { DollarSign, CreditCard, RotateCcw, FileText, Download, TrendingUp } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminFinance: React.FC = () => {
  const { orders, language } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.payAmount, 0) + 1284000;

  return (
    <div className="space-y-6 text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl">
          <span className="text-slate-400 block mb-1">
            {language === 'ZH' ? '实收净收入总额' : language === 'TL' ? 'Kabuong Kita' : 'Total Net Revenue'}
          </span>
          <span className="text-2xl font-black text-emerald-400">₱{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl">
          <span className="text-slate-400 block mb-1">
            {language === 'ZH' ? 'GCash 支付占比' : language === 'TL' ? 'GCash Bahagi' : 'GCash Payment Share'}
          </span>
          <span className="text-2xl font-black text-blue-400">68.4%</span>
        </div>
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl">
          <span className="text-slate-400 block mb-1">
            {language === 'ZH' ? 'Maya / 银行卡占比' : language === 'TL' ? 'Maya / Card Bahagi' : 'Maya / Card Share'}
          </span>
          <span className="text-2xl font-black text-purple-300">22.1%</span>
        </div>
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl">
          <span className="text-slate-400 block mb-1">
            {language === 'ZH' ? '货到付款 COD 占比' : language === 'TL' ? 'COD Bahagi' : 'COD Share'}
          </span>
          <span className="text-2xl font-black text-amber-400">9.5%</span>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-white">
            {language === 'ZH' ? '第三方网关流水明细' : language === 'TL' ? 'Mga Log ng Bayad' : 'Payment Gateway Transaction Logs'}
          </h3>
          <button
            onClick={() => alert(language === 'ZH' ? '财务报表已成功导出' : language === 'TL' ? 'Na-download ang report' : 'Financial report downloaded')}
            className="bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ZH' ? '导出财务月报' : language === 'TL' ? 'I-download ang Report' : 'Export Financial Report'}
            </span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { id: 'tx_9918', method: 'GCash', amount: 2499, user: 'Juan D.', status: 'SUCCESS', ref: 'GC-881940291' },
            { id: 'tx_9919', method: 'Maya', amount: 4890, user: 'Maria S.', status: 'SUCCESS', ref: 'MY-119284019' },
            { id: 'tx_9920', method: 'COD', amount: 1290, user: 'Alex G.', status: 'PENDING_COLLECTION', ref: 'COD-JNT-48' },
          ].map((tx) => (
            <div key={tx.id} className="p-3 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">{tx.method} Transaction #{tx.id}</span>
                <p className="text-[10px] text-slate-400">User: {tx.user} | Ref: {tx.ref}</p>
              </div>
              <div className="text-right">
                <span className="font-black text-[#FF8C61] block">₱{tx.amount.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
