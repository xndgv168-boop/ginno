import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Building2, User, Mail, ShieldCheck, Download, Printer, ExternalLink, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, InvoiceInfo } from '../../types';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const { requestOrderInvoice, language, user, setToastNotice } = useApp();

  const [type, setType] = useState<'personal' | 'company'>('company');
  const [title, setTitle] = useState<string>(user?.nickname || 'Ginno Customer');
  const [taxId, setTaxId] = useState<string>('TIN-984-102-391-000');
  const [email, setEmail] = useState<string>(user?.email || 'customer@ginno.ph');
  const [viewReceipt, setViewReceipt] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const isZh = language === 'ZH';
  const existingInvoice = order.invoiceInfo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(isZh ? '请输入发票抬头 / 公司全称' : 'Please enter invoice title or company name');
      return;
    }
    requestOrderInvoice(order.id, {
      type,
      title,
      taxId: type === 'company' ? taxId : undefined,
      email,
    });
    setViewReceipt(true);
  };

  const currentInvoice: InvoiceInfo | undefined = existingInvoice || (viewReceipt ? order.invoiceInfo : undefined);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full text-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/80 via-slate-900 to-purple-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{isZh ? '电子发票开具与预览' : 'E-Invoice Service'}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.2 rounded-full font-bold">
                  Official VAT
                </span>
              </h3>
              <p className="text-xs text-slate-400">Order #{order.orderNo}</p>
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
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {existingInvoice || currentInvoice ? (
            /* Electronic Tax Invoice Official Receipt Preview */
            <div className="bg-slate-950 p-5 rounded-2xl border border-white/15 space-y-4 relative overflow-hidden font-mono text-xs text-slate-300 shadow-inner">
              <div className="absolute top-3 right-3 opacity-15 pointer-events-none">
                <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-500 font-extrabold text-[10px] rotate-12 uppercase">
                  VAT PAID Official Stamp
                </div>
              </div>

              <div className="border-b border-white/10 pb-3 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">
                    GINNO PHILIPPINES INC.
                  </h4>
                  <p className="text-[10px] text-slate-400">Official E-VAT Sales Invoice / Official Receipt</p>
                  <p className="text-[10px] text-slate-400">TIN: 009-823-114-00000 VAT Reg.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    ✓ ISSUED
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{currentInvoice?.invoiceNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 block text-[10px]">{isZh ? '发票抬头' : 'Invoice Title'}</span>
                  <span className="font-bold text-white">{currentInvoice?.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{isZh ? '发票类型' : 'Invoice Type'}</span>
                  <span className="font-bold text-white uppercase">
                    {currentInvoice?.type === 'company' ? (isZh ? '企业增值税发票' : 'Company VAT') : (isZh ? '个人发票' : 'Personal')}
                  </span>
                </div>
                {currentInvoice?.taxId && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">{isZh ? '纳税人识别号 / TIN' : 'Tax ID / TIN'}</span>
                    <span className="font-bold text-white">{currentInvoice?.taxId}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block text-[10px]">{isZh ? '电子接收邮箱' : 'Recipient Email'}</span>
                  <span className="font-bold text-white truncate block">{currentInvoice?.email}</span>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold border-b border-white/10 pb-1">
                  <span>Description</span>
                  <span>Amount (PHP)</span>
                </div>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[11px] py-1 text-slate-300">
                    <span className="truncate max-w-[200px]">
                      {item.productName} (x{item.quantity})
                    </span>
                    <span className="font-bold">₱{item.total.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-[11px] py-1 text-slate-400">
                  <span>Shipping Fee</span>
                  <span>₱{order.shippingFee.toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[11px] py-1 text-emerald-400">
                    <span>Coupon Discount</span>
                    <span>-₱{order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs pt-2 font-black text-white border-t border-white/10">
                  <span>GRAND TOTAL (INCL. 12% VAT):</span>
                  <span className="text-[#FF8C61]">₱{order.payAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-white/10 flex items-center justify-between">
                <span>Issued Date: {new Date(currentInvoice?.issuedAt || order.createdAt).toLocaleDateString()}</span>
                <span>BIR Permit # 2026-08-E-0922</span>
              </div>
            </div>
          ) : (
            /* Request Invoice Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-extrabold text-slate-300 block">{isZh ? '抬头类型' : 'Invoice Header Type'}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('company')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      type === 'company'
                        ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF8C61]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{isZh ? '企业发票' : 'Company VAT'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('personal')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      type === 'personal'
                        ? 'border-[#FF6B35] bg-[#FF6B35]/20 text-[#FF8C61]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{isZh ? '个人发票' : 'Personal'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 block">
                  {type === 'company' ? (isZh ? '公司抬头全称' : 'Company Registered Name') : (isZh ? '个人全名' : 'Full Name')}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === 'company' ? 'e.g. Ginno Tech Philippines Inc.' : 'e.g. Juan Dela Cruz'}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              {type === 'company' && (
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-300 block">
                    {isZh ? '纳税人识别号 (TIN)' : 'Tax Identification Number (TIN)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. 000-123-456-000"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-300 block">
                  {isZh ? '电子发票接收邮箱' : 'Email to Receive E-Invoice'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isZh
                    ? '根据税务规定，开具电子发票将发送至您的电子邮箱，具有法律与报销凭证效力。'
                    : 'Official VAT E-Invoices are recognized for accounting and taxation compliance.'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg transition-all text-xs"
              >
                {isZh ? '确认并开具电子发票' : 'Issue E-Invoice Now'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Actions if already issued */}
        {(existingInvoice || currentInvoice) && (
          <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                alert(isZh ? '模拟下载发票 PDF 成功！' : 'E-Invoice PDF downloaded successfully!');
              }}
              className="py-2 px-4 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#FF8C61]" />
              <span>{isZh ? '下载 PDF' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-5 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black rounded-xl text-xs shadow-md transition-all"
            >
              {isZh ? '关闭' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
