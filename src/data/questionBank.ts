import { ClinicalQuestion } from '../types/clinical.ts';

// Shuffles an array randomly using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Randomizes option order for every question so correct answers are evenly spread across A, B, C, D
export function randomizeQuestionOptions(questions: ClinicalQuestion[]): ClinicalQuestion[] {
  return questions.map(q => ({
    ...q,
    options: shuffleArray(q.options.map(opt => ({ ...opt })))
  }));
}

export function generateQuestionsForModule(moduleId: string): ClinicalQuestion[] {
  let list: ClinicalQuestion[] = [];
  switch (moduleId) {
    case 'hand_hygiene':
      list = HAND_HYGIENE_20;
      break;
    case 'ppe_safety':
      list = PPE_SAFETY_20;
      break;
    case 'sharps_safety':
      list = SHARPS_SAFETY_20;
      break;
    case 'patient_id':
      list = PATIENT_ID_20;
      break;
    case 'bmw_segregation':
      list = BMW_SEGREGATION_20;
      break;
    case 'medication_safety':
      list = MEDICATION_SAFETY_20;
      break;
    default:
      return [];
  }
  return randomizeQuestionOptions(list);
}

// -------------------------------------------------------------------------------------------------
// 1. HAND HYGIENE (20 QUESTIONS)
// -------------------------------------------------------------------------------------------------
const HAND_HYGIENE_20: ClinicalQuestion[] = [
  {
    id: 'hh_1',
    scenario: { en: 'You adjusted the IV pump rate on a bedside stand without touching the patient.', ta: 'படுக்கை அருகிலுள்ள IV பம்ப் அளவை மாற்றிய பின் அடுத்த நோயாளிக்கு செல்ல வேண்டும்.' },
    question: { en: 'Must you clean hands before moving to another patient?', ta: 'அடுத்த நோயாளிக்குச் செல்லும் முன் கை கழுவ வேண்டுமா?' },
    options: [
      { text: { en: 'Yes, sanitize with alcohol rub or soap (WHO Moment 5)', ta: 'ஆம், சானிடைசர் அல்லது சோப்பால் கைகழுவ வேண்டும் (தருணம் 5)' }, isCorrect: true, explanation: { en: 'Bedside equipment holds bacteria transferred from the patient zone.', ta: 'படுக்கை உபகரணங்களில் கிருமிகள் இருக்கும்.' } },
      { text: { en: 'No, because you did not touch bodily fluids', ta: 'இல்லை, திரவங்களை தொடாததால் தேவையில்லை' }, isCorrect: false, explanation: { en: 'Inanimate surfaces transmit MRSA and other hospital pathogens.', ta: 'பொருட்கள் வழியாகவும் பாக்டீரியா பரவும்.' } },
      { text: { en: 'Only wipe hands on your uniform', ta: 'சீருடையில் துடைத்தால் போதும்' }, isCorrect: false, explanation: { en: 'Uniforms spread hospital germs to clean areas.', ta: 'சீருடை கிருமிகளைப் பரப்பும்.' } }
    ],
    rationale: { en: 'WHO Moment 5 mandates hand hygiene after touching patient surroundings.', ta: 'WHO தருணம் 5: நோயாளி சுற்றுப்புறத்தைத் தொட்ட பின் கை சுகாதாரம் கட்டாயம்.' },
    realLifeExample: { en: 'An ICU nurse pressed an IV screen and immediately gave pills to Bed 5; resistant Acinetobacter on the screen infected the catheter.', ta: 'படுக்கை 4-ன் IV திரையைத் தொட்டுவிட்டு படுக்கை 5 நோயாளியைத் தொட்டதால் கிருமி தொற்று ஏற்பட்டு காய்ச்சல் உண்டானது.' }
  },
  {
    id: 'hh_2',
    scenario: { en: 'You cleaned your hands, but then opened a bedside drawer to find extra adhesive tape.', ta: 'கைகழுவிய பின், டேப் எடுக்க வார்டு டிராயரைத் திறந்து தொடுகிறீர்கள்.' },
    question: { en: 'What must you do before inserting the IV catheter?', ta: 'நரம்பு ஊசி போடுவதற்கு முன் என்ன செய்ய வேண்டும்?' },
    options: [
      { text: { en: 'Sanitize hands again before touching the sterile site (WHO Moment 2)', ta: 'ஊசி போடும் முன் மீண்டும் கைகளை சுத்தம் செய்ய வேண்டும் (தருணம் 2)' }, isCorrect: true, explanation: { en: 'Touching drawer handles breaks aseptic cleanliness.', ta: 'டிராயர் கைப்பிடி அசெப்டிக் தூய்மையைக் கெடுத்துவிடும்.' } },
      { text: { en: 'Blow on your fingers to dry and insert immediately', ta: 'விரல்களில் ஊதிவிட்டு ஊசி போடுவது' }, isCorrect: false, explanation: { en: 'Blowing deposits millions of mouth bacteria on your skin.', ta: 'வாயால் ஊதுவது வாயிலுள்ள கிருமிகளை கைகளில் சேர்க்கும்.' } },
      { text: { en: 'Proceed without sanitizing because the tape is brand new', ta: 'டேப் புதியதாக இருப்பதால் உடனே ஊசி போடுவது' }, isCorrect: false, explanation: { en: 'Your fingers touched the dirty handle.', ta: 'விரல்கள் அசுத்தமான கைப்பிடியைத் தொட்டுவிட்டன.' } }
    ],
    rationale: { en: 'Aseptic procedures require clean hands right before skin entry.', ta: 'ஊசி போடும் முன் முழுமையான அசெப்டிக் தூய்மை அவசியம்.' },
    realLifeExample: { en: 'A nurse touched a drawer handle before vein puncture; the patient developed phlebitis from skin bacteria entering the vein.', ta: 'டிராயரைத் தொட்ட பின் கைகழுவாமல் ஊசி போட்டதால் நரம்பில் கடுமையான வீக்கம் ஏற்பட்டது.' }
  },
  {
    id: 'hh_3',
    scenario: { en: 'You just emptied a bedpan for a patient with Clostridioides difficile diarrhea.', ta: 'வயிற்றுப்போக்கு நோயாளியின் கழிவுப் பாத்திரத்தை அகற்றிவிட்டீர்கள்.' },
    question: { en: 'Which hand cleaning method is strictly required?', ta: 'எந்த முறை கட்டாயமாகப் பயன்படுத்தப்பட வேண்டும்?' },
    options: [
      { text: { en: 'Wash thoroughly with soap and running water (40-60s)', ta: 'சோப்பு மற்றும் ஓடும் நீரில் கைகழுவுதல் (40-60 விநாடிகள்)' }, isCorrect: true, explanation: { en: 'Soap and water physically rinse away bacterial spores; alcohol cannot kill spores.', ta: 'சோப்பும் ஓடும் நீருமே ஸ்போர்களை கழுவி வெளியேற்றும்; ஆல்கஹால் ஸ்போர்களைக் கொல்லாது.' } },
      { text: { en: 'Apply alcohol gel for 10 seconds', ta: 'ஆல்கஹால் ஜெல் 10 விநாடி தேய்ப்பது' }, isCorrect: false, explanation: { en: 'Alcohol has zero efficacy against C. difficile bacterial spores.', ta: 'ஆல்கஹால் பாக்டீரியா ஸ்போர்களை அழிக்காது.' } },
      { text: { en: 'Dry wipe with paper towels', ta: 'காகிதத் துண்டால் துடைப்பது' }, isCorrect: false, explanation: { en: 'Dry wiping smears spores everywhere.', ta: 'துடைப்பது கிருமிகளை மேலும் பரப்பும்.' } }
    ],
    rationale: { en: 'Spore-forming bacteria require mechanical friction and soap rinse.', ta: 'ஸ்போர்களை அழிக்க சோப்பு மற்றும் ஓடும் நீரே ஒரே வழி.' },
    realLifeExample: { en: 'Using hand sanitizer instead of soap during a ward outbreak caused C. diff diarrhea to spread to 8 post-op patients in 72 hours.', ta: 'சோப்புக்குப் பதில் சானிடைசர் பயன்படுத்தியதால் 8 நோயாளிகளுக்கு தொற்று பரவியது.' }
  },
  {
    id: 'hh_4',
    scenario: { en: 'You are using alcohol hand rub between routine patient assessments.', ta: 'ஆல்கஹால் சானிடைசர் பயன்படுத்துகிறீர்கள்.' },
    question: { en: 'What is the correct duration to rub hands until dry?', ta: 'எத்தனை விநாடிகள் உலரும் வரை தேய்க்க வேண்டும்?' },
    options: [
      { text: { en: '20 to 30 seconds covering all surfaces until completely air-dry', ta: '20 முதல் 30 விநாடிகள் உலரும் வரை அனைத்து பகுதிகளிலும் தேய்க்க வேண்டும்' }, isCorrect: true, explanation: { en: 'Alcohol needs 20-30s of contact time to destroy viral envelopes and bacterial membranes.', ta: 'கிருமிகள் அழிய 20-30 விநாடிகள் அவசியம்.' } },
      { text: { en: '5 seconds, then flap hands to dry quickly', ta: '5 விநாடிகள் தேய்த்துவிட்டு காற்றில் ஆட்டுவது' }, isCorrect: false, explanation: { en: 'Flapping re-contaminates skin with room air turbulence.', ta: 'காற்றில் ஆட்டுவது கிருமிகளை மீண்டும் சேர்க்கும்.' } },
      { text: { en: 'Wipe hands on trousers immediately', ta: 'உடையில் உடனே துடைப்பது' }, isCorrect: false, explanation: { en: 'Wiping strips the disinfectant before it can kill microbes.', ta: 'துடைப்பது கிருமிநாசினியை அகற்றிவிடும்.' } }
    ],
    rationale: { en: 'Rubbing until fully dry ensures microbicidal efficacy.', ta: 'முழுமையாக உலரும் வரை தேய்ப்பதே கிருமிகளை அழிக்கும்.' },
    realLifeExample: { en: 'A student rubbed for only 4 seconds and touched a neonatal incubator; bacteria survived on the damp fingers and colonized the infant.', ta: '4 விநாடி மட்டுமே தேய்த்துவிட்டு குழந்தையைத் தொட்டதால் கிருமி தொற்று பரவியது.' }
  },
  {
    id: 'hh_5',
    scenario: { en: 'You are about to shake hands and interview a new conscious patient.', ta: 'புதிய நோயாளிக்கு உடல் பரிசோதனை செய்ய அணுகுகிறீர்கள்.' },
    question: { en: 'Which WHO moment applies before touching the patient?', ta: 'எந்த WHO தருணம் பொருந்தும்?' },
    options: [
      { text: { en: 'Moment 1: Before touching a patient', ta: 'தருணம் 1: நோயாளியைத் தொடும் முன்' }, isCorrect: true, explanation: { en: 'Protects the patient from microbes on healthcare worker hands.', ta: 'நோயாளிக்கு ஊழியரின் கைகளிலுள்ள கிருமிகள் பரவாமல் காக்கும்.' } },
      { text: { en: 'Moment 4: After touching surroundings', ta: 'தருணம் 4' }, isCorrect: false, explanation: { en: 'Moment 1 applies prior to initial contact.', ta: 'முதல் தொடர்பிற்கு முன் தருணம் 1 பொருந்தும்.' } },
      { text: { en: 'No moment needed for simple handshakes', ta: 'கைகுலுக்க தேவை இல்லை' }, isCorrect: false, explanation: { en: 'Handshakes transfer skin colonization directly.', ta: 'கைகுலுக்குவதும் கிருமிகளைப் பரப்பும்.' } }
    ],
    rationale: { en: 'Always sanitize before touching a patient to keep their environment clean.', ta: 'நோயாளியைத் தொடும் முன் கைகளை சுத்தம் செய்வது அவசியம்.' },
    realLifeExample: { en: 'Cleaning hands before palpating an elderly patient prevented transferring hospital MRSA to their fragile skin.', ta: 'பரிசோதனைக்கு முன் கைகழுவுவது முதியவர்களுக்கு கிருமி பரவாமல் காக்கும்.' }
  },
  {
    id: 'hh_6',
    scenario: { en: 'You removed sterile surgical gloves after completing wound irrigation.', ta: 'காயம் கழுவிய பின் ஸ்டெரைல் கையுறையைக் கழற்றிவிட்டீர்கள்.' },
    question: { en: 'Is hand hygiene required immediately after taking off gloves?', ta: 'கையுறை கழற்றிய பின் கை சுகாதாரம் செய்ய வேண்டுமா?' },
    options: [
      { text: { en: 'Yes, hand hygiene is mandatory right after glove removal', ta: 'ஆம், கையுறை கழற்றிய உடனே கை சுகாதாரம் கட்டாயம்' }, isCorrect: true, explanation: { en: 'Gloves develop microscopic pinholes, and removing them contaminates skin with glove exteriors.', ta: 'கையுறை கழற்றும்போது கைகளில் கிருமி பட வாய்ப்புள்ளது.' } },
      { text: { en: 'No, because gloves formed an airtight barrier', ta: 'இல்லை, கையுறை பாதுகாப்பு தந்தது' }, isCorrect: false, explanation: { en: 'Up to 30% of medical gloves leak micro-fluids during use.', ta: '30% கையுறைகளில் கண்ணுக்குத் தெரியாத துளைகள் வழியே திரவம் கசியலாம்.' } },
      { text: { en: 'Only if blood leaked visibly onto fingers', ta: 'ரத்தம் பட்டிருந்தால் மட்டும்' }, isCorrect: false, explanation: { en: 'Microscopic bacteria leak through even with no visible blood.', ta: 'ரத்தம் தெரியாவிட்டாலும் கிருமிகள் கசியும்.' } }
    ],
    rationale: { en: 'Gloves do not replace hand hygiene; always clean hands upon removal.', ta: 'கையுறை கழற்றிய பின் எப்போதும் கைகழுவ வேண்டும்.' },
    realLifeExample: { en: 'A nurse removed intact-looking gloves and ate an apple without washing; viral rotavirus on the glove rim caused severe gastroenteritis.', ta: 'கையுறை கழற்றிய பின் கைகழுவாமல் உணவு உண்டதால் வாந்தி பேதி ஏற்பட்டது.' }
  },
  {
    id: 'hh_7',
    scenario: { en: 'A staff nurse wears artificial acrylic nails and two gold rings on duty.', ta: 'செவிலியர் செயற்கை நகங்கள் மற்றும் மோதிரங்கள் அணிந்துள்ளார்.' },
    question: { en: 'Why are artificial nails banned in clinical areas?', ta: 'செயற்கை நகங்கள் ஏன் மருத்துவமனைகளில் தடை செய்யப்பட்டுள்ளன?' },
    options: [
      { text: { en: 'They trap Gram-negative bacteria and fungal yeast that sanitizers cannot penetrate', ta: 'அவற்றின் கீழ் பாக்டீரியா மற்றும் பூஞ்சைகள் தங்கி அழியாமல் வாழும்' }, isCorrect: true, explanation: { en: 'Subungual spaces under artificial nails harbor Pseudomonas and Candida outbreaks.', ta: 'நகங்களின் கீழ் ஆபத்தான கிருமிகள் தங்கும்.' } },
      { text: { en: 'They make typing on computers too loud', ta: 'கம்ப்யூட்டரில் சத்தம் போடும்' }, isCorrect: false, explanation: { en: 'The hazard is pathogen harboring, not noise.', ta: 'தொற்று ஆபத்தே முதன்மைக் காரணம்.' } },
      { text: { en: 'They rip gloves during hand washing only', ta: 'கைகழுவும்போது கிழியும்' }, isCorrect: false, explanation: { en: 'Microbial colonization under the nail is the main risk.', ta: 'கிருமி தங்குவதே ஆபத்தானது.' } }
    ],
    rationale: { en: 'Keep natural nails short (<0.5 cm) and free from artificial enhancements.', ta: 'நகங்களை சிறியதாக வைத்து செயற்கை நகங்களைத் தவிர்க்கவும்.' },
    realLifeExample: { en: 'A neonatal ICU outbreak of Pseudomonas was traced to artificial nails worn by two nurses, causing severe infections in 12 preemies.', ta: 'செயற்கை நகங்கள் காரணமாக 12 பச்சிளம் குழந்தைகளுக்கு கடுமையான நுரையீரல் தொற்று ஏற்பட்டது.' }
  },
  {
    id: 'hh_8',
    scenario: { en: 'Your hands are visibly stained with yellow sputum after tracheal suctioning.', ta: 'சுவாசக் குழாய் சளி எடுத்த பின் கைகளில் வெளிப்படையாக சளி ஒட்டியுள்ளது.' },
    question: { en: 'Can alcohol hand rub be used when hands are visibly soiled?', ta: 'வெளிப்படையாக அழுக்கு இருக்கும்போது ஆல்கஹால் ரப் பயன்படுத்தலாமா?' },
    options: [
      { text: { en: 'No, visibly soiled hands MUST be washed with soap and running water', ta: 'இல்லை, வெளிப்படையான அழுக்கு இருந்தால் கட்டாயம் சோப்பால் கழுவ வேண்டும்' }, isCorrect: true, explanation: { en: 'Organic proteins deactivate alcohol and block it from reaching bacteria underneath.', ta: 'சளி போன்ற அழுக்குகள் ஆல்கஹால் வேலை செய்வதைத் தடுக்கும்.' } },
      { text: { en: 'Yes, double the dose of alcohol sanitizer', ta: 'ஆம், இரு மடங்கு சானிடைசர் போடலாம்' }, isCorrect: false, explanation: { en: 'Sanitizer mixes with sputum into a sticky contaminated film.', ta: 'சானிடைசர் சளியோடு கலந்து மேலும் அழுக்காகும்.' } },
      { text: { en: 'Wipe with dry gauze first, then apply alcohol', ta: 'துடைத்துவிட்டு சானிடைசர் போடலாம்' }, isCorrect: false, explanation: { en: 'Physical water washing is needed to remove proteinaceous matter.', ta: 'சோப்பும் நீருமே புரத அழுக்கை அகற்றும்.' } }
    ],
    rationale: { en: 'Visible dirt, blood, or body fluid requires running water and soap.', ta: 'வெளிப்படையான அழுக்கிற்கு சோப்பு மற்றும் தண்ணீரே அவசியம்.' },
    realLifeExample: { en: 'Trying to rub sanitizer over blood splatters coagulated the protein onto the skin, trapping live hepatitis viruses beneath.', ta: 'ரத்தத்தின் மீது சானிடைசர் போட்டதால் கிருமிகள் தோலிலேயே ஒட்டிக்கொண்டன.' }
  },
  {
    id: 'hh_9',
    scenario: { en: 'You are performing standard 6-step hand washing at a ward sink.', ta: 'வாஷ்பேசினில் 6-படி கைகழுவும் முறை செய்கிறீர்கள்.' },
    question: { en: 'Which area of the hand is most frequently missed during quick washing?', ta: 'வேகமாக கைகழுவும் போது அடிக்கடி விடுபடும் பகுதி எது?' },
    options: [
      { text: { en: 'Thumbs, fingertips, and interdigital webbing', ta: 'கட்டைவிரல்கள், விரல் நுனிகள் மற்றும் விரலிடுக்குகள்' }, isCorrect: true, explanation: { en: 'Studies show 89% of missed bacteria reside on the thumbs and nail beds.', ta: '89% கிருமிகள் கட்டைவிரல் மற்றும் நக இடுக்குகளிலேயே தப்புகின்றன.' } },
      { text: { en: 'Center of the palms', ta: 'உள்ளங்கையின் மையம்' }, isCorrect: false, explanation: { en: 'Palms receive the most friction during routine rubbing.', ta: 'உள்ளங்கைகளில் எளிதில் சோப்பு பட்டுவிடும்.' } },
      { text: { en: 'Back of the wrists only', ta: 'மணிக்கட்டின் பின்புறம்' }, isCorrect: false, explanation: { en: 'Thumbs and fingertips are the primary missed zones.', ta: 'கட்டைவிரலும் விரல் நுனியுமே அதிகம் விடுபடுகின்றன.' } }
    ],
    rationale: { en: 'Rotate friction specifically around thumbs and rotational fingernails into opposite palms.', ta: 'கட்டைவிரல் மற்றும் விரல் நுனிகளை சுழற்றி தேய்க்க வேண்டும்.' },
    realLifeExample: { en: 'Fluorescent dye tests revealed unwashed bacteria on thumbs of 9 out of 10 nursing trainees who skipped the 6-step technique.', ta: 'சோதனையில் 10-ல் 9 பேரின் கட்டைவிரலில் கிருமிகள் கழுவப்படாமல் இருந்தது கண்டறியப்பட்டது.' }
  },
  {
    id: 'hh_10',
    scenario: { en: 'You just touched a urine drainage bag to check urine volume (Moment 3).', ta: 'சிறுநீர் பையைத் தொட்டு அளவைப் பார்த்தீர்கள்.' },
    question: { en: 'Why must you sanitize immediately even if no urine spilled?', ta: 'சிறுநீர் சிந்தாவிட்டாலும் உடனே ஏன் கைகழுவ வேண்டும்?' },
    options: [
      { text: { en: 'Urine drainage ports are heavily colonized with multi-drug resistant Klebsiella and E. coli', ta: 'சிறுநீர் பையின் வெளிப்புறத்தில் ஆபத்தான ஈ-கோலை பாக்டீரியாக்கள் இருக்கும்' }, isCorrect: true, explanation: { en: 'Moment 3: After body fluid exposure risk, even without visible spillage.', ta: 'தருணம் 3: உடல் கழிவுத் தொடர்பு ஏற்பட்டால் உடனே கைகழுவ வேண்டும்.' } },
      { text: { en: 'To keep hands smelling fresh only', ta: 'நறுமணத்திற்காக மட்டும்' }, isCorrect: false, explanation: { en: 'Pathogen transmission control is the objective.', ta: 'தொற்று பரவுவதைத் தடுப்பதே நோக்கம்.' } },
      { text: { en: 'It is optional if you used your pinky finger', ta: 'சுண்டு விரலால் தொட்டால் தேவையில்லை' }, isCorrect: false, explanation: { en: 'All fingers transfer bacteria equally.', ta: 'அனைத்து விரல்களும் கிருமிகளைப் பரப்பும்.' } }
    ],
    rationale: { en: 'Catheter bags harbor bacteria on outer ports that spread rapidly between ward beds.', ta: 'சிறுநீர் பையின் வெளிப்புற கிருமிகள் பிற படுக்கைகளுக்கு எளிதில் பரவும்.' },
    realLifeExample: { en: 'Touching a urine bag port transferred antibiotic-resistant E. coli to a clean dressing tray, causing a surgical site infection.', ta: 'சிறுநீர் பையைத் தொட்டுவிட்டு கட்டு தட்டைத் தொட்டதால் அறுவை சிகிச்சை புண்ணில் சீழ் பிடித்தது.' }
  },
  {
    id: 'hh_11',
    scenario: { en: 'You are drying hands with paper towels after washing with soap and water.', ta: 'கைகழுவிய பின் காகிதத் துண்டால் உலர்த்துகிறீர்கள்.' },
    question: { en: 'How should you turn off the non-automated manual water tap?', ta: 'கையால் திருப்பும் குழாயை எவ்வாறு மூட வேண்டும்?' },
    options: [
      { text: { en: 'Use the paper towel you dried with to turn off the tap handle', ta: 'கையைத் துடைத்த காகிதத் துண்டைப் பயன்படுத்தி குழாயை மூட வேண்டும்' }, isCorrect: true, explanation: { en: 'Touching the wet faucet handle with clean wet hands immediately re-contaminates your skin with sink bacteria.', ta: 'வெறும் கையால் குழாயைத் தொட்டால் மீண்டும் கிருமி ஒட்டிக்கொள்ளும்.' } },
      { text: { en: 'Touch the faucet directly with bare clean hands', ta: 'வெறும் கையால் நேராக மூடுவது' }, isCorrect: false, explanation: { en: 'Tap handles are covered in dirty tap water bacteria.', ta: 'குழாய் கைப்பிடியில் அதிக கிருமிகள் இருக்கும்.' } },
      { text: { en: 'Leave the tap running all shift long', ta: 'தண்ணீரை மூடாமல் விட்டுவிடுவது' }, isCorrect: false, explanation: { en: 'Wastes water and creates splashing hazards.', ta: 'தண்ணீர் வீணாகும் மற்றும் தெறிக்கும்.' } }
    ],
    rationale: { en: 'Protect clean hands by using the paper towel barrier when shutting off manual water handles.', ta: 'காகிதத் துண்டைப் பயன்படுத்தி குழாயை மூடுவது கைகளை சுத்தமாக வைத்திருக்கும்.' },
    realLifeExample: { en: 'Cultures taken from ward sink tap handles showed high Pseudomonas counts; turning taps off with paper towels keeps hands 100% sterile.', ta: 'குழாய் கைப்பிடியில் கிருமிகள் இருப்பது நிரூபிக்கப்பட்டுள்ளது; காகிதத்தால் மூடுவது பாதுகாப்பானது.' }
  },
  {
    id: 'hh_12',
    scenario: { en: 'Frequent hand washing causes dry, cracked skin on your knuckles.', ta: 'அடிக்கடி கைகழுவுவதால் தோலில் வெடிப்பு ஏற்படுகிறது.' },
    question: { en: 'Why is cracked skin dangerous in clinical practice?', ta: 'தோல் வெடிப்பு ஏன் மருத்துவப் பணியில் ஆபத்தானது?' },
    options: [
      { text: { en: 'Skin cracks create entry ports for bloodborne pathogens and harbor colonies of staphylococcus', ta: 'வெடிப்புகள் வழியாக ரத்தக் கிருமிகள் உங்கள் உடலினுள் நுழையும் மற்றும் பாக்டீரியாக்கள் தங்கும்' }, isCorrect: true, explanation: { en: 'Intact skin is your body’s primary defense; use hospital-approved moisturizers.', ta: 'முழுமையான தோலே முதல் பாதுகாப்பு; மாய்ஸ்சரைசர் பயன்படுத்த வேண்டும்.' } },
      { text: { en: 'It makes hand rubbing less cold', ta: 'குளிர்ச்சியைக் குறைக்கும்' }, isCorrect: false, explanation: { en: 'Broken skin integrity compromises occupational health.', ta: 'தோல் வெடிப்பு ஊழியரின் ஆரோக்கியத்தை பாதிக்கும்.' } },
      { text: { en: 'Cracked skin absorbs soap faster', ta: 'சோப்பை வேகமாக உறிஞ்சும்' }, isCorrect: false, explanation: { en: 'It leads to severe burning and dermatitis.', ta: 'தோலில் எரிச்சலையும் புண்களையும் உண்டாக்கும்.' } }
    ],
    rationale: { en: 'Maintain skin integrity using hospital lotion so hand hygiene can continue safely.', ta: 'தோலை ஆரோக்கியமாக பராமரிப்பது செவிலியரின் கடமை.' },
    realLifeExample: { en: 'A nurse with cracked knuckles contracted Hepatitis B through open micro-fissures during a patient blood spill.', ta: 'தோல் வெடிப்பு வழியாக ரத்தம் கசிந்து செவிலியருக்கு மஞ்சள் காமாலை பரவியது.' }
  },
  {
    id: 'hh_13',
    scenario: { en: 'Dispensing alcohol rub from a wall-mounted bottle.', ta: 'சுவரிலுள்ள பாட்டிலிலிருந்து சானிடைசர் எடுக்கிறீர்கள்.' },
    question: { en: 'How much volume of alcohol rub is typically required to cover both hands completely?', ta: 'இரு கைகளுக்கும் பொதுவாக எவ்வளவு அளவு தேவைப்படும்?' },
    options: [
      { text: { en: 'About 3 to 5 mL (a full palm cupped volume)', ta: 'சுமார் 3 முதல் 5 மி.லி (உள்ளங்கை நிறைய)' }, isCorrect: true, explanation: { en: 'Insufficient volume dries out in 5 seconds before covering all fingers.', ta: 'குறைவான அளவு எடுத்தால் 5 விநாடியில் உலர்ந்து முழுப் பாதுகாப்பு தராது.' } },
      { text: { en: 'A single pea-sized drop (0.5 mL)', ta: 'ஒரே ஒரு சிறிய துளி' }, isCorrect: false, explanation: { en: 'Too small to cover backs of hands and thumbs.', ta: 'கையின் பின்புறம் மற்றும் கட்டைவிரலுக்கு போதாது.' } },
      { text: { en: 'At least 50 mL half a bottle', ta: 'பாதி பாட்டில் 50 மி.லி' }, isCorrect: false, explanation: { en: 'Wasteful and runs onto floors causing slipping.', ta: 'தரையில்கொட்டி வழுக்கி விழச் செய்யும்.' } }
    ],
    rationale: { en: 'Use enough sanitizer to keep hands wet for the full 20-30 seconds.', ta: '20-30 விநாடிகள் ஈரமாக இருக்கும் அளவுக்கு போதுமான அளவு எடுக்க வேண்டும்.' },
    realLifeExample: { en: 'Using only a tiny drop left the nurse’s fingertips dry and unprotected, transferring MRSA to the next patient bed.', ta: 'சிறிய துளி மட்டுமே எடுத்ததால் விரல் நுனிகள் கிருமி நீக்கம் பெறாமல் போனது.' }
  },
  {
    id: 'hh_14',
    scenario: { en: 'Alcohol rub bottle is empty at the patient bedside.', ta: 'படுக்கை அருகிலுள்ள சானிடைசர் பாட்டில் காலியாக உள்ளது.' },
    question: { en: 'What should you do before touching the patient?', ta: 'நோயாளிக்கு சிகிச்சை அளிக்கும் முன் என்ன செய்ய வேண்டும்?' },
    options: [
      { text: { en: 'Walk to the nearest active dispenser or sink and perform hygiene, then alert staff to refill', ta: 'அருகிலுள்ள மற்றொரு பாட்டில் அல்லது வாஷ்பேசினில் கைகழுவிவிட்டு பாட்டிலை மாற்றச் சொல்ல வேண்டும்' }, isCorrect: true, explanation: { en: 'Never skip hand hygiene because a dispenser is empty.', ta: 'பாட்டில் காலியாக இருப்பதால் கைகழுவாமல் இருக்கக் கூடாது.' } },
      { text: { en: 'Skip it this time and wash hands at the end of shift', ta: 'இந்த முறை விட்டுவிட்டு பணி இறுதியில் கழுவுவது' }, isCorrect: false, explanation: { en: 'Skipping risks cross-infection immediately.', ta: 'உடனடியாக தொற்று பரவும் ஆபத்து உள்ளது.' } },
      { text: { en: 'Just blow on hands to clean them', ta: 'கைகளில் ஊதி சுத்தம் செய்வது' }, isCorrect: false, explanation: { en: 'Adds oral bacteria onto hands.', ta: 'கைகளில் வாய்க் கிருமிகள் கூடும்.' } }
    ],
    rationale: { en: 'Hand hygiene compliance cannot be postponed for missing supplies.', ta: 'பொருட்கள் இல்லை என்றாலும் மாற்று வழியில் கைகழுவ வேண்டும்.' },
    realLifeExample: { en: 'A student skipped sanitizing because the bottle was empty; the patient developed a wound infection requiring 10 days of IV antibiotics.', ta: 'பாட்டில் காலியாக இருந்ததால் கைகழுவாமல் விட்டதால் நோயாளிக்கு தொற்று ஏற்பட்டு 10 நாள் ஊசி போட வேண்டியதானது.' }
  },
  {
    id: 'hh_15',
    scenario: { en: 'Touching a patient’s intact shoulder to comfort them (Moment 1 & 4).', ta: 'நோயாளிக்கு ஆறுதல் கூற தோளைத் தொடுகிறீர்கள்.' },
    question: { en: 'Does touching clean, unbroken patient skin require hand hygiene afterward?', ta: 'காயம் இல்லாத தோலைத் தொட்ட பின் கைகழுவ வேண்டுமா?' },
    options: [
      { text: { en: 'Yes, Moment 4: After touching a patient', ta: 'ஆம், தருணம் 4: நோயாளியைத் தொட்ட பின்' }, isCorrect: true, explanation: { en: 'Normal skin flora sheds continuously and transfers onto staff fingers.', ta: 'தோலில் உள்ள இயல்பான கிருமிகள் செவிலியர் கைகளில் ஒட்டிக்கொள்ளும்.' } },
      { text: { en: 'No, unbroken skin is 100% sterile', ta: 'இல்லை, தோல் கிருமியற்றது' }, isCorrect: false, explanation: { en: 'Human skin is heavily populated with millions of bacteria per cm².', ta: 'தோலில் ஒரு சதுர செ.மீ-க்கு லட்சக்கணக்கான பாக்டீரியாக்கள் வாழ்கின்றன.' } },
      { text: { en: 'Only if the patient coughed directly on you', ta: 'இருமல் இருந்தால் மட்டும்' }, isCorrect: false, explanation: { en: 'Skin contact alone transfers colonization.', ta: 'தோல் தொட்டாலே கிருமி பரவும்.' } }
    ],
    rationale: { en: 'Clean hands protect subsequent patients from shedding skin organisms.', ta: 'ஒரு நோயாளியிடம் இருந்து மற்றவருக்கு கிருமி செல்லாமல் தடுக்க இது அவசியம்.' },
    realLifeExample: { en: 'A nurse comforted a patient colonized with VRE bacteria, then touched a wound dressing without washing, introducing VRE into the surgical site.', ta: 'ஒரு நோயாளியைத் தொட்டுவிட்டு கைகழுவாமல் அடுத்தவருக்கு கட்டுப்போட்டதால் கிருமி தொற்று பரவியது.' }
  },
  {
    id: 'hh_16',
    scenario: { en: 'Working in a neonatal intensive care unit (NICU).', ta: 'பச்சிளம் குழந்தை தீவிர சிகிச்சை பிரிவில் (NICU) பணி.' },
    question: { en: 'Why are wrist watches and bracelets banned in critical care?', ta: 'கைக்கடிகாரம் மற்றும் வளையல்கள் தீவிர சிகிச்சைப் பிரிவில் ஏன் தடை?' },
    options: [
      { text: { en: 'Watches trap moisture and bacteria underneath and block proper wrist rubbing', ta: 'கடிகாரத்தின் அடியில் ஈரமும் கிருமிகளும் தங்கி மணிக்கட்டு முழுமையாக கழுவுவதைத் தடுக்கும்' }, isCorrect: true, explanation: { en: '"Bare below the elbows" policy ensures the entire lower arm and wrist can be decontaminated.', ta: '"முழங்கை வரை வெறுமையாக இருத்தல்" விதி முழு தூய்மையை உறுதி செய்கிறது.' } },
      { text: { en: 'Watches reflect light and distract babies', ta: 'வெளிச்சம் குழந்தைகளை தொந்தரவு செய்யும்' }, isCorrect: false, explanation: { en: 'Bacterial colonization is the clinical reason.', ta: 'கிருமி தங்குவதே உண்மையான காரணம்.' } },
      { text: { en: 'Batteries interfere with heart monitors', ta: 'பேட்டரி மானிட்டரை பாதிக்கும்' }, isCorrect: false, explanation: { en: 'Mechanical watches don’t interfere with ECGs.', ta: 'இது அறிவியல் உண்மை அல்ல.' } }
    ],
    rationale: { en: 'The "Bare Below the Elbows" policy prevents pathogen hiding spots on jewelry.', ta: 'நகைகள் மற்றும் கடிகாரங்களில் கிருமிகள் தங்குவதைத் தடுக்க வேண்டும்.' },
    realLifeExample: { en: 'Swabs taken under a doctor’s leather watch band grew resistant Klebsiella, causing an outbreak in premature infants.', ta: 'தோல் கடிகார பட்டையின் கீழ் ஆபத்தான கிருமிகள் வளர்ந்தது ஆய்வில் உறுதியானது.' }
  },
  {
    id: 'hh_17',
    scenario: { en: 'Preparing to change a central venous line dressing.', ta: 'மார்பு நரம்பு குழாய் (Central line) கட்டு மாற்றுகிறீர்கள்.' },
    question: { en: 'Which antiseptic agent is preferred for patient skin prep around central lines?', ta: 'தோலை சுத்தம் செய்ய எந்த மருந்து மிகவும் சிறந்தது?' },
    options: [
      { text: { en: '2% Chlorhexidine gluconate in 70% alcohol with friction for 30s', ta: '70% ஆல்கஹாலில் கலந்த 2% குளோரெக்சிடின் (30 விநாடி தேய்த்தல்)' }, isCorrect: true, explanation: { en: 'Chlorhexidine provides prolonged residual kill time compared to plain alcohol or povidone iodine.', ta: 'குளோரெக்சிடின் நீண்ட நேரம் கிருமிகளைக் கொல்லும் ஆற்றல் கொண்டது.' } },
      { text: { en: 'Warm tap water on cotton', ta: 'வெதுவெதுப்பான குழாய் தண்ணீர்' }, isCorrect: false, explanation: { en: 'Tap water introduces waterborne bacteria into the central line.', ta: 'குழாய் தண்ணீர் கிருமிகளை நரம்பில் சேர்க்கும்.' } },
      { text: { en: 'Hydrogen peroxide solution', ta: 'ஹைட்ரஜன் பெராக்சைடு' }, isCorrect: false, explanation: { en: 'Toxic to granulating tissue and lacks residual antimicrobial power.', ta: 'புதிய திசுக்களை சேதப்படுத்தும்.' } }
    ],
    rationale: { en: 'Chlorhexidine in alcohol is the international standard to prevent central line bloodstream infections (CLABSI).', ta: 'ரத்த ஓட்ட தொற்று (CLABSI) வராமல் தடுக்க குளோரெக்சிடின் சிறந்த தேர்வு.' },
    realLifeExample: { en: 'Switching to chlorhexidine reduced central line bloodstream infections by 65% across regional intensive care units.', ta: 'குளோரெக்சிடின் பயன்படுத்திய பின் ரத்தக் கிருமி தொற்று 65% குறைந்தது.' }
  },
  {
    id: 'hh_18',
    scenario: { en: 'You touched your own hair and adjusted your glasses during patient rounds.', ta: 'ரவுண்ட்ஸின் போது உங்கள் தலைமுடியையோ மூக்குக் கண்ணாடியையோ தொட்டீர்கள்.' },
    question: { en: 'Did your hands become contaminated by touching your own hair/face?', ta: 'உங்கள் முடியையோ முகத்தையோ தொட்டால் கைகள் அசுத்தமாகுமா?' },
    options: [
      { text: { en: 'Yes, human hair and face carry high numbers of staphylococcus and require re-sanitizing', ta: 'ஆம், முடி மற்றும் முகத்தில் ஸ்டேஃபிளோகாக்கஸ் கிருமிகள் இருக்கும்; மீண்டும் கைகழுவ வேண்டும்' }, isCorrect: true, explanation: { en: 'Staff facial touching is a leading silent route of bacterial re-contamination.', ta: 'முகத்தைத் தொடுவது கைகளில் மீண்டும் கிருமிகளைச் சேர்க்கும்.' } },
      { text: { en: 'No, your own body bacteria are always completely harmless to patients', ta: 'இல்லை, நம் கிருமிகள் மற்றவருக்கு ஆபத்து தராது' }, isCorrect: false, explanation: { en: 'Staff flora can cause lethal wound infections in immunocompromised patients.', ta: 'நம் கிருமிகள் பலவீனமான நோயாளிக்கு உயிராபத்தை விளைவிக்கும்.' } },
      { text: { en: 'Only if your hair was wet with water', ta: 'முடி ஈரமாக இருந்தால் மட்டும்' }, isCorrect: false, explanation: { en: 'Dry hair sheds bacteria continuously.', ta: 'உலர்ந்த முடியிலும் கிருமிகள் உதிரும்.' } }
    ],
    rationale: { en: 'Avoid touching your face, mask, or hair during sterile or clean patient care.', ta: 'பராமரிப்பின் போது முகம் மற்றும் முடியைத் தொடுவதைத் தவிர்க்கவும்.' },
    realLifeExample: { en: 'A nurse rubbed her nose and immediately inserted a urinary catheter; the patient developed a catheter-associated urinary tract infection (CAUTI).', ta: 'மூக்கைத் தொட்டுவிட்டு கைகழுவாமல் சிறுநீர்க் குழாய் பொருத்தியதால் நோயாளிக்கு தொற்று உண்டானது.' }
  },
  {
    id: 'hh_19',
    scenario: { en: 'You just finished giving an intramuscular injection with gloves.', ta: 'கையுறையோடு ஊசி போட்டு முடித்தீர்கள்.' },
    question: { en: 'Which order of actions is correct?', ta: 'எந்த வரிசை சரியானது?' },
    options: [
      { text: { en: '1. Dispose needle in sharps box -> 2. Remove gloves -> 3. Sanitize hands', ta: '1. ஊசியை sharps தொட்டியில் போடுதல் -> 2. கையுறை கழற்றுதல் -> 3. கைகழுவுதல்' }, isCorrect: true, explanation: { en: 'Sharps disposed immediately uncapped, gloves doffed safely, and hands cleaned.', ta: 'ஊசியை உடனே போட்டு, கையுறை கழற்றி, கை கழுவ வேண்டும்.' } },
      { text: { en: '1. Remove gloves -> 2. Recap needle with bare hands -> 3. Walk to sharps box', ta: 'கையுறை கழற்றி வெறும் கையால் ஊசியை மூடுவது' }, isCorrect: false, explanation: { en: 'Recapping bare-handed causes severe needle-stick injuries.', ta: 'வெறும் கையால் ஊசியை மூடுவது ஆபத்து.' } },
      { text: { en: '1. Wash hands with gloves on -> 2. Save needle for next shift', ta: 'கையுறையோடு கைகழுவி ஊசியை வைப்பது' }, isCorrect: false, explanation: { en: 'Washing gloves destroys latex; needles are never saved.', ta: 'கையுறையைக் கழுவக்கூடாது; ஊசியை மீண்டும் வைக்கக் கூடாது.' } }
    ],
    rationale: { en: 'Safety flow: Immediate safe sharps drop, safe doffing, hand decontamination.', ta: 'பாதுகாப்பு வரிசை: ஊசி அகற்றுதல், கையுறை கழற்றுதல், கைகழுவுதல்.' },
    realLifeExample: { en: 'Following this 3-step sequence prevents 100% of post-injection needle sticks and glove contamination incidents.', ta: 'இந்த 3 படிகளைப் பின்பற்றுவது ஊசி குத்து மற்றும் தொற்று விபத்துக்களை முற்றிலுமாகத் தவிர்க்கும்.' }
  },
  {
    id: 'hh_20',
    scenario: { en: 'Checking the alcohol concentration of a hospital hand sanitizer.', ta: 'மருத்துவமனை சானிடைசரின் ஆல்கஹால் அளவை சரிபார்க்கிறீர்கள்.' },
    question: { en: 'What is the minimum recommended alcohol concentration for hospital hand rub efficacy?', ta: 'பயனுள்ள கிருமி நாசினியாக இருக்க குறைந்தபட்ச ஆல்கஹால் அளவு என்ன?' },
    options: [
      { text: { en: 'Between 60% and 80% ethyl or isopropyl alcohol by volume', ta: '60% முதல் 80% வரை எத்தில் அல்லது ஐசோபுரோபைல் ஆல்கஹால்' }, isCorrect: true, explanation: { en: 'Concentrations below 60% fail to denature bacterial proteins effectively.', ta: '60%-க்கு கீழ் இருந்தால் பாக்டீரியாவை அழிக்க முடியாது.' } },
      { text: { en: '10% alcohol diluted with perfume', ta: '10% வாசனை திரவியம் கலந்தது' }, isCorrect: false, explanation: { en: 'Far too weak to kill healthcare-associated viruses.', ta: 'கிருமிகளைக் கொல்ல இது போதாது.' } },
      { text: { en: '100% pure anhydrous alcohol', ta: '100% தூய ஆல்கஹால்' }, isCorrect: false, explanation: { en: '100% alcohol evaporates instantly and needs water molecules to penetrate microbial cell walls.', ta: '100% ஆல்கஹால் உடனே ஆவியாகிவிடும்; கிருமியை அழிக்க நீர் கலவை தேவை.' } },
    ],
    rationale: { en: 'WHO recommends formulation containing 75-80% alcohol with water and glycerol for optimum kill kinetics.', ta: 'WHO வழிகாட்டலின்படி 70-80% ஆல்கஹால் கலவையே சிறந்தது.' },
    realLifeExample: { en: 'A counterfeit 30% alcohol sanitizer bought during an emergency failed to kill viruses, causing a spike in ward infections until certified 70% rub was restored.', ta: '30% ஆல்கஹால் கொண்ட தரமற்ற சானிடைசரால் வார்டில் தொற்று பரவியது; 70% தரமான சானிடைசர் வந்த பின் கட்டுக்குள் வந்தது.' }
  }
];

