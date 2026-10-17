import React, { useState } from 'react';
import { Language, WasteItem } from '../types/clinical';
import { WASTE_ITEMS, PPE_STEPS } from '../data/clinicalData';
import { CheckCircle2, XCircle, RotateCcw, Check, Trash2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ToolsSandboxProps {
  lang: Language;
}

export const ToolsSandbox: React.FC<ToolsSandboxProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'waste' | 'ppe'>('waste');

  // Waste sorter state
  const [wasteIndex, setWasteIndex] = useState(0);
  const [wasteScore, setWasteScore] = useState(0);
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [wasteFeedback, setWasteFeedback] = useState<string | null>(null);
  const [isWasteFinished, setIsWasteFinished] = useState(false);

  // PPE mode
  const [ppeMode, setPpeMode] = useState<'donning' | 'doffing'>('donning');

  const currentItem: WasteItem = WASTE_ITEMS[wasteIndex];

  const handleBinClick = (bin: 'yellow' | 'red' | 'white' | 'blue') => {
    if (selectedBin) return;
    setSelectedBin(bin);

    const isCorrect = bin === currentItem.correctBin;
    if (isCorrect) {
      sound.playSuccess();
      setWasteScore(prev => prev + 1);
      setWasteFeedback(lang === 'en' ? 'Correct Bin!' : 'சரியான தொட்டி!');

      try {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
      } catch {
        // fallback
      }
    } else {
      sound.playCaution();
      setWasteFeedback(lang === 'en' ? 'Oops! Wrong Bin.' : 'தவறான தொட்டி.');
    }
  };

  const handleNextItem = () => {
    sound.playClick();
    if (wasteIndex < WASTE_ITEMS.length - 1) {
      setWasteIndex(prev => prev + 1);
      setSelectedBin(null);
      setWasteFeedback(null);
    } else {
      setIsWasteFinished(true);
      if (wasteScore >= 4) {
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
        } catch {
          // fallback
        }
      }
    }
  };

  const handleResetWaste = () => {
    sound.playClick();
    setWasteIndex(0);
    setWasteScore(0);
    setSelectedBin(null);
    setWasteFeedback(null);
    setIsWasteFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top clean tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {lang === 'en' ? 'Interactive Hospital Simulators' : 'செயல்முறைக் கருவிகள்'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'en' ? 'Hands-on practice with live feedback and real hospital examples.' : 'செயல்முறைப் பயிற்சி மற்றும் உண்மை உதாரணங்கள்.'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('waste');
            }}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeTab === 'waste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Waste Sorter' : 'கழிவுத் தொட்டி'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('ppe');
            }}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
              activeTab === 'ppe' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'PPE Order' : 'PPE வரிசை'}
          </button>
        </div>
      </div>

      {/* Waste Sorter */}
      {activeTab === 'waste' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {lang === 'en' ? 'Drag or click the matching bin:' : 'சரியான வண்ணத் தொட்டியைத் தேர்வு செய்யவும்:'}
            </span>
            <span className="font-mono font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
              {lang === 'en' ? 'Marks:' : 'மதிப்பெண்:'} {wasteScore} / {WASTE_ITEMS.length}
            </span>
          </div>

          {!isWasteFinished ? (
            <div className="space-y-4">
              {/* Item prompt */}
              <div className="p-5 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-200/80 text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-sky-800 font-bold block">
                  {lang === 'en' ? 'Clinical Waste Item to Sort' : 'பிரித்து அப்புறப்படுத்த வேண்டிய பொருள்'}
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900">
                  "{currentItem.name[lang]}"
                </p>
              </div>

              {/* 4 Colored Bins */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Yellow */}
                <button
                  disabled={selectedBin !== null}
                  onClick={() => handleBinClick('yellow')}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    selectedBin === 'yellow'
                      ? currentItem.correctBin === 'yellow'
                        ? 'bg-amber-100 border-amber-600 ring-4 ring-amber-300 scale-105'
                        : 'bg-rose-50 border-rose-400 opacity-60'
                      : 'bg-amber-50 hover:bg-amber-100/90 border-amber-300 hover:scale-102'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-600 mx-auto mb-2 flex items-center justify-center shadow-xs">
                    <Trash2 className="w-4 h-4 text-amber-950" />
                  </div>
                  <h4 className="font-bold text-xs text-amber-950">Yellow Bin</h4>
                  <p className="text-[11px] text-amber-900 mt-0.5">Soiled cotton & pus</p>
                </button>

                {/* Red */}
                <button
                  disabled={selectedBin !== null}
                  onClick={() => handleBinClick('red')}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    selectedBin === 'red'
                      ? currentItem.correctBin === 'red'
                        ? 'bg-rose-100 border-rose-600 ring-4 ring-rose-300 scale-105'
                        : 'bg-rose-50 border-rose-400 opacity-60'
                      : 'bg-rose-50 hover:bg-rose-100/90 border-rose-300 hover:scale-102'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-rose-700 mx-auto mb-2 flex items-center justify-center shadow-xs">
                    <Trash2 className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-xs text-rose-950">Red Bin</h4>
                  <p className="text-[11px] text-rose-900 mt-0.5">Plastics / IV tubes</p>
                </button>

                {/* White */}
                <button
                  disabled={selectedBin !== null}
                  onClick={() => handleBinClick('white')}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    selectedBin === 'white'
                      ? currentItem.correctBin === 'white'
                        ? 'bg-slate-200 border-slate-700 ring-4 ring-slate-400 scale-105'
                        : 'bg-rose-50 border-rose-400 opacity-60'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-300 hover:scale-102'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-700 mx-auto mb-2 flex items-center justify-center shadow-xs">
                    <Trash2 className="w-4 h-4 text-slate-800" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">White Box</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Sharp needles & blades</p>
                </button>

                {/* Blue */}
                <button
                  disabled={selectedBin !== null}
                  onClick={() => handleBinClick('blue')}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    selectedBin === 'blue'
                      ? currentItem.correctBin === 'blue'
                        ? 'bg-sky-100 border-sky-600 ring-4 ring-sky-300 scale-105'
                        : 'bg-rose-50 border-rose-400 opacity-60'
                      : 'bg-sky-50 hover:bg-sky-100/90 border-sky-300 hover:scale-102'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-800 mx-auto mb-2 flex items-center justify-center shadow-xs">
                    <Trash2 className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-xs text-sky-950">Blue Box</h4>
                  <p className="text-[11px] text-sky-900 mt-0.5">Glass ampoules & vials</p>
                </button>
              </div>

              {/* Feedback with Real-Life Example */}
              {selectedBin && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 animate-in fade-in duration-200 ${
                    selectedBin === currentItem.correctBin
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {selectedBin === currentItem.correctBin ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{wasteFeedback}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>{wasteFeedback} Correct is: <strong className="uppercase">{currentItem.correctBin}</strong></span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-700">
                    {currentItem.explanation[lang]}
                  </p>

                  <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                    <span><strong>Hospital Impact:</strong> {currentItem.realLifeExample[lang]}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  disabled={selectedBin === null}
                  onClick={handleNextItem}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 disabled:opacity-40 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>{wasteIndex === WASTE_ITEMS.length - 1 ? (lang === 'en' ? 'See My Marks' : 'மதிப்பெண்களைப் பார்') : (lang === 'en' ? 'Next Item' : 'அடுத்த பொருள்')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {lang === 'en' ? 'Waste Segregation Complete!' : 'கழிவுப் பிரிப்பு பயிற்சி முடிந்தது!'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'en' ? 'Your Total Marks:' : 'உங்கள் மொத்த மதிப்பெண்:'}
                </p>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-1">
                  {wasteScore} / {WASTE_ITEMS.length} ({Math.round((wasteScore / WASTE_ITEMS.length) * 100)}%)
                </div>
              </div>

              <button
                onClick={handleResetWaste}
                className="px-4 py-2 text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Play Again' : 'மீண்டும் விளையாடு'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* PPE Sequence */}
      {activeTab === 'ppe' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800">
              {lang === 'en' ? 'Interactive Sequence Guide' : 'வரிசை வழிகாட்டி'}
            </span>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  setPpeMode('donning');
                }}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  ppeMode === 'donning' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Putting On (Donning)' : 'அணிதல்'}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setPpeMode('doffing');
                }}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  ppeMode === 'doffing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Removing (Doffing)' : 'கழற்றுதல்'}
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {ppeMode === 'donning' ? (
              PPE_STEPS.map((s, idx) => (
                <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs sm:text-sm hover:border-sky-300 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-sky-900 text-white flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-0.5 flex-1">
                    <strong className="text-slate-900 font-bold block">{s.name[lang]}</strong>
                    <p className="text-slate-600 text-xs">{s.tip[lang]}</p>
                    <p className="text-[11px] text-sky-800 italic mt-0.5">
                      💡 Real Ward Reason: {s.realLifeExample[lang]}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              [
                { step: 1, name: { en: '1. Gloves First', ta: '1. கையுறைகள்' }, desc: { en: 'Most heavily contaminated. Peel off inside-out without touching skin.', ta: 'முன்புறம் தொடாமல் கழற்றவும்.' }, why: { en: 'Stops you from rubbing patient fluid onto your face when reaching for your mask.', ta: 'முகமூடியைத் தொடும்போது முகத்தில் கிருமி படாமல் தடுக்கும்.' } },
                { step: 2, name: { en: '2. Eye Goggles / Face Shield', ta: '2. கண்ணாடிகள்' }, desc: { en: 'Grasp from back headband only, never front visor.', ta: 'பின்புற பட்டையை மட்டும் தொடவும்.' }, why: { en: 'Front visor is coated in respiratory droplets from coughing patients.', ta: 'முன் பகுதியில் எச்சில் துகள்கள் படிந்திருக்கும்.' } },
                { step: 3, name: { en: '3. Isolation Gown', ta: '3. அங்கி (Gown)' }, desc: { en: 'Untie neck/waist, pull forward away from body, roll into a ball.', ta: 'முன்புறமாக இழுத்து சுருட்டி எடுக்கவும்.' }, why: { en: 'Prevents shaking dust and organisms into ward air currents.', ta: 'காற்றில் கிருமி பரவாமல் உடலின் முன் பகுதியில் சுருட்டி எடுக்க வேண்டும்.' } },
                { step: 4, name: { en: '4. Mask / N95 Respirator', ta: '4. முகமூடி / N95' }, desc: { en: 'Touch only the elastic straps behind your ears. Never touch the front.', ta: 'காதின் பின்னுள்ள பட்டையை மட்டும் தொடவும்.' }, why: { en: 'Inhaled viruses collect on the front filter mesh.', ta: 'முகமூடியின் முன் பகுதியில் கிருமிகள் குவிந்திருக்கும்.' } },
                { step: 5, name: { en: '5. Hand Hygiene', ta: '5. கை சுகாதாரம்' }, desc: { en: 'Wash with soap and water or alcohol rub immediately on exiting.', ta: 'அறையை விட்டு வெளியேறியதும் உடனே கைகழுவவும்.' }, why: { en: 'Destroys any virus that accidentally touched your fingers while removing gear.', ta: 'கழற்றும்போது தெரியாமல் ஒட்டிய கிருமிகளை முற்றிலும் அழிக்கும்.' } },
              ].map(s => (
                <div key={s.step} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs sm:text-sm hover:border-rose-300 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div className="space-y-0.5 flex-1">
                    <strong className="text-slate-900 font-bold block">{s.name[lang]}</strong>
                    <p className="text-slate-600 text-xs">{s.desc[lang]}</p>
                    <p className="text-[11px] text-rose-800 italic mt-0.5">
                      💡 Real Ward Reason: {s.why[lang]}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
