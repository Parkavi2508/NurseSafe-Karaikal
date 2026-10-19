import React, { useState, useEffect } from 'react';
import { SafetyModule, Language, SessionResult, ClinicalQuestion } from '../types/clinical';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, FileText, ChevronLeft, Flame, Sparkles, AlertCircle, User, Check, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';
import { shuffleArray } from '../data/questionBank';
import confetti from 'canvas-confetti';

interface QuizSimulatorProps {
  module: SafetyModule;
  lang: Language;
  onExit: () => void;
  onSessionCompleted: (session: SessionResult) => void;
  onViewCertificate: (session: SessionResult) => void;
  onAnswerQuestion?: (isCorrect: boolean, pointsEarned: number) => void;
}

export const QuizSimulator: React.FC<QuizSimulatorProps> = ({
  module,
  lang,
  onExit,
  onSessionCompleted,
  onViewCertificate,
  onAnswerQuestion,
}) => {
  // Pre-quiz user info state (persisted to localStorage)
  const [hasStarted, setHasStarted] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('nursesafe_user_name') || '';
  });
  const [userAge, setUserAge] = useState(() => {
    return localStorage.getItem('nursesafe_user_age') || '';
  });

  // Active quiz state with randomly shuffled options for every question
  const [activeQuestions, setActiveQuestions] = useState<ClinicalQuestion[]>(() => {
    return module.questions.map(q => ({
      ...q,
      options: shuffleArray(q.options.map(opt => ({ ...opt })))
    }));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [recordedSession, setRecordedSession] = useState<SessionResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [wrongQuestions, setWrongQuestions] = useState<Array<{
    id: string;
    questionText: string;
    chosenText: string;
    correctText: string;
    rationale: string;
    realLifeExample: string;
  }>>([]);

  // Freshly shuffle options whenever the module changes
  useEffect(() => {
    setActiveQuestions(module.questions.map(q => ({
      ...q,
      options: shuffleArray(q.options.map(opt => ({ ...opt })))
    })));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setCorrectCount(0);
    setPoints(0);
    setStreak(0);
    setMaxStreak(0);
    setWrongQuestions([]);
    setIsCompleted(false);
    setRecordedSession(null);
  }, [module.id]);

  const currentQ = activeQuestions[currentIndex] || module.questions[0];
  const total = activeQuestions.length || module.questions.length;

  const handleStartQuiz = () => {
    const trimmedName = userName.trim() || 'Learner';
    setUserName(trimmedName);
    localStorage.setItem('nursesafe_user_name', trimmedName);
    if (userAge) {
      localStorage.setItem('nursesafe_user_age', userAge);
    }

    sound.playClick();
    setStartTime(Date.now());
    setHasStarted(true);
  };

  const handleSelectOption = (idx: number) => {
    if (isChecked) return;
    sound.playClick();
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isChecked || !currentQ) return;
    const isCorrect = currentQ.options[selectedOption].isCorrect;
    setIsChecked(true);

    if (isCorrect) {
      sound.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const bonus = newStreak > 1 ? newStreak * 2 : 0;
      const earned = 10 + bonus;
      setPoints(prev => prev + earned);
      setCorrectCount(prev => prev + 1);
      onAnswerQuestion?.(true, earned);

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 }
        });
      } catch {
        // Fallback
      }
    } else {
      sound.playCaution();
      setStreak(0);
      onAnswerQuestion?.(false, 0);
      const correctOpt = currentQ.options.find(o => o.isCorrect);
      setWrongQuestions(prev => [
        ...prev,
        {
          id: currentQ.id,
          questionText: currentQ.question[lang],
          chosenText: currentQ.options[selectedOption].text[lang],
          correctText: correctOpt ? correctOpt.text[lang] : '',
          rationale: currentQ.rationale[lang],
          realLifeExample: currentQ.realLifeExample[lang]
        }
      ]);
    }
  };

  const handleNext = () => {
    if (!isChecked) return;
    sound.playClick();

    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsCompleted(true);
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 80;

    if (percentage >= 80) {
      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.5 }
        });
      } catch {
        // Fallback
      }
    }

    const durationSeconds = Math.max(5, Math.round((Date.now() - startTime) / 1000));
    setIsSaving(true);

    const localSession: SessionResult = {
      id: `sess-${Date.now()}`,
      moduleId: module.id,
      moduleTitle: module.title[lang],
      studentName: userName.trim() || 'Learner',
      age: userAge ? parseInt(userAge) : undefined,
      score: correctCount,
      totalQuestions: total,
      percentage,
      points,
      maxStreak,
      timeSpentSeconds: durationSeconds,
      wrongQuestionsList: wrongQuestions.map(w => w.id).join('; '),
      passed,
      timestamp: new Date().toISOString()
    };

    // Send session to server API for durable persistence and Firestore storage
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: module.id,
          studentName: userName.trim() || 'Learner',
          age: userAge ? parseInt(userAge) : undefined,
          score: correctCount,
          totalQuestions: total,
          points,
          maxStreak,
          timeSpentSeconds: durationSeconds,
          wrongQuestionsList: wrongQuestions.map(w => w.id).join('; ')
        })
      });

      if (response.ok) {
        const resData = await response.json();
        const saved = resData.data || localSession;
        setRecordedSession(saved);
        onSessionCompleted(saved);
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save session record to database.');
      }
    } catch (err: any) {
      console.error('Session persistence failed:', err);
      alert('Error saving assessment record: ' + (err?.message || 'Database connection error. Please try again.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    sound.playClick();
    // Freshly reshuffle options on retry
    setActiveQuestions(module.questions.map(q => ({
      ...q,
      options: shuffleArray(q.options.map(opt => ({ ...opt })))
    })));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setCorrectCount(0);
    setPoints(0);
    setStreak(0);
    setWrongQuestions([]);
    setIsCompleted(false);
    setRecordedSession(null);
    setStartTime(Date.now());
  };

  // 1. Initial Intake Screen: Name and Age Only (No clinical upload)
  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={onExit}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'en' ? 'Back' : 'பின்செல்'}</span>
          </button>
          <span className="text-xs font-mono font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            {total} Scenarios · 8 Min
          </span>
        </div>

        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-xl bg-sky-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {module.title[lang]}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {module.description[lang]}
          </p>
        </div>

        {/* Clean Learner Intake Form (No file uploads) */}
        <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-sky-700" />
            <span>{lang === 'en' ? 'Learner Information' : 'பயிற்சியாளர் விவரங்கள்'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                {lang === 'en' ? 'Name:' : 'பெயர்:'}
              </label>
              <input
                type="text"
                placeholder={lang === 'en' ? 'e.g. Priya S.' : 'உதா: பிரியா'}
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                {lang === 'en' ? 'Age:' : 'வயது:'}
              </label>
              <input
                type="number"
                placeholder="21"
                min="16"
                max="99"
                value={userAge}
                onChange={e => setUserAge(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono font-medium"
              />
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          className="w-full py-3 text-sm font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-xl transition-all shadow-md hover:scale-101 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{lang === 'en' ? `Start ${total} Interactive Scenarios` : `${total} பயிற்சிகளைத் தொடங்கு`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 2. Completed Score Screen (Joyful, with Marks, Explanations, Certificate)
  if (isCompleted) {
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 80;

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-300 shadow-sm">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-sky-700 font-bold">
            {lang === 'en' ? 'Module Finished!' : 'பயிற்சி முடிந்தது!'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {module.title[lang]}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {passed
              ? (lang === 'en' ? `Awesome job, ${userName || 'Learner'}! You demonstrated excellent safety principles.` : `அற்புதம் ${userName}! சிறப்பான தேர்ச்சி பெற்றீர்கள்.`)
              : (lang === 'en' ? `Good attempt, ${userName || 'Learner'}! Review the examples below and retry for full marks.` : `நன்றாக முயற்சி செய்தீர்கள் ${userName}! தவறுகளைப் படித்துவிட்டு மீண்டும் முயற்சி செய்யுங்கள்.`)}
          </p>
        </div>

        {/* Big Marks & Stats Display */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100">
            <span className="text-xs text-sky-700 font-medium block">
              {lang === 'en' ? 'Marks' : 'மதிப்பெண்'}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-950">
              {correctCount} / {total}
            </span>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium block">
              {lang === 'en' ? 'Accuracy' : 'சதவீதம்'}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-950">
              {percentage}%
            </span>
          </div>

          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
            <span className="text-xs text-amber-700 font-medium block">
              {lang === 'en' ? 'Points Earned' : 'புள்ளிகள்'}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-950">
              {points} pts
            </span>
          </div>
        </div>

        {/* Saved confirmation */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 max-w-sm mx-auto">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isSaving
              ? (lang === 'en' ? 'Saving record to database...' : 'பதிவு செய்யப்படுகிறது...')
              : (lang === 'en' ? 'Marks & results saved to database' : 'மதிப்பெண்கள் பதிவேட்டில் பதிவு செய்யப்பட்டன')}
          </span>
        </div>

        {/* Clear Explanations for Wrong Answers with Real-Time Examples */}
        {wrongQuestions.length > 0 && (
          <div className="text-left space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {lang === 'en' ? `Questions to Review (${wrongQuestions.length})` : `மீளாய்வு செய்ய வேண்டியவை (${wrongQuestions.length})`}
              </h3>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {wrongQuestions.map((wq, idx) => (
                <div key={idx} className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 leading-snug">
                    {idx + 1}. {wq.questionText}
                  </div>
                  <div className="text-rose-700">
                    <span className="font-semibold">{lang === 'en' ? 'Your Answer: ' : 'உங்கள் தேர்வு: '}</span>
                    {wq.chosenText}
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    <span className="font-bold">{lang === 'en' ? 'Correct: ' : 'சரியான பதில்: '}</span>
                    {wq.correctText}
                  </div>
                  <p className="text-slate-600 italic bg-white/80 p-2 rounded border border-rose-100">
                    <strong>{lang === 'en' ? '🏥 Real-Time Example: ' : '🏥 உண்மை உதாரணம்: '}</strong>
                    {wq.realLifeExample}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestart}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Play Again' : 'மீண்டும் விளையாடு'}</span>
          </button>

          {passed && (
            <button
              onClick={() => {
                const targetSession = recordedSession || {
                  id: `sess-${Date.now()}`,
                  moduleId: module.id,
                  moduleTitle: module.title.en,
                  studentName: userName || 'Learner',
                  age: userAge ? parseInt(userAge) : undefined,
                  score: correctCount,
                  totalQuestions: total,
                  percentage,
                  points,
                  maxStreak,
                  timeSpentSeconds: 60,
                  passed: true,
                  timestamp: new Date().toISOString()
                };
                onViewCertificate(targetSession);
              }}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-102 active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'en' ? 'Get Certificate' : 'சான்றிதழ் பெறு'}</span>
            </button>
          )}

          <button
            onClick={onExit}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-sky-900 hover:bg-sky-800 rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'All Modules' : 'அனைத்து பிரிவுகள்'}
          </button>
        </div>
      </div>
    );
  }

  // 3. Active Interactive Quiz View
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Top Interactive Score Header */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-xs">
        <button
          onClick={onExit}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Exit' : 'வெளியேறு'}</span>
        </button>

        {/* Center Live Streak & Learner */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium hidden sm:inline">
            {userName}{userAge ? ` (${userAge})` : ''}
          </span>
          {streak > 1 && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streak} Streak!</span>
            </span>
          )}
          <span className="text-xs font-bold text-sky-900 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            {points} pts
          </span>
        </div>

        {/* Right Question Counter */}
        <div className="text-xs font-mono font-bold text-slate-700">
          {currentIndex + 1} / {total}
        </div>
      </div>

      {/* Smooth Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-sky-600 h-1.5 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + (isChecked ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5">
        {/* Scenario Banner */}
        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
          {currentQ.scenario[lang]}
        </div>

        {/* Question Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {currentQ.question[lang]}
        </h3>

        {/* Interactive Options (Randomized order: Option A, B, C, D) */}
        <div className="space-y-3 pt-1">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const letter = String.fromCharCode(65 + idx);

            let btnStyle = 'border-slate-200 bg-white hover:border-sky-300 text-slate-800';

            if (isChecked) {
              if (option.isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30';
              } else if (isSelected) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
              } else {
                btnStyle = 'border-slate-100 bg-slate-50/60 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              btnStyle = 'border-sky-700 bg-sky-50 text-sky-950 ring-2 ring-sky-600/30';
            }

            return (
              <button
                key={idx}
                disabled={isChecked}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 cursor-pointer ${btnStyle}`}
              >
                <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? option.isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    : isSelected
                      ? 'bg-sky-800 text-white'
                      : 'bg-slate-100 text-slate-700'
                }`}>
                  {letter}
                </span>

                <div className="flex-1 space-y-1">
                  <span>{option.text[lang]}</span>
                  {isChecked && (
                    <p className={`text-xs mt-1 ${option.isCorrect ? 'text-emerald-800 font-semibold' : 'text-rose-700'}`}>
                      {option.explanation[lang]}
                    </p>
                  )}
                </div>

                {isChecked && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isChecked && !option.isCorrect && isSelected && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Real-Life Example & Rationale Callout after checking */}
        {isChecked && (
          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold text-sky-950">
              <Sparkles className="w-4 h-4 text-sky-700" />
              <span>{lang === 'en' ? 'Clinical Rationale' : 'மருத்துவக் காரணம்'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-normal">
              {currentQ.rationale[lang]}
            </p>

            <div className="pt-2 border-t border-sky-200/80">
              <span className="font-bold text-slate-900 block mb-0.5">
                {lang === 'en' ? '🏥 Real-World Hospital Example:' : '🏥 உண்மை மருத்துவமனை உதாரணம்:'}
              </span>
              <p className="text-slate-600 italic leading-relaxed">
                {currentQ.realLifeExample[lang]}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {lang === 'en' ? 'Select an answer and check' : 'பதிலைத் தேர்ந்தெடுத்து சரிபார்க்கவும்'}
          </span>

          {!isChecked ? (
            <button
              disabled={selectedOption === null}
              onClick={handleCheckAnswer}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                selectedOption !== null
                  ? 'bg-sky-900 hover:bg-sky-800 text-white shadow-sm cursor-pointer hover:scale-101 active:scale-98'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'en' ? 'Check Answer' : 'சரிபார்'}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-bold bg-sky-900 hover:bg-sky-800 text-white rounded-xl shadow-sm transition-all hover:scale-101 active:scale-98 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentIndex < total - 1 ? (lang === 'en' ? 'Next Scenario' : 'அடுத்த பயிற்சி') : (lang === 'en' ? 'Finish & See Marks' : 'மதிப்பெண்களைக் காண்க')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
