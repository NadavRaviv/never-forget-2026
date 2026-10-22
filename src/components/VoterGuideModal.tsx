import React from 'react';
import { TranslationDict } from '../i18n/translations';
import { X, CheckCircle, Clock, CreditCard, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';

interface VoterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDict;
  theme: 'light' | 'dark';
}

export const VoterGuideModal: React.FC<VoterGuideModalProps> = ({ isOpen, onClose, t, theme }) => {
  if (!isOpen) return null;
  const isLight = theme === 'light';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative max-w-2xl w-full max-h-[90vh] border rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
          isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-neutral-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between gap-4 ${
          isLight ? 'bg-slate-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/15 text-red-600 border border-red-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg sm:text-xl font-black ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {t.voterGuideTitle}
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {t.voterGuideSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isLight ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Official link */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight
              ? 'bg-red-50/70 border-red-200 text-neutral-900'
              : 'bg-gradient-to-r from-red-950/60 to-neutral-900 border-red-800/60 text-neutral-100'
          }`}>
            <div>
              <h4 className="font-bold text-base mb-1">
                {t.whereToVote}
              </h4>
              <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                kalpi.elections.gov.il
              </p>
            </div>
            <a
              href="https://kalpi.elections.gov.il/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              <span>kalpi.elections.gov.il</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Voting Hours */}
          <div className="space-y-2">
            <h4 className={`font-bold flex items-center gap-2 text-base ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              <Clock className="w-4 h-4 text-amber-500" />
              <span>07:00 – 22:00</span>
            </h4>
            <div className={`p-4 rounded-xl border space-y-2 text-xs sm:text-sm ${
              isLight ? 'bg-slate-50 border-neutral-200 text-neutral-700' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
            }`}>
              <p>• <strong>07:00 - 22:00:</strong> Polling stations across the country are open continuously.</p>
              <p>• As long as you arrive in line before closing time, you have the full right to vote!</p>
            </div>
          </div>

          {/* Valid Identification */}
          <div className="space-y-2">
            <h4 className={`font-bold flex items-center gap-2 text-base ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span>ID Requirements / תעודה מזהה</span>
            </h4>
            <div className={`p-4 rounded-xl border space-y-2 text-xs sm:text-sm ${
              isLight ? 'bg-slate-50 border-neutral-200 text-neutral-700' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
            }`}>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}><strong>תעודת זהות ישראלית (Teudat Zehut)</strong></span>
                </li>
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}><strong>דרכון ישראלי בתוקף (Valid Passport)</strong></span>
                </li>
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}><strong>רישיון נהיגה ישראלי בתוקף (Valid Driver's License)</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${
          isLight ? 'bg-slate-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all cursor-pointer shadow-md"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