// -------------------------------------------------------------------------------------------------
// 2. PPE SAFETY (20 QUESTIONS)
// -------------------------------------------------------------------------------------------------
const PPE_SAFETY_20: ClinicalQuestion[] = Array.from({ length: 20 }, (_, i) => {
  const qNum = i + 1;
  const questionsList = [
    {
      q: 'Which mask provides certified protection against microscopic airborne Tuberculosis droplet nuclei?',
      qTa: 'காற்றில் பரவும் காசநோய் கிருமிகளைத் தடுக்க எந்த முகக்கவசம் சான்றளிக்கப்பட்டது?',
      cor: 'Fit-tested N95 particulate respirator mask',
      corTa: 'முகத்தோடு பொருந்திய N95 சுவாசக் கவசம்',
      w1: 'Standard loose surgical paper mask',
      w1Ta: 'சாதாரண அறுவை சிகிச்சை முகமூடி',
      w2: 'Cloth bandanna folded twice',
      w2Ta: 'துணி முகமூடி',
      why: 'N95 filters 95% of 0.3-micron airborne particles with a tight facial seal.',
      whyTa: 'N95 கவசம் 95% நுண்ணிய கிருமிகளை வடிகட்டும்.',
      ex: 'An intern wearing a surgical mask inhaled floating TB droplet nuclei in a poorly ventilated room; an N95 prevents this completely.',
      exTa: 'சாதாரண முகமூடி அணிந்த மருத்துவ மாணவர் காசநோய் கிருமியை சுவாசித்ததால் தொற்றால் பாதிக்கப்பட்டார்.'
    },
    {
      q: 'In the standard CDC doffing (removal) order, which item is taken off FIRST?',
      qTa: 'PPE உடைகளைக் கழற்றும் போது முதலில் கழற்றப்பட வேண்டியது எது?',
      cor: 'Gloves (glove-in-glove technique)',
      corTa: 'கையுறைகள் (ஒன்றினுள் ஒன்றாக)',
      w1: 'N95 respirator mask from the front',
      w1Ta: 'முகமூடியை முன்புறமாகத் தொட்டு',
      w2: 'Eye goggles using dirty gloves',
      w2Ta: 'கண்ணாடிகளை அழுக்கு கையுறையோடு',
      why: 'Gloves touch blood and bodily fluids directly; removing them first keeps clean hands from contaminating your face.',
      whyTa: 'கையுறைகளே அசுத்தமானவை; அவற்றை முதலில் கழற்றினால் முகத்தில் கிருமி படாது.'
      ,ex: 'Untying a mask while still wearing dirty gloves transferred MRSA bacteria straight onto the nurse\'s lip.',
      exTa: 'கையுறையைக் கழற்றாமல் முகமூடியைத் தொட்டதால் முகத்தில் தொற்று உண்டானது.'
    },
    {
      q: 'How should you perform a user seal check on an N95 respirator after putting it on?',
      qTa: 'N95 கவசம் அணிந்த பின் சீல் சோதனையை எவ்வாறு செய்ய வேண்டும்?',
      cor: 'Cup hands over the respirator and inhale gently; it should collapse slightly without leaking around edges',
      corTa: 'கைகளால் மூடி மூச்சை உள்ளிழுக்கவும்; ஓரங்களில் காற்று கசியாமல் கவசம் குழிய வேண்டும்',
      w1: 'Spray perfume to see if you can smell it',
      w1Ta: 'சென்ட் அடித்து வாசனையைப் பார்ப்பது',
      w2: 'Tape the edges to your cheeks with paper tape',
      w2Ta: 'கன்னத்தில் டேப் ஒட்டி வைப்பது',
      why: 'A positive and negative pressure seal check confirms air flows through the filter, not around perimeter leaks.',
      whyTa: 'காற்றுக் கசிவு இல்லை என்பதை உறுதி செய்ய இந்த சோதனை அவசியம்.'
      ,ex: 'A nurse with an unsealed N95 smelled chemicals through the cheek gaps, proving infectious airborne droplets could also enter.',
      exTa: 'சீல் செய்யாத முகமூடியின் ஓரம் வழியே ஆபத்தான கிருமிகள் நுழைய வாய்ப்புள்ளது.'
    },
    {
      q: 'During an abdominal wound dressing, your sterile glove gets nicked by scissors.',
      qTa: 'புண் கட்டும்போது கையுறை கத்தரிக்கோலால் கிழிந்துவிடுகிறது.',
      cor: 'Stop immediately, remove torn glove, wash/sanitize hands, and don a fresh sterile glove',
      corTa: 'உடனே நிறுத்தி, கிழிந்ததை அகற்றி, கைகழுவி புதிய ஸ்டெரைல் கையுறை அணிய வேண்டும்',
      w1: 'Put surgical adhesive tape over the hole and finish quickly',
      w1Ta: 'டேப் ஒட்டிவிட்டு பணியைத் தொடருவது',
      w2: 'Ignore it since there is no visible bleeding on your finger',
      w2Ta: 'காயமில்லை என்பதால் புறக்கணிப்பது',
      why: 'Any tear destroys barrier protection and allows skin bacteria to enter the sterile surgical field.',
      whyTa: 'கையுறை கிழிந்தால் கிருமி தடுப்புப் பாதுகாப்பு உடைந்துவிடும்.'
      ,ex: 'A nurse taped a torn glove and finished dressing; the patient developed a wound infection from skin flora leaking through the tear.',
      exTa: 'கிழிந்த இடத்தில் டேப் ஒட்டி தொடர்ந்ததால் நோயாளிக்கு புண்ணில் தொற்று ஏற்பட்டது.'
    },
    {
      q: 'Can the same pair of examination gloves be worn while caring for two different patients in neighboring beds?',
      qTa: 'ஒரே கையுறையை அடுத்தடுத்த படுக்கையிலுள்ள இரு நோயாளிகளுக்குப் பயன்படுத்தலாமா?',
      cor: 'Never; gloves must be changed between every patient, followed by hand hygiene',
      corTa: 'ஒருபோதும் கூடாது; ஒவ்வொரு நோயாளிக்கும் புதிய கையுறை அணிய வேண்டும்',
      w1: 'Yes, if you wipe the gloves with sanitizer between beds',
      w1Ta: 'சானிடைசர் தேய்த்துவிட்டு பயன்படுத்தலாம்',
      w2: 'Yes, if both patients have the same diagnosis',
      w2Ta: 'இருவருக்கும் ஒரே நோய் இருந்தால் பயன்படுத்தலாம்',
      why: 'Reusing gloves spreads multi-drug resistant superbugs like wildfire across ward beds.',
      whyTa: 'கையுறையை மீண்டும் பயன்படுத்துவது படுக்கைகளுக்கு இடையே கொடிய கிருமிகளைப் பரப்பும்.'
      ,ex: 'An aide wore one pair of gloves for 3 patient bed baths, causing all three to contract the same resistant hospital infection.',
      exTa: 'ஒரே கையுறையால் 3 நோயாளிகளுக்கு பணிவிடை செய்ததால் மூவருக்கும் ஒரே தொற்று பரவியது.'
    }
  ];

  const template = questionsList[i % questionsList.length];
  return {
    id: `ppe_${qNum}`,
    scenario: {
      en: `Clinical PPE Safety Case #${qNum}: ${template.q}`,
      ta: `மருத்துவ PPE சூழ்நிலை #${qNum}: ${template.qTa}`
    },
    question: {
      en: template.q,
      ta: template.qTa
    },
    options: [
      { text: { en: template.cor, ta: template.corTa }, isCorrect: true, explanation: { en: template.why, ta: template.whyTa } },
      { text: { en: template.w1, ta: template.w1Ta }, isCorrect: false, explanation: { en: 'This violates hospital infection control standards.', ta: 'இது தொற்று கட்டுப்பாட்டு விதிமீறலாகும்.' } },
      { text: { en: template.w2, ta: template.w2Ta }, isCorrect: false, explanation: { en: 'Dangerous practice that increases exposure risk.', ta: 'இது ஆபத்தை அதிகரிக்கும் தவறான செயல்.' } }
    ],
    rationale: { en: template.why, ta: template.whyTa },
    realLifeExample: { en: template.ex, ta: template.exTa }
  };
});

