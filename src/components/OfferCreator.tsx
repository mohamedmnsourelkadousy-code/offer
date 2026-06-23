import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Plus, 
  Sparkles, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Coffee, 
  Utensils, 
  Palette, 
  Smartphone,
  ChevronRight,
  Info,
  Calendar,
  Eye,
  Store,
  FileText
} from 'lucide-react';
import { Offer } from '../types';
import { getSafeLocationOrigin } from '../utils/safeLocation';

interface OfferCreatorProps {
  onOfferCreated: (offer: Offer) => void;
}

const PRESETS = [
  {
    title: "قهوة مقطرة V60 مجانية",
    merchant: "مقهى ومحمصة آروما (Aroma Coffee)",
    description: "احصل على كوب مجاني من القهوة المقطرة الباردة أو الحارة المحضرة بحبوب البن الكولومبية الفاخرة ذات الإيحاءات الكرزية.",
    category: "coffee",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    bgColor: "#1e1b4b", // deep indigo
    textColor: "#f8fafc",
    expiresInDays: 7
  },
  {
    title: "ماتشا باردة بالحليب",
    merchant: "ماتشا لاند (Matcha Land)",
    description: "استمتع بمشروب الماتشا اليابانية الاحتفالية الباردة مع حليب الشوفان الفاخر مجاناً بالكامل بمناسبة الافتتاح.",
    category: "tea",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800",
    bgColor: "#064e3b", // deep green
    textColor: "#f0fdf4",
    expiresInDays: 5
  },
  {
    title: "دونات الزعفران والهيل",
    merchant: "مخبز قرفة (Cinnamon Bakery)",
    description: "دونات طازجة مغطاة بصوص السكر والهيل مع خيوط الزعفران الفاخرة مجاناً مع أي قهوة تطلبها.",
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    bgColor: "#7c2d12", // terracotta
    textColor: "#fff7ed",
    expiresInDays: 3
  },
  {
    title: "كرواسون اللوز البلجيكي",
    merchant: "مخبز وحلويات أوبرا (Opera)",
    description: "كرواسون اللوز المقرمش المخبوز على الطريقة الفرنسية التقليدية ومحشو بكريمة اللوز الغنية.",
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
    bgColor: "#4c1d95", // deep purple
    textColor: "#faf5ff",
    expiresInDays: 4
  },
  {
    title: "موهيتو خوخ ونعناع منعش",
    merchant: "جوس بار (Juice Bar)",
    description: "مشروب غازي بارد بنكهة الخوخ والنعناع الطازج وشرائح الليمون، المشروب المثالي لأيام الصيف الدافئة.",
    category: "drink",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    bgColor: "#0f172a", // slate dark
    textColor: "#f8fafc",
    expiresInDays: 7
  }
];

const COLOR_PALETTES = [
  { name: 'كحلي ليلي', bg: '#1e1b4b', text: '#f8fafc' },
  { name: 'أخضر غابات', bg: '#064e3b', text: '#f0fdf4' },
  { name: 'بنفسجي ملكي', bg: '#4c1d95', text: '#faf5ff' },
  { name: 'برتقالي طيني', bg: '#7c2d12', text: '#fff7ed' },
  { name: 'رمادي داكن', bg: '#0f172a', text: '#f8fafc' },
  { name: 'وردي لطيف', bg: '#831843', text: '#fdf2f8' },
];

