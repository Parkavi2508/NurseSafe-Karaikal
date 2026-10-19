import React, { useState } from 'react';
import { SessionResult, Language, SafetyModule } from '../types/clinical';
import {
  Award,
  Trash2,
  FileText,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Target,
  ShieldCheck,
  ArrowRight,
  Database,
  Download,
  FileSpreadsheet,
  ExternalLink,
  Table,
  Eye,
  RefreshCw
} from 'lucide-react';
import { sound } from '../utils/audio';
import * as XLSX from 'xlsx';

interface DashboardProps {
  sessions: SessionResult[];
  modules: SafetyModule[];
  lang: Language;
  onClearSessions?: () => void;
  onViewCertificate: (session: SessionResult) => void;
  onRefreshSessions: () => void;
  liveTotalAnswered?: number;
  liveCorrectMarks?: number;
  livePoints?: number;
  onStartModule?: (mod: SafetyModule) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  sessions,
  modules,
  lang,
  onClearSessions,
  onViewCertificate,
  liveTotalAnswered = 0,
  liveCorrectMarks = 0,
  livePoints = 0,
  onStartModule,
}) => {
  const [showBackendTable, setShowBackendTable] = useState(false);
  const [backendRecords, setBackendRecords] = useState<SessionResult[]>([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  const fetchBackendRecords = async () => {
    setIsLoadingBackend(true);
    try {
      const res = await fetch('/api/sessions');
      const json = await res.json();
      if (json && json.data) {
        setBackendRecords(json.data);
      }
    } catch (err) {
      console.error('Failed to load backend dataset:', err);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  const handleToggleBackendViewer = () => {
    sound.playClick();
    if (!showBackendTable) {
      fetchBackendRecords();
    }
    setShowBackendTable(prev => !prev);
  };

  const getExportData = () => {
    const list = backendRecords.length > 0 ? backendRecords : sessions;
    if (list.length === 0) {
      return [{
        'Session ID': 'sample-001',
        'Date & Time': new Date().toISOString(),
        'Learner Name': 'Learner Sample',
        'Age': 20,
        'Module ID': 'hand_hygiene',
        'Module Title': 'WHO Hand Hygiene Lab',
        'Marks Scored': 20,
        'Total Questions': 20,
        'Accuracy (%)': '100%',
        'Points Earned': 200,
        'Max Streak': 20,
        'Duration (Seconds)': 120,
        'Status': 'PASS',
        'Wrong Questions': 'None'
      }];
    }
    return list.map(s => ({
      'Session ID': s.id,
      'Date & Time': s.timestamp,
      'Learner Name': s.studentName,
      'Age': s.age !== undefined ? s.age : 'N/A',
      'Module ID': s.moduleId,
      'Module Title': s.moduleTitle,
      'Marks Scored': s.score,
      'Total Questions': s.totalQuestions,
      'Accuracy (%)': `${s.percentage}%`,
      'Points Earned': s.points || s.score * 10,
      'Max Streak': s.maxStreak || 0,
      'Duration (Seconds)': s.timeSpentSeconds || 0,
      'Status': s.passed ? 'PASS' : 'RETRY',
      'Wrong Questions': s.wrongQuestionsList || 'None'
    }));
  };

  const handleDownloadExcel = async () => {
    sound.playSuccess();
    try {
      const res = await fetch('/api/download/excel');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'live_web_dataset.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback to client-side XLSX generation
    }
    const data = getExportData();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Live Dataset');
    XLSX.writeFile(wb, 'live_web_dataset.xlsx');
  };

  const handleDownloadCSV = async () => {
    sound.playSuccess();
    try {
      const res = await fetch('/api/download/csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'live_web_dataset.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback to client-side CSV generation
    }
    const data = getExportData();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'live_web_dataset.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalSessions = sessions.length;
  const sessionQuestions = sessions.reduce((acc, s) => acc + s.totalQuestions, 0);
  const sessionCorrect = sessions.reduce((acc, s) => acc + s.score, 0);
  const sessionPoints = sessions.reduce((acc, s) => acc + (s.points || s.score * 10), 0);

  const totalQuestions = Math.max(sessionQuestions, liveTotalAnswered);
  const totalCorrect = Math.max(sessionCorrect, liveCorrectMarks);
  const totalPoints = Math.max(sessionPoints, livePoints);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const progressPercent = Math.min(100, Math.round((totalQuestions / 120) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
              {lang === 'en' ? 'Personal Learning Track' : 'சுய முன்னேற்றப் பதிவேடு'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {lang === 'en' ? 'My Marks & Competency Progress' : 'என் மதிப்பெண்கள் & தேர்ச்சி நிலை'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Starts from 0 on each refresh. Marks and progress dynamically advance as you answer clinical questions.'
              : 'ஒவ்வொரு முறையும் 0-ல் இருந்து தொடங்கி, வினாக்களுக்கு பதிலளிக்கும்போது மதிப்பெண்களும் முன்னேற்றமும் அதிகரிக்கும்.'}
          </p>
        </div>

        <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'en' ? 'Official Clinical Dataset (Read-Only)' : 'அதிகாரப்பூர்வ மருத்துவப் பதிவேடு (பார்வை மட்டும்)'}</span>
        </div>
      </div>

      {/* Real-time Dynamic Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              {lang === 'en' ? 'Live Progress by Questions Answered' : 'வினாக்கள் பதில் முன்னேற்றம்'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-bold text-xs">
              {totalQuestions} / 120 {lang === 'en' ? 'questions' : 'வினாக்கள்'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {lang === 'en' ? 'Marks:' : 'மதிப்பெண்:'}{' '}
              <strong className="text-sky-950 font-mono text-sm">{totalCorrect}</strong> / {totalQuestions || 0}
            </span>
            <span className="font-mono font-extrabold text-sky-900 text-base">{progressPercent}%</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{lang === 'en' ? 'Initial Point: 0%' : 'தொடக்க நிலை: 0%'}</span>
          <span>
            {totalQuestions === 0
              ? (lang === 'en' ? 'Ready to begin – start any module to earn marks' : 'பயிற்சியைத் தொடங்கி மதிப்பெண்களைப் பெறுங்கள்')
              : `${lang === 'en' ? 'Accuracy:' : 'துல்லியம்:'} ${overallAccuracy}%`}
          </span>
          <span>{lang === 'en' ? 'Goal: 120 Questions (100%)' : 'இலக்கு: 120 வினாக்கள்'}</span>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">
            {lang === 'en' ? 'Modules Completed' : 'முடித்த பயிற்சிகள்'}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
            {totalSessions}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">
            {lang === 'en' ? 'Total Marks Scored' : 'பெற்ற மதிப்பெண்'}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-900">
            {totalCorrect}
            <span className="text-slate-400 text-sm font-normal"> / {totalQuestions > 0 ? totalQuestions : 120}</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">
            {lang === 'en' ? 'Overall Accuracy' : 'சராசரி சதவீதம்'}
          </span>
          <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${overallAccuracy >= 80 ? 'text-emerald-700' : 'text-slate-900'}`}>
            {overallAccuracy}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">
            {lang === 'en' ? 'Points Earned' : 'மொத்த புள்ளிகள்'}
          </span>
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-950">
              {totalPoints}
            </span>
          </div>
        </div>
      </div>

      {/* Backend Real-Time Dataset & Export Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4 border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>{lang === 'en' ? 'Live Web Dataset (/dataset)' : 'நேரலை இணைய தரவுத்தொகுப்பு (/dataset)'}</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'en' ? 'Live Web Dataset & Real-Time Export' : 'நேரலை இணைய தரவுத்தொகுப்பு & பதிவிறக்கம்'}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'en'
                ? 'Every completed module quiz is dynamically recorded into the Live Web Dataset. You can view the full dataset online at /dataset or download it directly as Excel (.xlsx), CSV (.csv), or JSON.'
                : 'ஒவ்வொரு நிறைவு செய்யப்பட்ட பயிற்சியும் நேரலை இணைய தரவுத்தொகுப்பில் உடனடியாகப் பதிவு செய்யப்படுகிறது. இதனை /dataset பக்கத்தில் பார்க்கலாம் அல்லது எக்செல்/சிஎஸ்வி வடிவில் பதிவிறக்கலாம்.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:self-center shrink-0">
            <a
              href="/dataset"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>{lang === 'en' ? 'Open Live Web Dataset (/dataset)' : 'நேரலை தரவுத்தளம் (/dataset)'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>

            <a
              href="/api/download/excel"
              download="live_web_dataset.xlsx"
              onClick={() => sound.playSuccess()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === 'en' ? 'Download Excel (.xlsx)' : 'எக்செல் பதிவிறக்கு (.xlsx)'}</span>
            </a>

            <a
              href="/api/download/csv"
              download="live_web_dataset.csv"
              onClick={() => sound.playSuccess()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'en' ? 'Download CSV (.csv)' : 'சிஎஸ்வி பதிவிறக்கு (.csv)'}</span>
            </a>

            <button
              onClick={handleToggleBackendViewer}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-sky-400" />
              <span>{showBackendTable ? (lang === 'en' ? 'Close Table' : 'அட்டவணையை மூடு') : (lang === 'en' ? 'Inspect Table' : 'அட்டவணையைத் திற')}</span>
            </button>
          </div>
        </div>

        {/* In-app Table Inspector */}
        {showBackendTable && (
          <div className="pt-4 border-t border-slate-700 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {lang === 'en' ? 'Live Backend Records:' : 'பின்னணி பதிவுகள்:'}{' '}
                <strong className="text-white">{backendRecords.length}</strong>
              </span>
              <button
                onClick={fetchBackendRecords}
                disabled={isLoadingBackend}
                className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBackend ? 'animate-spin' : ''}`} />
                <span>{lang === 'en' ? 'Refresh' : 'புதுப்பி'}</span>
              </button>
            </div>

            <div className="overflow-x-auto max-h-72 rounded-xl border border-slate-700 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-300 sticky top-0 border-b border-slate-700">
                  <tr>
                    <th className="p-2.5 font-semibold">Session ID</th>
                    <th className="p-2.5 font-semibold">Date & Time</th>
                    <th className="p-2.5 font-semibold">Learner Name</th>
                    <th className="p-2.5 font-semibold">Age</th>
                    <th className="p-2.5 font-semibold">Module</th>
                    <th className="p-2.5 font-semibold">Marks</th>
                    <th className="p-2.5 font-semibold">Accuracy</th>
                    <th className="p-2.5 font-semibold">Points</th>
                    <th className="p-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {backendRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-slate-400">
                        {isLoadingBackend
                          ? (lang === 'en' ? 'Loading backend records...' : 'ஏற்றப்படுகிறது...')
                          : (lang === 'en' ? 'No records stored in backend yet. Complete any module to record data.' : 'பதிவுகள் எதுவும் இல்லை.')}
                      </td>
                    </tr>
                  ) : (
                    backendRecords.map((r, i) => (
                      <tr key={r.id || i} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-2.5 font-mono text-[11px] text-slate-400">{r.id}</td>
                        <td className="p-2.5 text-slate-300">{new Date(r.timestamp).toLocaleDateString()}</td>
                        <td className="p-2.5 font-semibold text-white">{r.studentName}</td>
                        <td className="p-2.5 text-slate-300">{r.age !== undefined ? r.age : 'N/A'}</td>
                        <td className="p-2.5 text-sky-300 font-medium">{r.moduleTitle}</td>
                        <td className="p-2.5 font-mono font-bold text-white">{r.score} / {r.totalQuestions}</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-400">{r.percentage}%</td>
                        <td className="p-2.5 font-mono text-amber-300">{r.points || r.score * 10}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.passed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {r.passed ? 'PASS' : 'RETRY'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Module Mastery Breakdown' : 'பிரிவுவாரியான தேர்ச்சி'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">6 Modules (20 Questions each)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modules.map(mod => {
            const modSessions = sessions.filter(s => s.moduleId === mod.id);
            const modQuestions = modSessions.reduce((acc, s) => acc + s.totalQuestions, 0);
            const modCorrect = modSessions.reduce((acc, s) => acc + s.score, 0);
            const pct = modQuestions > 0 ? Math.round((modCorrect / modQuestions) * 100) : null;

            return (
              <div key={mod.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-start justify-between gap-2 text-xs">
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm">{mod.title[lang]}</h4>
                    <span className="text-slate-500 text-[11px]">{mod.subtitle[lang]}</span>
                  </div>
                  <span className="font-mono font-bold text-sky-950 shrink-0 text-sm">
                    {pct !== null ? `${pct}%` : (lang === 'en' ? '0%' : '0%')}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (pct || 0) >= 80 ? 'bg-emerald-600' : 'bg-sky-600'
                    }`}
                    style={{ width: `${pct || 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    {modQuestions > 0
                      ? `${modCorrect}/${modQuestions} ${lang === 'en' ? 'marks' : 'மதிப்பெண்'}`
                      : `${mod.questions.length} ${lang === 'en' ? 'questions available' : 'வினாக்கள் உள்ளன'}`}
                  </span>
                  {onStartModule && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onStartModule(mod);
                      }}
                      className="text-sky-700 hover:text-sky-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{pct !== null ? (lang === 'en' ? 'Retake' : 'மீண்டும் செய்') : (lang === 'en' ? 'Start' : 'தொடங்கு')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Certifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Safety Certifications Earned' : 'பெற்ற சான்றிதழ்கள்'}
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {sessions.filter(s => s.passed).length} {lang === 'en' ? 'unlocked' : 'பெறப்பட்டது'}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="max-w-md mx-auto">
              {lang === 'en'
                ? 'Your session started at 0. Answer module questions with 80% or higher to unlock official competency certificates.'
                : 'உங்கள் பயிற்சி 0-ல் தொடங்கியது. 80% அல்லது அதற்கு மேல் மதிப்பெண் பெற்று சான்றிதழ்களைத் திறக்கவும்.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{s.moduleTitle}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      s.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.passed ? (lang === 'en' ? 'PASSED' : 'தேர்ச்சி') : (lang === 'en' ? 'RETRY' : 'மீண்டும் செய்')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span>
                      {lang === 'en' ? 'Learner:' : 'பெயர்:'} <strong>{s.studentName}</strong>
                      {s.age !== undefined && <span> ({s.age} yrs)</span>}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-sky-950 font-bold">
                      {s.score} / {s.totalQuestions} ({s.percentage}%)
                    </span>
                    <span>·</span>
                    <span>{new Date(s.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {s.passed && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onViewCertificate(s);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'View Certificate' : 'சான்றிதழ்'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
