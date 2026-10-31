import React, { useState } from 'react';
import { X, MapPin, Plus, Check, Truck, Building, User, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';

interface CartAddressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: Address | null;
  onSelectAddress: (addr: Address) => void;
}

export const CartAddressDrawer: React.FC<CartAddressDrawerProps> = ({
  isOpen,
  onClose,
  selectedAddress,
  onSelectAddress,
}) => {
  const { addresses, addNewAddress, language } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form fields
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Metro Manila');
  const [city, setCity] = useState('Quezon City');
  const [barangay, setBarangay] = useState('Barangay Central');
  const [streetDetail, setStreetDetail] = useState('');
  const [zipCode, setZipCode] = useState('1100');

  if (!isOpen) return null;

  const isZh = language === 'ZH';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addNewAddress({
      receiverName,
      phone,
      province,
      city,
      barangay,
      streetDetail,
      zipCode,
      isDefault: addresses.length === 0,
    });
    onSelectAddress(created);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 to-purple-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{isZh ? '选择收货地址' : 'Select Delivery Address'}</h3>
              <p className="text-xs text-slate-400">{isZh ? '配送至全国各地' : 'Doorstep shipping across Philippines'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {showAddForm ? (
            /* Add Address Form */
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="font-extrabold text-white">{isZh ? '添加新地址' : 'Add New Address'}</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  {isZh ? '返回列表' : 'Back to list'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">{isZh ? '收货人姓名' : 'Receiver Name'}</label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">{isZh ? '联系电话' : 'Phone Number'}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0917 123 4567"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">{isZh ? '省份/地区' : 'Province / State'}</label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">{isZh ? '城市' : 'City'}</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">{isZh ? '社区 / Barangay' : 'Barangay'}</label>
                  <input
                    type="text"
                    required
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">{isZh ? '邮政编码' : 'Zip Code'}</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">{isZh ? '详细街道门牌' : 'Street & House / Unit No.'}</label>
                <textarea
                  required
                  rows={2}
                  value={streetDetail}
                  onChange={(e) => setStreetDetail(e.target.value)}
                  placeholder="Unit 1204 Tower B, Sunshine Condominiums, Katipunan Ave"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black rounded-2xl shadow-lg transition-all text-xs"
              >
                {isZh ? '保存并使用此地址' : 'Save & Select Address'}
              </button>
            </form>
          ) : (
            /* Address List */
            <div className="space-y-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelectAddress(addr);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10 shadow-lg ring-2 ring-[#FF6B35]/30'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-xs">{addr.receiverName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{addr.phone}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 px-2 py-0.2 rounded-full font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#FF8C61]" />}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {addr.streetDetail}, {addr.barangay}, {addr.city}, {addr.province} {addr.zipCode}
                    </p>
                  </div>
                );
              })}

              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-white/40 text-slate-200 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4 text-[#FF8C61]" />
                <span>{isZh ? '添加新收货地址' : 'Add New Shipping Address'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