export default function OfferCreator({ onOfferCreated }: OfferCreatorProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [merchant, setMerchant] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'coffee' | 'tea' | 'dessert' | 'food' | 'drink' | 'other'>('coffee');
  const [imageUrl, setImageUrl] = useState('');
  const [bgColor, setBgColor] = useState('#1e1b4b');
  const [textColor, setTextColor] = useState('#f8fafc');
  const [expiresAt, setExpiresAt] = useState('');

  // UI Flow State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOffer, setCreatedOffer] = useState<Offer | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [publicBaseUrl, setPublicBaseUrl] = useState('');

  // Fetch the dynamic public URL configuration on mount
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && data.publicUrl) {
          setPublicBaseUrl(data.publicUrl);
        }
      })
      .catch(err => {
        console.error("Failed to load backend public URL config:", err);
      });
  }, []);

  // Set default expiration date to 7 days from now
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    // Format to yyyy-MM-dd for HTML date input
    const formatted = defaultDate.toISOString().split('T')[0];
    setExpiresAt(formatted);
  }, []);

  const selectPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setMerchant(preset.merchant);
    setDescription(preset.description);
    setCategory(preset.category as any);
    setImageUrl(preset.imageUrl);
    setBgColor(preset.bgColor);
    setTextColor(preset.textColor);
    
    const exp = new Date();
    exp.setDate(exp.getDate() + preset.expiresInDays);
    setExpiresAt(exp.toISOString().split('T')[0]);
  };

  const getSafeFallbackOrigin = () => {
    return getSafeLocationOrigin();
  };

  const isValidPublicUrl = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return !lower.includes('google.com') && 
           !lower.includes('aistudio') && 
           !lower.includes('localhost') && 
           !lower.includes('127.0.0.1') &&
           !lower.includes('0.0.0.0');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !merchant || !description) {
      setError('الرجاء إدخال الحقول الأساسية (العنوان، المتجر والوصف)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const expirationISO = new Date(expiresAt).toISOString();
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          merchant,
          description,
          category,
          imageUrl,
          bgColor,
          textColor,
          expiresAt: expirationISO,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'حدث خطأ أثناء حفظ العرض');
      }

      const newOffer: Offer = await response.json();
      
      // Generate QR Code containing the link to scan
      // Dynamic link based on loaded backend publicUrl config, falling back to mapped origin
      let scanLink = '';
      if (isValidPublicUrl(publicBaseUrl)) {
        scanLink = `${publicBaseUrl}/?offerId=${newOffer.id}`;
      } else {
        scanLink = `${getSafeFallbackOrigin()}/?offerId=${newOffer.id}`;
      }

      const qrDataUrl = await QRCode.toDataURL(scanLink, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });

      setQrCodeDataUrl(qrDataUrl);
      setCreatedOffer(newOffer);
      onOfferCreated(newOffer);
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdOffer) return;
    
    let scanLink = '';
    if (isValidPublicUrl(publicBaseUrl)) {
      scanLink = `${publicBaseUrl}/?offerId=${createdOffer.id}`;
    } else {
      scanLink = `${getSafeFallbackOrigin()}/?offerId=${createdOffer.id}`;
    }
    
    let successful = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(scanLink);
        successful = true;
      }
    } catch (err) {
      console.warn("Modern clipboard copy failed:", err);
    }

    if (!successful) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = scanLink;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        successful = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.warn("Fallback copy failed:", err);
      }
    }

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setCreatedOffer(null);
    setQrCodeDataUrl('');
    setTitle('');
    setMerchant('');
    setDescription('');
    setImageUrl('');
    setCategory('coffee');
    setBgColor('#1e1b4b');
    setTextColor('#f8fafc');
  };

  const baseLink = isValidPublicUrl(publicBaseUrl) ? publicBaseUrl : getSafeFallbackOrigin();
  const offerLink = createdOffer ? `${baseLink}/?offerId=${createdOffer.id}` : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form & Setup (Column left/middle) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-natural-sand p-6 shadow-sm">
        {!createdOffer ? (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-natural-sand pb-3">
              <Sparkles className="w-5 h-5 text-natural-olive" />
              <h3 className="font-serif font-bold text-lg text-natural-dark">لوحة إنشاء العروض ورموز QR</h3>
            </div>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              اختر أحد القوالب الجاهزة أو املأ النموذج أدناه لإنشاء بطاقة العرض المجاني ورمز الـ QR الخاص بها بشكل تلقائي.
            </p>

            {/* Presets Quick Selector */}
            <div className="mb-6">
              <span className="block text-xs font-bold text-slate-700 mb-2.5">اختيار عرض جاهز (سريع):</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className="px-3.5 py-1.5 rounded-lg bg-natural-bg/50 hover:bg-natural-sand text-slate-700 border border-natural-sand/70 text-xs font-medium flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                  >
                    <Coffee className="w-3.5 h-3.5 text-natural-gold" />
                    {preset.title.split(' ')[0]} - {preset.merchant.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 justify-end">
                    <span>اسم المتجر / الكافيه</span>
                    <Store className="w-3.5 h-3.5 text-natural-olive" />
                  </label>
                  <input
                    type="text"
                    required
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder="مثال: مقهى العميد الكلاسيكي"
                    className="w-full px-4 py-2.5 rounded-xl bg-natural-bg/30 text-natural-dark border border-natural-sand text-xs focus:ring-2 focus:ring-natural-olive focus:bg-white focus:outline-none placeholder-slate-400 transition-all text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 justify-end">
                    <span>عنوان العرض المجاني</span>
                    <FileText className="w-3.5 h-3.5 text-natural-olive" />
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: كوب إسبريسو مجاني"
                    className="w-full px-4 py-2.5 rounded-xl bg-natural-bg/30 text-natural-dark border border-natural-sand text-xs focus:ring-2 focus:ring-natural-olive focus:bg-white focus:outline-none placeholder-slate-400 transition-all text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف العرض والشروط (Terms & Description)</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: احصل على فنجان إسبريسو مجاناً بالكامل عند إبراز هذه البطاقة للكاشير. يسري العرض لمدة محدودة بمناسبة نهاية العام."
                  className="w-full px-4 py-2.5 rounded-xl bg-natural-bg/30 text-natural-dark border border-natural-sand text-xs focus:ring-2 focus:ring-natural-olive focus:bg-white focus:outline-none placeholder-slate-400 transition-all text-right leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 justify-end">
                    <span>تاريخ انتهاء صلاحية العرض</span>
                    <Calendar className="w-3.5 h-3.5 text-natural-olive" />
                  </label>
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-natural-bg/30 text-natural-dark border border-natural-sand text-xs focus:ring-2 focus:ring-natural-olive focus:bg-white focus:outline-none transition-all text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">تصنيف الهدية</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-natural-bg/30 text-natural-dark border border-natural-sand text-xs focus:ring-2 focus:ring-natural-olive focus:bg-white focus:outline-none transition-all text-right"
                  >
                    <option value="coffee">☕ قهوة (Coffee)</option>
                    <option value="tea">🍵 شاي / ماتشا (Tea/Matcha)</option>
                    <option value="dessert">🥐 حلويات ومخبوزات (Dessert)</option>
                    <option value="food">🍔 وجبة خفيفة (Food)</option>
                    <option value="drink">🍹 مشروب منعش (Drinks)</option>
                    <option value="other">🎁 أخرى (Gift)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط صورة الهدية (من Unsplash أو مماثل)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-natural-bg/30 text-natural-dark border border-natural-sand text-xs focus:ring-2 focus:ring-natural-olive focus:bg-white focus:outline-none placeholder-slate-400 transition-all text-left"
                />
                <span className="block text-[10px] text-slate-500 mt-1 text-right">
                  اترك الحقل فارغاً لاستخدام صورة تلقائية جذابة تتناسب مع اختيارك.
                </span>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1 justify-end">
                  <span>لون السمة للبطاقة (Card Theme)</span>
                  <Palette className="w-3.5 h-3.5 text-natural-olive" />
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {COLOR_PALETTES.map((palette, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBgColor(palette.bg);
                        setTextColor(palette.text);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all duration-200 ${
                        bgColor === palette.bg 
                          ? 'border-natural-olive bg-natural-bg scale-105' 
                          : 'border-natural-sand bg-white hover:bg-natural-bg/30'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full mx-auto mb-1 border border-white/10" style={{ backgroundColor: palette.bg }} />
                      <span className="text-[10px] text-slate-500 font-medium block truncate">{palette.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-natural-olive hover:bg-natural-sage text-white font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    توليد الـ QR وبطاقة العرض المجانية حقيقياً
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE: QR CODE CREATED */
          <div className="text-center space-y-6 py-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-natural-dark">تم توليد رمز الـ QR بنجاح!</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-md mx-auto">
                العرض الآن مسجل حياً في قاعدة بيانات النظام. بمجرد قيام العميل بمسح هذا الكود، ستفتح لديه صفحة الهدايا والبطاقات مباشرة.
              </p>
            </div>

            {/* QR Card Container */}
            <div className="bg-white p-6 rounded-2xl max-w-xs mx-auto border border-natural-sand shadow-md flex flex-col items-center">
              <span className="text-[10px] font-bold text-natural-olive tracking-wider mb-2 uppercase font-serif">مسح العرض المجاني</span>
              <img src={qrCodeDataUrl} alt="Offer QR Code" className="w-48 h-48 block" />
              <div className="mt-4 text-center">
                <h4 className="font-bold text-xs text-slate-900">{createdOffer.title}</h4>
                <p className="text-[10px] text-natural-olive font-bold font-mono tracking-wider mt-1">{createdOffer.merchant}</p>
                <div className="mt-2.5 bg-natural-olive/10 text-natural-olive font-mono text-[9px] font-bold px-3 py-1 rounded-full">
                  {createdOffer.code}
                </div>
              </div>
            </div>

            {/* Direct Public Link Info Alert */}
            <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl max-w-xs mx-auto text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                رابط مباشر معتمد للهواتف الذكية
              </div>
              <p className="text-[9.5px] text-slate-600 leading-normal">
                يدعم هذا الـ QR متصفحات Safari وهواتف iPhone تلقائياً وبشكل مباشر، دون أي حاجة لتسجيل الدخول أو مواجهة حظر ملفات الارتباط (Cookies).
              </p>
            </div>

            {/* Interactive Actions */}
            <div className="max-w-md mx-auto space-y-3.5 pt-4 text-right">
              <div className="bg-natural-bg/50 p-3 rounded-xl border border-natural-sand flex items-center justify-between text-xs font-mono">
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 bg-white hover:bg-natural-bg text-slate-600 rounded-lg border border-natural-sand flex items-center justify-center transition-colors shadow-sm"
                  title="نسخ الرابط"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <span className="text-slate-600 truncate pl-3 text-right text-[10px] w-64 block font-mono">{offerLink}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={qrCodeDataUrl}
                  download={`qr-code-${createdOffer.id}.png`}
                  className="py-3 px-4 rounded-xl bg-white border border-natural-sand text-slate-700 hover:bg-natural-bg text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  تحميل الـ QR
                </a>
                <a
                  href={offerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-natural-olive hover:bg-natural-sage text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  فتح صفحة العرض
                </a>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 text-center text-xs text-natural-olive hover:text-natural-sage font-bold transition-colors"
              >
                + إنشاء رمز QR لعرض جديد
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Smartphone Live Preview (Column right) */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full max-w-[320px]">
          <div className="flex items-center gap-2 mb-3 px-1 text-slate-500">
            <Smartphone className="w-4 h-4 text-natural-olive" />
            <span className="text-xs font-bold text-natural-dark font-serif">معاينة الهاتف الحية (Live Preview)</span>
          </div>

          {/* Smartphone mockup shell */}
          <div className="relative border-[8px] border-natural-sand rounded-[40px] bg-white overflow-hidden shadow-xl aspect-[9/18] w-full flex flex-col justify-between">
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-natural-sand rounded-full z-30 flex items-center justify-center gap-1.5 border border-white/40">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="w-12 h-1 bg-slate-400 rounded-full" />
            </div>

            {/* Simulated Phone Screen Contents */}
            <div className="flex-1 overflow-y-auto px-4 pt-10 pb-4 flex flex-col justify-between h-full bg-natural-bg select-none">
              
              {/* If created or preview state */}
              <div className="space-y-4">
                {/* Simulated URL bar */}
                <div className="bg-white p-1.5 rounded-xl border border-natural-sand text-[9px] text-slate-500 font-mono text-center flex items-center justify-center gap-1 shadow-sm">
                  <span className="text-slate-400">🔒</span>
                  <span>{createdOffer ? `yourdomain.com/offer/${createdOffer.id}` : 'yourdomain.com/offer/preview'}</span>
                </div>

                {/* Offer Card Preview */}
                <div 
                  className="rounded-2xl p-4 shadow-md text-right border border-white/10"
                  style={{ 
                    backgroundColor: bgColor || '#5A5A40', 
                    color: textColor || '#f8fafc' 
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded font-bold uppercase text-amber-300">GIFT CARD</span>
                    <span className="text-[10px] font-bold truncate max-w-[110px]">{merchant || 'اسم المقهى التجاري'}</span>
                  </div>

                  <div className="h-20 rounded-lg overflow-hidden mb-2.5">
                    <img 
                      src={imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h4 className="text-sm font-extrabold truncate">{title || 'عرض قهوة مقطرة مجانية'}</h4>
                  <p className="text-[10px] opacity-80 line-clamp-2 mt-1 leading-relaxed font-light">
                    {description || 'هنا يظهر تفصيل العرض والشروط، قم بملء الحقول على اليمين لرؤية التغييرات المباشرة.'}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between items-center text-[8px] opacity-75">
                    <span>كود: {createdOffer?.code || 'AUTO-XXXX'}</span>
                    <span>انتهاء: {expiresAt ? new Date(expiresAt).toLocaleDateString('ar-EG') : 'قريباً'}</span>
                  </div>
                </div>

                {/* Wallet Buttons Mockup */}
                <div className="space-y-2 pt-2">
                  <div className="w-full py-2 bg-white text-natural-dark rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm border border-natural-sand">
                    <svg className="w-3.5 h-3.5 text-natural-olive" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M112.5 137.5c0-13.8 11.2-25 25-25H375c13.8 0 25 11.2 25 25V375c0 13.8-11.2 25-25 25H137.5c-13.8 0-25-11.2-25-25V137.5z" stroke="currentColor" strokeWidth="32" fill="none" />
                      <path d="M176 176h160v32H176zm0 64h160v32H176zm0 64h160v32H176z"/>
                    </svg>
                    إضافة إلى Apple Wallet
                  </div>
                  <div className="w-full py-2 bg-natural-olive text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm">
                    <Smartphone className="w-3.5 h-3.5" />
                    إضافة إلى Google Wallet
                  </div>
                </div>
              </div>

              {/* Merchant validation stamp */}
              <div className="pt-4 border-t border-natural-sand text-center text-[8px] text-slate-500 leading-normal">
                <span>تثبيت المحفظة آمن وتفاعلي 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
