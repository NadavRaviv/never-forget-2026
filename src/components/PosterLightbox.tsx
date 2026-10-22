import React, { useEffect } from 'react';
import { Poster } from '../types';
import { TranslationDict } from '../i18n/translations';
import { X, Download, Share2 } from 'lucide-react';

interface PosterLightboxProps {
  poster: Poster | null;
  isSelected: boolean;
  onClose: () => void;
  onSelect: (poster: Poster) => void;
  onShare: (poster: Poster) => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const PosterLightbox: React.FC<PosterLightboxProps> = ({
  poster,
  isSelected,
  onClose,
  onSelect,
  onShare,
  t,
  theme,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!poster) return null;

  const isLight = theme === 'light';
  const posterTrans = t.posters[poster.id] || poster;

  const handleDownload = async () => {
    try {
      const response = await fetch(poster.imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lo-shachanu-${poster.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(poster.imagePath, '_blank');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative max-w-4xl w-full max-h-[92vh] border rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
          isLight ? 'bg-white border-neutral-300' : 'bg-neutral-900 border-neutral-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className={`px-5 py-4 border-b flex items-center justify-between gap-4 ${
          isLight ? 'bg-slate-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div>
            <span className="text-xs text-red-600 font-bold ml-2">
              {t.sloganPrefix}
            </span>
            <h3 className={`text-base sm:text-lg font-black inline-block ${
              isLight ? 'text-neutral-900' : 'text-white'
            }`}>
              {posterTrans.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isLight
                ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
            }`}
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poster Viewer */}
        <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-2 sm:p-4 min-h-[300px]">
          <img
            src={poster.imagePath}
            alt={poster.altText}
            className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Footer controls */}
        <div className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 ${
          isLight ? 'bg-slate-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className={`text-xs sm:text-sm max-w-md hidden md:block ${
            isLight ? 'text-neutral-700' : 'text-neutral-300'
          }`}>
            "{posterTrans.quote}"
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownload}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>{t.downloadPosterBtn}</span>
            </button>

            <button
              onClick={() => {
                onSelect(poster);
                onClose();
                onShare(poster);
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{isSelected ? t.sharePosterNav : t.selectThisPosterBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
