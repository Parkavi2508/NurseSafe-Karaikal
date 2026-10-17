import { SafetyModule, WasteItem, PPEStep, PEPStep, ClinicalQuestion } from '../types/clinical';
import { generateQuestionsForModule } from './questionBank';

// Define the 6 core modules
export const CLINICAL_MODULES: SafetyModule[] = [
  {
    id: 'hand_hygiene',
    category: 'infection_control',
    icon: 'Sparkles',
    title: {
      en: 'WHO Hand Hygiene Lab',
      ta: 'WHO கை சுகாதாரம்'
    },
    subtitle: {
      en: '5 Moments, Spores & Friction Techniques',
      ta: '5 தருணங்கள் & கைகழுவும் முறை'
    },
    description: {
      en: '20 high-yield clinical scenarios on WHO 5 moments, rub vs wash, and spore decontamination.',
      ta: 'WHO 5 தருணங்கள் மற்றும் தொற்று தடுப்புக்கான 20 மருத்துவ சூழ்நிலைப் பயிற்சிகள்.'
    },
    estimatedMinutes: 8,
    questions: generateQuestionsForModule('hand_hygiene')
  },
  {
    id: 'ppe_safety',
    category: 'infection_control',
    icon: 'Shield',
    title: {
      en: 'PPE Donning & Doffing Sequence',
      ta: 'பாதுகாப்பு உடைகள் (PPE)'
    },
    subtitle: {
      en: 'CDC Sequence, N95 Seal & Barrier Care',
      ta: 'CDC வரிசை, N95 முகக்கவசம் & சுய பாதுகாப்பு'
    },
    description: {
      en: '20 practical scenarios on wearing and removing PPE safely without self-contaminating.',
      ta: 'சுய தொற்று ஏற்படாமல் PPE உடைகளை சரியாக அணிந்து கழற்றுவதற்கான 20 பயிற்சிகள்.'
    },
    estimatedMinutes: 8,
    questions: generateQuestionsForModule('ppe_safety')
  },
  {
    id: 'sharps_safety',
    category: 'device_safety',
    icon: 'AlertTriangle',
    title: {
      en: 'Sharps Safety & Needle-Stick PEP',
      ta: 'ஊசி மற்றும் கூர்மையான கருவிகள்'
    },
    subtitle: {
      en: 'No-Recap Rule, 3/4 Limit & 2h Protocol',
      ta: 'ஊசியை மூடாதிருத்தல் & 2 மணி நேர அவசர முறை'
    },
    description: {
      en: '20 vital scenarios on puncture prevention, safe disposal, and rapid emergency exposure response.',
      ta: 'ஊசி குத்துக் காயங்களைத் தடுத்தல் மற்றும் அவசர முதலுதவிக்கான 20 பயிற்சிகள்.'
    },
    estimatedMinutes: 8,
    questions: generateQuestionsForModule('sharps_safety')
  },
  {
    id: 'patient_id',
    category: 'patient_rights',
    icon: 'UserCheck',
    title: {
      en: 'Patient Identification & Verification',
      ta: 'நோயாளி அடையாள சரிபார்ப்பு'
    },
    subtitle: {
      en: 'Two Identifiers, Non-Bed Rule & Alerts',
      ta: 'இரு அடையாளங்கள் & படுக்கை எண்ணை நம்பாதிருத்தல்'
    },
    description: {
      en: '20 real-world scenarios on zero-harm patient matching and wristband discrepancy handling.',
      ta: 'தவறான நோயாளிக்கு மருந்து செல்வதைத் தடுக்கும் 20 சூழ்நிலைப் பயிற்சிகள்.'
    },
    estimatedMinutes: 8,
    questions: generateQuestionsForModule('patient_id')
  },
  {
    id: 'bmw_segregation',
    category: 'infection_control',
    icon: 'Recycle',
    title: {
      en: 'Bio-Medical Waste Segregation (BMW 2016)',
      ta: 'மருத்துவக் கழிவுப் பிரிப்பு (BMW 2016)'
    },
    subtitle: {
      en: 'Yellow, Red, White & Blue 4-Bin Protocol',
      ta: 'மஞ்சள், சிவப்பு, வெள்ளை, நீல நிறத் தொட்டிகள்'
    },
    description: {
      en: '20 decision cases on separating infectious, plastic, sharp, and glass hospital waste.',
      ta: 'இந்திய கழிவு மேலாண்மை விதிகளின்படி 4 வண்ணத் தொட்டிகளில் பிரிக்கும் 20 பயிற்சிகள்.'
    },
    estimatedMinutes: 8,
    questions: generateQuestionsForModule('bmw_segregation')
  },
  {
    id: 'medication_safety',
    category: 'medication',
    icon: 'Pill',
    title: {
      en: 'Safe Medication Administration & 10 Rights',
      ta: 'பாதுகாப்பான மருந்தளிப்பு & 10 உரிமைகள்'
    },
    subtitle: {
      en: 'High-Alert Drugs, LASA, Dual-Checks & Dosing',
      ta: 'அதிமுக்கிய மருந்துகள், கணக்கீடு & இரு செவிலியர் சரிபார்ப்பு'
    },
    description: {
      en: '20 life-saving scenarios on insulin, heparin, IV potassium, pediatric math, and verbal read-back.',
      ta: 'இன்சுலின், ஹெபாரின், பொட்டாசியம் மற்றும் மருந்துப் பிழைகளைத் தவிர்க்கும் 20 மருத்துவப் பயிற்சிகள்.'
    },
    estimatedMinutes: 8,
    questions: generateQuestionsForModule('medication_safety')
  }
];

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'w1',
    name: {
      en: 'Blood-soaked cotton & pus gauze',
      ta: 'ரத்தம் மற்றும் சீழ் படிந்த பஞ்சு'
    },
    correctBin: 'yellow',
    explanation: {
      en: 'Yellow: Soiled biological waste for high-heat incineration.',
      ta: 'மஞ்சள் தொட்டி: எரிக்கப்பட வேண்டிய ரத்தம் படிந்த பஞ்சுக் கழிவுகள்.'
    },
    realLifeExample: {
      en: 'Incinerators reach 1100°C to destroy all viral pathogens in soiled cotton.',
      ta: '1100°C வெப்பத்தில் கிருமிகள் முழுமையாக எரிக்கப்படும்.'
    }
  },
  {
    id: 'w2',
    name: {
      en: 'Plastic syringe (needle removed)',
      ta: 'ஊசி அகற்றப்பட்ட பிளாஸ்டிக் சிரின்ஜ்'
    },
    correctBin: 'red',
    explanation: {
      en: 'Red: Recyclable plastic polymers for autoclaving and shredding.',
      ta: 'சிவப்பு தொட்டி: மறுசுழற்சி பிளாஸ்டிக் கழிவுகள்.'
    },
    realLifeExample: {
      en: 'Disinfected plastic is melted down into industrial pipes and buckets.',
      ta: 'கிருமி நீக்கப்பட்ட பிளாஸ்டிக் குழாய்களாக மறுசுழற்சி செய்யப்படும்.'
    }
  },
  {
    id: 'w3',
    name: {
      en: 'Metallic IV needle & scalpel blade',
      ta: 'கூர்மையான உலோக ஊசி மற்றும் கத்தி'
    },
    correctBin: 'white',
    explanation: {
      en: 'White translucent box: Puncture-proof container for sharp metal needles.',
      ta: 'வெள்ளை துளையாத தொட்டி: கூர்மையான ஊசிகள் மற்றும் உலோகக் கத்திகள்.'
    },
    realLifeExample: {
      en: 'Puncture-proof walls stop needles from stabbing waste collectors\' legs through plastic bags.',
      ta: 'துளையாத சுவர் ஊசிகள் குப்பை பையை கிழித்துக்கொண்டு வெளியே வராமல் தடுக்கும்.'
    }
  },
  {
    id: 'w4',
    name: {
      en: 'Glass medicine ampoule & injection vial',
      ta: 'கண்ணாடி மருந்துக் குப்பி மற்றும் பாட்டில்'
    },
    correctBin: 'blue',
    explanation: {
      en: 'Blue box: Broken and unbroken glassware and metal implants.',
      ta: 'நீலப் பெட்டி: கண்ணாடி பாட்டில்கள் மற்றும் உலோகப் பொருட்கள்.'
    },
    realLifeExample: {
      en: 'Glass is soaked in sodium hypochlorite disinfectant and recycled into new glassware.',
      ta: 'கண்ணாடிகள் கிருமி நீக்கப்பட்டு புதிய கண்ணாடியாக மாற்றப்படும்.'
    }
  },
  {
    id: 'w5',
    name: {
      en: 'Foley urinary catheter & urine bag',
      ta: 'சிறுநீர்க் குழாய் மற்றும் பிளாஸ்டிக் பை'
    },
    correctBin: 'red',
    explanation: {
      en: 'Red: Infected recyclable plastic catheter bags.',
      ta: 'சிவப்பு தொட்டி: மறுசுழற்சி சிறுநீர் பிளாஸ்டிக் பை.'
    },
    realLifeExample: {
      en: 'Urine is emptied into sanitary sewer first, then the plastic bag goes into Red.',
      ta: 'சிறுநீரை வெளியேற்றிவிட்டு பிளாஸ்டிக் பையை சிவப்புத் தொட்டியில் போட வேண்டும்.'
    }
  }
];

