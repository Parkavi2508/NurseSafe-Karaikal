import React from 'react';
import { Language } from '../types/clinical';
import { ArrowRight, BookOpen, ShieldCheck, HeartPulse } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  lang: Language;
  onExploreModules: () => void;
  onLaunchSimulators: () => void;
  onOpenPEP: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExploreModules,
  onLaunchSimulators,
  onOpenPEP,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background with subtle photo scrim */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/src/assets/images/hero_clinical_lab_simulation_1792165717929.jpg"
          alt="Clinical Simulation Lab"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">
          <span>Karaikal Nursing Lab</span>
          <span aria-hidden="true">·</span>
          <span>Clinical Safety Training</span>
          <span aria-hidden="true">·</span>
          <span>Bilingual (EN / தமிழ்)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          {lang === 'en'
            ? 'Practice Clinical Safety Decisions'
            : 'மருத்துவப் பாதுகாப்புப் பயிற்சி'}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          {lang === 'en'
            ? '6 modules with 20 real-time clinical scenarios each (120 total), interactive marks calculation, and clear wrong-answer explanations with real-world examples.'
            : '6 பிரிவுகளில் தலா 20 மருத்துவ சூழ்நிலைப் பயிற்சிகள் (மொத்தம் 120 வினாக்கள்), ஊடாடும் மதிப்பெண்கள் மற்றும் உண்மை உதாரணங்கள்.'}
        </p>

        {/* Clean Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onExploreModules();
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'en' ? 'Start Scenarios' : 'பயிற்சியைத் தொடங்கு'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onLaunchSimulators();
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>{lang === 'en' ? 'Interactive Tools' : 'செயல்முறைக் கருவிகள்'}</span>
          </button>

          <button
            onClick={() => {
              sound.playCaution();
              onOpenPEP();
            }}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>{lang === 'en' ? 'Needle-Stick Protocol' : 'ஊசி குத்து வழிகாட்டி'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
