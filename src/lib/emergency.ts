/**
 * Heuristic emergency-language detection (FR/EN/HE keywords).
 * Not a medical device — used only to surface urgent banners.
 */

const EMERGENCY_PATTERNS: RegExp[] = [
  /\bdouleur\s+(dans\s+la\s+|à\s+la\s+)?poitrine\b/i,
  /\boppression\s+(thoracique|dans\s+la\s+poitrine)\b/i,
  /\bchest\s+pain\b/i,
  /\bcrise\s+cardiaque\b/i,
  /\bheart\s+attack\b/i,
  /\bessoufflement\s+(soudain|sévère|grave)\b/i,
  /\bdifficult[ée]\s+(à\s+)?respirer\b/i,
  /\bcan'?t\s+breathe\b/i,
  /\bcyanose\b/i,
  /\bavc\b/i,
  /\bstroke\b/i,
  /\bparalys(ie|é|ée)\s+(du\s+visage|d'?un\s+c[ôo]t[ée]|soudaine)\b/i,
  /\basym[ée]trie\s+(du\s+)?visage\b/i,
  /\btrouble\s+de\s+la\s+parole\s+soudain\b/i,
  /\bfacial\s+(droop|weakness)\b/i,
  /\bh[ée]morragie\s+(importante|massive|abondante)\b/i,
  /\bsaignement\s+(abondant|incontr[ôo]lable|qui\s+ne\s+s'?arr[êe]te\s+pas)\b/i,
  /\bsevere\s+bleeding\b/i,
  /\bperte\s+de\s+connaissance\b/i,
  /\bunconscious\b/i,
  /\bconvulsion(s)?\b/i,
  /\bs[ée]izure(s)?\b/i,
  /\banaphylaxie\b/i,
  /\bchoc\s+anaphylactique\b/i,
  /\bgonflement\s+(de\s+la\s+)?gorge\b/i,
  /\bthroat\s+swelling\b/i,
  /\bsuicid(e|aire|er)\b/i,
  /\bme\s+tuer\b/i,
  /\bwant\s+to\s+(die|kill\s+myself)\b/i,
  /\bideation\s+suicid\w*\b/i,
  /\bautodestruction\b/i,
  /\bsaignement\s+vaginal\s+(abondant|important).{0,40}grossesse\b/i,
  /\bgrossesse.{0,40}saignement\s+vaginal\s+(abondant|important)\b/i,
  /\bintoxication\b/i,
  /\boverdose\b/i,
  // Hebrew
  /\bכאב\s+בחזה\b/u,
  /\bהתקף\s+לב\b/u,
  /\bקושי\s+נשימה\b/u,
  /\bשבץ\b/u,
  /\bאובדנ\w*\b/u,
  /\bהתאבד\w*\b/u,
  /\bפרכוס\w*\b/u,
  /\bדימום\s+כבד\b/u,
  // Russian
  /\bболь\s+в\s+груд/i,
  /\bинфаркт\b/i,
  /\bинсульт\b/i,
  /\bне\s+могу\s+дышать\b/i,
  /\bсуицид\w*\b/i,
  /\bсудорог\w*\b/i,
  /\bсильное\s+кровотечение\b/i,
];

const NEGATION =
  /\b(pas\s+de|sans|aucune?|non|not|no|without)\b[\s\S]{0,24}$/i;

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
  ],
  israel: [
    { label: "Magen David Adom", number: "101" },
    { label: "Police", number: "100" },
    { label: "Pompiers", number: "102" },
  ],
} as const;