export const PPE_STEPS: PPEStep[] = [
  {
    id: 'don_1',
    order: 1,
    phase: 'donning',
    name: { en: '1. Hand Hygiene', ta: '1. கை சுகாதாரம்' },
    tip: { en: 'Sanitize before touching clean PPE', ta: 'சுத்தமான உடைகளைத் தொடும் முன் கைகழுவுதல்' },
    realLifeExample: { en: 'Stops skin bacteria from contaminating the sterile inside of your gown.', ta: 'கையிலுள்ள கிருமிகள் உடையில் ஒட்டுவதைத் தடுக்கிறது.' }
  },
  {
    id: 'don_2',
    order: 2,
    phase: 'donning',
    name: { en: '2. Isolation Gown', ta: '2. அங்கி (Gown)' },
    tip: { en: 'Cover body neck to knees and tie back', ta: 'கழுத்து முதல் முழங்கால் வரை மூடி கட்டுதல்' },
    realLifeExample: { en: 'Shields your uniform from projectile blood or fluids during CPR.', ta: 'ரத்தம் உங்கள் சீருடையில் படாமல் காக்கிறது.' }
  },
  {
    id: 'don_3',
    order: 3,
    phase: 'donning',
    name: { en: '3. Mask or N95', ta: '3. முகமூடி / N95' },
    tip: { en: 'Pinch nose bridge and check seal', ta: 'மூக்கில் அழுத்தி சீல் சோதனை செய்தல்' },
    realLifeExample: { en: 'Prevents breathing in cough droplets floating in the patient room.', ta: 'காற்றில் மிதக்கும் எச்சில் துகள்களை சுவாசிப்பதைத் தடுக்கிறது.' }
  },
  {
    id: 'don_4',
    order: 4,
    phase: 'donning',
    name: { en: '4. Eye Goggles / Face Shield', ta: '4. பாதுகாப்புக் கண்ணாடி' },
    tip: { en: 'Place over face and eyes', ta: 'கண்களை மறைக்கும்படி அணிதல்' },
    realLifeExample: { en: 'Stops arterial blood spurts from hitting your eye mucous membranes.', ta: 'ரத்தம் கண்களில் தெறித்து விழுவதைத் தடுக்கிறது.' }
  },
  {
    id: 'don_5',
    order: 5,
    phase: 'donning',
    name: { en: '5. Gloves', ta: '5. கையுறைகள்' },
    tip: { en: 'Pull cuffs over gown wrists', ta: 'அங்கியின் மணிக்கட்டை மூடி அணிதல்' },
    realLifeExample: { en: 'Leaves zero bare skin exposed to body secretions.', ta: 'மணிக்கட்டில் தோல் வெளிப்படாமல் பாதுகாக்கிறது.' }
  }
];

