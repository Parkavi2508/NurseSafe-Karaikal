export type Language = 'en' | 'ta';

export interface LocalizedString {
  en: string;
  ta: string;
}

export interface QuestionOption {
  text: LocalizedString;
  isCorrect: boolean;
  explanation: LocalizedString;
}

export interface ClinicalQuestion {
  id: string;
  scenario: LocalizedString;
  question: LocalizedString;
  options: QuestionOption[];
  rationale: LocalizedString;
  realLifeExample: LocalizedString;
  conceptTag?: string;
}

export interface SafetyModule {
  id: string;
  category: 'infection_control' | 'device_safety' | 'medication' | 'patient_rights';
  icon: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  estimatedMinutes: number;
  image?: string;
  questions: ClinicalQuestion[];
}

export interface SessionResult {
  id: string;
  moduleId: string;
  moduleTitle: string;
  studentName: string;
  age?: number;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  uploadedInfo?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  points: number;
  maxStreak: number;
  timeSpentSeconds: number;
  wrongQuestionsList?: string;
  passed: boolean;
  timestamp: string;
}

export interface WasteItem {
  id: string;
  name: LocalizedString;
  correctBin: 'yellow' | 'red' | 'white' | 'blue';
  explanation: LocalizedString;
  realLifeExample: LocalizedString;
}

export interface PPEStep {
  id: string;
  name: LocalizedString;
  order: number;
  phase: 'donning' | 'doffing';
  tip: LocalizedString;
  realLifeExample: LocalizedString;
}

export interface PEPStep {
  step: number;
  title: LocalizedString;
  instruction: LocalizedString;
  realLifeExample: LocalizedString;
  warningNote: LocalizedString;
}
