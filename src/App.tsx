import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Plus, 
  FolderHeart, 
  Info, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  ArrowLeft,
  ChevronLeft,
  RefreshCw,
  Gift,
  MousePointerClick
} from 'lucide-react';
import { Offer } from './types';
import OfferCreator from './components/OfferCreator';
import OfferLanding from './components/OfferLanding';
import SavedPasses from './components/SavedPasses';
import { getSafeLocationSearch, getSafeLocationPathname } from './utils/safeLocation';

export default function App() {
  // Routing: detect ?offerId=xxx query param
  const [offerIdParam, setOfferIdParam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'wallet'>('create');
  const [appInitialized, setAppInitialized] = useState(false);
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);

  useEffect(() => {
    // Read search parameters on load
    const params = new URLSearchParams(getSafeLocationSearch());
    const offerId = params.get('offerId');
    if (offerId) {
      setOfferIdParam(offerId);
    }
    setAppInitialized(true);
  }, []);

  const handleSelectOfferFromWallet = (id: string) => {
    // Force transition to offer landing page
    setOfferIdParam(id);
    // Push state so URL changes or reflects selection
    try {
      const newUrl = `?offerId=${id}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (e) {
      console.warn("Failed to push history state:", e);
    }
  };

  const handleBackToCreator = () => {
    setOfferIdParam(null);
    // Clean up query param
    try {
      const cleanUrl = getSafeLocationPathname();
      window.history.pushState({ path: cleanUrl }, '', cleanUrl);
    } catch (e) {
      console.warn("Failed to push history state:", e);
    }
  };

  const handleOfferCreated = (newOffer: Offer) => {
    setRecentOffers(prev => [newOffer, ...prev]);
  };

  if (!appInitialized) {
    return (
      <div className="min-h-screen bg-natural-bg flex items-center justify-center text-slate-500">
        <div className="w-8 h-8 border-2 border-natural-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render Offer Landing Page directly if query parameter is active
  if (offerIdParam) {
    return (
      <OfferLanding 
        offerId={offerIdParam} 
        onBackToCreator={handleBackToCreator} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-natural-bg text-natural-dark selection:bg-natural-olive selection:text-white pb-12 transition-colors duration-300">
      
      {/* Decorative background delicate textures and gradients */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-natural-sand/30 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-natural-olive/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-natural-sage/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-natural-sand pb-6 mb-8 text-right md:text-right gap-4">
          <div className="flex items-center gap-3 md:order-2 justify-end">
            <div className="text-right">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-natural-dark tracking-tight flex items-center gap-2.5 justify-end">
                <span>إنشاء بطاقات الـ Wallet وكود QR</span>
                <QrCode className="w-8 h-8 text-natural-olive" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
                نظام متكامل لتوليد كوبونات الهدايا المجانية وحفظها مباشرة في محفظة الهاتف (Apple & Google Wallet)
              </p>
            </div>
          </div>
          
          {/* Quick status button */}
          <div className="flex gap-2 justify-center md:order-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-natural-sand text-[11px] font-bold text-natural-olive shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              قاعدة بيانات العروض نشطة (Active)
            </span>
          </div>
        </header>

        {/* Dynamic Instructional Flowchart */}
        <section className="bg-white rounded-2xl border border-natural-sand p-6 mb-8 text-right shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-natural-olive/5 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-2 justify-end mb-4 border-b border-natural-sand pb-3">
            <h3 className="font-serif font-bold text-base text-natural-dark">كيف تعمل هذه المنصة؟ (دورة حياة العرض المجاني)</h3>
            <HelpCircle className="w-4.5 h-4.5 text-natural-olive" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 text-right">
            
            {/* Step 1 */}
            <div className="bg-natural-bg/50 p-4 rounded-xl border border-natural-sand/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-natural-olive/10 text-natural-olive px-2.5 py-0.5 rounded">الخطوة 1</span>
                <Plus className="w-4.5 h-4.5 text-natural-olive" />
              </div>
              <h4 className="font-bold text-xs text-natural-dark">تخصيص وإنشاء العرض</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                قم بتعبئة بيانات هديتك (كوب قهوة، كرواسون، إلخ...) وحدد الألوان والشروط المناسبة لمتجرك.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-natural-bg/50 p-4 rounded-xl border border-natural-sand/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-natural-olive/10 text-natural-olive px-2.5 py-0.5 rounded">الخطوة 2</span>
                <QrCode className="w-4.5 h-4.5 text-natural-olive" />
              </div>
              <h4 className="font-bold text-xs text-natural-dark">تعليق ملصق الـ QR</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                قم بتحميل رمز الـ QR المولد وعرضه على الطاولات أو الكاونتر ليقوم العميل بمسحه بكاميرا هاتفه.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-natural-bg/50 p-4 rounded-xl border border-natural-sand/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-natural-olive/10 text-natural-olive px-2.5 py-0.5 rounded">الخطوة 3</span>
                <Smartphone className="w-4.5 h-4.5 text-natural-olive" />
              </div>
              <h4 className="font-bold text-xs text-natural-dark">حفظ البطاقة في المحفظة</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                تفتح صفحة العرض بهاتف العميل مباشرة، ويضغط على زر الحفظ لتتحمل البطاقة في محفظة Apple أو Google.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-natural-bg/50 p-4 rounded-xl border border-natural-sand/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-natural-olive/10 text-natural-olive px-2.5 py-0.5 rounded">الخطوة 4</span>
                <CheckCircle2 className="w-4.5 h-4.5 text-natural-olive" />
              </div>
              <h4 className="font-bold text-xs text-natural-dark">الصرف والاعتماد الفوري</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                يبرز العميل بطاقة المحفظة للموظف، ويقوم الكاشير بمسح الكود أو الضغط على زر "اعتماد الكوبون" لإتمام الصرف بأمان!
              </p>
            </div>

          </div>
        </section>

        {/* Dashboard Tabs Selectors */}
        <div className="flex border-b border-natural-sand mb-8 gap-2 justify-end z-10 relative">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-5 py-3 border-b-2 text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'wallet'
                ? 'border-natural-olive text-natural-olive font-extrabold'
                : 'border-transparent text-slate-500 hover:text-natural-olive'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            استعراض المحفظة الرقمية والعروض القائمة
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-5 py-3 border-b-2 text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'create'
                ? 'border-natural-olive text-natural-olive font-extrabold'
                : 'border-transparent text-slate-500 hover:text-natural-olive'
            }`}
          >
            <Plus className="w-4 h-4" />
            تخصيص وإنشاء رمز QR جديد
          </button>
        </div>

        {/* Tab Contents */}
        <main className="z-10 relative">
          {activeTab === 'create' ? (
            <OfferCreator onOfferCreated={handleOfferCreated} />
          ) : (
            <SavedPasses onSelectOffer={handleSelectOfferFromWallet} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-natural-sand pt-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <span>حقوق النشر والبرمجة © {new Date().getFullYear()} - جميع الحقوق محفوظة</span>
            <div className="flex gap-4">
              <span className="hover:text-natural-olive cursor-pointer">مطور في بيئة Google AI Studio</span>
              <span>•</span>
              <span className="hover:text-natural-olive cursor-pointer">يدعم Apple Pay & Google Wallet</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
