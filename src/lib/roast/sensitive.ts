// Topics Crispy never jokes about. Anything that clearly touches them is dropped from the
// digest before the AI sees it, and the system prompt forbids them too. False positives
// are fine here: losing a harmless title costs nothing, sending a sensitive one does.

const TERMS = [
  // Health and bodies
  "cancer", "chemo", "tumou?r", "diabetes", "diagnos(is|ed)", "disease", "illness", "surgery", "hospital",
  "pregnan(t|cy)", "miscarriage", "fertility", "ivf", "abortion", "weight ?loss", "ozempic", "diet pills?",
  "eating disorder", "anorexia", "bulimia", "body ?dysmorphia", "disabilit(y|ies)", "wheelchair", "chronic pain",
  "medication", "symptoms?", "doctor explains", "std", "hiv",
  // Mental health
  "depress(ion|ed)", "anxiety", "panic attacks?", "therap(y|ist)", "suicid(e|al)", "self[- ]?harm", "mental health",
  "adhd", "autis(m|tic)", "bipolar", "ptsd", "ocd", "trauma", "schizophren", "lonel(y|iness)", "burnout",
  "addiction", "rehab", "sobriety", "relapse", "alcoholi(c|sm)", "overdose",
  // Grief
  "grief", "grieving", "funeral", "passed away", "in memoriam", "memorial", "rest in peace", "rip", "died",
  "death of", "condolences?", "obituary", "tribute to",
  // Religion
  "church", "sermon", "bible", "gospel", "jesus", "christ(ian|ianity)?", "god", "allah", "islam(ic)?", "muslims?",
  "quran", "koran", "ramadan", "hindu(ism)?", "bhagavad", "gita", "krishna", "shiva", "ganesh", "temple", "mosque",
  "synagogue", "jewish", "judaism", "torah", "rabbi", "buddh(a|ism|ist)", "sikh(ism)?", "gurdwara", "prayers?",
  "worship", "pastor", "imam", "pope", "religio(n|us)", "atheis(m|t)", "spiritual",
  // Sexuality and gender identity
  "gay", "lesbian", "lgbt\\w*", "queer", "bisexual", "transgender", "trans", "non[- ]?binary", "coming out",
  "sexuality", "sexual", "sex", "porn\\w*", "onlyfans", "nsfw", "erotic", "fetish",
  // Politics
  "politic(s|al|ian)?", "election", "elections", "vote", "voting", "ballot", "senate", "congress", "parliament",
  "democrats?", "republicans?", "liberals?", "conservatives?", "left[- ]?wing", "right[- ]?wing", "trump", "biden",
  "harris", "obama", "modi", "bjp", "rahul gandhi", "putin", "zelensky", "netanyahu", "israel", "palestin\\w*",
  "gaza", "hamas", "ukraine", "immigration", "protest", "propaganda", "president",
  // Money troubles
  "bankrupt(cy)?", "debt relief", "in debt", "eviction", "evicted", "foreclosure", "unemploy(ed|ment)", "laid off",
  "layoffs?", "can't afford", "broke and",
];

const PATTERN = new RegExp(`(^|[^\\p{L}\\p{N}])(${TERMS.join("|")})(?=$|[^\\p{L}\\p{N}])`, "iu");

export function isSensitive(text: string | null | undefined) {
  return Boolean(text && PATTERN.test(text));
}

/** Keeps only items whose text fields are all clear. */
export function dropSensitive<T>(items: T[], fields: (item: T) => (string | null | undefined)[]) {
  return items.filter((item) => !fields(item).some(isSensitive));
}
