/**
 * Heuristic emergency-language detection (FR/EN/HE/RU keywords).
 * Not a medical device — used only to surface urgent banners.
 */

const EMERGENCY_PATTERNS: RegExp[] = [
  // Cardio
  /\bdouleur\s+(dans\s+la\s+|à\s+la\s+)?poitrine\b/i,
  /\boppression\s+(thoracique|dans\s+la\s+poitrine)\b/i,
  /\bchest\s+pain\b/i,
  /\bcrise\s+cardiaque\b/i,
  /\binfarctus\b/i,
  /\bheart\s+attack\b/i,
  /\bכאב\s+בחזה\b/u,
  /\bלחץ\s+בחזה\b/u,
  /\bהתקף\s+לב\b/u,
  /\bболь\s+в\s+груд/iu,
  /\bинфаркт\b/iu,

  // Respiratory distress
  /\bessoufflement\s+(soudain|sévère|grave)\b/i,
  /\bdifficult[ée]\s+(à\s+)?respirer\b/i,
  /\bcan'?t\s+breathe\b/i,
  /\bsevere\s+shortness\s+of\s+breath\b/i,
  /\bcyanose\b/i,
  /\bקושי\s+נשימה\b/u,
  /\bקוצר\s+נשימה\s+(חמור|פתאומי)\b/u,
  /\bלא\s+יכול\s+לנשום\b/u,
  /\bне\s+могу\s+дышать\b/iu,
  /\bсильная\s+одышка\b/iu,

  // Stroke
  /\bavc\b/i,
  /\bait\b/i,
  /\bstroke\b/i,
  /\bparalys(ie|é|ée)\s+(du\s+visage|d'?un\s+c[ôo]t[ée]|soudaine)\b/i,
  /\basym[ée]trie\s+(du\s+)?visage\b/i,
  /\btrouble\s+de\s+la\s+parole\s+soudain\b/i,
  /\bfacial\s+(droop|weakness)\b/i,
  /\bslurred\s+speech\b/i,
  /\bשבץ\b/u,
  /\bאירוע\s+מוחי\b/u,
  /\bצניחת\s+פנים\b/u,
  /\bинсульт\b/iu,
  /\bперекос\s+лица\b/iu,

  // Bleeding / trauma
  /\bh[ée]morragie\s+(importante|massive|abondante)\b/i,
  /\bsaignement\s+(abondant|incontr[ôo]lable|qui\s+ne\s+s'?arr[êe]te\s+pas)\b/i,
  /\bsevere\s+bleeding\b/i,
  /\bדימום\s+(כבד|חזק|בלתי\s+נשלט)\b/u,
  /\bсильное\s+кровотечение\b/iu,

  // Neuro / consciousness
  /\bperte\s+de\s+connaissance\b/i,
  /\bunconscious\b/i,
  /\bconvulsion(s)?\b/i,
  /\bs[ée]izure(s)?\b/i,
  /\bמחוסר\s+הכרה\b/u,
  /\bפרכוס\w*\b/u,
  /\bбез\s+сознания\b/iu,
  /\bсудорог\w*\b/iu,

  // Anaphylaxis
  /\banaphylaxie\b/i,
  /\bchoc\s+anaphylactique\b/i,
  /\banaphylaxis\b/i,
  /\bgonflement\s+(de\s+la\s+)?gorge\b/i,
  /\bthroat\s+swelling\b/i,
  /\bאנפילקסיס\b/u,
  /\bנפיחות\s+(ב)?גרון\b/u,
  /\bанафилакс/iu,
  /\bотёк\s+горла\b/iu,

  // Meningitis / sepsis cues
  /\bm[ée]ningite\b/i,
  /\bmeningitis\b/i,
  /\bsepsis\b/i,
  /\bseptic[ée]mie\b/i,
  /\braideur\s+de\s+(la\s+)?nuque\b/i,
  /\bstiff\s+neck\b/i,
  /\bnon[\s-]?blanching\s+rash\b/i,
  /\bדלקת\s+קרום\s+המוח\b/u,
  /\bאלח\s+דם\b/u,
  /\bנוקשות\s+עורף\b/u,
  /\bменингит\b/iu,
  /\bсепсис\b/iu,

  // Mental health crisis
  /\bsuicid(e|aire|er)\b/i,
  /\bme\s+tuer\b/i,
  /\bwant\s+to\s+(die|kill\s+myself)\b/i,
  /\bkill\s+myself\b/i,
  /\bideation\s+suicid\w*\b/i,
  /\bautodestruction\b/i,
  /\bself[\s-]?harm\b/i,
  /\bאובדנ\w*\b/u,
  /\bהתאבד\w*\b/u,
  /\bהתאבדות\b/u,
  /\bלפגוע\s+בעצמי\b/u,
  /\bсуицид\w*\b/iu,
  /\bубить\s+себя\b/iu,
  /\bпокончить\s+с\s+собой\b/iu,

  // Obstetric / toxic
  /\bsaignement\s+vaginal\s+(abondant|important).{0,40}grossesse\b/i,
  /\bgrossesse.{0,40}saignement\s+vaginal\s+(abondant|important)\b/i,
  /\bintoxication\b/i,
  /\boverdose\b/i,
  /\bמנת\s+יתר\b/u,
  /\bпередозировк/iu,

  // Clot / PE
  /\bpulmonary\s+embolism\b/i,
  /\bembolie\s+pulmonaire\b/i,
  /\bdeep\s+vein\s+thrombosis\b/i,
  /\bתסחיף\s+ריאתי\b/u,
  /\bтромбоэмболи/iu,

  // Heat stroke
  /\bheat\s+stroke\b/i,
  /\bcoup\s+de\s+chaleur\b/i,
  /\bמכת\s+חום\b/u,
  /\bтепловой\s+удар\b/iu,

  // Testicular torsion cues
  /\btesticular\s+torsion\b/i,
  /\btorsion\s+(du\s+)?testicule\b/i,
  /\bsudden\s+severe\s+testicle\s+pain\b/i,
  /\bפיתול\s+אשך\b/u,
  /\bперекрут\s+яичка\b/iu,

  // Carbon monoxide
  /\bcarbon\s+monoxide\b/i,
  /\bmonoxyde\s+de\s+carbone\b/i,
  /\bחד[\s-]?תחמוצת\s+הפחמן\b/u,
  /\bугарный\s+газ\b/iu,

  // Asthma attack
  /\basthma\s+attack\b/i,
  /\bcrise\s+d['']asthme\b/i,
  /\bהתקף\s+אסתמה\b/u,
  /\bприступ\s+астмы\b/iu,

  // Alcohol withdrawal / delirium tremens
  /\balcohol\s+withdrawal\b/i,
  /\bdelirium\s+tremens\b/i,
  /\bsevrage\s+alcool\b/i,
  /\bגמילה\s+מאלכוהול\b/u,
  /\bабстиненц\w*\s+алкогол/iu,
  /\bбелая\s+горячка\b/iu,

  // Sudden confusion / delirium
  /\bsudden\s+confusion\b/i,
  /\bconfusion\s+soudaine\b/i,
  /\bבלבול\s+פתאומי\b/u,
  /\bвнезапн\w*\s+спутанност/iu,

  // Ectopic pregnancy
  /\bectopic\s+pregnancy\b/i,
  /\bgrossesse\s+extra[\s-]?ut[ée]rine\b/i,
  /\bהריון\s+חוץ[\s-]?רחמי\b/u,
  /\bвнематочн\w*\s+беременност/iu,

  // Malaria / post-travel fever
  /\bmalaria\b/i,
  /\bpaludisme\b/i,
  /\bמלריה\b/u,
  /\bмалярия\b/iu,
  /\bfever\s+after\s+travel\b/i,
  /\bfi[èe]vre\s+apr[èe]s\s+voyage\b/i,

  // Head injury red flags (severe)
  /\bhead\s+injury\b/i,
  /\btraumatisme\s+cr[âa]nien\b/i,
  /\bחבלת\s+ראש\b/u,
  /\bтравма\s+головы\b/iu,

  // Neonatal jaundice red flags (baby <24h / not feeding framed via keywords)
  /\bneonatal\s+jaundice\b/i,
  /\bjaundice\s+(in\s+)?(newborn|baby|babies)\b/i,
  /\bict[èe]re\s+(du\s+)?nouveau[\s-]?n[ée]\b/i,
  /\bצהבת\s+(ב)?(יילוד|תינוק)\b/u,
  /\bжелтуха\s+новорождённ/iu,

  // Severe dengue
  /\bsevere\s+dengue\b/i,
  /\bdengue\s+s[ée]v[èe]re\b/i,
  /\bדנגי\b/u,
  /\bденге\b/iu,

  // COPD severe distress already covered by breath patterns; keep named cue
  /\bCOPD\s+(attack|exacerbation|flare)\b/i,
  /\bexacerbation\s+(de\s+)?BPCO\b/i,

  // Rabies exposure
  /\brabies\b/i,
  /\brage\b/i,
  /\bכלבת\b/u,
  /\bбешенств/iu,

  // Temporal arteritis / giant cell
  /\btemporal\s+arteritis\b/i,
  /\bgiant\s+cell\s+arteritis\b/i,
  /\bart[ée]rite\s+temporale\b/i,
  /\bmaladie\s+de\s+Horton\b/i,
  /\bדלקת\s+עורקים\s+רקתית\b/u,
  /\bвисочн\w*\s+артериит\b/iu,

  // Acute pancreatitis
  /\bpancreatitis\b/i,
  /\bpancr[ée]atite\b/i,
  /\bדלקת\s+לבלב\b/u,
  /\bпанкреатит\b/iu,
];

const NEGATION =
  /\b(pas\s+de|sans|aucune?|non|not|no|without|בלי|ללא|нет|без)\b[\s\S]{0,24}$/i;

export type EmergencyInfo = {
  detected: boolean;
  matched: string[];
};

export function detectEmergency(text: string): EmergencyInfo {
  const matched: string[] = [];
  for (const pattern of EMERGENCY_PATTERNS) {
    const re = new RegExp(
      pattern.source,
      pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`,
    );
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const before = text.slice(Math.max(0, m.index - 24), m.index);
      if (NEGATION.test(before.trimEnd()) || NEGATION.test(before)) {
        continue;
      }
      matched.push(m[0]);
      break;
    }
  }
  return { detected: matched.length > 0, matched };
}

export const EMERGENCY_NUMBERS = {
  france: [
    { label: "SAMU", number: "15" },
    { label: "Urgences européennes", number: "112" },
    { label: "Pompiers", number: "18" },
    { label: "Urgence sourds/malentendants", number: "114" },
  ],
  israel: [
    { label: "Magen David Adom", number: "101" },
    { label: "Police", number: "100" },
    { label: "Pompiers", number: "102" },
  ],
} as const;
