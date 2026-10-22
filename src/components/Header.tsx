import React, { useState, useEffect, useRef } from 'react';
import { Vote, CheckCircle2, Sun, Moon, Globe, Check, ChevronDown, Sparkles } from 'lucide-react';
import { LanguageCode, LANGUAGES, TranslationDict } from '../i18n/translations';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  t: TranslationDict;
  pledgeCount: number;
  hasPledged: boolean;
  onPledge: () => void;
  onOpenGuide: () => void;
  onOpenPosterCreator: () => void;
  selectedPosterTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  language,
  onSelectLanguage,
  t,
  pledgeCount,
  hasPledged,
  onPledge,
  onOpenGuide,
  onOpenPosterCreator,
  selectedPosterTitle,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 3,
    hours: 14,
    minutes: 42,
    seconds: 19
  });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const isLight = theme === 'light';

  return (
    <header className={`relative w-full border-b sticky top-0 z-40 transition-colors ${
      isLight
        ? 'border-neutral-200 bg-white/95 text-neutral-900 shadow-sm'
        : 'border-neutral-800 bg-neutral-950/90 text-neutral-100'
    } backdrop-blur-md`}>
      {/* Top Emergency Announcement Bar */}
      <div className="bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white py-1.5 px-4 text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span>{t.urgentBanner}</span>
        <span className="hidden sm:inline opacity-80">|</span>
        <span className="hidden sm:inline font-mono bg-black/30 px-2 py-0.5 rounded text-red-100">
          {timeLeft.days} {t.daysRemaining}, {timeLeft.hours}:{timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo / Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="bg-red-600 text-white px-2.5 sm:px-3 py-1 font-black text-lg sm:text-2xl tracking-tighter uppercase rounded border border-red-500 shadow-md">
            {t.sloganPrefix}
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-xl tracking-tight flex items-center gap-1.5">
              <span>{t.sloganMain}</span>
              <span className="text-red-500 text-xs sm:text-sm font-normal">|</span>
              <span className={`text-xs sm:text-base font-semibold ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                {t.rightChoiceBadge}
              </span>
            </div>
            <p className={`text-[11px] hidden md:block ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {t.platformDesc}
            </p>
          </div>
        </div>

        {/* Action items on the navbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* New "Want to create your own poster?" button */}
          <button
            type="button"
            onClick={onOpenPosterCreator}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold px-2.5 sm:px-3 py-2 rounded-xl transition-all cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/20 active:scale-95 border border-red-500"
            title={t.createPosterBtn}
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap">{t.createPosterBtn}</span>
          </button>

          {/* 1. Dark / Light Mode Switcher (Swapped inward) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold p-2 sm:px-3 sm:py-2 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800 hover:text-black'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
            }`}
            title={isLight ? t.darkMode : t.lightMode}
            aria-label={isLight ? t.darkMode : t.lightMode}
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100 shrink-0" />
                <span className="hidden lg:inline">{t.darkMode}</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 fill-amber-300 shrink-0" />
                <span className="hidden lg:inline">{t.lightMode}</span>
              </>
            )}
          </button>

          {/* 2. Language Dropdown Menu (Swapped & Mobile-Optimized: never cropped) */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
              }`}
              title={t.changeLanguage}
              aria-label={t.changeLanguage}
              aria-expanded={isLangMenuOpen}
            >
              <Globe className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile backdrop to easily close when tapping outside */}
            {isLangMenuOpen && (
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
                onClick={() => setIsLangMenuOpen(false)}
              />
            )}

            {/* Language options popup: fixed on mobile with margins, absolute on desktop */}
            {isLangMenuOpen && (
              <div
                className={`fixed sm:absolute top-[72px] sm:top-full mt-2 inset-x-3 sm:inset-x-auto w-auto sm:w-56 rounded-2xl border shadow-2xl py-2 z-50 animate-fadeIn ${
                  t.dir === 'rtl' ? 'sm:right-0 sm:left-auto' : 'sm:left-0 sm:right-auto'
                } ${
                  isLight
                    ? 'bg-white border-neutral-200 text-neutral-900 shadow-neutral-400/40'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-100 shadow-black'
                }`}
              >
                <div className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider border-b mb-1 flex items-center justify-between ${
                  isLight ? 'text-neutral-500 border-neutral-100' : 'text-neutral-400 border-neutral-800'
                }`}>
                  <span>{t.changeLanguage}</span>
                  <span className="text-[10px] opacity-70">6 שפות</span>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {LANGUAGES.map(lang => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onSelectLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer text-right ${
                          isSelected
                            ? 'bg-red-600 text-white font-bold'
                            : isLight
                              ? 'hover:bg-neutral-100 text-neutral-800'
                              : 'hover:bg-neutral-800 text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-lg">{lang.flag}</span>
                          <span className="text-sm font-semibold">{lang.nativeName}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>


          {/* Citizen pledge button */}
          <button
            onClick={onPledge}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md shrink-0 ${
              hasPledged
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-red-600 hover:bg-red-500 text-white border border-red-500 active:scale-95'
            }`}
          >
            {hasPledged ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden xs:inline">{t.pledgedBtn}</span>
              </>
            ) : (
              <>
                <Vote className="w-4 h-4" />
                <span className="hidden xs:inline">{t.pledgeBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress / Step indicator bar */}
      <div className={`border-t px-4 py-2 text-xs ${
        isLight
          ? 'bg-neutral-50/90 border-neutral-200 text-neutral-600'
          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a href="#step-1" className={`flex items-center gap-1 transition-colors ${
              isLight ? 'hover:text-black text-neutral-800' : 'hover:text-white text-neutral-200'
            }`}>
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">1</span>
              <span className="font-medium">{t.step1Nav}</span>
            </a>
            <span className="opacity-40">{t.dir === 'rtl' ? '←' : '→'}</span>
            <a href="#step-2" className={`flex items-center gap-1 transition-colors ${
              isLight ? 'hover:text-black text-neutral-700' : 'hover:text-white text-neutral-300'
            }`}>
              <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                isLight ? 'bg-neutral-500' : 'bg-neutral-700'
              }`}>2</span>
              <span className="font-medium">{t.step2Nav}</span>
            </a>
            <span className="opacity-40">{t.dir === 'rtl' ? '←' : '→'}</span>
            <a href="#step-3" className={`flex items-center gap-1 transition-colors ${
              isLight ? 'hover:text-black text-neutral-700' : 'hover:text-white text-neutral-300'
            }`}>
              <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                isLight ? 'bg-neutral-500' : 'bg-neutral-700'
              }`}>3</span>
              <span className="font-medium">{t.step3Nav}</span>
            </a>
          </div>

          <div className={`flex items-center gap-2 text-xs shrink-0 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            <span className="hidden sm:inline">{t.pledgedVotersCount}:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
              isLight
                ? 'text-red-700 bg-white border-neutral-300'
                : 'text-amber-400 bg-black/40 border-neutral-800'
            }`}>
              {pledgeCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
