export type Locale = "en" | "te" | "hi" | "ta";
export type RegionalLocale = Exclude<Locale, "en">;

export type UnitId = "programming" | "engineering" | "math" | "lab" | "career";

export interface Unit {
  id: UnitId;
  emoji: string;
}

export interface Word {
  id: string;
  term: string;
  phonetic: string;
  definition: string;
  sentence: string;
  tier: 1 | 2 | 3;
  unit: UnitId;
  emoji: string;
  translation: Record<RegionalLocale, string>;
  /** How the English word sounds, written in the regional script. */
  sayAs: Record<RegionalLocale, string>;
}

export const UNITS: Unit[] = [
  { id: "programming", emoji: "💻" },
  { id: "engineering", emoji: "⚙️" },
  { id: "math", emoji: "📐" },
  { id: "lab", emoji: "🧪" },
  { id: "career", emoji: "💼" },
];

type Row = [
  term: string,
  phonetic: string,
  definition: string,
  sentence: string,
  tier: 1 | 2 | 3,
  emoji: string,
  te: string,
  teSay: string,
  hi: string,
  hiSay: string,
  ta: string,
  taSay: string,
];

const RAW: Record<UnitId, Row[]> = {
  programming: [
    ["Algorithm", "AL-guh-rith-um", "A step-by-step method to solve a problem.", "We wrote an algorithm to sort the student marks.", 1, "🧭", "క్రమసూత్ర పద్ధతి", "అల్గారిథమ్", "कलन विधि", "एल्गोरिदम", "படிமுறை", "அல்காரிதம்"],
    ["Variable", "VAIR-ee-uh-bul", "A named box that stores a value which can change.", "Store the total price in a variable called sum.", 1, "📦", "చరరాశి", "వేరియబుల్", "चर", "वेरिएबल", "மாறி", "வேரியபிள்"],
    ["Function", "FUNK-shun", "A reusable block of code that does one job.", "This function returns the area of a circle.", 1, "🔧", "ప్రమేయం", "ఫంక్షన్", "फलन", "फ़ंक्शन", "சார்பு", "ஃபங்ஷன்"],
    ["Loop", "LOOP", "Code that repeats until a condition is met.", "The loop prints numbers from one to ten.", 1, "🔁", "పునరావృతం", "లూప్", "पुनरावृत्ति", "लूप", "மடக்கு", "லூப்"],
    ["Array", "uh-RAY", "An ordered list of values stored together.", "Keep all the sensor readings in an array.", 1, "🧮", "శ్రేణి", "అరే", "सरणी", "ऐरे", "அணி", "அரே"],
    ["Compiler", "kum-PIE-ler", "A program that translates code into machine language.", "The compiler found an error on line twelve.", 2, "🏭", "అనువాదక ప్రోగ్రామ్", "కంపైలర్", "संकलक", "कंपाइलर", "தொகுப்பி", "கம்பைலர்"],
    ["Syntax", "SIN-tax", "The grammar rules of a programming language.", "A missing semicolon is a syntax error.", 2, "📝", "వాక్య నిర్మాణం", "సింటాక్స్", "वाक्य-विन्यास", "सिंटैक्स", "தொடரியல்", "சின்டாக்ஸ்"],
    ["Debug", "dee-BUG", "To find and fix mistakes in code.", "We spent an hour trying to debug the login page.", 1, "🐞", "దోషాలు సరిచేయడం", "డీబగ్", "त्रुटि सुधारना", "डीबग", "பிழைநீக்கம்", "டீபக்"],
    ["Database", "DAY-tuh-base", "An organised collection of stored information.", "Student records are saved in the college database.", 2, "🗄️", "దత్తాంశ నిధి", "డేటాబేస్", "आँकड़ा कोष", "डेटाबेस", "தரவுத்தளம்", "டேட்டாபேஸ்"],
    ["Network", "NET-work", "Computers connected to share data.", "The lab computers are connected to one network.", 1, "🕸️", "జాలం", "నెట్‌వర్క్", "जाल तंत्र", "नेटवर्क", "வலையமைப்பு", "நெட்வொர்க்"],
  ],
  engineering: [
    ["Voltage", "VOHL-tij", "The electrical push that moves current.", "The battery supplies a voltage of nine volts.", 1, "🔋", "విద్యుత్ పీడనం", "వోల్టేజ్", "वोल्टता", "वोल्टेज", "மின்னழுத்தம்", "வோல்டேஜ்"],
    ["Current", "KUR-ent", "The flow of electric charge.", "Measure the current flowing through the bulb.", 1, "⚡", "విద్యుత్ ప్రవాహం", "కరెంట్", "विद्युत धारा", "करंट", "மின்னோட்டம்", "கரண்ட்"],
    ["Resistance", "ri-ZIS-tunce", "How much a material opposes current.", "Copper wire has very low resistance.", 2, "🚧", "నిరోధం", "రెసిస్టెన్స్", "प्रतिरोध", "रेज़िस्टेंस", "மின்தடை", "ரெசிஸ்டன்ஸ்"],
    ["Circuit", "SUR-kit", "A closed path through which current flows.", "Close the switch to complete the circuit.", 1, "🔌", "వలయం", "సర్క్యూట్", "परिपथ", "सर्किट", "மின்சுற்று", "சர்க்யூட்"],
    ["Velocity", "vuh-LOSS-ih-tee", "Speed in a given direction.", "The velocity of the car is sixty kilometres per hour north.", 2, "🏎️", "వేగం", "వెలాసిటీ", "वेग", "वेलॉसिटी", "திசைவேகம்", "வெலாசிட்டி"],
    ["Acceleration", "ak-SEL-uh-RAY-shun", "The rate at which velocity changes.", "Gravity gives every object the same acceleration.", 2, "🚀", "త్వరణం", "యాక్సిలరేషన్", "त्वरण", "एक्सेलरेशन", "முடுக்கம்", "ஆக்சிலரேஷன்"],
    ["Friction", "FRIK-shun", "A force that resists sliding between surfaces.", "Friction slows the bicycle when you brake.", 1, "🛞", "ఘర్షణ", "ఫ్రిక్షన్", "घर्षण", "फ्रिक्शन", "உராய்வு", "ஃப்ரிக்ஷன்"],
    ["Torque", "TORK", "A turning force around an axis.", "A longer spanner gives more torque on the bolt.", 3, "🔩", "భ్రామకం", "టార్క్", "बल आघूर्ण", "टॉर्क", "முறுக்குவிசை", "டார்க்"],
    ["Pressure", "PRESH-er", "Force applied on a unit area.", "Water pressure increases with depth.", 1, "🎈", "పీడనం", "ప్రెషర్", "दाब", "प्रेशर", "அழுத்தம்", "பிரஷர்"],
    ["Thermodynamics", "THUR-moh-dy-NAM-iks", "The science of heat, work and energy.", "Thermodynamics explains how an engine converts heat into work.", 3, "🔥", "ఉష్ణగతిక శాస్త్రం", "థర్మోడైనమిక్స్", "ऊष्मागतिकी", "थर्मोडायनामिक्स", "வெப்ப இயக்கவியல்", "தெர்மோடைனமிக்ஸ்"],
  ],
  math: [
    ["Equation", "ih-KWAY-zhun", "A statement that two expressions are equal.", "Solve the equation to find the value of x.", 1, "🟰", "సమీకరణం", "ఈక్వేషన్", "समीकरण", "इक्वेशन", "சமன்பாடு", "ஈக்வேஷன்"],
    ["Derivative", "dih-RIV-uh-tiv", "The rate at which a quantity changes.", "The derivative of distance with respect to time is speed.", 3, "📈", "అవకలజం", "డెరివేటివ్", "अवकलज", "डेरिवेटिव", "வகைக்கெழு", "டெரிவேட்டிவ்"],
    ["Integral", "IN-tuh-grul", "The total area under a curve.", "Use an integral to find the area under the graph.", 3, "∫", "సమాకలనం", "ఇంటిగ్రల్", "समाकलन", "इंटीग्रल", "தொகையீடு", "இன்டெக்ரல்"],
    ["Matrix", "MAY-triks", "A rectangular grid of numbers.", "Multiply the matrix by the vector.", 2, "🔢", "మాత్రిక", "మ్యాట్రిక్స్", "आव्यूह", "मैट्रिक्स", "அணிக்கோவை", "மேட்ரிக்ஸ்"],
    ["Vector", "VEK-ter", "A quantity with size and direction.", "Force is a vector because it has direction.", 2, "➡️", "సదిశ", "వెక్టర్", "सदिश", "वेक्टर", "திசையன்", "வெக்டர்"],
    ["Probability", "prob-uh-BIL-ih-tee", "How likely something is to happen.", "The probability of getting heads is one half.", 2, "🎲", "సంభావ్యత", "ప్రాబబిలిటీ", "प्रायिकता", "प्रोबेबिलिटी", "நிகழ்தகவு", "ப்ராபபிலிட்டி"],
    ["Hypothesis", "hy-POTH-uh-sis", "An idea you test with an experiment.", "Our hypothesis is that heat increases the reaction speed.", 3, "💡", "పరికల్పన", "హైపోథిసిస్", "परिकल्पना", "हाइपोथीसिस", "கருதுகோள்", "ஹைபோதிசிஸ்"],
    ["Analysis", "uh-NAL-uh-sis", "Careful study of something in detail.", "The data analysis shows a clear pattern.", 2, "🔍", "విశ్లేషణ", "అనాలిసిస్", "विश्लेषण", "एनालिसिस", "பகுப்பாய்வு", "அனாலிசிஸ்"],
    ["Graph", "GRAF", "A drawing that shows data or relationships.", "Plot the results on a graph.", 1, "📊", "రేఖాచిత్రం", "గ్రాఫ్", "आलेख", "ग्राफ़", "வரைபடம்", "கிராஃப்"],
    ["Ratio", "RAY-shee-oh", "A comparison of two quantities.", "Mix cement and sand in the ratio one to three.", 1, "➗", "నిష్పత్తి", "రేషియో", "अनुपात", "रेशियो", "விகிதம்", "ரேஷியோ"],
  ],
  lab: [
    ["Experiment", "ik-SPER-uh-ment", "A test done to discover or prove something.", "We did an experiment to measure the boiling point.", 1, "⚗️", "ప్రయోగం", "ఎక్స్‌పెరిమెంట్", "प्रयोग", "एक्सपेरिमेंट", "சோதனை", "எக்ஸ்பெரிமென்ட்"],
    ["Laboratory", "LAB-ruh-tor-ee", "A room equipped for scientific work.", "Wear safety goggles inside the laboratory.", 1, "🧪", "ప్రయోగశాల", "లేబొరేటరీ", "प्रयोगशाला", "लैबोरेटरी", "ஆய்வகம்", "லேபரட்டரி"],
    ["Assignment", "uh-SINE-ment", "A task given by a teacher to complete.", "Submit the assignment before Friday.", 1, "📚", "అప్పగించిన పని", "అసైన్‌మెంట్", "दत्त कार्य", "असाइनमेंट", "ஒப்படைப்பு", "அசைன்மென்ட்"],
    ["Lecture", "LEK-cher", "A talk given to teach a class.", "The professor's lecture was about electric motors.", 1, "🎓", "ఉపన్యాసం", "లెక్చర్", "व्याख्यान", "लेक्चर", "விரிவுரை", "லெக்சர்"],
    ["Prototype", "PROH-tuh-type", "A first working model of a product.", "Our team built a prototype of the water sensor.", 2, "🛠️", "తొలి నమూనా", "ప్రోటోటైప్", "आदिरूप", "प्रोटोटाइप", "முன்மாதிரி", "புரோட்டோடைப்"],
    ["Specification", "spes-ih-fih-KAY-shun", "A detailed description of requirements.", "Check the specification before buying the motor.", 3, "📋", "నిర్దేశాలు", "స్పెసిఫికేషన్", "विनिर्देश", "स्पेसिफिकेशन", "விவரக்குறிப்பு", "ஸ்பெசிஃபிகேஷன்"],
    ["Measurement", "MEZH-er-ment", "The size or amount found by measuring.", "Write down every measurement in your lab record.", 1, "📏", "కొలత", "మెజర్‌మెంట్", "माप", "मेज़रमेंट", "அளவீடு", "மெஷர்மென்ட்"],
    ["Calibration", "kal-ih-BRAY-shun", "Adjusting an instrument so it reads correctly.", "Do the calibration of the scale before weighing.", 3, "🎚️", "క్రమాంకనం", "క్యాలిబ్రేషన్", "अंशांकन", "कैलिब्रेशन", "அளவுத்திருத்தம்", "கேலிப்ரேஷன்"],
    ["Diagram", "DY-uh-gram", "A simple drawing that explains how something works.", "Draw a neat diagram of the circuit.", 1, "🗺️", "చిత్రపటం", "డయాగ్రమ్", "आरेख", "डायग्राम", "விளக்கப்படம்", "டயாகிராம்"],
    ["Simulation", "sim-yuh-LAY-shun", "A computer model that imitates a real process.", "The simulation shows how the bridge handles heavy load.", 2, "🖥️", "అనుకరణ", "సిమ్యులేషన్", "अनुकरण", "सिमुलेशन", "உருவகப்படுத்தல்", "சிமுலேஷன்"],
  ],
  career: [
    ["Resume", "REZ-oo-may", "A short document listing your skills and experience.", "Keep your resume to one page.", 1, "📄", "స్వవివరణ పత్రం", "రెజ్యూమే", "बायोडाटा", "रिज़्यूमे", "சுயவிவரம்", "ரெஸ்யூமே"],
    ["Interview", "IN-ter-vyoo", "A formal meeting where an employer asks you questions.", "I have a placement interview tomorrow morning.", 1, "🤝", "ముఖాముఖి", "ఇంటర్వ్యూ", "साक्षात्कार", "इंटरव्यू", "நேர்காணல்", "இன்டர்வியூ"],
    ["Teamwork", "TEEM-work", "Working well together with others.", "Good teamwork helped us finish the project early.", 1, "👥", "జట్టుకృషి", "టీమ్‌వర్క్", "सामूहिक कार्य", "टीमवर्क", "குழுப்பணி", "டீம்வொர்க்"],
    ["Deadline", "DED-line", "The latest time to finish a task.", "The deadline for the report is Monday.", 1, "⏰", "గడువు", "డెడ్‌లైన్", "समय सीमा", "डेडलाइन", "காலக்கெடு", "டெட்லைன்"],
    ["Presentation", "prez-un-TAY-shun", "A talk that explains an idea to an audience.", "She gave a clear presentation on solar energy.", 2, "📽️", "ప్రదర్శన", "ప్రెజెంటేషన్", "प्रस्तुति", "प्रेज़ेंटेशन", "விளக்கக்காட்சி", "பிரசன்டேஷன்"],
    ["Communication", "kuh-myoo-nih-KAY-shun", "Sharing ideas clearly with others.", "Strong communication skills help in every job.", 2, "🗣️", "భావ ప్రసారం", "కమ్యూనికేషన్", "संचार", "कम्युनिकेशन", "தகவல்தொடர்பு", "கம்யூனிகேஷன்"],
    ["Leadership", "LEE-der-ship", "The ability to guide and motivate a group.", "He showed leadership by organising the tech fest.", 2, "🧑‍✈️", "నాయకత్వం", "లీడర్‌షిప్", "नेतृत्व", "लीडरशिप", "தலைமைத்துவம்", "லீடர்ஷிப்"],
    ["Project", "PROJ-ekt", "A planned piece of work with a goal.", "Our final year project is a smart irrigation system.", 1, "🎯", "ప్రణాళిక పని", "ప్రాజెక్ట్", "परियोजना", "प्रोजेक्ट", "திட்டம்", "ப்ராஜெக்ட்"],
    ["Feedback", "FEED-back", "Comments that help you improve.", "The interviewer gave me useful feedback.", 1, "💬", "అభిప్రాయం", "ఫీడ్‌బ్యాక్", "प्रतिक्रिया", "फ़ीडबैक", "பின்னூட்டம்", "ஃபீட்பேக்"],
    ["Internship", "IN-turn-ship", "Short-term work to gain experience.", "I did a summer internship at a power plant.", 2, "🏢", "శిక్షణ ఉద్యోగం", "ఇంటర్న్‌షిప్", "प्रशिक्षुता", "इंटर्नशिप", "பயிற்சிப்பணி", "இன்டர்ன்ஷிப்"],
  ],
};

export const WORDS: Word[] = (Object.entries(RAW) as [UnitId, Row[]][]).flatMap(([unit, rows]) =>
  rows.map(([term, phonetic, definition, sentence, tier, emoji, te, teSay, hi, hiSay, ta, taSay]) => ({
    id: term.toLowerCase(),
    term,
    phonetic,
    definition,
    sentence,
    tier,
    unit,
    emoji,
    translation: { te, hi, ta },
    sayAs: { te: teSay, hi: hiSay, ta: taSay },
  })),
);

export const WORDS_BY_ID: Record<string, Word> = Object.fromEntries(WORDS.map((w) => [w.id, w]));

export function wordsInUnit(unitId: UnitId) {
  return WORDS.filter((w) => w.unit === unitId);
}
