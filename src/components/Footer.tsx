import React from 'react';
import { Language } from '../types/clinical';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-500 no-print">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p className="font-medium text-slate-700">
          NurseSafe Karaikal · Clinical Safety Lab
        </p>

        {/* Dataset Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[11px] font-medium text-slate-600">
          <span className="text-slate-400">
            {lang === 'en' ? 'Live Dataset:' : 'நேரலை தரவுத்தொகுப்பு:'}
          </span>
          <a
            href="/dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-700 hover:text-sky-800 hover:underline font-bold"
          >
            {lang === 'en' ? 'Live Web Dataset (/dataset)' : 'இணையத்தில் பார்க்க'}
          </a>
          <span>·</span>
          <a
            href="/api/download/excel"
            download="live_web_dataset.xlsx"
            className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>⬇ {lang === 'en' ? 'Download Excel (.xlsx)' : 'எக்செல் பதிவிறக்கு'}</span>
          </a>
          <span>·</span>
          <a
            href="/api/download/csv"
            download="live_web_dataset.csv"
            className="text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>⬇ {lang === 'en' ? 'Download CSV (.csv)' : 'சிஎஸ்வி பதிவிறக்கு'}</span>
          </a>
        </div>

        <p className="text-[11px] text-slate-400 pt-1">
          {lang === 'en'
            ? 'Educational prototype for nursing students. Follow institutional protocols and faculty guidance in real clinical practice.'
            : 'செவிலிய மாணவர்களுக்கான பயிற்சிக் கருவி. உண்மையான மருத்துவப் பணியில் உங்கள் மருத்துவமனை நெறிமுறைகளைப் பின்பற்றுங்கள்.'}
        </p>
      </div>
    </footer>
  );
};
