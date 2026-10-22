import React from 'react';
import { Poster } from '../types';
import { TranslationDict } from '../i18n/translations';
import { ArrowDown, Flame, Check } from 'lucide-react';

interface HeroBannerProps {
  posters: Poster[];
  selectedPoster: Poster;
  onSelectPoster: (poster: Poster) => void;
  onScrollToStep1: () => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  posters,
  selectedPoster,
  onSelectPoster,
  onScrollToStep1,
  t,
  theme,
}) => {
  const isLight = theme === 'light';

  return (
    <div className={`relative overflow-hidden py-12 md:py-20 border-b transition-colors ${
      isLight
        ? 'bg-gradient-to-b from-white via-slate-50 to-neutral-100 border-neutral-200'
        : 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-neutral-800'
    }`}>
      {/* Background distressed grunge / campaign textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Urgency Tag */}
          <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold mb-6 tracking-wide shadow-sm">
            <Flame className="w-4 h-4 text-red-600 animate-pulse" />
            <span>{t.urgentBanner}</span>
          </div>

          {/* Main Huge Typography Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[1.05] mb-6">
            <span className="block text-red-600 text-stencil drop-shadow-md">
              {t.heroHeadline1}
            </span>
            <span className={`block mt-1 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {t.heroHeadline2}
            </span>
          </h1>

          {/* Subheading */}
          <p className={`text-lg sm:text-2xl md:text-3xl font-extrabold mb-6 max-w-3xl mx-auto leading-relaxed ${
            isLight ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {t.heroSubtitle}
          </p>

          <p className={`text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed ${
            isLight ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            {t.heroDesc}
          </p>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={onScrollToStep1}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base sm:text-lg shadow-xl shadow-red-600/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>{t.chooseReasonCta}</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>

            <a
              href="#step-2"
              className={`px-6 py-4 rounded-2xl font-bold text-base border flex items-center gap-2 transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 shadow-sm'
                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80'
              }`}
            >
              <span>{t.whyRightChoiceCta}</span>
            </a>
          </div>

          {/* Quick interactive strip of the 5 posters */}
          <div className={`mt-8 pt-8 border-t ${isLight ? 'border-neutral-200' : 'border-neutral-800/80'}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-2 ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              <span>{t.quickPickLabel}</span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-3xl mx-auto">
              {posters.map((poster) => {
                const isSelected = selectedPoster.id === poster.id;
                const posterTrans = t.posters[poster.id] || poster;

                return (
                  <button
                    key={poster.id}
                    onClick={() => onSelectPoster(poster)}
                    className={`group relative rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer text-right aspect-[3/4] ${
                      isSelected
                        ? 'border-red-500 ring-2 ring-red-500 shadow-lg shadow-red-600/30 scale-105'
                        : isLight
                          ? 'border-neutral-300 hover:border-neutral-500 opacity-80 hover:opacity-100 hover:scale-102 bg-white'
                          : 'border-neutral-800 hover:border-neutral-600 opacity-75 hover:opacity-100 hover:scale-102 bg-neutral-900'
                    }`}
                    title={posterTrans.shortTitle}
                  >
                    <img
                      src={poster.imagePath}
                      alt={posterTrans.shortTitle}
                      className="w-full h-full object-cover"
                    />

                    {isSelected && (
                      <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                        <span className="bg-red-600 text-white p-1 rounded-full shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-black/85 p-1 text-[10px] text-white font-bold truncate text-center hidden sm:block">
                      {posterTrans.shortTitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
