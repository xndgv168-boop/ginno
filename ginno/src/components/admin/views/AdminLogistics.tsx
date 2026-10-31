import React, { useState } from 'react';
import { Truck, MapPin, Package, Settings, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminLogistics: React.FC = () => {
  const { orders, language } = useApp();

  const [couriers, setCouriers] = useState([
    { id: 'c_jnt', name: 'J&T Express Philippines', code: 'JNT_PH', status: 'Active', apiConnected: true },
    { id: 'c_lbc', name: 'LBC Express', code: 'LBC_PH', status: 'Active', apiConnected: true },
    { id: 'c_ninja', name: 'Ninja Van Philippines', code: 'NINJA_PH', status: 'Active', apiConnected: true },
  ]);

  return (
    <div className="space-y-6 text-slate-100">
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-white">
          {language === 'ZH' ? '合作物流公司' : language === 'TL' ? 'Mga Kargamento' : 'Logistics Carriers'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {couriers.map((c) => (
            <div key={c.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white text-sm">{c.name}</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {c.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Code: {c.code}</p>
              <span className="text-[10px] text-emerald-400 font-bold block">✓ API Live Sync Active</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-white">
          {language === 'ZH' ? '运费计算规则模板' : language === 'TL' ? 'Mga Template ng Kargamento' : 'Freight Templates'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-extrabold text-amber-300">Metro Manila Standard Freight</h4>
            <p className="text-slate-300">Free shipping on orders over ₱999, otherwise flat ₱75 rate.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-extrabold text-amber-300">Provincial (Visayas & Mindanao)</h4>
            <p className="text-slate-300">Flat ₱150 rate, estimated arrival 3-5 business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
