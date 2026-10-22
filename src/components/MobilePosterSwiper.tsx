import React, { useRef, useState, useEffect } from 'react';
import { Poster } from '../types';
import { TranslationDict } from '../i18n/translations';
import { SocialBuffet } from './SocialBuffet';
import { ChevronRight, ChevronLeft, Check, ZoomIn, Share2, Hand } from 'lucide-react';

interface MobilePosterSwiperProps {
  posters: Poster[];
  selectedPoster: Poster;
  onSelectPoster: (poster: Poster) => void;
  onPreviewPoster: (poster: Poster) => void;
  selectedPillarSnippet?: string;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const MobilePosterSwiper: React.FC<MobilePosterSwiperProps> = ({
  posters,
  selectedPoster,
  onSelectPoster,
  onPreviewPoster,
  selectedPillarSnippet,
  t,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);

  const isLight = theme === 'light';

  useEffect(() => {
    const idx = posters.findIndex(p => p.id === selectedPoster.id);
    if (idx !== -1 && idx !== currentIndex) {
      setCurrentIndex(idx);
      scrollToIndex(idx);
    }
  }, [selectedPoster]);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % posters.length;
    setCurrentIndex(nextIdx);
    onSelectPoster(posters[nextIdx]);
    scrollToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + posters.length) % posters.length;
    setCurrentIndex(prevIdx);
    onSelectPoster(posters[prevIdx]);
    scrollToIndex(prevIdx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setShowSwipeHint(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    const isRtl = t.dir === 'rtl';

    if (isRtl) {
      if (diff > 50) handleNext();
      else if (diff < -50) handlePrev();
    } else {
      if (diff > 50) handlePrev();
      else if (diff < -50) handleNext();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const currentPoster = posters[currentIndex] || selectedPoster;
  const currentPosterTrans = t.posters[currentPoster.id] || currentPoster;

  return (
    <div className={`w-full md:hidden py-6 px-3 border-y transition-colors ${
      isLight ? 'bg-slate-100/90 border-neutral-200' : 'bg-neutral-950/80 border-neutral-800'
    }`}>
      {/* Mobile Header & Instructions */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 bg-red-600/15 text-red-600 dark:text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Hand className="w-3.5 h-3.5 animate-pulse" />
          <span>{t.swipeInstructions}</span>
        </div>
        <h3 className={`text-xl font-black ${isLight ? 'text-neutral-900' : 'text-white'}`}>
          {t.swipeBanner}
        </h3>
      </div>

      {/* Swipeable Carousel Container */}
      <div className="relative">
        {/* Navigation arrows overlay */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous poster"
          className={`absolute ${t.dir === 'rtl' ? '-right-1' : '-left-1'} top-1/3 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer backdrop-blur-sm border ${
            isLight
              ? 'bg-white text-neutral-800 border-neutral-300'
              : 'bg-black/80 text-white border-neutral-700'
          }`}
        >
          {t.dir === 'rtl' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        <button
          onClick={handleNext}
          type="button"
          aria-label="Next poster"
          className={`absolute ${t.dir === 'rtl' ? '-left-1' : '-right-1'} top-1/3 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer backdrop-blur-sm border ${
            isLight
              ? 'bg-white text-neutral-800 border-neutral-300'
              : 'bg-black/80 text-white border-neutral-700'
          }`}
        >
          {t.dir === 'rtl' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>

        {/* Swipe Hint Banner */}
        {showSwipeHint && (
          <div className="text-center text-[11px] text-amber-600 dark:text-amber-300 font-semibold mb-2 animate-bounce">
            {t.swipeHint}
          </div>
        )}

        {/* Horizontal Snap Scroll Area */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 px-6 no-scrollbar touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posters.map((poster, index) => {
            const isSelected = selectedPoster.id === poster.id;
            const isCurrent = currentIndex === index;
            const posterTrans = t.posters[poster.id] || poster;

            return (
              <div
                key={poster.id}
                onClick={() => {
                  setCurrentIndex(index);
                  onSelectPoster(poster);
                }}
                className={`shrink-0 w-[82vw] max-w-[340px] snap-center rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer ${
                  isCurrent
                    ? isLight
                      ? 'border-red-500 ring-2 ring-red-500/40 bg-white scale-100 shadow-xl'
                      : 'border-red-500 poster-glow-active ring-2 ring-red-500/50 bg-neutral-900 scale-100 shadow-2xl'
                    : isLight
                      ? 'border-neutral-200 bg-white/70 opacity-70 scale-95'
                      : 'border-neutral-800 bg-neutral-900/60 opacity-60 scale-95'
                }`}
              >
                {/* Poster Image */}
                <div className="relative aspect-[3/4] w-full bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={poster.imagePath}
                    alt={poster.altText}
                    className="w-full h-full object-contain p-1"
                  />

                  {/* Top Status */}
                  <div className={`absolute top-2.5 ${t.dir === 'rtl' ? 'right-2.5' : 'left-2.5'} z-10`}>
                    {isSelected ? (
                      <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg border border-white/30">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{t.selectedBadge}</span>
                      </span>
                    ) : (
                      <span className="bg-black/70 text-neutral-300 text-[10px] px-2 py-0.5 rounded-full border border-neutral-700">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Zoom button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewPoster(poster);
                    }}
                    type="button"
                    className={`absolute bottom-2.5 ${t.dir === 'rtl' ? 'left-2.5' : 'right-2.5'} bg-black/80 text-white p-2 rounded-xl border border-neutral-700 flex items-center gap-1 text-[11px] font-bold`}
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.zoomFull}</span>
                  </button>
                </div>

                {/* Poster summary */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-[11px] font-bold text-red-600 dark:text-red-400 mb-1">
                      {posterTrans.category}
                    </div>
                    <h4 className={`text-base font-black leading-tight mb-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                      {posterTrans.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 italic mb-3 ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                      "{posterTrans.quote}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                      onSelectPoster(poster);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                        : isLight
                          ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                          : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{t.selectedDoneBtn}</span>
                      </>
                    ) : (
                      <span>{t.selectThisPosterBtn}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {posters.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentIndex(idx);
                onSelectPoster(p);
                scrollToIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 bg-red-600'
                  : isLight
                    ? 'w-2 bg-neutral-300 hover:bg-neutral-400'
                    : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
              aria-label={`Poster ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Buffet of Social Icons - Revealed immediately upon choosing/viewing */}
      <div className={`mt-6 pt-5 border-t rounded-2xl p-4 shadow-xl ${
        isLight
          ? 'bg-white border-neutral-200 text-neutral-900'
          : 'bg-neutral-900/90 border-neutral-800 text-neutral-100'
      }`}>
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.socialBuffetTitle}</span>
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {currentPosterTrans.shortTitle}
            </span>
          </div>
          <p className={`text-[11px] mt-1 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {t.step3Subtitle}
          </p>
        </div>

        {/* The 7 Social Icons Buffet */}
        <SocialBuffet
          poster={currentPoster}
          selectedPillarSnippet={selectedPillarSnippet}
          t={t}
          theme={theme}
        />
      </div>
    </div>
  );
};
