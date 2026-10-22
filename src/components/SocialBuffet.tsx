import React, { useState } from 'react';
import { Poster } from '../types';
import { TranslationDict } from '../i18n/translations';
import { Mail, Copy, Check } from 'lucide-react';

interface SocialBuffetProps {
  poster: Poster;
  personalDedication?: string;
  selectedPillarSnippet?: string;
  t: TranslationDict;
  theme?: 'light' | 'dark';
}

export const SocialBuffet: React.FC<SocialBuffetProps> = ({
  poster,
  personalDedication,
  selectedPillarSnippet,
  t,
  theme = 'light',
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const posterTrans = t.posters[poster.id] || poster;
  const isLight = theme === 'light';

  const appUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const fullImageUrl = typeof window !== 'undefined' ? `${window.location.origin}${poster.imagePath}` : poster.imagePath;

  const pillarText = selectedPillarSnippet ? `\n📌 ${selectedPillarSnippet}` : '';
  const dedicationText = personalDedication ? `\n🇮🇱 ${personalDedication}!` : '';

  const shareText = `*${t.sloganPrefix} ${t.sloganMain}*
📢 ${posterTrans.title}
"${posterTrans.quote}"${pillarText}${dedicationText}

${t.heroSubtitle}
${appUrl}`;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // 1. Twitter / X
  const handleTwitter = () => {
    const text = `${t.sloganPrefix} ${t.sloganMain} 🗳️\n${posterTrans.shortTitle} - ${t.rightChoiceBadge}\n#לא_שכחנו #הולכים_להצביע`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 2. Facebook
  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 3. Discord
  const handleDiscord = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n🖼️ ${fullImageUrl}`);
      setCopiedType('discord');
      showToast(t.copiedToast + ' (Discord)');
      setTimeout(() => setCopiedType(null), 3000);
      window.open('https://discord.com/channels/@me', '_blank', 'noopener,noreferrer');
    } catch {
      window.open('https://discord.com/channels/@me', '_blank', 'noopener,noreferrer');
    }
  };

  // 4. Slack
  const handleSlack = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n🖼️ ${fullImageUrl}`);
      setCopiedType('slack');
      showToast(t.copiedToast + ' (Slack)');
      setTimeout(() => setCopiedType(null), 3000);
      window.open('https://slack.com/', '_blank', 'noopener,noreferrer');
    } catch {
      window.open('https://slack.com/', '_blank', 'noopener,noreferrer');
    }
  };

  // 5. WhatsApp
  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 6. Email
  const handleEmail = () => {
    const subject = `${t.sloganPrefix} ${t.sloganMain} - ${posterTrans.shortTitle}`;
    const body = `${shareText}\n\n${appUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  // 7. Copy URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appUrl || window.location.origin);
      setCopiedType('url');
      showToast(t.copiedToast);
      setTimeout(() => setCopiedType(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {notification && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* The 7 Icons Buffet Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-3">
        {/* 1. Twitter / X */}
        <button
          onClick={handleTwitter}
          type="button"
          aria-label="Twitter / X"
          className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-neutral-400 text-neutral-800'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-neutral-600 text-neutral-200'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center border border-neutral-700/80 group-hover:scale-110 transition-all shadow-inner">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <span className="text-[11px] font-bold mt-2">Twitter / X</span>
        </button>

        {/* 2. Facebook */}
        <button
          onClick={handleFacebook}
          type="button"
          aria-label="Facebook"
          className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-blue-300 text-neutral-800'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-blue-700 text-neutral-200'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-all shadow-md shadow-blue-500/20">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <span className="text-[11px] font-bold mt-2">Facebook</span>
        </button>

        {/* 3. Discord */}
        <button
          onClick={handleDiscord}
          type="button"
          aria-label="Discord"
          className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-indigo-300 text-neutral-800'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-indigo-600 text-neutral-200'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#5865F2] flex items-center justify-center group-hover:scale-110 transition-all shadow-md shadow-indigo-500/20">
            {copiedType === 'discord' ? (
              <Check className="w-5 h-5 text-white stroke-[3]" />
            ) : (
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            )}
          </div>
          <span className="text-[11px] font-bold mt-2">Discord</span>
        </button>

        {/* 4. Slack */}
        <button
          onClick={handleSlack}
          type="button"
          aria-label="Slack"
          className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-purple-300 text-neutral-800'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-purple-700 text-neutral-200'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#4A154B] flex items-center justify-center group-hover:scale-110 transition-all shadow-md shadow-purple-900/20">
            {copiedType === 'slack' ? (
              <Check className="w-5 h-5 text-white stroke-[3]" />
            ) : (
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
            )}
          </div>
          <span className="text-[11px] font-bold mt-2">Slack</span>
        </button>

        {/* 5. WhatsApp */}
        <button
          onClick={handleWhatsApp}
          type="button"
          aria-label="WhatsApp"
          className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-emerald-300 text-neutral-800'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-emerald-600 text-neutral-200'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center group-hover:scale-110 transition-all shadow-md shadow-emerald-500/20">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </div>
          <span className="text-[11px] font-bold mt-2">WhatsApp</span>
        </button>

        {/* 6. Email */}
        <button
          onClick={handleEmail}
          type="button"
          aria-label="Email"
          className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-amber-300 text-neutral-800'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-amber-600 text-neutral-200'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-amber-600 flex items-center justify-center group-hover:scale-110 transition-all shadow-md shadow-amber-500/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-bold mt-2">Email</span>
        </button>

        {/* 7. Icon of a copy the URL */}
        <button
          onClick={handleCopyUrl}
          type="button"
          aria-label="Copy URL"
          className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-sm col-span-2 sm:col-span-1 ${
            isLight
              ? 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-red-300 text-neutral-800'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-red-600 text-neutral-200'
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md ${
            copiedType === 'url' ? 'bg-emerald-600 scale-110 shadow-emerald-500/30' : 'bg-red-600 group-hover:scale-110 shadow-red-500/20'
          }`}>
            {copiedType === 'url' ? (
              <Check className="w-5 h-5 text-white stroke-[3]" />
            ) : (
              <Copy className="w-5 h-5 text-white" />
            )}
          </div>
          <span className="text-[11px] font-bold mt-2">
            {copiedType === 'url' ? (t.dir === 'rtl' ? 'הועתק!' : 'Copied!') : 'Copy URL'}
          </span>
        </button>
      </div>
    </div>
  );
};