// -------------------------------------------------------------------------------------------------
// 3. SHARPS SAFETY (20 QUESTIONS)
// -------------------------------------------------------------------------------------------------
const SHARPS_SAFETY_20: ClinicalQuestion[] = Array.from({ length: 20 }, (_, i) => {
  const qNum = i + 1;
  const questionsList = [
    {
      q: 'Why is two-handed recapping of used needles banned worldwide?',
      qTa: 'இரண்டு கைகளால் ஊசியை மூடுவது ஏன் உலகளவில் தடை செய்யப்பட்டுள்ளது?',
      cor: 'It is the #1 cause of accidental needle-stick percutaneous injuries',
      corTa: 'தவறுதலாக ஊசி குத்துவதற்கு இதுவே முதன்மைக் காரணம்',
      w1: 'Caps make the sharps box too heavy to lift',
      w1Ta: 'தொட்டி அதிக எடையாகும்',
      w2: 'Plastic caps can be recycled as clean plastic',
      w2Ta: 'மூடிகளை மறுசுழற்சி செய்யலாம்',
      why: 'Recapping positions your non-dominant hand directly in the strike path of the needle.',
      whyTa: 'மூடியைப் பிடிக்கும் கை ஊசிக்கு நேராக இருப்பதால் கை தவறி குத்த வாய்ப்புள்ளது.'
      ,ex: 'A nurse tried recapping a heparin needle; the tip missed the cap by 2 mm and drove into her index finger.',
      exTa: 'ஊசியை மூட முயன்ற போது தவறி விரலில் ஆழமாகக் குத்தியது.'
    },
    {
      q: 'What is the immediate, FIRST first-aid step if a needle stick occurs at the bedside?',
      qTa: 'ஊசி குத்துக் காயம் ஏற்பட்டால் வாஷ்பேசினில் உடனே செய்ய வேண்டியது என்ன?',
      cor: 'Wash gently with soap and running water; allow blood to flow naturally without squeezing',
      corTa: 'சோப்பு மற்றும் ஓடும் நீரில் கழுவவும்; காயத்தை அழுத்தாமல் ரத்தம் இயல்பாக வெளியேற விடவும்',
      w1: 'Squeeze the thumb hard and suck the blood with your mouth',
      w1Ta: 'விரலை பலமாக அழுத்தி ரத்தத்தை வாயால் உறிஞ்சுவது',
      w2: 'Pour pure bleach or acid to cauterize the puncture',
      w2Ta: 'பிளீச்சிங் திரவம் அல்லது ஆசிட் ஊற்றுவது',
      why: 'Squeezing creates vacuum suction pulling viral particles deeper into capillaries; sucking contaminates mouth mucosa.',
      whyTa: 'அழுத்துவது கிருமிகளை ஆழமாக செலுத்தும்; வாயால் உறிஞ்சக் கூடாது.'
      ,ex: 'A student squeezed her punctured finger aggressively, rupturing micro-vessels and pushing viral blood deeper into the tissue.',
      exTa: 'விரலை பலமாக அழுத்தியதால் ரத்தக்குழாய்கள் கிழிந்து கிருமி உடலின் உள்ளே சென்றது.'
    },
    {
      q: 'Within what time window is HIV Post-Exposure Prophylaxis (PEP) most effective?',
      qTa: 'HIV தடுப்பு மருந்து (PEP) எத்தனை மணி நேரத்திற்குள் தொடங்குவது மிகச் சிறந்தது?',
      cor: 'Ideally within 2 hours (and up to 72 hours maximum)',
      corTa: '2 மணி நேரத்திற்குள் (அதிகபட்சம் 72 மணி நேரம் வரை)',
      w1: 'Wait 2 weeks to see if a fever develops first',
      w1Ta: '2 வாரம் கழித்து காய்ச்சல் வந்தால் தொடங்கலாம்',
      w2: 'After 30 days of incubation',
      w2Ta: '30 நாட்கள் கழித்து',
      why: 'Antiretroviral PEP stops the virus from replicating and integrating into DNA if taken within the golden 2-hour window.',
      whyTa: '2 மணி நேரத்திற்குள் PEP மாத்திரை உட்கொண்டால் HIV கிருமி உடலில் கலப்பதைத் தடுத்து முழுப் பாதுகாப்பைத் தரும்.'
      ,ex: 'Taking the first PEP dose in casualty 45 minutes after an exposure stopped HIV transmission completely.',
      exTa: '45 நிமிடத்தில் PEP மாத்திரை உட்கொண்டதால் எச்.ஐ.வி பரவுவது தடுக்கப்பட்டது.'
    },
    {
      q: 'At what marked capacity must a puncture-resistant sharps box be sealed and replaced?',
      qTa: 'Sharps தொட்டி எவ்வளவு நிரம்பியதும் மூடி புதியதை வைக்க வேண்டும்?',
      cor: 'When it reaches 3/4 (75%) full or the marked fill line',
      corTa: '3/4 பங்கு (75%) அல்லது அதில் குறிக்கப்பட்ட கோட்டை அடைந்தவுடன்',
      w1: 'When needles start overflowing onto the bedside cart',
      w1Ta: 'ஊசிகள் வெளியே வழியும் போது',
      w2: 'Only when 100% packed to the brim',
      w2Ta: '100% நிரம்பி வழியும் போது',
      why: 'Overfilling above 75% causes sharp tips to protrude and puncture disposal workers.',
      whyTa: '75%-க்கு மேல் நிரப்பினால் ஊசிகள் வெளியே நீட்டிக்கொண்டு பிறருக்குக் குத்தும்.'
      ,ex: 'A housekeeper was stabbed in the wrist while carrying an overfilled sharps container that was crammed to 100% capacity.',
      exTa: '100% நிரம்பிய தொட்டியை அள்ளிய தூய்மைப் பணியாளருக்கு ஊசி குத்தியது.'
    },
    {
      q: 'Which bloodborne virus carries the highest transmission risk (up to 30%) following a percutaneous needle stick?',
      qTa: 'ஊசி குத்து மூலம் பரவும் அதிக ஆபத்துள்ள (30% வரை) வைரஸ் எது?',
      cor: 'Hepatitis B Virus (HBV)',
      corTa: 'மஞ்சள் காமாலை (ஹெபடைடிஸ் பி)',
      w1: 'Human Immunodeficiency Virus (HIV) (0.3% risk)',
      w1Ta: 'HIV (0.3% ஆபத்து மட்டுமே)',
      w2: 'Common Cold Rhinovirus',
      w2Ta: 'சாதாரண சளி வைரஸ்',
      why: 'HBV is 100 times more infectious than HIV in bloodborne needle exposures; vaccination is essential.',
      whyTa: 'ஹெபடைடிஸ் பி ரத்தம் மூலம் பரவும் வேகம் HIV-யை விட 100 மடங்கு அதிகம்.'
      ,ex: 'A nurse fully vaccinated against Hep B with antibody titers >100 mIU/mL had complete immunity after an accidental stick.',
      exTa: 'ஹெபடைடிஸ் பி தடுப்பூசி போட்டிருந்த செவிலியருக்கு ஊசி குத்தியபோதும் நோய் தாக்கவில்லை.'
    }
  ];

  const template = questionsList[i % questionsList.length];
  return {
    id: `ss_${qNum}`,
    scenario: {
      en: `Clinical Sharps Safety Case #${qNum}: ${template.q}`,
      ta: `கூர்மையான கருவிகள் பயிற்சி #${qNum}: ${template.qTa}`
    },
    question: {
      en: template.q,
      ta: template.qTa
    },
    options: [
      { text: { en: template.cor, ta: template.corTa }, isCorrect: true, explanation: { en: template.why, ta: template.whyTa } },
      { text: { en: template.w1, ta: template.w1Ta }, isCorrect: false, explanation: { en: 'This causes high risk of percutaneous blood exposure.', ta: 'இது ஆபத்தை அதிகரிக்கும் செயலாகும்.' } },
      { text: { en: template.w2, ta: template.w2Ta }, isCorrect: false, explanation: { en: 'Incorrect and dangerous procedure.', ta: 'தவறான மற்றும் ஆபத்தான நடைமுறை.' } }
    ],
    rationale: { en: template.why, ta: template.whyTa },
    realLifeExample: { en: template.ex, ta: template.exTa }
  };
});

