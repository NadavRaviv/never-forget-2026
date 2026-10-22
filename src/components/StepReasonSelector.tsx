import React, { useState } from 'react';
import { Poster, CategoryFilter } from '../types';
import { CATEGORIES } from '../data/posters';
import { TranslationDict } from '../i18n/translations';
import { Check, ZoomIn, Share2, AlertTriangle, Shield, Scale, FileText, UserX, AlertCircle } from 'lucide-react';

interface StepReasonSelectorProps {
  posters: Poster[];
  selectedPoster: Poster;
  onSelectPoster: (poster: Poster) => void;
  onPreviewPoster: (poster: Poster) => void;
  onProceedToShare: () => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const StepReasonSelector: React.FC<StepReasonSelectorProps> = ({
  posters,
  selectedPoster,
  onSelectPoster,
  onPreviewPoster,
  onProceedToShare,
  t,
  theme,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const isLight = theme === 'light';

  const filteredPosters = posters.filter(poster => {
    if (activeCategory === 'all') return true;
    return poster.categorySlug === activeCategory;
  });

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case 'security':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'equality':
        return <Scale className="w-4 h-4 text-amber-500" />;
      case 'investigation':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'leadership':
        return <UserX className="w-4 h-4 text-purple-500" />;
      case 'governance':
        return <AlertTriangle className="w-4 h-4 text-emerald-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  const selectedPosterTrans = t.posters[selectedPoster.id] || selectedPoster;

  return (
    <section id="step-1" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-600 dark:text-red-400 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>{t.step1Nav}</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 ${
          isLight ? 'text-neutral-900' : 'text-white'
        }`}>
          {t.step1Title}
        </h2>
        <p className={`text-base sm:text-lg leading-relaxed ${
          isLight ? 'text-neutral-600' : 'text-neutral-300'
        }`}>
          {t.step1Subtitle}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500 scale-105'
                  : isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 shadow-sm'
                    : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
              }`}
            >
              <span>{cat.id === 'all' ? t.allPosters : cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active selection summary banner */}
      <div className={`mb-8 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl transition-colors ${
        isLight
          ? 'bg-white border-neutral-200'
          : 'bg-neutral-900/90 border-neutral-800'
      }`}>
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-red-500/50 shadow-md">
            <img
              src={selectedPoster.imagePath}
              alt={selectedPosterTrans.shortTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                {t.currentSelectedBanner}
              </span>
              <span className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {t.readyToShare}
              </span>
            </div>
            <h4 className={`font-extrabold text-base sm:text-lg ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {selectedPosterTrans.title}
            </h4>
          </div>
        </div>

        <button
          onClick={onProceedToShare}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-red-600/25 transition-all cursor-pointer active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>{t.jumpToShare}</span>
        </button>
      </div>

      {/* Posters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPosters.map((poster, index) => {
          const isSelected = selectedPoster.id === poster.id;
          const posterTrans = t.posters[poster.id] || poster;

          return (
            <div
              key={poster.id}
              onClick={() => onSelectPoster(poster)}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer border ${
                isSelected
                  ? isLight
                    ? 'bg-white border-red-500 ring-2 ring-red-500/50 shadow-xl shadow-red-500/10 scale-[1.01]'
                    : 'bg-neutral-900 border-red-500 poster-glow-active ring-2 ring-red-500/50 scale-[1.01]'
                  : isLight
                    ? 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-lg'
                    : 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className={`absolute top-3 ${t.dir === 'rtl' ? 'right-3' : 'left-3'} z-20 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/20`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{t.selectedBadge}</span>
                </div>
              )}

              {/* Poster Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                <img
                  src={poster.imagePath}
                  alt={poster.altText}
                  className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  loading={index < 2 ? 'eager' : 'lazy'}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                {/* Quick inspect button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewPoster(poster);
                  }}
                  className={`absolute bottom-3 ${t.dir === 'rtl' ? 'left-3' : 'right-3'} z-10 bg-black/75 hover:bg-black text-white p-2.5 rounded-xl backdrop-blur-sm border border-neutral-700 transition-all opacity-90 hover:opacity-100 flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-lg`}
                  title={t.zoomFull}
                >
                  <ZoomIn className="w-4 h-4 text-amber-400" />
                  <span>{t.zoomFull}</span>
                </button>
              </div>

              {/* Content / Reason Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      isLight
                        ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700/60'
                    }`}>
                      {getCategoryIcon(poster.categorySlug)}
                      <span>{posterTrans.category}</span>
                    </span>

                    <span className="text-[11px] font-mono opacity-60">
                      #{index + 1}
                    </span>
                  </div>

                  <h3 className={`text-xl font-black group-hover:text-red-600 transition-colors mb-2 leading-snug ${
                    isLight ? 'text-neutral-900' : 'text-white'
                  }`}>
                    {posterTrans.title}
                  </h3>

                  <div className={`border-r-4 border-red-500 p-2.5 rounded-l-lg mb-3 ${
                    isLight ? 'bg-red-50 text-red-950' : 'bg-red-950/40 text-red-200'
                  }`}>
                    <p className="text-xs sm:text-sm font-medium italic">
                      "{posterTrans.quote}"
                    </p>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                    isLight ? 'text-neutral-600' : 'text-neutral-300'
                  }`}>
                    {posterTrans.description}
                  </p>
                </div>

                {/* Selection Action Button */}
                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isLight ? 'border-neutral-200' : 'border-neutral-800/80'
                }`}>
                  <button
                    type="button"
                    onClick={() => onSelectPoster(poster)}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 border border-red-500'
                        : isLight
                          ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{t.selectedDoneBtn}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.selectThisPosterBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
