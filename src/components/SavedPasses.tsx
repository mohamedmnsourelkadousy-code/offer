import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderHeart, 
  Smartphone, 
  Trash2, 
  QrCode, 
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  Coffee
} from 'lucide-react';
import { Offer } from '../types';
import WalletPassSim from './WalletPassSim';

interface SavedPassesProps {
  onSelectOffer: (offerId: string) => void;
}

export default function SavedPasses({ onSelectOffer }: SavedPassesProps) {
  const [savedOffers, setSavedOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Sync with available offers on load/poll
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        if (response.ok) {
          const data: Offer[] = await response.json();
          // For demo simplicity, we can show all offers, or filter them
          // Let's list all registered offers in the database as available in the phone's wallet!
          setSavedOffers(data);
        }
      } catch (err) {
        console.error("Error fetching saved passes:", err);
      }
    };

    fetchOffers();
    // Poll every 5 seconds to keep database in sync (so if they scan and redeem on phone, it updates on desktop!)
    const interval = setInterval(fetchOffers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Simply filter out in local state or keep it in sync
    setSavedOffers(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-natural-sand p-6 shadow-sm text-right">
      <div className="flex items-center justify-between mb-4 border-b border-natural-sand pb-3">
        <span className="text-[10px] font-mono bg-natural-olive/10 text-natural-olive px-3 py-1 rounded-full font-bold">
          {savedOffers.length} بطاقة رقمية نشطة
        </span>
        <div className="flex items-center gap-2">
          <h3 className="font-serif font-bold text-lg text-natural-dark">محفظة العروض المدمجة (In-App Wallet)</h3>
          <FolderHeart className="w-5 h-5 text-natural-olive" />
        </div>
      </div>
      
      <p className="text-xs text-slate-600 mb-6 leading-relaxed">
        استعرض وتحكّم ببطاقات الهدايا التي تم توليدها. هذه المحاكاة توفر لك معاينة تفاعلية لكيفية ترتيب البطاقات واستخدامها داخل محفظة العميل الرقمية.
      </p>

      {savedOffers.length === 0 ? (
        <div className="border border-dashed border-natural-sand rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-natural-bg rounded-full flex items-center justify-center mx-auto text-natural-olive">
            <Smartphone className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            المحفظة فارغة حالياً. بمجرد إنشاء عرض جديد أو الضغط على "إضافة للمحفظة"، ستظهر البطاقات منسقة هنا تلقائياً!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedOffers.map((offer) => {
            const isExpired = new Date(offer.expiresAt) < new Date();
            const formattedExpiry = new Date(offer.expiresAt).toLocaleDateString('ar-EG', {
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={offer.id}
                onClick={() => setSelectedOffer(offer)}
                className="group relative rounded-xl p-4 cursor-pointer overflow-hidden border border-natural-sand bg-natural-bg/40 hover:bg-white hover:border-natural-olive hover:shadow-md transition-all duration-300 flex flex-col justify-between aspect-[1.6/1]"
              >
                {/* Visual colored accent sidebar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5" 
                  style={{ backgroundColor: offer.bgColor || '#5A5A40' }} 
                />

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <button
                      onClick={(e) => handleDelete(offer.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md border border-natural-sand transition-all duration-200"
                      title="إزالة من هذه الواجهة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-right">
                      <span className="text-[10px] text-natural-olive font-bold block">{offer.merchant}</span>
                      <h4 className="font-bold text-sm text-natural-dark group-hover:text-natural-olive transition-colors truncate max-w-[180px]">
                        {offer.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Footer labels */}
                <div className="flex justify-between items-center pt-2.5 border-t border-natural-sand text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-white border border-natural-sand px-1.5 py-0.5 rounded font-bold text-natural-dark">{offer.code}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    {offer.isUsed ? (
                      <span className="text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded">تم استخدامها</span>
                    ) : isExpired ? (
                      <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">منتهي</span>
                    ) : (
                      <span className="text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        صالح حتى {formattedExpiry}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN PREVIEW INTERACTIVE MODAL */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-natural-dark/95 backdrop-blur-md z-50 overflow-y-auto flex flex-col items-center justify-center py-6"
          >
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <button
                onClick={() => onSelectOffer(selectedOffer.id)}
                className="bg-natural-olive hover:bg-natural-sage py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg"
              >
                زيارة صفحة الهبوط العامة <QrCode className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedOffer(null)}
                className="bg-white hover:bg-natural-bg p-2.5 rounded-full border border-natural-sand text-natural-dark font-bold text-xs flex items-center justify-center transition-colors shadow-lg"
              >
                إغلاق النافذة [X]
              </button>
            </div>
            
            <div className="w-full max-w-md pt-10">
              <div className="text-center mb-4">
                <span className="text-[10px] text-natural-gold font-bold uppercase tracking-widest block font-serif">معاينة تفاعلية</span>
                <h4 className="font-bold text-lg text-white font-serif mt-1">{selectedOffer.title}</h4>
                <p className="text-xs text-natural-sand">{selectedOffer.merchant}</p>
              </div>
              <WalletPassSim offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