// -------------------------------------------------------------------------------------------------
// 4. PATIENT IDENTIFICATION (20 QUESTIONS)
// -------------------------------------------------------------------------------------------------
const PATIENT_ID_20: ClinicalQuestion[] = Array.from({ length: 20 }, (_, i) => {
  const qNum = i + 1;
  const questionsList = [
    {
      q: 'Before administering IV antibiotics, how should patient identity be verified?',
      qTa: 'மருந்து கொடுப்பதற்கு முன் நோயாளியின் அடையாளத்தை எவ்வாறு சரிபார்க்க வேண்டும்?',
      cor: 'Ask open-ended: "What is your full name and date of birth?", then match wristband with the chart',
      corTa: '"உங்கள் முழுப் பெயர் மற்றும் பிறந்த தேதியைக் கூறுங்கள்" எனக் கேட்டு, கைப்பட்டையை சீட்டுடன் ஒப்பிட வேண்டும்',
      w1: 'Ask "Are you Mr. Ramesh in Bed 8?" and proceed if he nods',
      w1Ta: '"நீங்கள் படுக்கை 8-ல் இருக்கும் ரமேஷா?" என்று கேட்டு அவர் தலையசைத்தால் கொடுப்பது',
      w2: 'Rely solely on the bed number tag on the wall',
      w2Ta: 'படுக்கை எண்ணை மட்டும் நம்புவது',
      why: 'Patients often nod without hearing clearly; always use 2 independent identifiers (Name + Hospital MRN/DOB). Never bed number.',
      whyTa: 'நோயாளி புரியாமல் தலையசைக்க வாய்ப்புண்டு; பெயர் மற்றும் மருத்துவ எண் இரண்டையும் சரிபார்க்க வேண்டும்.'
      ,ex: 'Two patients swapped beds to watch cricket; a nurse checked only the bed number and almost gave insulin to the wrong person!',
      exTa: 'நோயாளிகள் இடம் மாறியிருந்த போது படுக்கை எண்ணை மட்டும் நம்பி இன்சுலின் போடச் சென்ற விபத்து தடுக்கப்பட்டது.'
    },
    {
      q: 'A patient is intubated and unconscious in ICU without a family member present.',
      qTa: 'சுயநினைவற்ற தீவிர சிகிச்சை நோயாளிக்கு மருந்து கொடுக்கும் முன் அடையாளத்தை எவ்வாறு சரிபார்ப்பது?',
      cor: 'Verify the barcode/MRN on the wristband against the electronic chart with a second registered nurse',
      corTa: 'கைப்பட்டையிலுள்ள பார்கோட்/எண்ணை இரண்டாவது செவிலியருடன் இணைந்து ஆவணங்களோடு சரிபார்க்க வேண்டும்',
      w1: 'Guess based on the patient’s age and facial appearance',
      w1Ta: 'தோற்றத்தை வைத்து ஊகிப்பது',
      w2: 'Skip verification because ICU patients do not walk around',
      w2Ta: 'தீவிர சிகிச்சைப் பிரிவு என்பதால் சரிபார்ப்பைத் தவிர்ப்பது',
      why: 'Unconscious patients require objective dual-nurse electronic verification of their wristband barcode/MRN.',
      whyTa: 'சுயநினைவற்ற நோயாளிகளுக்கு கைப்பட்டை பார்கோடை இரு செவிலியர் சரிபார்ப்பது கட்டாயம்.'
      ,ex: 'Two trauma patients arrived unconscious from the same accident; dual wristband MRN verification prevented an ABO blood mismatch.',
      exTa: 'விபத்தில் சுயநினைவின்றி வந்த இருவருக்கு ரத்த வகை மாறிவிடாமல் கைப்பட்டை சரிபார்ப்பு காப்பாற்றியது.'
    },
    {
      q: 'Two patients in the same surgical ward have the identical name: "Suresh Kumar".',
      qTa: 'ஒரே வார்டில் இரு நோயாளிகளின் பெயர் "சுரேஷ் குமார்" என ஒரே மாதிரியாக உள்ளது.',
      cor: 'Place a bold "NAME ALERT" warning on both charts, use Date of Birth + Hospital Number, and verify at bedside every time',
      corTa: 'இரு ஆவணங்களிலும் "NAME ALERT" எச்சரிக்கை இட்டு, பிறந்த தேதி மற்றும் மருத்துவ எண்ணை ஒப்பிட வேண்டும்',
      w1: 'Call one "Suresh 1" and the other "Suresh 2" informally',
      w1Ta: 'சுரேஷ் 1, சுரேஷ் 2 என அழைப்பது',
      w2: 'Move one patient out to the hallway',
      w2Ta: 'ஒருவரை வெளியே மாற்றுவது',
      why: 'Similar names cause catastrophic drug and surgery mix-ups unless formal alert protocols and unique MRNs are enforced.',
      whyTa: 'ஒரே பெயர் இருந்தால் மருத்துவ எண் மூலம் மட்டுமே சிகிச்சை உறுதி செய்யப்பட வேண்டும்.'
      ,ex: 'Placing a red "NAME ALERT" prevented an emergency appendectomy patient from being mixed up with a knee replacement patient.',
      exTa: 'பெயர் எச்சரிக்கை குறியீடு தவறான அறுவை சிகிச்சை நடக்காமல் நோயாளியைக் காப்பாற்றியது.'
    },
    {
      q: 'A patient’s ID wristband has fallen off and is lying on the bathroom floor.',
      qTa: 'நோயாளியின் கைப்பட்டை கழன்று குளியலறை தரையில் கிடக்கிறது.',
      cor: 'Discard the loose band, verify identity from the medical record with a colleague, and print/attach a brand new verified wristband',
      corTa: 'அதை குப்பையில் போட்டு, ஆவணங்களுடன் சரிபார்த்து புதிய கைப்பட்டையை அணிவிக்க வேண்டும்',
      w1: 'Tape the dirty floor wristband back onto the patient’s arm',
      w1Ta: 'தரையில் கிடந்ததை மீண்டும் கையில் ஒட்டுவது',
      w2: 'Write the patient name on their forearm with a permanent marker',
      w2Ta: 'கையில் மார்க்கரால் எழுதுவது',
      why: 'Loose wristbands from floors are contaminated and could belong to a previous discharged patient.',
      whyTa: 'தரையில் கிடந்த கட்டு முந்தைய நோயாளிக்கு உரியதாக இருக்கலாம்; புதியது மட்டுமே அணிய வேண்டும்.'
      ,ex: 'A floor wristband belonged to a discharged cardiac patient; taping it to a new patient almost led to giving unnecessary heart drugs.',
      exTa: 'முந்தைய நோயாளியின் கைக்கட்டை எடுத்து ஒட்டியதால் தவறான இதய மருந்து போக இருந்த ஆபத்து தவிர்க்கப்பட்டது.'
    },
    {
      q: 'Prior to blood transfusion, what bedside verification process is mandatory?',
      qTa: 'ரத்தம் ஏற்றுவதற்கு முன் படுக்கை அருகில் செய்ய வேண்டிய கட்டாய சோதனை என்ன?',
      cor: 'Two healthcare professionals independently cross-check patient name, MRN, donor unit number, blood group, and expiry at bedside',
      corTa: 'இரு செவிலியர்கள் நோயாளி பெயர், எண், ரத்தக் குரூப், பாக்கெட் எண் ஆகியவற்றை படுக்கை அருகில் சரிபார்க்க வேண்டும்',
      w1: 'One nurse quickly checks the bag in the hallway nursing station',
      w1Ta: 'ஒருவர் மட்டும் தனியாகப் பார்ப்பது',
      w2: 'Ask the patient if the blood bag looks like theirs',
      w2Ta: 'நோயாளியிடம் பாக்கெட்டை காட்டிக் கேட்பது',
      why: 'ABO incompatible blood transfusions can trigger fatal acute hemolytic reactions within minutes.',
      whyTa: 'ரத்த வகை மாறினால் நிமிடங்களில் உயிராபத்தை விளைவிக்கும் கடுமையான எதிர்வினை உண்டாகும்.'
      ,ex: 'A dual-nurse bedside check caught an A-positive bag brought for an O-positive patient, saving the patient from a fatal hemolytic reaction.',
      exTa: 'இரு செவிலியர் சரிபார்ப்பு தவறான ரத்த பாக்கெட்டை உடனே கண்டுபிடித்து நோயாளியின் உயிரைக் காப்பாற்றியது.'
    }
  ];

  const template = questionsList[i % questionsList.length];
  return {
    id: `pid_${qNum}`,
    scenario: {
      en: `Clinical Identification Case #${qNum}: ${template.q}`,
      ta: `அடையாள சரிபார்ப்புப் பயிற்சி #${qNum}: ${template.qTa}`
    },
    question: {
      en: template.q,
      ta: template.qTa
    },
    options: [
      { text: { en: template.cor, ta: template.corTa }, isCorrect: true, explanation: { en: template.why, ta: template.whyTa } },
      { text: { en: template.w1, ta: template.w1Ta }, isCorrect: false, explanation: { en: 'Unsafe practice that risks wrong-patient errors.', ta: 'தவறான நோயாளிக்கு செல்லும் ஆபத்துள்ள செயல்.' } },
      { text: { en: template.w2, ta: template.w2Ta }, isCorrect: false, explanation: { en: 'Violates patient identification safety standards.', ta: 'நோயாளி பாதுகாப்பு விதிகளுக்கு எதிரானது.' } }
    ],
    rationale: { en: template.why, ta: template.whyTa },
    realLifeExample: { en: template.ex, ta: template.exTa }
  };
});

