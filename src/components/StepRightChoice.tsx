import React from 'react';
import { TranslationDict } from '../i18n/translations';
import { CheckCircle2, ShieldCheck, Scale, Award, HeartHandshake, Compass, ArrowDown } from 'lucide-react';

interface StepRightChoiceProps {
  selectedPillar: string;
  onSelectPillar: (pillar: string) => void;
  onScrollToShare: () => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const StepRightChoice: React.FC<StepRightChoiceProps> = ({
  selectedPillar,
  onSelectPillar,
  onScrollToShare,
  t,
  theme,
}) => {
  const isLight = theme === 'light';

  const pillarIcons: Record<string, React.ReactNode> = {
    'security-responsibility': <ShieldCheck className="w-6 h-6 text-red-500" />,
    'draft-equality': <Scale className="w-6 h-6 text-amber-500" />,
    'truth-investigation': <Award className="w-6 h-6 text-blue-500" />,
    'unity-integrity': <HeartHandshake className="w-6 h-6 text-emerald-500" />,
  };

  const pillarKeys = ['security-responsibility', 'draft-equality', 'truth-investigation', 'unity-integrity'];

  return (
    <section id="step-2" className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t transition-colors ${
      isLight ? 'border-neutral-200' : 'border-neutral-800/80'
    }`}>
      {/* Step Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4">
          <Compass className="w-4 h-4 text-amber-500" />
          <span>{t.step2Nav}</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 ${
          isLight ? 'text-neutral-900' : 'text-white'
        }`}>
          {t.step2Title}
        </h2>
        <p className={`text-base sm:text-lg leading-relaxed ${
          isLight ? 'text-neutral-600' : 'text-neutral-300'
        }`}>
          {t.step2Subtitle}
        </p>
      </div>

      {/* Hero Manifesto Box */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 mb-10 shadow-2xl transition-colors ${
        isLight
          ? 'bg-gradient-to-br from-white via-slate-50 to-red-50/50 border-neutral-200'
          : 'bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-red-950/40 border-neutral-800'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-950/60 px-3 py-1 rounded-md border border-red-300 dark:border-red-800/60">
              {t.manifestoBadge}
            </span>
            <h3 className={`text-2xl sm:text-3xl font-extrabold mt-3 mb-4 leading-tight ${
              isLight ? 'text-neutral-900' : 'text-white'
            }`}>
              {t.manifestoTitle}
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed mb-6 ${
              isLight ? 'text-neutral-600' : 'text-neutral-300'
            }`}>
              {t.manifestoDesc}
            </p>

            {/* Quick selectors for "Right Choice" commitment */}
            <div className="flex flex-wrap gap-2.5">
              {pillarKeys.map(key => {
                const p = t.pillars[key];
                if (!p) return null;
                const isSelected = selectedPillar === key;
                return (
                  <button
                    key={key}
                    onClick={() => onSelectPillar(key)}
                    className={`text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105 font-black'
                        : isLight
                          ? 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 shadow-sm'
                          : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                    <span>{p.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`lg:col-span-4 p-6 rounded-2xl border text-center flex flex-col items-center justify-center ${
            isLight
              ? 'bg-white/80 border-neutral-200 shadow-lg'
              : 'bg-black/50 border-neutral-800'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-600">
              <Compass className="w-8 h-8" />
            </div>
            <div className={`text-xs font-medium mb-1 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {t.rightChoiceBadge}
            </div>
            <div className={`text-xl font-black mb-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {t.sloganMain}
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
              {t.heroSubtitle}
            </p>
            <button
              onClick={onScrollToShare}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>{t.jumpToShare}</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillarKeys.map(key => {
          const pillar = t.pillars[key];
          if (!pillar) return null;
          const isSelected = selectedPillar === key;

          return (
            <div
              key={key}
              onClick={() => onSelectPillar(key)}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? isLight
                    ? 'bg-white border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : isLight
                    ? 'bg-white/80 border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-800 border-neutral-700'
                  }`}>
                    {pillarIcons[key]}
                  </div>
                  {isSelected ? (
                    <span className="text-[11px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t.selectedBadge}</span>
                    </span>
                  ) : (
                    <span className={`text-[11px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {t.selectThisPosterBtn}
                    </span>
                  )}
                </div>

                <h4 className={`text-lg font-black mb-1 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  {pillar.title}
                </h4>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-2">
                  {pillar.headline}
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                  {pillar.description}
                </p>
              </div>

              <div className={`pt-4 mt-4 border-t text-xs ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`}>
                <span className={`font-semibold ${isSelected ? 'text-amber-600 dark:text-amber-400' : isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {isSelected ? `✓ ${t.selectedDoneBtn}` : `+ ${t.selectThisPosterBtn}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
