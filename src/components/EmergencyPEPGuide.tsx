import React from 'react';
import { Language } from '../types/clinical';
import { PEP_ALGORITHM } from '../data/clinicalData';
import { AlertOctagon, Clock, Printer, CheckCircle2, XCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface EmergencyPEPGuideProps {
  lang: Language;
}

export const EmergencyPEPGuide: React.FC<EmergencyPEPGuideProps> = ({ lang }) => {
  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Alert Header */}
      <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h2 className="text-base sm:text-lg font-bold text-rose-950">
              {lang === 'en' ? 'Needle-Stick Emergency Protocol (PEP)' : 'ஊசி குத்து அவசர வழிகாட்டி (PEP)'}
            </h2>
          </div>

          <button
            onClick={handlePrint}
            className="no-print inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-white border border-rose-300 text-rose-900 rounded-lg font-medium hover:bg-rose-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Print' : 'அச்சிடு'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
          <Clock className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{lang === 'en' ? 'Critical: Start PEP Medication within 2 Hours' : 'முக்கியம்: 2 மணி நேரத்திற்குள் PEP மருந்து தொடங்கவும்'}</span>
        </div>
      </div>

      {/* 5 Clean Steps */}
      <div className="space-y-3">
        {PEP_ALGORITHM.map(s => (
          <div key={s.step} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3 text-xs sm:text-sm">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
              s.step === 1 ? 'bg-rose-600 text-white' : s.step <= 3 ? 'bg-amber-600 text-white' : 'bg-sky-800 text-white'
            }`}>
              {s.step}
            </div>

            <div className="space-y-1.5 flex-1">
              <h3 className="font-bold text-slate-900 text-sm">{s.title[lang]}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{s.instruction[lang]}</p>
              {s.realLifeExample && (
                <p className="text-xs text-sky-900 bg-sky-50 p-2 rounded border border-sky-100 italic">
                  💡 {s.realLifeExample[lang]}
                </p>
              )}
              <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                <strong>Warning:</strong> {s.warningNote[lang]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple DO's and DON'Ts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1.5">
          <span className="font-bold text-emerald-800 flex items-center gap-1 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {lang === 'en' ? 'DO:' : 'செய்ய வேண்டியவை:'}
          </span>
          <ul className="space-y-1 list-disc list-inside text-slate-700">
            <li>Wash with mild soap and water under a running tap.</li>
            <li>Report immediately to the ward supervisor.</li>
            <li>Take the 1st dose of PEP within 2 hours.</li>
          </ul>
        </div>

        <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 space-y-1.5">
          <span className="font-bold text-rose-800 flex items-center gap-1 text-xs">
            <XCircle className="w-4 h-4 text-rose-600" />
            {lang === 'en' ? 'DO NOT:' : 'செய்யக்கூடாதவை:'}
          </span>
          <ul className="space-y-1 list-disc list-inside text-slate-700">
            <li>DO NOT squeeze or pinch the wound.</li>
            <li>DO NOT suck the wound with your mouth.</li>
            <li>DO NOT pour bleach or harsh chemicals on it.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