export const PEP_ALGORITHM: PEPStep[] = [
  {
    step: 1,
    title: { en: 'Sink First Aid: Wash with Soap & Water', ta: 'உடனடியாக சோப்பு நீரில் கழுவவும்' },
    instruction: {
      en: 'Wash puncture site gently with soap and running water for 2-3 minutes. Let blood flow naturally. Do NOT squeeze or suck the wound.',
      ta: 'காயத்தை சோப்பு மற்றும் ஓடும் நீரில் 2-3 நிமிடங்கள் கழுவவும். காயத்தை அழுத்தவோ வாயால் உறிஞ்சவோ கூடாது.'
    },
    realLifeExample: {
      en: 'Real-Life Ward Story: Squeezing creates negative pressure that acts like a syringe, pulling viral particles deeper into the puncture track. Gentle washing cleans the wound surface safely.',
      ta: 'உண்மை கதை: காயத்தை அழுத்தினால் அது சிரின்ஜ் போல செயல்பட்டு கிருமிகளை ரத்த ஓட்டத்திற்குள் இழுக்கும்; அழுத்தாமல் சோப்பில் கழுவுவதே சிறந்தது.'
    },
    warningNote: {
      en: 'Do NOT squeeze or apply bleach.',
      ta: 'காயத்தை அழுத்தவோ பிளீச்சிங் ஊற்றவோ கூடாது.'
    }
  },
  {
    step: 2,
    title: { en: 'Report to Ward Supervisor', ta: 'மேற்பார்வையாளரிடம் தெரிவிக்கவும்' },
    instruction: {
      en: 'Inform the ward in-charge immediately so another staff member can cover your patients.',
      ta: 'வார்டு தலைமை செவிலியரிடம் உடனே தகவல் தெரிவிக்கவும்.'
    },
    realLifeExample: {
      en: 'Real-Life Ward Story: Nurses who report immediately receive counseling and PEP within minutes instead of suffering anxiety alone.',
      ta: 'உடனடியாகத் தெரிவிக்கும் செவிலியர்களுக்கு நிமிடங்களில் ஆலோசனை மற்றும் மருந்துகள் கிடைக்கின்றன.'
    },
    warningNote: {
      en: 'Never hide an exposure out of fear.',
      ta: 'பயம் காரணமாக ஊசி குத்துக் காயத்தை ஒருபோதும் மறைக்கக் கூடாது.'
    }
  },
  {
    step: 3,
    title: { en: 'Start PEP Medication within 2 Hours', ta: '2 மணி நேரத்திற்குள் PEP மருந்து' },
    instruction: {
      en: 'Go to casualty or clinic. Take the 1st dose of HIV Post-Exposure Prophylaxis (PEP) immediately (golden window is <2 hours).',
      ta: 'அவசர சிகிச்சைப் பிரிவை அணுகி 2 மணி நேரத்திற்குள் முதல் HIV தடுப்பு மாத்திரையை (PEP) உட்கொள்ளவும்.'
    },
    realLifeExample: {
      en: 'Real-Life Ward Story: PEP antiretroviral drugs stop the HIV virus from integrating into human DNA. When started within 2 hours, protection is virtually 100% effective.',
      ta: '2 மணி நேரத்திற்குள் PEP மாத்திரை உட்கொண்டால் HIV கிருமி உடலில் கலப்பதைத் தடுத்து 100% பாதுகாப்பைத் தரும்.'
    },
    warningNote: {
      en: 'Efficacy drops after 72 hours.',
      ta: '72 மணி நேரத்திற்குப் பின் இதன் பலன் குறையும்.'
    }
  },
  {
    step: 4,
    title: { en: 'Check Hepatitis B Vaccine Status', ta: 'மஞ்சள் காமாலை தடுப்பூசி நிலை' },
    instruction: {
      en: 'Check your anti-HBs titer. If unimmunized, receive Hepatitis B Immunoglobulin (HBIG) + vaccine booster within 24-48 hours.',
      ta: 'ஹெபடைடிஸ் பி ஆன்டிபாடி அளவைச் சோதித்து தேவைப்பட்டால் 24-48 மணி நேரத்தில் HBIG ஊசி போடவும்.'
    },
    realLifeExample: {
      en: 'Real-Life Ward Story: Hepatitis B is 100 times more infectious than HIV. Vaccinated healthcare workers with titers > 10 mIU/mL are fully protected from needle sticks.',
      ta: 'மஞ்சள் காமாலை பரவும் வேகம் HIV-யை விட 100 மடங்கு அதிகம்; தடுப்பூசி போட்ட ஊழியர்கள் முழுப் பாதுகாப்போடு இருப்பார்கள்.'
    },
    warningNote: {
      en: 'Hepatitis B transmission risk is up to 30%.',
      ta: 'மஞ்சள் காமாலை பரவும் அபாயம் 30% வரை அதிகம்.'
    }
  },
  {
    step: 5,
    title: { en: 'Incident Log & 6-Week Follow-Up', ta: 'பதிவு செய்து பரிசோதனை செய்தல்' },
    instruction: {
      en: 'Log the incident in the hospital register and schedule confidential antibody follow-ups at 6 weeks, 3 months, and 6 months.',
      ta: 'விபத்துப் பதிவேட்டில் பதிவு செய்து 6 வாரங்கள் மற்றும் 3 மாதங்களில் ரத்தப் பரிசோதனை செய்யவும்.'
    },
    realLifeExample: {
      en: 'Real-Life Ward Story: Systematic follow-up ensures complete peace of mind and confirms you remain 100% infection-free.',
      ta: 'தொடர் பரிசோதனை நீங்கள் கிருமித் தொற்றின்றி ஆரோக்கியமாக இருப்பதை 100% உறுதி செய்யும்.'
    },
    warningNote: {
      en: 'All records remain strictly confidential.',
      ta: 'அனைத்து விவரங்களும் ரகசியமாகப் பாதுகாக்கப்படும்.'
    }
  }
];
