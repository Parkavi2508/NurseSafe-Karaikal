import React from 'react';
import { SessionResult, Language } from '../types/clinical';
import { Award, Printer, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface CertificateModalProps {
  session: SessionResult | null;
  lang: Language;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  session,
  lang,
  onClose,
}) => {
  if (!session) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Controls Header */}
        <div className="no-print flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'en' ? 'Clinical Safety Achievement' : 'பாதுகாப்புச் சான்றிதழ்'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Print / Save PDF' : 'அச்சிடு / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="border-4 border-double border-slate-800 p-6 sm:p-8 rounded-xl bg-gradient-to-b from-white via-slate-50/40 to-white text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-sky-950 text-white flex items-center justify-center mx-auto border-4 border-amber-400 shadow-md">
            <Award className="w-7 h-7 text-amber-300" />
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              NurseSafe Karaikal · Safety Lab
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Certificate of Completion
            </h2>
            <p className="text-xs text-slate-500">
              Clinical Safety & Infection Prevention Lab
            </p>
          </div>

          <div className="py-2 space-y-1">
            <p className="text-xs text-slate-500 italic">This certifies that</p>
            <h3 className="text-2xl font-bold text-sky-950 underline decoration-slate-300 decoration-1 underline-offset-8">
              {session.studentName || 'Student'}
              {session.age !== undefined && (
                <span className="text-sm font-normal text-slate-500 no-underline ml-2">
                  (Age: {session.age})
                </span>
              )}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
            has successfully completed the interactive module on{' '}
            <strong className="text-slate-900">{session.moduleTitle}</strong> with a score of{' '}
            <strong className="text-emerald-800 font-mono text-base">{session.score} / {session.totalQuestions} ({session.percentage}%)</strong>.
          </p>

          <div className="text-[11px] text-slate-400 font-mono pt-4 border-t border-slate-200">
            Issued on {new Date(session.timestamp).toLocaleDateString()} · NurseSafe Clinical Skills Project
          </div>
        </div>
      </div>
    </div>
  );
};
