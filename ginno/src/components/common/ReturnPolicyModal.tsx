import React from 'react';
import {
  RotateCcw,
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  AlertCircle,
  Ban,
  DollarSign,
  Info,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReturnPolicyModal: React.FC = () => {
  const { showReturnPolicyModal, setShowReturnPolicyModal, language } = useApp();

  if (!showReturnPolicyModal) return null;

  const isZh = language === 'ZH';
  const isTl = language === 'TL';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden my-auto relative space-y-0">
        {/* Modal Header Banner */}
        <div className="bg-gradient-to-r from-purple-900/80 via-slate-900 to-[#FF6B35]/20 p-5 sm:p-6 border-b border-white/10 relative">
          <button
            onClick={() => setShowReturnPolicyModal(false)}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded-full transition-all border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 px-2.5 py-0.5 rounded-full font-bold">
                  {isZh ? '7天无理由退换' : isTl ? '7-Araw Libreng Return' : '7-Day Free Return'}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {isZh ? '买家权益保障' : isTl ? 'Proteksyon ng Mamimili' : 'Buyer Guarantee'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                {isZh
                  ? '7天无理由退换货规则与条款说明'
                  : isTl
                  ? 'Mga Patakaran at Tuntunin sa 7-Araw na Return'
                  : '7-Day No-Reason Return & Refund Policy Terms'}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          <p className="text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
            {isZh
              ? '吉诺平台为您提供安心无忧的购物保障！为确保买卖双方公平透明，请详细阅读以下7天无理由退换货的具体标准与办理指南：'
              : isTl
              ? 'Nagbibigay ang Ginno ng ligtas na karanasan sa pamimili. Basahin ang mga tuntunin sa 7-araw na pagpapalit at refund:'
              : 'Ginno provides a worry-free shopping guarantee. Please review our 7-day return conditions and guidelines below:'}
          </p>

          {/* Rule 1: 7-Day Calculation */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#FF8C61] font-bold">
              <div className="w-6 h-6 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center text-xs font-black text-[#FF8C61] shrink-0">
                1
              </div>
              <Clock className="w-4 h-4 text-[#FF8C61]" />
              <span className="text-sm font-black text-white">
                {isZh ? '7天期限起算时间说明' : isTl ? 'Pagkalkula ng 7 Araw' : '7-Day Period Starting Date'}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-8">
              {isZh ? (
                <>
                  7 天冷静期从<strong className="text-amber-300 font-extrabold">买家物流签收之日起算（第1天）</strong>，而非下订单日或卖家发货日。在签收后的 168 小时内均可申请无理由退换货。
                </>
              ) : isTl ? (
                <>
                  Ang 7 araw ay magsisimula sa <strong className="text-amber-300">araw na natanggap (签收)</strong> ng mamimili ang package, hindi sa araw ng order o pagpapadala.
                </>
              ) : (
                <>
                  The 7-day period is calculated starting from the <strong className="text-amber-300">date of parcel delivery / receipt</strong> by the buyer, NOT from the order creation date or shipping date.
                </>
              )}
            </p>
          </div>

          {/* Rule 2: Item Condition */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-xs font-black text-purple-300 shrink-0">
                2
              </div>
              <PackageCheck className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-black text-white">
                {isZh ? '退回商品完好标准' : isTl ? 'Kondisyon ng Isosoling Produkto' : 'Returned Item Condition Requirements'}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-8">
              {isZh ? (
                <>
                  退回商品必须保持原出厂状态：<strong className="text-white font-extrabold">全新未使用、防伪扣及吊牌完整未剪、原包装盒（袋）完好无损</strong>，相关赠品、配件及说明书须一并寄回，且不影响二次销售。
                </>
              ) : isTl ? (
                <>
                  Dapat <strong className="text-white">hindi pa nagagamit, kumpleto ang mga tag/label, at nasa orihinal na packaging</strong> kasama ang mga libreng regalo at accessories.
                </>
              ) : (
                <>
                  Returned products must remain in brand new condition: <strong className="text-white">unused, unwashed, tags & anti-counterfeit seals intact, with complete original packaging</strong>, accessories, and gifts included.
                </>
              )}
            </p>
          </div>

          {/* Rule 3: Freight Cost */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs font-black text-blue-300 shrink-0">
                3
              </div>
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-black text-white">
                {isZh ? '退货运费承担标准' : isTl ? 'Patakaran sa Freight / Courier Fee' : 'Return Shipping Cost Responsibility'}
              </span>
            </div>
            <div className="text-slate-300 text-xs leading-relaxed pl-8 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5">
                  {isZh ? '个人原因退货' : 'Personal Reasons'}
                </span>
                <span>
                  {isZh
                    ? '（买错颜色/尺寸、不想要了、个人喜好调整等）：退回物流运费由买家自行承担。'
                    : 'Buyer pays return shipping fee for non-defective reasons (e.g. wrong size/color choice, change of mind).'}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5">
                  {isZh ? '质量问题退货' : 'Quality Defect'}
                </span>
                <span>
                  {isZh
                    ? '（商品破损、功能故障、少发漏发、发错款式等）：卖家承担往返全部运费。'
                    : 'Seller covers all shipping fees for defective, damaged, or incorrectly sent items.'}
                </span>
              </div>
            </div>
          </div>

          {/* Rule 4: Excluded Categories */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center text-xs font-black text-red-300 shrink-0">
                4
              </div>
              <Ban className="w-4 h-4 text-red-400" />
              <span className="text-sm font-black text-white">
                {isZh ? '不支持7天无理由退货的排除类目' : isTl ? 'Mga Hindi Kasali sa Return' : 'Excluded Categories (Non-Returnable)'}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-8">
              {isZh
                ? '依据电商相关法律规定与卫生安全标准，以下特殊商品类目不支持无理由退换：'
                : 'Due to health, safety, and customization regulations, the following categories do NOT support no-reason returns:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 text-xs font-medium">
              {[
                { zh: '1. 定制类商品 (个人刻字、专属尺寸)', en: 'Customized & Personalized Goods' },
                { zh: '2. 贴身衣物 (内衣裤、泳衣、袜子等)', en: 'Underwear, Swimwear & Socks' },
                { zh: '3. 消耗品及一次性使用工具', en: 'Consumable & Single-use Goods' },
                { zh: '4. 已封锁拆封的美妆护肤/个人护理', en: 'Opened Cosmetics & Personal Care' },
                { zh: '5. 数字虚拟产品 (充值卡/盲盒兑换码)', en: 'Digital Virtual Cards & Unboxed Vouchers' },
              ].map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-red-500/10 p-2 rounded-xl text-red-200 border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="truncate">{isZh ? cat.zh : cat.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rule 5: Inspection & Restocking Fee */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs font-black text-emerald-300 shrink-0">
                5
              </div>
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-black text-white">
                {isZh ? '验货检验与重新入库费说明' : isTl ? 'Inspeksyon at Restocking Fee' : 'Inspection & Restocking Fee Terms'}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-8">
              {isZh ? (
                <>
                  商家收到退回商品并经质检确认无误后方可完成退款办理；如原卡纸或外包装有明显撕裂破损需要重新翻新入库的，双方约定可扣除少量重新入库费（Restocking Fee，<strong className="text-emerald-300 font-bold">建议≤10% - 15%</strong>）。
                </>
              ) : (
                <>
                  Refunds are processed after the return warehouse conducts visual inspection. If the original packaging is slightly damaged requiring repackaging, a minor <strong className="text-emerald-300 font-bold">Restocking Fee (≤10% - 15%)</strong> may apply.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <HelpCircle className="w-4 h-4 text-[#FF8C61]" />
            <span>
              {isZh ? '如有疑问请联系 Ginno 7x24 在线客服' : 'Need help? Contact Ginno 24/7 Customer Service'}
            </span>
          </div>
          <button
            onClick={() => setShowReturnPolicyModal(false)}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-extrabold rounded-xl shadow-lg shadow-purple-500/20 transition-all text-xs"
          >
            {isZh ? '我已了解并同意' : isTl ? 'Naintindihan Ko Na' : 'I Understand & Agree'}
          </button>
        </div>
      </div>
    </div>
  );
};