// -------------------------------------------------------------------------------------------------
// 5. BMW SEGREGATION (20 QUESTIONS)
// -------------------------------------------------------------------------------------------------
const BMW_SEGREGATION_20: ClinicalQuestion[] = Array.from({ length: 20 }, (_, i) => {
  const qNum = i + 1;
  const questionsList = [
    {
      q: 'Which color biohazard bag is designated for blood-soaked cotton, purulent wound gauze, and anatomical tissue?',
      qTa: 'ரத்தம் மற்றும் சீழ் படிந்த பஞ்சு, உடற்கழிவுகள் எந்த வண்ணப் பையில் போடப்பட வேண்டும்?',
      cor: 'Yellow non-chlorinated plastic bag (for high-temperature incineration)',
      corTa: 'மஞ்சள் நிறக் கழிவுப் பை (உயர் வெப்பத்தில் எரிப்பதற்காக)',
      w1: 'Red bag for plastic recycling',
      w1Ta: 'சிவப்புப் பை',
      w2: 'General black municipal garbage bin',
      w2Ta: 'சாதாரண கருப்பு குப்பைத் தொட்டி',
      why: 'Yellow is designated for soiled, infectious, and anatomical waste to be destroyed at 1100°C in an incinerator.',
      whyTa: 'மஞ்சள் பை எரிக்கப்பட வேண்டிய ரத்தம் படிந்த பஞ்சு மற்றும் உடற்கழிவுகளுக்கு ஒதுக்கப்பட்டுள்ளது.'
      ,ex: 'Throwing soiled dressings in municipal trash caused local sanitation workers to contract Hepatitis B while sorting bags.',
      exTa: 'ரத்தம் படிந்த பஞ்சை பொதுக் குப்பையில் போட்டதால் தூய்மைப் பணியாளருக்கு மஞ்சள் காமாலை பரவியது.'
    },
    {
      q: 'Where must an empty plastic normal saline bottle and plastic IV tubing be discarded?',
      qTa: 'காலி பிளாஸ்டிக் சலைன் பாட்டில் மற்றும் டியூப் எங்கு போடப்பட வேண்டும்?',
      cor: 'Red bin (for recyclable contaminated plastics for autoclaving and shredding)',
      corTa: 'சிவப்பு தொட்டி (மறுசுழற்சி செய்யக்கூடிய பிளாஸ்டிக் கழிவுகள்)',
      w1: 'Yellow bag to be burned in the incinerator furnace',
      w1Ta: 'மஞ்சள் பையில் போட்டு எரிப்பது',
      w2: 'White puncture-proof container',
      w2Ta: 'வெள்ளை தொட்டி',
      why: 'Red bin is for recyclable medical polymers. Burning plastics in yellow incinerators produces toxic cancer-causing dioxin gases.',
      whyTa: 'சிவப்பு தொட்டி பிளாஸ்டிக் கழிவுகளுக்கு உரியது; பிளாஸ்டிக்கை எரிப்பது நச்சு வாயுக்களை உண்டாக்கும்.'
      ,ex: 'Burning IV bags in Yellow furnaces caused thick toxic black smoke, resulting in severe environmental pollution penalties.',
      exTa: 'பிளாஸ்டிக் டியூப்களை எரித்ததால் நச்சுப் புகை உண்டாகி மருத்துவமனைக்கு மாசுக் கட்டுப்பாட்டு வாரியம் அபராதம் விதித்தது.'
    },
    {
      q: 'Where do used IV cannula needles, suture needles, and surgical blades belong?',
      qTa: 'பயன்படுத்திய நரம்பு ஊசிகள், தையல் ஊசிகள் மற்றும் அறுவை கத்திகள் எங்கு போடப்பட வேண்டும்?',
      cor: 'White translucent puncture-proof and tamper-proof container',
      corTa: 'வெள்ளை நிற துளையாத கொள்கலன்',
      w1: 'Red plastic bag',
      w1Ta: 'சிவப்பு பிளாஸ்டிக் பை',
      w2: 'Blue cardboard box',
      w2Ta: 'நீலப் பெட்டி',
      why: 'Metallic sharps can puncture plastic bags and stab handlers; they require rigid puncture-proof white containers.',
      whyTa: 'கூர்மையான ஊசிகள் பிளாஸ்டிக் பையை கிழித்து பிறருக்குக் குத்தாமல் இருக்க வெள்ளை துளையாத தொட்டி கட்டாயம்.'
      ,ex: 'A metal blade placed in a red plastic bag sliced through the bottom, stabbing the leg of a housekeeping staff member.',
      exTa: 'சிவப்பு பையில் போடப்பட்ட கத்தி பையைக் கிழித்துக்கொண்டு பணியாளரின் காலில் குத்தியது.'
    },
    {
      q: 'Which container is designated for broken antibiotic glass vials and glass ampoules?',
      qTa: 'உடைந்த கண்ணாடி மருந்துக் குப்பிகள் எந்த கொள்கலனில் போடப்பட வேண்டும்?',
      cor: 'Blue puncture-proof box or container with blue marking',
      corTa: 'நீல நிற அட்டைப் பெட்டி அல்லது தொட்டி',
      w1: 'Yellow bag with soiled cotton',
      w1Ta: 'மஞ்சள் பை',
      w2: 'Black municipal trash bin',
      w2Ta: 'கருப்பு குப்பைத் தொட்டி',
      why: 'Blue category is for glassware and orthopedic metallic implants to be disinfected with sodium hypochlorite and recycled.',
      whyTa: 'நீலப் பெட்டி கண்ணாடி பாட்டில்கள் மற்றும் உலோகப் பொருட்களுக்கு மட்டுமே உரியது.'
      ,ex: 'Glass vials thrown in yellow bags shattered and slashed an incinerator operator\'s hands through their protective leather gloves.',
      exTa: 'மஞ்சள் பையில் போடப்பட்ட கண்ணாடி உடைந்ததால் தூய்மைப் பணியாளரின் கையில் ஆழமான வெட்டுக் காயம் ஏற்பட்டது.'
    },
    {
      q: 'What should happen to leftover normal saline or IV fluid before discarding the empty plastic bottle in Red?',
      qTa: 'பிளாஸ்டிக் பாட்டிலை சிவப்புத் தொட்டியில் போடும் முன் அதிலுள்ள திரவத்தை என்ன செய்ய வேண்டும்?',
      cor: 'Drain all residual fluid into the clinical sink before placing the empty bottle in Red',
      corTa: 'திரவத்தை வாஷ்பேசினில் முழுமையாக ஊற்றி காலி செய்துவிட்டு சிவப்புத் தொட்டியில் போட வேண்டும்',
      w1: 'Throw the bottle full of fluid into the Red bin',
      w1Ta: 'திரவத்தோடு தொட்டியில் போடுவது',
      w2: 'Pour the saline into the Yellow bag',
      w2Ta: 'மஞ்சள் பையில் ஊற்றுவது',
      why: 'Plastic recycling autoclaves cannot process heavy liquid volumes; bottles must be empty.',
      whyTa: 'மறுசுழற்சி ஆலைகளில் திரவம் இருக்கக் கூடாது; காலியாக மட்டுமே போட வேண்டும்.'
      ,ex: 'Full fluid bags burst open during transport, soaking the recycling cart and creating slippery biohazard spills.',
      exTa: 'திரவத்தோடு போட்ட பாட்டில்கள் வழியில் உடைந்து தரையில் சிந்தி வழுக்கி விழச் செய்தது.'
    }
  ];

  const template = questionsList[i % questionsList.length];
  return {
    id: `bmw_${qNum}`,
    scenario: {
      en: `Biomedical Waste Case #${qNum}: ${template.q}`,
      ta: `மருத்துவக் கழிவுப் பயிற்சி #${qNum}: ${template.qTa}`
    },
    question: {
      en: template.q,
      ta: template.qTa
    },
    options: [
      { text: { en: template.cor, ta: template.corTa }, isCorrect: true, explanation: { en: template.why, ta: template.whyTa } },
      { text: { en: template.w1, ta: template.w1Ta }, isCorrect: false, explanation: { en: 'Violates biomedical waste segregation legal rules.', ta: 'இது கழிவு மேலாண்மை விதிகளுக்கு முரணானது.' } },
      { text: { en: template.w2, ta: template.w2Ta }, isCorrect: false, explanation: { en: 'Environmental hazard and unsafe for waste handlers.', ta: 'சுற்றுச்சூழல் மற்றும் பணியாளர்களுக்கு ஆபத்தானது.' } }
    ],
    rationale: { en: template.why, ta: template.whyTa },
    realLifeExample: { en: template.ex, ta: template.exTa }
  };
});

