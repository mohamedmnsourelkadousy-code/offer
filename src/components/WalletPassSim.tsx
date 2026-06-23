import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  MapPin, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  Info, 
  RotateCw, 
  Smartphone, 
  ChevronLeft, 
  BadgePercent,
  Download,
  AlertCircle
} from 'lucide-react';
import { Offer } from '../types';
import { safeNavigateTo } from '../utils/safeLocation';

interface WalletPassSimProps {
  offer: Offer;
  onClose?: () => void;
  isEmbed?: boolean;
}

export default function WalletPassSim({ offer, onClose, isEmbed = false }: WalletPassSimProps) {
  const [platform, setPlatform] = useState<'apple' | 'google'>('apple');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const formattedExpiry = new Date(offer.expiresAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAddToWallet = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setShowNotification(true);
      
      // Mimic actual pass download via safeNavigateTo so Safari/iOS handles it natively and safely in sandbox
      safeNavigateTo(`/api/offers/${offer.id}/pkpass`, `pass-${offer.id}.pkpass`);

      // Automatically hide notification after 4 seconds
      setTimeout(() => setShowNotification(false), 4000);
    }, 1500);
  };

  const handleDownloadOffline = () => {
    // Navigate using safeNavigateTo to prevent iOS popup blocking of .pkpass files while staying safe in sandboxes
    safeNavigateTo(`/api/offers/${offer.id}/pkpass`, `pass-${offer.id}.pkpass`);

    // Also download text fallback for desktop users after a short delay
    setTimeout(() => {
      const passText = `
------------------------------------------
   ${offer.merchant.toUpperCase()} - WALLET PASS
------------------------------------------
العرض: ${offer.title}
كود الكوبون: ${offer.code}
تاريخ الانتهاء: ${formattedExpiry}
تفاصيل العرض: ${offer.description}
------------------------------------------
هذه بطاقة رقمية صالحة للاستخدام مرة واحدة.
      `;
      const blob = new Blob([passText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pass-${offer.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  return (
    <div className={`w-full flex flex-col items-center ${isEmbed ? '' : 'py-6 px-4'}`}>
      
      {/* Platform Selector */}
      <div className="flex bg-white p-1 rounded-full border border-natural-sand mb-6 gap-1 z-10 shadow-sm">
        <button
          onClick={() => { setPlatform('apple'); setIsFlipped(false); }}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
            platform === 'apple'
              ? 'bg-natural-olive text-white shadow-sm'
              : 'text-slate-500 hover:text-natural-dark'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          محاكاة Apple Wallet
        </button>
        <button
          onClick={() => { setPlatform('google'); setIsFlipped(false); }}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
            platform === 'google'
              ? 'bg-natural-olive text-white shadow-sm'
              : 'text-slate-500 hover:text-natural-dark'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          محاكاة Google Wallet
        </button>
      </div>

      {/* Interactive Pass Container */}
      <div className="relative w-full max-w-sm aspect-[3/5] cursor-pointer group perspective-1000">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full h-full transform-style-3d relative"
        >
          {/* FRONT OF THE CARD */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden border border-white/10"
            style={{ 
              backgroundColor: offer.bgColor, 
              color: offer.textColor,
              boxShadow: `0 25px 50px -12px ${offer.bgColor}50` 
            }}
          >
            {/* Visual Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none" />

            {platform === 'apple' ? (
              /* ================= APPLE WALLET STYLE ================= */
              <>
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-white/10 bg-black/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                      <Coffee className="w-4.5 h-4.5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-[10px] opacity-75 font-medium leading-none">محل كافيه</div>
                      <div className="text-sm font-bold truncate max-w-[150px]">{offer.merchant}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] opacity-70 tracking-wider font-semibold">بطاقة هدايا</div>
                    <div className="text-[11px] font-bold text-amber-300">GIFT PASS</div>
                  </div>
                </div>

                {/* Main Hero & Title */}
                <div className="px-5 pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="relative h-28 rounded-xl overflow-hidden mb-3.5 shadow-md border border-white/5">
                      <img 
                        src={offer.imageUrl} 
                        alt={offer.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <BadgePercent className="w-3 h-3" />
                        مجاني 100%
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold leading-tight line-clamp-2 tracking-tight text-right">
                      {offer.title}
                    </h3>
                    <p className="text-xs opacity-80 mt-1 line-clamp-2 text-right font-light leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Secondary metadata */}
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-dashed border-white/20">
                    <div className="text-right">
                      <div className="text-[9px] opacity-70 leading-none mb-1">تاريخ الانتهاء</div>
                      <div className="text-xs font-mono font-semibold truncate">{formattedExpiry}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] opacity-70 leading-none mb-1">حالة العرض</div>
                      <div className={`text-xs font-bold ${offer.isUsed ? 'text-red-400' : 'text-emerald-400'} flex items-center gap-1 justify-end`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {offer.isUsed ? 'مستعمل' : 'صالح ونشط'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perforation split line style */}
                <div className="relative h-4 flex items-center justify-between px-0 overflow-hidden">
                  <div className="w-3.5 h-3.5 bg-slate-950 rounded-full -mr-1.5 z-10 shadow-inner" />
                  <div className="w-full border-t border-dashed border-white/25 mx-1" />
                  <div className="w-3.5 h-3.5 bg-slate-950 rounded-full -ml-1.5 z-10 shadow-inner" />
                </div>

                {/* Barcode & Redeem footer */}
                <div className="p-4 pt-1 bg-white text-slate-900 rounded-b-2xl flex flex-col items-center justify-center">
                  <div className="w-full max-w-[200px] h-12 bg-white flex flex-col items-center justify-center p-1 border border-slate-200 rounded">
                    {/* Simulated PDF417 bar code */}
                    <div className="w-full h-7 flex gap-[1px] items-stretch overflow-hidden opacity-90">
                      {Array.from({ length: 48 }).map((_, i) => {
                        const heights = ['h-full', 'h-4/5', 'h-3/4', 'h-full', 'h-5/6'];
                        const selectedHeight = heights[(i * 7 + 3) % heights.length];
                        const widths = ['w-[1px]', 'w-[2px]', 'w-[3px]', 'w-[1.5px]'];
                        const selectedWidth = widths[(i * 3 + 2) % widths.length];
                        const isBgDark = (i % 2 === 0 && i % 3 !== 0) || (i % 5 === 0);
                        return (
                          <div 
                            key={i} 
                            className={`${selectedWidth} ${selectedHeight} ${isBgDark ? 'bg-slate-950' : 'bg-transparent'}`} 
                          />
                        );
                      })}
                    </div>
                    <div className="text-[9px] font-mono tracking-[0.25em] text-slate-600 font-bold mt-1">
                      {offer.code}
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center mt-2.5 px-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(true);
                      }}
                      className="text-[10px] text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      تفاصيل الشروط
                    </button>
                    <span className="text-[8px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-bold">
                      APPLE PASSKIT MOCK
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* ================= GOOGLE WALLET STYLE ================= */
              <>
                <div className="p-5 flex flex-col h-full justify-between">
                  {/* Google Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-950/40 flex items-center justify-center border border-white/10">
                        <Coffee className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{offer.merchant}</h4>
                        <p className="text-[10px] opacity-75 font-light">مكافأة الكوبون المجاني</p>
                      </div>
                    </div>
                    <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      GPay Pass
                    </div>
                  </div>

                  {/* Google Body */}
                  <div className="flex-1 py-4 flex flex-col justify-between">
                    <div>
                      <div className="relative h-28 rounded-xl overflow-hidden mb-3 shadow-lg">
                        <img 
                          src={offer.imageUrl} 
                          alt={offer.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h3 className="text-xl font-extrabold text-right leading-snug">
                        {offer.title}
                      </h3>
                      <p className="text-xs opacity-85 mt-1 text-right font-light leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 mt-4">
                      <div className="flex justify-between items-center text-xs">
                        <div className="text-right">
                          <span className="block text-[9px] opacity-65">رمز العميل</span>
                          <span className="font-mono font-bold text-amber-300">{offer.code}</span>
                        </div>
                        <div className="text-left text-right">
                          <span className="block text-[9px] opacity-65">ينتهي في</span>
                          <span className="font-mono font-bold text-slate-200">{formattedExpiry}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google QR code Section */}
                  <div className="bg-white text-slate-900 p-4 rounded-xl flex flex-col items-center justify-center shadow-lg">
                    {/* Simulated Code-128 or QR in white container */}
                    <div className="w-40 h-10 flex items-center justify-center gap-[1.5px] bg-slate-50 p-1.5 rounded border border-slate-100">
                      {Array.from({ length: 35 }).map((_, i) => {
                        const widths = ['w-[1px]', 'w-[2px]', 'w-[3px]', 'w-[1.5px]'];
                        const selectedWidth = widths[(i * 5 + 1) % widths.length];
                        const isBgDark = (i % 2 === 0 && i % 4 !== 0) || (i % 7 === 0);
                        return (
                          <div 
                            key={i} 
                            className={`h-full ${selectedWidth} ${isBgDark ? 'bg-slate-950' : 'bg-transparent'}`} 
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-700 mt-1">{offer.code}</span>
                    <div className="w-full flex justify-between items-center mt-2 pt-1 border-t border-slate-100 text-[10px]">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlipped(true);
                        }}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        الشروط والأحكام
                      </button>
                      <span className="text-slate-400 font-semibold text-[8px]">GOOGLE WALLET MOCK</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Quick action button overlay */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-1.5 rounded-full hover:bg-black/60 transition-colors z-20">
              <RotateCw className="w-3.5 h-3.5 text-white" onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }} />
            </div>
          </div>

          {/* BACK OF THE CARD */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl flex flex-col justify-between p-5 overflow-hidden border border-white/10"
            style={{ 
              backgroundColor: offer.bgColor, 
              color: offer.textColor,
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/40 pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-amber-300" />
                <h4 className="font-bold text-sm">تفاصيل البطاقة والشروط</h4>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full text-xs transition-colors"
              >
                رجوع
              </button>
            </div>

            {/* Terms list */}
            <div className="flex-1 py-4 overflow-y-auto space-y-3.5 text-right text-xs text-slate-200">
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">شروط الاستخدام:</span>
                <p className="leading-relaxed opacity-90 font-light">
                  • هذا العرض صالح للاستخدام الفردي لمرة واحدة فقط بمجرد مسح الكود من قِبل الكاشير.
                </p>
                <p className="leading-relaxed opacity-90 font-light mt-1">
                  • لا يمكن استبدال الكوبون بمبالغ نقدية أو دمجه مع عروض ترويجية أخرى.
                </p>
              </div>

              <div>
                <span className="font-bold text-amber-300 block mb-0.5">الموقع والفروع:</span>
                <p className="leading-relaxed opacity-90 font-light flex items-start gap-1 justify-end mt-1">
                  <span>العرض متاح بجميع الفروع في المملكة العربية السعودية</span>
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                </p>
              </div>

              <div>
                <span className="font-bold text-amber-300 block mb-0.5">الصلاحية:</span>
                <p className="leading-relaxed opacity-90 font-light flex items-start gap-1 justify-end mt-1">
                  <span>تنتهي صلاحية الكوبون في {formattedExpiry}</span>
                  <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                </p>
              </div>

              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 text-[10px]">
                <span className="font-bold text-slate-300 block">معلومات الأمان الرقمي:</span>
                <p className="opacity-75 mt-0.5">
                  تم توليد هذه البطاقة رقمياً وتوقيعها محلياً في المتصفح. معرّف البطاقة الفريد: 
                  <span className="font-mono block text-amber-200 mt-1">{offer.id}</span>
                </p>
              </div>
            </div>

            {/* Back Footer */}
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] opacity-75">
              <span>تاريخ الإضافة: {new Date(offer.createdAt).toLocaleDateString('ar-EG')}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-amber-300 hover:underline flex items-center gap-1 font-bold"
              >
                عرض الوجه الأمامي <RotateCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons below Pass */}
      <div className="w-full max-w-sm mt-6 space-y-3 z-10">
        <AnimatePresence mode="wait">
          {!isAdded ? (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleAddToWallet}
              disabled={isAdding}
              className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                isAdding 
                  ? 'bg-natural-sand text-slate-500 cursor-not-allowed'
                  : 'bg-natural-olive text-white hover:bg-natural-sage shadow-md hover:shadow-lg'
              }`}
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  جاري الإضافة إلى المحفظة...
                </>
              ) : platform === 'apple' ? (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M112.5 137.5c0-13.8 11.2-25 25-25H375c13.8 0 25 11.2 25 25V375c0 13.8-11.2 25-25 25H137.5c-13.8 0-25-11.2-25-25V137.5z" stroke="currentColor" strokeWidth="32" fill="none" />
                    <path d="M176 176h160v32H176zm0 64h160v32H176zm0 64h160v32H176z"/>
                  </svg>
                  إضافة إلى Apple Wallet
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16H9V14H11V16ZM11 12H9V7H11V12ZM15 16H13V14H15V16ZM15 12H13V7H15V12Z" fill="currentColor" />
                  </svg>
                  إضافة إلى Google Wallet
                </>
              )}
            </motion.button>
          ) : (
            <motion.div
              key="added-state"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center text-emerald-800"
            >
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold">تمت الإضافة بنجاح!</span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed mb-3">
                تم حفظ هذه البطاقة وتخزينها في محفظة الهاتف الرقمية بنجاح. يمكنك استعراضها دائماً من علامة تبويب "محفظتي".
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleDownloadOffline}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  تحميل نسخة دون اتصال
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleDownloadOffline}
          className="w-full py-2.5 rounded-xl border border-natural-sand text-slate-600 hover:text-natural-olive hover:bg-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          تحميل البطاقة بصيغة Pass وملف نصي
        </button>

        {!isEmbed && onClose && (
          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-natural-olive font-bold transition-colors"
          >
            إغلاق نافذة المحاكاة
          </button>
        )}
      </div>

      {/* Floating System Notification Simulated */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-80 bg-white border border-natural-sand rounded-2xl p-4 shadow-xl flex gap-3 text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-natural-olive flex items-center justify-center shadow-md shrink-0">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold">محفظة الهاتف الذكي</span>
                <span className="text-[9px] text-natural-gold bg-natural-olive/10 px-1.5 py-0.5 rounded font-mono">الآن</span>
              </div>
              <h5 className="font-bold text-xs text-natural-dark truncate mt-0.5">تم حفظ بطاقة {offer.merchant}</h5>
              <p className="text-[10px] text-slate-600 leading-snug mt-1">
                تم تثبيت كود الكوبون <span className="font-mono font-bold text-natural-olive">{offer.code}</span> بنجاح. البطاقة نشطة ومتاحة للاستخدام!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
