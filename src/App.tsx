import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import { SafetyModule, SessionResult, Language } from './types/clinical';
import { CLINICAL_MODULES } from './data/clinicalData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ModuleList } from './components/ModuleList';
import { QuizSimulator } from './components/QuizSimulator';
import { ToolsSandbox } from './components/ToolsSandbox';
import { EmergencyPEPGuide } from './components/EmergencyPEPGuide';
import { Dashboard } from './components/Dashboard';
import { CertificateModal } from './components/CertificateModal';
import { Footer } from './components/Footer';
import { sound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'modules' | 'tools' | 'pep' | 'dashboard'>('home');
  const [modules, setModules] = useState<SafetyModule[]>(CLINICAL_MODULES);
  
  // Marks and progress start cleanly from 0 on every refresh as requested
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [liveTotalAnswered, setLiveTotalAnswered] = useState(0);
  const [liveCorrectMarks, setLiveCorrectMarks] = useState(0);
  const [livePoints, setLivePoints] = useState(0);

  const [activeModule, setActiveModule] = useState<SafetyModule | null>(null);
  const [certificateSession, setCertificateSession] = useState<SessionResult | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Synchronize permanent assessment records in real-time from Google Cloud Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'clinical_sessions'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded: SessionResult[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as SessionResult;
          loaded.push(data);
        });
        loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (loaded.length > 0) {
          setSessions(loaded);
        }
      }, (err) => {
        console.warn('Firestore real-time sync notice:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore initialization notice:', e);
    }
  }, []);

  // Calculate live cumulative marks and progress across questions answered
  const sessionAnswered = sessions.reduce((acc, s) => acc + s.totalQuestions, 0);
  const sessionMarks = sessions.reduce((acc, s) => acc + s.score, 0);
  const sessionPointsEarned = sessions.reduce((acc, s) => acc + (s.points || s.score * 10), 0);

  const totalAnswered = Math.max(liveTotalAnswered, sessionAnswered);
  const totalMarks = Math.max(liveCorrectMarks, sessionMarks);
  const totalPoints = Math.max(livePoints, sessionPointsEarned);
  // Total of 120 questions across 6 units (20 questions each)
  const progressPercent = Math.min(100, Math.round((totalAnswered / 120) * 100));

  const handleStartModule = (mod: SafetyModule) => {
    sound.playClick();
    setActiveModule(mod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitQuiz = () => {
    sound.playClick();
    setActiveModule(null);
  };

  // Live real-time question answering: marks and progress increase question by question
  const handleAnswerQuestion = (isCorrect: boolean, pointsEarned: number) => {
    setLiveTotalAnswered(prev => prev + 1);
    if (isCorrect) {
      setLiveCorrectMarks(prev => prev + 1);
    }
    setLivePoints(prev => prev + pointsEarned);
  };

  const handleSessionCompleted = (newSession: SessionResult) => {
    setSessions(prev => [newSession, ...prev]);
  };


  const handleToggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) {
      sound.playSuccess();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-200">
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          sound.playClick();
          setActiveModule(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        onToggleLang={newLang => setLang(newLang)}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        totalMarks={totalMarks}
        totalAnswered={totalAnswered}
        progressPercent={progressPercent}
      />

      <main className="flex-1">
        {/* If a scenario quiz is active, render simulator exclusively */}
        {activeModule ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <QuizSimulator
              module={activeModule}
              lang={lang}
              onExit={handleExitQuiz}
              onSessionCompleted={handleSessionCompleted}
              onViewCertificate={sess => setCertificateSession(sess)}
              onAnswerQuestion={handleAnswerQuestion}
            />
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <div className="space-y-12 sm:space-y-16">
                <HeroSection
                  lang={lang}
                  onExploreModules={() => {
                    setCurrentTab('modules');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onLaunchSimulators={() => {
                    setCurrentTab('tools');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenPEP={() => {
                    setCurrentTab('pep');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Curated Module Preview */}
                  <ModuleList
                    modules={modules}
                    lang={lang}
                    onStartModule={handleStartModule}
                  />
                </div>
              </div>
            )}

            {currentTab === 'modules' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <ModuleList
                  modules={modules}
                  lang={lang}
                  onStartModule={handleStartModule}
                />
              </div>
            )}

            {currentTab === 'tools' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <ToolsSandbox lang={lang} />
              </div>
            )}

            {currentTab === 'pep' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <EmergencyPEPGuide lang={lang} />
              </div>
            )}

            {currentTab === 'dashboard' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <Dashboard
                  sessions={sessions}
                  modules={modules}
                  lang={lang}
                  onViewCertificate={sess => setCertificateSession(sess)}
                  onRefreshSessions={() => {}}
                  liveTotalAnswered={totalAnswered}
                  liveCorrectMarks={totalMarks}
                  livePoints={totalPoints}
                  onStartModule={handleStartModule}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer lang={lang} />

      {/* Certificate Modal */}
      <CertificateModal
        session={certificateSession}
        lang={lang}
        onClose={() => setCertificateSession(null)}
      />
    </div>
  );
}