// -------------------------------------------------------------------------------------------------
// 6. SAFE MEDICATION ADMINISTRATION (20 QUESTIONS) - NEW DEDICATED MODULE!
// -------------------------------------------------------------------------------------------------
const MEDICATION_SAFETY_20: ClinicalQuestion[] = Array.from({ length: 20 }, (_, i) => {
  const qNum = i + 1;
  const questionsList = [
    {
      q: 'You are preparing an intravenous infusion of concentrated Potassium Chloride (KCl). What is the strict rule?',
      qTa: 'செறிவூட்டப்பட்ட பொட்டாசியம் குளோரைடு (KCl) நரம்பு மருந்துக்கான மிக முக்கியமான விதி என்ன?',
      cor: 'NEVER give IV push or bolus; must ALWAYS be diluted in an IV bag and infused via an electronic pump',
      corTa: 'ஒருபோதும் நேரடியாக (IV push) செலுத்தக் கூடாது; சலைனில் கலந்து பம்ப் மூலம் மட்டுமே மெதுவாக செலுத்த வேண்டும்',
      w1: 'Push 10 mL rapidly through the IV cannula directly',
      w1Ta: '10 மி.லி நரம்பில் வேகமாக செலுத்துவது',
      w2: 'Mix it in hot tea for the patient to drink',
      w2Ta: 'சூடான டீயில் கலந்து குடிக்க வைப்பது',
      why: 'Direct IV push of concentrated potassium causes immediate fatal cardiac arrest (ventricular fibrillation).',
      whyTa: 'பொட்டாசியத்தை நேரடியாக நரம்பில் ஏற்றினால் நொடிகளில் இதயம் நின்று மரணம் ஏற்படும்.'
      ,ex: 'An intern injected concentrated KCl by direct IV push thinking it was saline; the patient went into instantaneous asystole/cardiac arrest.',
      exTa: 'பொட்டாசியத்தை நேரடியாக ஊசியில் செலுத்தியதால் நோயாளியின் இதயம் நொடிகளில் துடிப்பை நிறுத்தியது.'
    },
    {
      q: 'Before administering high-alert subcutaneous Insulin or IV Heparin, what verification is mandatory?',
      qTa: 'அதிமுக்கிய மருந்துகளான இன்சுலின் அல்லது ஹெபாரின் செலுத்தும் முன் என்ன சோதனை கட்டாயம்?',
      cor: 'An independent double-check by two registered nurses, calculating dose and syringe units separately',
      corTa: 'இரண்டு செவிலியர்கள் தனித்தனியாக அளவைக் கணக்கிட்டு சரிபார்க்கும் இரட்டைச் சரிபார்ப்பு (Double-Check)',
      w1: 'Mental calculation by one nurse alone without showing anyone',
      w1Ta: 'ஒருவர் மட்டும் மனக்கணக்கு போட்டுவிட்டு செலுத்துவது',
      w2: 'Ask the patient how many units they feel like having today',
      w2Ta: 'நோயாளிக்கு எத்தனை யூனிட் வேண்டும் எனக் கேட்பது',
      why: 'Independent dual checks catch 95% of unit/decimal conversion errors before high-risk medicine enters the body.',
      whyTa: 'இரு செவிலியர் சரிபார்ப்பு 95% கணக்கீட்டுப் பிழைகளைத் தடுத்து உயிரைக் காக்கும்.'
      ,ex: 'A nurse mistook a "U" for a zero and drew 40 units of insulin instead of 4; the second nurse caught the 10x overdose during double-check.',
      exTa: '4 யூனிட்டுக்கு பதில் 40 யூனிட் இன்சுலின் எடுக்கப்பட்டதை இரண்டாவது செவிலியர் சரிபார்த்து நோயாளியைக் காப்பாற்றினார்.'
    },
    {
      q: 'Two medications have look-alike sound-alike names: "DOPamine" and "DOBUTamine". How does the pharmacy prevent mix-ups?',
      qTa: 'ஒரே மாதிரியான பெயருடைய மருந்துகள் (LASA) தவறாக மாறாமல் இருக்க மருத்துவமனை என்ன செய்கிறது?',
      cor: 'Using Tall-Man lettering (e.g. DOPamine vs DOBUTamine) on labels and separate storage bins',
      corTa: 'பெரிய எழுத்துக்கள் (Tall-Man Lettering) மற்றும் தனித்தனி பெட்டிகளில் பிரித்து வைப்பது',
      w1: 'Mixing both ampoules together in the same drawer',
      w1Ta: 'இரண்டையும் ஒரே டிராயரில் கலந்து வைப்பது',
      w2: 'Tearing off labels so staff look inside the vial',
      w2Ta: 'லேபிளை கிழித்துவிட்டு மருந்தைப் பார்ப்பது',
      why: 'Tall-Man lettering highlights the differences in look-alike sound-alike (LASA) medications to prevent fatal substitutions.',
      whyTa: 'பெரிய எழுத்துக்கள் ஒரே மாதிரியான மருந்துப் பெயர்களின் வித்தியாசத்தை எளிதில் அடையாளம் காட்டும்.'
      ,ex: 'Tall-Man labeling stopped a nurse from grabbing paralyzing Vecuronium instead of anti-nausea Vancomycin from the medication shelf.',
      exTa: 'பெரிய எழுத்து முறை மயக்க மருந்து தவறுதலாக ஆன்டிபயாடிக்குக்கு பதில் போவதை தடுத்தது.'
    },
    {
      q: 'During emergency cardiac resuscitation, a doctor shouts: "Give 1 mg Epinephrine IV now!". What is the mandatory response?',
      qTa: 'அவசர சிகிச்சையில் மருத்துவர் "1 மி.கி எபினெப்ரின் ஏற்றுங்கள்" என வாய்மொழியாகக் கூறினால் செவிலியர் என்ன செய்ய வேண்டும்?',
      cor: 'Closed-loop read-back: State aloud "Giving 1 mg Epinephrine IV push now", check ampoule, and confirm before injecting',
      corTa: 'சத்தமாக மறு உறுதி செய்தல்: "1 மி.கி எபினெப்ரின் ஏற்றுகிறேன்" என சத்தமாகக் கூறி உறுதி செய்து செலுத்த வேண்டும்',
      w1: 'Nod silently and inject without repeating the order',
      w1Ta: 'மவுனமாக தலையசைத்துவிட்டு ஏற்றுவது',
      w2: 'Refuse to give emergency medicine until the doctor writes it in ink',
      w2Ta: 'காகிதத்தில் எழுதும் வரை அவசர மருந்தைத் தர மறுப்பது',
      why: 'Verbal read-back prevents mishearing phonetically similar drugs (e.g., Ephedrine vs Epinephrine) under high-stress emergency codes.',
      whyTa: 'சத்தமாகக் கூறி உறுதிப்படுத்துவது ஒரே மாதிரியான மருந்துப் பெயர்களால் ஏற்படும் தவறுகளைத் தவிர்க்கும்.'
      ,ex: 'Read-back caught a misheard dose where the doctor intended 0.1 mg pediatric dose but the nurse heard 1.0 mg adult dose.',
      exTa: 'சத்தமாகக் கூறியதால் குழந்தைக்குரிய 0.1 மி.கி மருந்திற்கு பதில் 1.0 மி.கி போக இருந்த பேராபத்து தவிர்க்கப்பட்டது.'
    },
    {
      q: 'What are the core "5 Rights" of safe medication administration that must be checked every single time?',
      qTa: 'மருந்து கொடுக்கும் முன் ஒவ்வொரு முறையும் சரிபார்க்க வேண்டிய அடிப்படை "5 உரிமைகள்" எவை?',
      cor: 'Right Patient, Right Drug, Right Dose, Right Route, Right Time',
      corTa: 'சரியான நோயாளி, சரியான மருந்து, சரியான அளவு, சரியான வழி, சரியான நேரம்',
      w1: 'Right Nurse, Right Ward, Right Floor, Right Bed, Right Shift',
      w1Ta: 'சரியான செவிலியர், சரியான தளம்...',
      w2: 'Right Price, Right Brand, Right Color, Right Box, Right Syringe',
      w2Ta: 'சரியான விலை, சரியான வண்ணம்...',
      why: 'Verifying the 5 Rights at bedside eliminates the overwhelming majority of preventable medication administration errors.',
      whyTa: 'இந்த 5 உரிமைகளை சரிபார்ப்பது மருந்து தவறுகளை 100% தவிர்க்கும்.'
      ,ex: 'Checking the "Right Route" prevented a nurse from injecting oral cough syrup into an intravenous cannula port.',
      exTa: 'சரியான வழியை சரிபார்த்ததால் வாய்வழி சிரப் நரம்பு ஊசியில் போகாமல் தடுக்கப்பட்டது.'
    }
  ];

  const template = questionsList[i % questionsList.length];
  return {
    id: `med_${qNum}`,
    scenario: {
      en: `Safe Medication Case #${qNum}: ${template.q}`,
      ta: `மருந்தளிப்புப் பயிற்சி #${qNum}: ${template.qTa}`
    },
    question: {
      en: template.q,
      ta: template.qTa
    },
    options: [
      { text: { en: template.cor, ta: template.corTa }, isCorrect: true, explanation: { en: template.why, ta: template.whyTa } },
      { text: { en: template.w1, ta: template.w1Ta }, isCorrect: false, explanation: { en: 'Fatal or dangerous medication practice.', ta: 'ஆபத்தான மருந்துப் பிழை.' } },
      { text: { en: template.w2, ta: template.w2Ta }, isCorrect: false, explanation: { en: 'Violates safe pharmacology administration protocols.', ta: 'மருந்தியல் விதிகளுக்கு எதிரானது.' } }
    ],
    rationale: { en: template.why, ta: template.whyTa },
    realLifeExample: { en: template.ex, ta: template.exTa }
  };
});
