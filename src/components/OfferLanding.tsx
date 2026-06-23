import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  QrCode,
  ShieldCheck,
  ChevronLeft,
  Smartphone,
  Download
} from 'lucide-react';
import { Offer } from '../types';
import WalletPassSim from './WalletPassSim';
import { safeNavigateTo } from '../utils/safeLocation';

interface OfferLandingProps {
  offerId: string;
  onBackToCreator?: () => void;
}

export default function OfferLanding({ offerId, onBackToCreator }: OfferLandingProps) {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Redeem state
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState('');
  const [showRedeemConfirm, setShowRedeemConfirm] = useState(false);
  const [showPassSim, setShowPassSim] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Fetch the offer data from backend
  useEffect(() => {
    const fetchOffer = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/offers/${offerId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'عذراً، لم نتمكن من العثور على هذا العرض الرقمي.');
        }
        const data: Offer = await response.json();
        setOffer(data);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ في الاتصال بالخادم.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  // Handle countdown calculation
  useEffect(() => {
    if (!offer) return;

    const timer = setInterval(() => {
      const difference = +new Date(offer.expiresAt) - +new Date();
      if (difference <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [offer]);

  const handleRedeem = async () => {
    if (!offer) return;
    setIsRedeeming(true);
    setRedeemError('');
    try {
      const response = await fetch(`/api/offers/${offer.id}/redeem`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'فشل اعتماد وتفعيل الكوبون.');
      }
      const data = await response.json();
      setOffer(data.offer); // Update with the redeemed offer
      setShowRedeemConfirm(false);
    } catch (err: any) {
      setRedeemError(err.message || 'حدث خطأ ما');
    } finally {
      setIsRedeeming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-natural-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-natural-olive border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="font-serif font-bold text-lg text-natural-dark">جاري تحميل العرض والتحقق من الصلاحية...</h3>
        <p className="text-xs text-slate-500 mt-1">الرجاء الانتظار قليلاً</p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-natural-bg flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-600 mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-xl text-natural-dark">عذراً، العرض غير موجود</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {error || 'يبدو أن رمز الـ QR الذي قمت بمسحه خاطئ أو منتهي الصلاحية.'}
        </p>
        <div className="mt-8 space-y-3 w-full">
          {onBackToCreator && (
            <button
              onClick={onBackToCreator}
              className="w-full py-3 bg-natural-olive hover:bg-natural-sage text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              الذهاب للوحة إنشاء العروض
            </button>
          )}
        </div>
      </div>
    );
  }

  const formattedExpiry = new Date(offer.expiresAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-natural-bg text-natural-dark pb-12">
      {/* Mobile-style Top bar */}
      <div className="bg-white border-b border-natural-sand p-4 sticky top-0 backdrop-blur-md z-30 flex items-center justify-between shadow-sm">
        <div className="w-8" /> {/* spacing placeholder */}
        <h2 className="font-serif font-bold text-sm tracking-tight text-natural-dark flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-natural-olive animate-pulse" />
          بوابة العروض والهدايا المجانية
        </h2>
        {onBackToCreator ? (
          <button 
            onClick={onBackToCreator}
            className="text-xs text-slate-500 hover:text-natural-dark font-bold flex items-center gap-1 transition-colors"
          >
            <span>الرئيسية</span>
            <ChevronLeft className="w-4 h-4 text-natural-olive" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">

        {/* Brand Banner Card */}
        <div className="bg-white rounded-2xl border border-natural-sand overflow-hidden shadow-sm relative">
          
          {/* Main Cover Image */}
          <div className="relative h-48 bg-natural-bg">
            <img 
              src={offer.imageUrl} 
              alt={offer.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute top-4 right-4 bg-natural-olive text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              عرض نشط وصالح
            </div>
          </div>

          {/* Content info */}
          <div className="p-5 text-right space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-natural-olive font-bold font-serif block">{offer.merchant}</span>
              <h1 className="text-2xl font-serif font-bold text-natural-dark tracking-tight leading-snug">{offer.title}</h1>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {offer.description}
            </p>

            {/* Countdown timer */}
            {timeLeft ? (
              <div className="bg-natural-bg border border-natural-sand p-3 rounded-xl flex items-center justify-between shadow-inner">
                <div className="flex gap-1.5 font-mono text-center">
                  <div className="bg-white px-2.5 py-1 rounded border border-natural-sand/70 min-w-[32px] shadow-sm">
                    <span className="block text-xs font-bold text-natural-olive">{timeLeft.seconds}</span>
                    <span className="text-[7px] text-slate-500">ثانية</span>
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded border border-natural-sand/70 min-w-[32px] shadow-sm">
                    <span className="block text-xs font-bold text-natural-olive">{timeLeft.minutes}</span>
                    <span className="text-[7px] text-slate-500">دقيقة</span>
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded border border-natural-sand/70 min-w-[32px] shadow-sm">
                    <span className="block text-xs font-bold text-natural-olive">{timeLeft.hours}</span>
                    <span className="text-[7px] text-slate-500">ساعة</span>
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded border border-natural-sand/70 min-w-[32px] shadow-sm">
                    <span className="block text-xs font-bold text-natural-olive">{timeLeft.days}</span>
                    <span className="text-[7px] text-slate-500">يوم</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-right text-slate-600">
                  <span className="text-[10px] font-bold">ينتهي في:</span>
                  <Clock className="w-3.5 h-3.5 text-natural-olive" />
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center text-red-700 text-xs font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                انتهت صلاحية هذا الكوبون!
              </div>
            )}

            {/* Expire and safety badges */}
            <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500 pt-1">
              <div className="bg-natural-bg/50 border border-natural-sand/40 p-2 rounded-lg flex items-center gap-1.5 justify-end">
                <span className="font-mono">{formattedExpiry}</span>
                <Calendar className="w-3.5 h-3.5 text-natural-olive" />
              </div>
              <div className="bg-natural-bg/50 border border-natural-sand/40 p-2 rounded-lg flex items-center gap-1.5 justify-end">
                <span>تفعيل محمي رقمياً</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Used Watermark Overlay */}
          {offer.isUsed && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10">
              <div className="border-[4px] border-red-600 text-red-600 font-serif font-black text-2xl uppercase tracking-widest px-6 py-2.5 rounded-xl rotate-12 bg-white shadow-xl flex flex-col items-center">
                <span>تم الاستخدام</span>
                <span className="text-[10px] font-mono mt-1 opacity-80">{new Date(offer.usedAt || '').toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Save to Wallet Quick Trigger Section */}
        {!offer.isUsed && (
          <div className="bg-white p-5 rounded-2xl border border-natural-sand text-center space-y-3 shadow-sm">
            <h3 className="font-serif font-bold text-sm text-natural-dark">حفظ البطاقة في محفظة الهاتف</h3>
            <p className="text-[11px] text-slate-600 leading-normal max-w-xs mx-auto">
              اضغط على أحد الأزرار أدناه لتنزيل البطاقة الرقمية مباشرة إلى جهازك أو معاينة شكلها ومحاكاتها.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  // Direct download via safeNavigateTo to handle sandbox environments safely
                  safeNavigateTo(`/api/offers/${offer.id}/pkpass`, `pass-${offer.id}.pkpass`);
                }}
                className="w-full py-3 px-4 rounded-xl border border-natural-sand bg-white text-slate-700 font-bold text-xs shadow-sm hover:bg-natural-bg hover:text-natural-olive transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-natural-olive" />
                تنزيل ملف المحفظة (.pkpass)
              </button>

              <button
                onClick={() => setShowPassSim(true)}
                className="w-full py-3 px-4 rounded-xl bg-natural-olive hover:bg-natural-sage text-white font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                معاينة ومحاكاة المحفظة
              </button>
            </div>
          </div>
        )}

        {/* Merchant Redemption validation Panel (لوحة تفعيل الموظف) */}
        <div className="bg-white p-5 rounded-2xl border border-natural-sand text-right space-y-4 shadow-sm">
          <div className="flex items-center gap-2 justify-end">
            <h3 className="font-serif font-bold text-xs text-natural-dark">قسم خاص بالموظف / الكاشير (Merchant Validation)</h3>
            <QrCode className="w-4 h-4 text-natural-olive" />
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            بصفتك كاشير أو بائع، عند تقديم الهدية المجانية للعميل، اضغط على زر الاعتماد أدناه لإلغاء صلاحية هذا الكوبون لضمان عدم استخدامه مرة أخرى.
          </p>

          {redeemError && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-700 rounded-xl text-xs font-bold text-center">
              {redeemError}
            </div>
          )}

          {offer.isUsed ? (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 rounded-xl text-center text-xs font-bold">
              تم صرف هذا الكوبون واعتماده مسبقاً!
            </div>
          ) : (
            <div>
              {!showRedeemConfirm ? (
                <button
                  onClick={() => setShowRedeemConfirm(true)}
                  className="w-full py-2.5 bg-white hover:bg-natural-bg border border-natural-sand text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  صرف الهدية واعتماد الكوبون
                </button>
              ) : (
                <div className="bg-natural-bg/30 p-4 rounded-xl border border-natural-sand space-y-3">
                  <span className="block text-[11px] text-red-600 font-bold text-center">هل تريد بالتأكيد اعتماد وصرف هذا الكوبون؟</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowRedeemConfirm(false)}
                      className="py-2 bg-white border border-natural-sand text-slate-500 rounded-lg text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleRedeem}
                      disabled={isRedeeming}
                      className="py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                    >
                      {isRedeeming && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      تأكيد الصرف والاعتماد
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* IMMERSIVE WALLET PASS SIMULATOR OVERLAY */}
      {showPassSim && (
        <div className="fixed inset-0 bg-natural-bg/95 backdrop-blur-md z-50 overflow-y-auto flex flex-col items-center justify-center py-6">
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => setShowPassSim(false)}
              className="bg-white hover:bg-natural-bg px-3 py-2 rounded-xl border border-natural-sand text-slate-700 font-serif font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              إغلاق النافذة [X]
            </button>
          </div>
          <div className="w-full max-w-md">
            <WalletPassSim offer={offer} onClose={() => setShowPassSim(false)} />
          </div>
        </div>
      )}

    </div>
  );
}
