/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { POSTERS } from './data/posters';
import { Poster } from './types';
import { LanguageCode, TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MobilePosterSwiper } from './components/MobilePosterSwiper';
import { StepReasonSelector } from './components/StepReasonSelector';
import { StepRightChoice } from './components/StepRightChoice';
import { StepSharePoster } from './components/StepSharePoster';
import { PosterLightbox } from './components/PosterLightbox';
import { VoterGuideModal } from './components/VoterGuideModal';
import { CreatePosterModal } from './components/CreatePosterModal';
import { Footer } from './components/Footer';

export default function App() {
  // 1. Theme State: Default to Light mode per user request!
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 2. Language State: Default to Hebrew, supports yi (Yiddish), ru, am, ar, fr
  const [language, setLanguage] = useState<LanguageCode>('he');

  const [postersList, setPostersList] = useState<Poster[]>(POSTERS);
  const [selectedPoster, setSelectedPoster] = useState<Poster>(POSTERS[0]);
  const [selectedPillar, setSelectedPillar] = useState<string>('security-responsibility');
  const [previewPoster, setPreviewPoster] = useState<Poster | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCreatePosterOpen, setIsCreatePosterOpen] = useState<boolean>(false);
  const [hasPledged, setHasPledged] = useState<boolean>(false);
  const [pledgeCount, setPledgeCount] = useState<number>(14832);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('voter_theme_preference');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme);
      }
      const storedLang = localStorage.getItem('voter_lang_preference') as LanguageCode;
      if (storedLang && ['he', 'yi', 'ru', 'am', 'ar', 'fr'].includes(storedLang)) {
        setLanguage(storedLang);
      }
      const storedPledge = localStorage.getItem('israel_voter_pledge_2026');
      if (storedPledge === 'true') {
        setHasPledged(true);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  // Update HTML direction and language attribute whenever language changes
  useEffect(() => {
    const activeTrans = TRANSLATIONS[language] || TRANSLATIONS.he;
    document.documentElement.dir = activeTrans.dir;
    document.documentElement.lang = language;
    try {
      localStorage.setItem('voter_lang_preference', language);
    } catch {}
  }, [language]);

  // Update theme class on HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('voter_theme_preference', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
  };

  const handlePledgeToggle = () => {
    if (!hasPledged) {
      setHasPledged(true);
      setPledgeCount(prev => prev + 1);
      try {
        localStorage.setItem('israel_voter_pledge_2026', 'true');
      } catch {}
    } else {
      setHasPledged(false);
      setPledgeCount(prev => Math.max(14832, prev - 1));
      try {
        localStorage.removeItem('israel_voter_pledge_2026');
      } catch {}
    }
  };

  const scrollToStep1 = () => {
    const el = document.getElementById('step-1');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToShare = () => {
    const el = document.getElementById('step-3');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.he;

  // Find snippet of selected pillar in the active language
  const getPillarSnippet = (pillarId: string) => {
    const pillar = t.pillars[pillarId];
    return pillar ? pillar.shareSnippet : t.heroSubtitle;
  };

  // Handler when user creates their own poster
  const handleCustomPosterCreated = (imageBlobUrl: string) => {
    const newPoster: Poster = {
      id: `custom-poster-${Date.now()}`,
      title: 'הכרזה האישית שלי לבחירות',
      shortTitle: 'הכרזה האישית שלי',
      category: 'כרזה אישית',
      categorySlug: 'governance',
      quote: 'לא שכחנו! הולכים להצביע!',
      description: 'כרזת מחאה אישית שנוצרה בסטודיו הכרזות של האזרחים.',
      detailPoints: ['השמעת קול אישי למען שינוי ועתיד המדינה'],
      impactStat: 'קול אזרחי ישיר',
      imagePath: imageBlobUrl,
      suggestedShareText: 'יצרתי כרזת מחאה אישית לבחירות השבוע! לא שכחנו – הולכים להצביע!',
      altText: 'כרזה אישית שנוצרה על ידי המשתמש'
    };
    setPostersList([newPoster, ...postersList]);
    setSelectedPoster(newPoster);
    setIsCreatePosterOpen(false);
    scrollToShare();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans selection:bg-red-600 selection:text-white ${
      theme === 'light' ? 'bg-slate-50 text-neutral-900' : 'bg-neutral-950 text-neutral-100'
    }`}>
      {/* Main Campaign Header with Theme, Language controls, and Create Poster button */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        t={t}
        pledgeCount={pledgeCount}
        hasPledged={hasPledged}
        onPledge={handlePledgeToggle}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenPosterCreator={() => setIsCreatePosterOpen(true)}
        selectedPosterTitle={(t.posters[selectedPoster.id] || selectedPoster).shortTitle}
      />

      <main className="flex-1">
        {/* Dynamic Hero Banner */}
        <HeroBanner
          posters={postersList}
          selectedPoster={selectedPoster}
          onSelectPoster={(poster) => {
            setSelectedPoster(poster);
            scrollToShare();
          }}
          onScrollToStep1={scrollToStep1}
          t={t}
          theme={theme}
        />

        {/* Mobile-First Interactive Swiper with Instant Social Buffet */}
        <MobilePosterSwiper
          posters={postersList}
          selectedPoster={selectedPoster}
          onSelectPoster={setSelectedPoster}
          onPreviewPoster={(poster) => setPreviewPoster(poster)}
          selectedPillarSnippet={getPillarSnippet(selectedPillar)}
          t={t}
          theme={theme}
        />

        {/* 1. Pick your reason why go vote in this week election (Grid for desktop & tablet) */}
        <div className="hidden md:block">
          <StepReasonSelector
            posters={postersList}
            selectedPoster={selectedPoster}
            onSelectPoster={setSelectedPoster}
            onPreviewPoster={(poster) => setPreviewPoster(poster)}
            onProceedToShare={scrollToShare}
            t={t}
            theme={theme}
          />
        </div>

        {/* 2. To the right choice */}
        <StepRightChoice
          selectedPillar={selectedPillar}
          onSelectPillar={setSelectedPillar}
          onScrollToShare={scrollToShare}
          t={t}
          theme={theme}
        />

        {/* 3. Social links to share one of the photos that the user chose */}
        <StepSharePoster
          poster={selectedPoster}
          selectedPillarSnippet={getPillarSnippet(selectedPillar)}
          onPreviewPoster={(poster) => setPreviewPoster(poster)}
          t={t}
          theme={theme}
        />
      </main>

      {/* Lightbox zoom modal */}
      <PosterLightbox
        poster={previewPoster}
        isSelected={previewPoster ? previewPoster.id === selectedPoster.id : false}
        onClose={() => setPreviewPoster(null)}
        onSelect={(p) => setSelectedPoster(p)}
        onShare={(p) => {
          setSelectedPoster(p);
          scrollToShare();
        }}
        t={t}
        theme={theme}
      />

      {/* Voter guide modal */}
      <VoterGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        t={t}
        theme={theme}
      />

      {/* Create your own poster modal studio */}
      <CreatePosterModal
        isOpen={isCreatePosterOpen}
        onClose={() => setIsCreatePosterOpen(false)}
        t={t}
        theme={theme}
        onPosterCreated={handleCustomPosterCreated}
      />

      {/* Footer */}
      <Footer
        onOpenGuide={() => setIsGuideOpen(true)}
        t={t}
        theme={theme}
      />
    </div>
  );
}
