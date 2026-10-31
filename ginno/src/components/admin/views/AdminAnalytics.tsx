import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const CONVERSION_DATA = [
  { step: 'Page Visits', count: 48000 },
  { step: 'View Product', count: 32000 },
  { step: 'Add to Cart', count: 12400 },
  { step: 'Checkout Initiated', count: 6800 },
  { step: 'Payment Complete', count: 3420 },
];

export const AdminAnalytics: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="space-y-6 text-slate-100">
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-white">
          {language === 'ZH' ? '全链路转化率漏斗图表' : language === 'TL' ? 'Pagsusuri ng Conversion Funnel' : 'Funnel Conversion Rate Analysis'}
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CONVERSION_DATA} layout="vertical">
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis dataKey="step" type="category" stroke="#94A3B8" fontSize={11} width={130} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
              <Bar dataKey="count" fill="#FF6B35" radius={[0, 12, 12, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
