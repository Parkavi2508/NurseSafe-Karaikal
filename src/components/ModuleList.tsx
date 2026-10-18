import React, { useState } from 'react';
import { SafetyModule, Language } from '../types/clinical';
import { Clock, Sparkles, Shield, AlertTriangle, UserCheck, Recycle, Pill, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

const heroImg = '/images/hero_clinical_lab_simulation_1792165717929.jpg';
const ppeImg = '/images/clinical_ppe_safety_1792165733681.jpg';
const sharpsImg = '/images/clinical_sharps_safety_1792165752556.jpg';
const patientIdImg = '/images/clinical_patient_id_1792165766885.jpg';

interface ModuleListProps {
  modules: SafetyModule[];
  lang: Language;
  onStartModule: (module: SafetyModule) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  lang,
  onStartModule,
}) => {
  const [filter, setFilter] = useState<'all' | 'infection_control' | 'device_safety' | 'medication' | 'patient_rights'>('all');

  const filteredModules = modules.filter(m => filter === 'all' || m.category === filter);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-sky-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'Recycle':
        return <Recycle className="w-5 h-5 text-teal-600" />;
      case 'Pill':
        return <Pill className="w-5 h-5 text-purple-600" />;
      default:
        return <Shield className="w-5 h-5 text-sky-600" />;
    }
  };

  const getModuleImage = (id: string) => {
    switch (id) {
      case 'ppe_safety':
        return ppeImg;
      case 'sharps_safety':
        return sharpsImg;
      case 'patient_id':
      case 'medication_safety':
        return patientIdImg;
      case 'hand_hygiene':
      default:
        return heroImg;
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {lang === 'en' ? 'Practice Modules' : 'பயிற்சி தொகுதிகள்'}
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            {lang === 'en'
              ? 'Choose a topic to test your clinical safety decisions.'
              : 'ஒரு தலைப்பைத் தேர்ந்தெடுத்து வினாக்களுக்கு பதிலளியுங்கள்.'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setFilter('all');
            }}
            className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'All' : 'அனைத்தும்'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilter('infection_control');
            }}
            className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'infection_control' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Infection' : 'தொற்று தடுப்பு'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilter('device_safety');
            }}
            className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'device_safety' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Sharps' : 'கூர்மையானவை'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilter('patient_rights');
            }}
            className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'patient_rights' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Patient ID' : 'அடையாளம்'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilter('medication');
            }}
            className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'medication' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Medication' : 'மருந்துகள்'}
          </button>
        </div>
      </div>

      {/* Clean Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
          >
            <div className="relative h-36 overflow-hidden bg-slate-100">
              <img
                src={getModuleImage(mod.id)}
                alt={mod.title[lang]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="font-semibold flex items-center gap-1.5">
                  {getModuleIcon(mod.icon)}
                  {mod.title[lang]}
                </span>
                <span className="text-slate-200 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  {mod.estimatedMinutes}m
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {mod.description[lang]}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                  <span>{mod.questions.length} questions</span>
                  <span>·</span>
                  <span>Pass mark 80%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onStartModule(mod);
                }}
                className="w-full py-2 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'en' ? 'Start Module' : 'தொடங்கு'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
