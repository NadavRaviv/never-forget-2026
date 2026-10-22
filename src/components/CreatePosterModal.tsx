import React, { useState, useRef, useEffect } from 'react';
import { TranslationDict } from '../i18n/translations';
import { X, Upload, Download, Sparkles, Image as ImageIcon, Check, RefreshCw, Share2 } from 'lucide-react';

interface CreatePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
  onPosterCreated?: (imageBlobUrl: string) => void;
}

export const CreatePosterModal: React.FC<CreatePosterModalProps> = ({
  isOpen,
  onClose,
  t,
  theme,
  onPosterCreated,
}) => {
  const [topText, setTopText] = useState(t.sloganPrefix);
  const [bottomText, setBottomText] = useState(t.sloganMain);
  const [quoteText, setQuoteText] = useState('');
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>('/assets/aistudio/IMG-20261022-WA0001_d25b5c55.jpg');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === 'light';

  // Update defaults when language changes
  useEffect(() => {
    setTopText(t.sloganPrefix);
    setBottomText(t.sloganMain);
  }, [t]);

  // Redraw canvas whenever inputs change
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed poster aspect ratio: 800 x 1100
    canvas.width = 800;
    canvas.height = 1100;

    // 1. Dark gritty background
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, 800, 1100);

    // 2. Load and draw user's image in the center area
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = uploadedImageSrc;
    img.onload = () => {
      // Draw image in center
      const imgHeight = 620;
      const imgWidth = 720;
      const imgX = 40;
      const imgY = 220;

      // Draw distressed photo frame
      ctx.fillStyle = '#18181b';
      ctx.fillRect(36, 216, 728, 628);

      // Scale and center cover crop
      const hRatio = imgWidth / img.width;
      const vRatio = imgHeight / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (imgWidth - img.width * ratio) / 2;
      const centerShiftY = (imgHeight - img.height * ratio) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(imgX, imgY, imgWidth, imgHeight);
      ctx.clip();
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        imgX + centerShiftX,
        imgY + centerShiftY,
        img.width * ratio,
        img.height * ratio
      );
      ctx.restore();

      // Top Red Stencil Brush Banner
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(30, 40, 740, 150);

      // Paint distressed grunge splatters
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(30, 180, 740, 10);

      // Top Text ("לא שכחנו!")
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 78px Rubik, Heebo, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(topText.toUpperCase(), 400, 115);

      // Quote banner overlay if provided
      if (quoteText.trim()) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(50, 710, 700, 110);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(740, 710, 10, 110);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 26px Rubik, Heebo, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`"${quoteText}"`, 400, 765);
      }

      // Bottom Red / White Banner
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(30, 870, 740, 170);

      // Paint red sub-bar
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(40, 880, 720, 150);

      // Bottom Text ("הולכים להצביע!")
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 74px Rubik, Heebo, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bottomText.toUpperCase(), 400, 955);

      // Grunge outer borders
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 12;
      ctx.strokeRect(16, 16, 768, 1068);
    };
  }, [isOpen, topText, bottomText, quoteText, uploadedImageSrc]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'my-election-poster.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);

      if (onPosterCreated) {
        onPosterCreated(dataUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `*${topText} ${bottomText}*${quoteText ? `\n"${quoteText}"` : ''}\nיצרתי כרזת מחאה אישית לבחירות השבוע! צרו גם אתם: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative max-w-5xl w-full max-h-[94vh] border rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
          isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-neutral-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
          isLight ? 'bg-slate-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/15 text-red-600 border border-red-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                {t.createPosterBtn}
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                סטודיו לעיצוב כרזת מחאה אישית בסגנון הקמפיין הרשמי
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isLight ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* 1. Upload Photo */}
            <div className={`p-4 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <label className="text-xs font-bold block mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-red-500" />
                <span>העלאת תמונה משלך לכרזה:</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>בחרו תמונה מהמכשיר</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadedImageSrc('/assets/aistudio/IMG-20261022-WA0000_2baf57b9.jpg')}
                  className={`py-3 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                    isLight ? 'bg-white border-neutral-300 text-neutral-700' : 'bg-neutral-800 border-neutral-700 text-neutral-200'
                  }`}
                  title="החלף לתמונת רקע לדוגמה"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Top Title */}
            <div>
              <label className="text-xs font-bold block mb-1.5">
                כותרת עליונה בכרזה (סגנון סטנסיל אדום):
              </label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-black focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-neutral-800 text-white'
                }`}
                placeholder="למשל: לא שכחנו!"
              />
            </div>

            {/* 3. Bottom Title */}
            <div>
              <label className="text-xs font-bold block mb-1.5">
                כותרת תחתונה בכרזה (קריאה לפעולה):
              </label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-black focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-neutral-800 text-white'
                }`}
                placeholder="למשל: הולכים להצביע!"
              />
            </div>

            {/* 4. Custom quote / reason */}
            <div>
              <label className="text-xs font-bold block mb-1.5">
                משפט מחאה / הסיבה שלך (יופיע כפס ציטוט מעל הכותרת):
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={2}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-neutral-800 text-white'
                }`}
                placeholder="למשל: למען שוויון בנטל ועתיד ילדינו!"
              />
            </div>

            {/* Export and Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all cursor-pointer active:scale-98"
              >
                {exportSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                    <span>הכרזה נשמרה בהצלחה!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>הורדת הכרזה האישית שלי</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>שתף ישירות בוואטסאפ (WhatsApp)</span>
              </button>
            </div>
          </div>

          {/* Live Preview Canvas Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="text-xs font-bold opacity-60 mb-2">
              תצוגה חיה בזמן אמת של הכרזה:
            </div>
            <div className="w-full max-w-[360px] aspect-[800/1100] rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500 bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
