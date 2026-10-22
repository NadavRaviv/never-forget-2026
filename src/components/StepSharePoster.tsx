import React, { useState } from 'react';
import { Poster } from '../types';
import { TranslationDict } from '../i18n/translations';
import { SocialBuffet } from './SocialBuffet';
import {
  Share2,
  Download,
  Check,
  Sparkles,
  Eye,
  Smartphone,
  Info
} from 'lucide-react';

interface StepSharePosterProps {
  poster: Poster;
  selectedPillarSnippet?: string;
  onPreviewPoster: (poster: Poster) => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const StepSharePoster: React.FC<StepSharePosterProps> = ({
  poster,
  selectedPillarSnippet,
  onPreviewPoster,
  t,
  theme,
}) => {
  const [personalDedication, setPersonalDedication] = useState<string>(t.dedications[0] || '');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const isLight = theme === 'light';
  const posterTrans = t.posters[poster.id] || poster;

  const appUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const pillarText = selectedPillarSnippet ? `\n📌 ${selectedPillarSnippet}` : '';
  const dedicationText = personalDedication ? `\n🇮🇱 ${personalDedication}!` : '';

  const shareText = `*${t.sloganPrefix} ${t.sloganMain}*
📢 ${posterTrans.title}
"${posterTrans.quote}"${pillarText}${dedicationText}

${t.heroSubtitle}
${appUrl}`;

  // Download high-resolution poster
  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(poster.imagePath);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `lo-shachanu-${poster.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      window.open(poster.imagePath, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Native Mobile Share
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const response = await fetch(poster.imagePath);
        const blob = await response.blob();
        const file = new File([blob], `poster-${poster.id}.jpg`, { type: 'image/jpeg' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${t.sloganPrefix} ${t.sloganMain}`,
            text: shareText,
            url: appUrl,
            files: [file]
          });
          return;
        }

        await navigator.share({
          title: `${t.sloganPrefix} ${t.sloganMain}`,
          text: shareText,
          url: appUrl
        });
      } catch (err) {
        // Dismissed
      }
    }
  };

  return (
    <section id="step-3" className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t transition-colors ${
      isLight ? 'border-neutral-200' : 'border-neutral-800/80'
    }`}>
      <div id="share-station"></div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4">
          <Share2 className="w-4 h-4 text-emerald-500" />
          <span>{t.step3Nav}</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 ${
          isLight ? 'text-neutral-900' : 'text-white'
        }`}>
          {t.step3Title}
        </h2>
        <p className={`text-base sm:text-lg leading-relaxed ${
          isLight ? 'text-neutral-600' : 'text-neutral-300'
        }`}>
          {t.step3Subtitle}
        </p>
      </div>

      {/* Main sharing showcase container */}
      <div className={`rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-white border-neutral-200'
          : 'bg-neutral-900 border-neutral-800'
      }`}>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center justify-center gap-2 animate-bounce">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.copiedToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chosen Poster Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className={`relative group rounded-2xl overflow-hidden border-2 border-red-500 shadow-2xl w-full max-w-md bg-neutral-950 ${
              isLight ? 'poster-glow-light' : 'poster-glow-active'
            }`}>
              <img
                src={poster.imagePath}
                alt={poster.altText}
                className="w-full h-auto object-contain cursor-pointer"
                onClick={() => onPreviewPoster(poster)}
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onPreviewPoster(poster)}
                  className="bg-neutral-900/90 text-white px-4 py-2 rounded-xl text-xs font-bold border border-neutral-700 flex items-center gap-1.5 hover:bg-black transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{t.zoomFull}</span>
                </button>
              </div>

              <div className={`absolute bottom-2 ${t.dir === 'rtl' ? 'right-2' : 'left-2'} bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow-md`}>
                {t.selectedBadge}
              </div>
            </div>

            <p className={`text-xs mt-3 text-center ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {t.zoomFull}
            </p>
          </div>

          {/* Social Buffet Station */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold border px-2.5 py-0.5 rounded ${
                  isLight
                    ? 'bg-neutral-100 text-red-600 border-neutral-200'
                    : 'bg-neutral-800 text-red-400 border-neutral-700'
                }`}>
                  {posterTrans.category}
                </span>
                <span className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {posterTrans.impactStat}
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-black leading-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {posterTrans.title}
              </h3>
            </div>

            {/* Dedication selector */}
            <div className={`p-4 rounded-2xl border transition-colors ${
              isLight ? 'bg-slate-50 border-neutral-200' : 'bg-neutral-950/70 border-neutral-800/80'
            }`}>
              <label className={`text-xs font-bold block mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.personalDedicationLabel}</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {t.dedications.map((reason, idx) => {
                  const isSelected = personalDedication === reason;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPersonalDedication(isSelected ? '' : reason)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white border border-red-500 shadow-md font-bold'
                          : isLight
                            ? 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300'
                            : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The 7 Social Icons Buffet */}
            <div>
              <h4 className={`text-sm font-black mb-3 flex items-center gap-2 ${
                isLight ? 'text-neutral-900' : 'text-white'
              }`}>
                <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.socialBuffetTitle}</span>
              </h4>

              <SocialBuffet
                poster={poster}
                personalDedication={personalDedication}
                selectedPillarSnippet={selectedPillarSnippet}
                t={t}
                theme={theme}
              />
            </div>

            {/* Extra tools: Download poster & Native share */}
            <div className={`flex flex-wrap items-center gap-3 pt-3 border-t ${
              isLight ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{t.nativeShareBtn}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 shadow-sm'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700'
                }`}
              >
                <Download className="w-4 h-4 text-amber-500" />
                <span>{isDownloading ? '...' : t.downloadPosterBtn}</span>
              </button>
            </div>

            {/* Preview snippet */}
            <div className={`rounded-xl p-4 border ${
              isLight ? 'bg-slate-50 border-neutral-200 text-neutral-800' : 'bg-black/60 border-neutral-800 text-neutral-200'
            }`}>
              <div className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                <Info className="w-3.5 h-3.5" />
                <span>{t.shareTextPreview}</span>
              </div>
              <p className="text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed select-all">
                {shareText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
