import React from 'react';
import { Language } from '../types/clinical';
import { Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'home' | 'modules' | 'tools' | 'pep' | 'dashboard';
  onSelectTab: (tab: 'home' | 'modules' | 'tools' | 'pep' | 'dashboard') => void;
  lang: Language;
  onToggleLang: (newLang: Language) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  totalMarks?: number;
  totalAnswered?: number;
  progressPercent?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  audioEnabled,
  onToggleAudio,
  totalMarks = 0,
  totalAnswered = 0,
  progressPercent = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-left font-bold tracking-tight text-slate-900 text-lg hover:text-sky-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-900 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
            NS
          </div>
          <span className="font-semibold text-slate-900">
            NurseSafe <span className="text-sky-700 font-normal">Karaikal</span>
          </span>
        </button>

        {/* Zone 2: 4-5 Concise Single-line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'home'
                ? 'text-sky-900 font-semibold border-b-2 border-sky-800'
                : 'hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Overview' : 'முகப்பு'}
          </button>
          <button
            onClick={() => onSelectTab('modules')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'modules'
                ? 'text-sky-900 font-semibold border-b-2 border-sky-800'
                : 'hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Safety Modules' : 'பயிற்சி தொகுதிகள்'}
          </button>
          <button
            onClick={() => onSelectTab('tools')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'tools'
                ? 'text-sky-900 font-semibold border-b-2 border-sky-800'
                : 'hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Interactive Simulators' : 'செயல்முறை கருவிகள்'}
          </button>
          <button
            onClick={() => onSelectTab('pep')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'pep'
                ? 'text-rose-700 font-semibold border-b-2 border-rose-600'
                : 'hover:text-rose-700 text-rose-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Emergency PEP Guide' : 'அவசர ஊசி குத்து நெறிமுறை'}
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'dashboard'
                ? 'text-sky-900 font-semibold border-b-2 border-sky-800'
                : 'hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'My Marks & Progress' : 'மதிப்பெண்கள்'}
          </button>
        </nav>

        {/* Zone 3: Live Marks & Progress badge, Language switcher & Audio toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Marks & Progress indicator (starts from 0 on refresh, increases as questions are answered) */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer text-xs"
            title={lang === 'en' ? 'Click to view My Marks & Progress' : 'மதிப்பெண்களைக் காண்க'}
          >
            <div className="flex items-center gap-1 font-mono font-bold text-sky-950">
              <span className="text-[11px] font-sans font-medium text-sky-700">{lang === 'en' ? 'Marks:' : 'மதிப்பெண்:'}</span>
              <span>{totalMarks}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 pl-1.5 border-l border-sky-200">
              <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-sky-800 text-[11px] font-bold">{progressPercent}%</span>
            </div>
          </button>

          <button
            onClick={onToggleAudio}
            title={audioEnabled ? 'Mute clinical audio' : 'Enable clinical audio'}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle audio"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-sky-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                onToggleLang('en');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onToggleLang('ta');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === 'ta' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
          </div>

          <button
            onClick={() => onSelectTab('modules')}
            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-white bg-sky-900 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            {lang === 'en' ? 'Launch Lab' : 'பயிற்சி தொடங்கு'}
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around px-3 py-2 bg-slate-50 border-t border-slate-200 text-xs overflow-x-auto">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'home' ? 'font-bold text-sky-900' : 'text-slate-600'}`}
        >
          {lang === 'en' ? 'Home' : 'முகப்பு'}
        </button>
        <button
          onClick={() => onSelectTab('modules')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'modules' ? 'font-bold text-sky-900' : 'text-slate-600'}`}
        >
          {lang === 'en' ? 'Modules' : 'பயிற்சிகள்'}
        </button>
        <button
          onClick={() => onSelectTab('tools')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'tools' ? 'font-bold text-sky-900' : 'text-slate-600'}`}
        >
          {lang === 'en' ? 'Simulators' : 'கருவிகள்'}
        </button>
        <button
          onClick={() => onSelectTab('pep')}
          className={`px-2 py-1 whitespace-nowrap ${currentTab === 'pep' ? 'font-bold text-rose-700' : 'text-rose-800'}`}
        >
          {lang === 'en' ? 'PEP 2h Guide' : 'அவசர வழிகாட்டி'}
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 whitespace-nowrap flex items-center gap-1 ${currentTab === 'dashboard' ? 'font-bold text-sky-900' : 'text-slate-600'}`}
        >
          <span>{lang === 'en' ? 'My Marks' : 'மதிப்பெண்'}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-sky-100 text-sky-900 rounded font-bold">
            {totalMarks} ({progressPercent}%)
          </span>
        </button>
      </div>
    </header>
  );
};
