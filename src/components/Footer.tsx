import React from 'react';
import { TranslationDict } from '../i18n/translations';
import { ArrowUp, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenGuide: () => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuide, t, theme }) => {
  const isLight = theme === 'light';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 transition-colors ${
      isLight ? 'bg-slate-100 border-neutral-200 text-neutral-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-8 md:flex-row text-center md:text-right">
        {/* Brand & mission */}
        <div className="max-w-md">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <span className="bg-red-600 text-white font-black text-lg px-2.5 py-0.5 rounded border border-red-500">
              {t.sloganPrefix}
            </span>
            <span className={`font-extrabold text-lg ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {t.sloganMain} | {t.rightChoiceBadge}
            </span>
          </div>
          <p className="text-xs leading-relaxed opacity-85">
            {t.platformDesc}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <a href="#step-1" className={`transition-colors ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>
            {t.step1Nav}
          </a>
          <span className="opacity-40">•</span>
          <a href="#step-2" className={`transition-colors ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>
            {t.step2Nav}
          </a>
          <span className="opacity-40">•</span>
          <a href="#step-3" className={`transition-colors ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>
            {t.step3Nav}
          </a>
          <span className="opacity-40">•</span>
          <button
            onClick={onOpenGuide}
            className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.whereToVote}</span>
          </button>
        </div>

        {/* Back to top */}
        <div>
          <button
            onClick={scrollToTop}
            className={`p-3 rounded-full border transition-colors cursor-pointer shadow-lg inline-flex items-center gap-2 text-xs font-bold ${
              isLight
                ? 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
            }`}
            title={t.backToTop}
          >
            <span>{t.backToTop}</span>
            <ArrowUp className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto mt-8 pt-6 border-t text-center text-[11px] opacity-75 ${
        isLight ? 'border-neutral-200' : 'border-neutral-900'
      }`}>
        {t.heroSubtitle}
      </div>
    </footer>
  );
};
