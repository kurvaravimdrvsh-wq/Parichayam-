export type Lang = "te" | "en";

export type Line = { te: string; en: string };

export function tx(lang: Lang, line: Line): string {
  return line[lang];
}

export const CITIES: { id: string; te: string; en: string }[] = [
  { id: "hyderabad", te: "హైదరాబాద్", en: "Hyderabad" },
  { id: "vijayawada", te: "విజయవాడ", en: "Vijayawada" },
  { id: "warangal", te: "వరంగల్", en: "Warangal" },
  { id: "visakhapatnam", te: "విశాఖపట్నం", en: "Visakhapatnam" },
  { id: "tirupati", te: "తిరుపతి", en: "Tirupati" },
  { id: "guntur", te: "గుంటూరు", en: "Guntur" },
  { id: "rajahmundry", te: "రాజమండ్రి", en: "Rajahmundry" },
  { id: "nellore", te: "నెల్లూరు", en: "Nellore" },
  { id: "kakinada", te: "కాకినాడ", en: "Kakinada" },
  { id: "karimnagar", te: "కరీంనగర్", en: "Karimnagar" },
];

export const INTERESTS: { id: string; te: string; en: string }[] = [
  { id: "coffee", te: "కాఫీ", en: "Coffee" },
  { id: "books", te: "పుస్తకాలు", en: "Books" },
  { id: "cinema", te: "సినిమా", en: "Cinema" },
  { id: "cooking", te: "వంటలు", en: "Cooking" },
  { id: "travel", te: "ప్రయాణం", en: "Travel" },
  { id: "music", te: "సంగీతం", en: "Music" },
  { id: "cricket", te: "క్రికెట్", en: "Cricket" },
  { id: "photo", te: "ఫోటోలు", en: "Photos" },
  { id: "dance", te: "నృత్యం", en: "Dance" },
  { id: "nature", te: "ప్రకృతి", en: "Nature" },
  { id: "poetry", te: "కవిత్వం", en: "Poetry" },
  { id: "food", te: "తినుబండారం", en: "Food" },
];

export const INTENTS: { id: "friend" | "date" | "serious"; te: string; en: string }[] = [
  { id: "friend", te: "స్నేహం", en: "Friendship" },
  { id: "date", te: "డేటింగ్", en: "Dating" },
  { id: "serious", te: "పెళ్లి ఆలోచన", en: "Something serious" },
];

export function cityName(lang: Lang, id: string): string {
  const city = CITIES.find((item) => item.id === id);
  return city ? city[lang] : id;
}

export function interestName(lang: Lang, id: string): string {
  const item = INTERESTS.find((row) => row.id === id);
  return item ? item[lang] : id;
}

export function intentName(lang: Lang, id: string): string {
  const item = INTENTS.find((row) => row.id === id);
  return item ? item[lang] : id;
}

export const copy = {
  tagline: {
    te: "కొత్త పరిచయాలకు కొత్త ప్రారంభం.",
    en: "A new beginning for new introductions.",
  },
  start: { te: "మొదలుపెడదాం", en: "Begin" },
  sample: {
    te: "ఇక్కడి ముఖాలు నమూనా పరిచయాలు. మీ వివరాలు ఈ పరికరంలోనే ఉంటాయి.",
    en: "These faces are sample introductions. Your details stay on this device.",
  },
  nameTitle: { te: "మీ పేరు ఏమిటి?", en: "What is your name?" },
  nameHint: {
    te: "పరిచయంలో ఇదే కనిపిస్తుంది.",
    en: "This is the name people will see.",
  },
  ageCityTitle: { te: "వయసు, నగరం", en: "Age and city" },
  age: { te: "వయసు", en: "Age" },
  city: { te: "నగరం", en: "City" },
  adult: { te: "18 ఏళ్లు నిండి ఉండాలి.", en: "You need to be 18 or older." },
  intentTitle: { te: "ఎవరిని కలవాలనుకుంటున్నారు?", en: "Who are you hoping to meet?" },
  interestsTitle: { te: "మీకు ఏమి నచ్చుతుంది?", en: "What do you enjoy?" },
  interestsHint: { te: "కనీసం రెండు ఎంచుకోండి.", en: "Choose at least two." },
  bioTitle: { te: "మిమ్మల్ని ఒక పంక్తిలో చెప్పండి", en: "Say it in one line" },
  bioHint: { te: "ఖాళీగా వదిలేయొచ్చు.", en: "You can leave this blank." },
  bioPlaceholder: {
    te: "ఉదాహరణ: ఆదివారం ఉదయం కాఫీ, సాయంత్రం ఒక నడక.",
    en: "Example: Sunday morning coffee, an evening walk.",
  },
  next: { te: "తర్వాత", en: "Next" },
  back: { te: "వెనక్కి", en: "Back" },
  enter: { te: "పరిచయాలు చూడండి", en: "See introductions" },
  discover: { te: "కొత్తవి", en: "New" },
  matches: { te: "పరిచయాలు", en: "Intros" },
  profile: { te: "నేను", en: "Me" },
  pass: { te: "వద్దు", en: "Pass" },
  like: { te: "నచ్చింది", en: "Like" },
  years: { te: "ఏళ్లు", en: "yrs" },
  firstMeet: { te: "మొదటి కలుపు", en: "A first meeting" },
  emptyTitle: { te: "ఈ దగ్గరి పరిచయాలు అయిపోయాయి", en: "You have seen everyone nearby" },
  emptyBody: {
    te: "వదిలేసిన వారిని మళ్లీ చూడొచ్చు. ఇప్పటికే అయిన పరిచయాలు అలాగే ఉంటాయి.",
    en: "You can look again at people you passed. Introductions you already made stay.",
  },
  review: { te: "మళ్లీ చూడండి", en: "Look again" },
  matched: { te: "పరిచయం అయింది", en: "You are introduced" },
  matchedBody: {
    te: "మీరిద్దరూ ఒకరినొకరు నచ్చుకున్నారు.",
    en: "You both wanted to meet.",
  },
  sayHi: { te: "సందేశం పంపండి", en: "Send a note" },
  later: { te: "తర్వాత", en: "Later" },
  noMatches: { te: "ఇంకా పరిచయాలు లేవు", en: "No introductions yet" },
  noMatchesBody: {
    te: "మీకు నచ్చిన వారు మిమ్మల్ని కూడా నచ్చుకుంటే ఇక్కడ కనిపిస్తారు.",
    en: "When someone you like likes you too, they show up here.",
  },
  you: { te: "మీరు", en: "You" },
  write: { te: "సందేశం రాయండి", en: "Write a note" },
  send: { te: "పంపండి", en: "Send" },
  myDetails: { te: "నా వివరాలు", en: "My details" },
  about: { te: "నా గురించి", en: "About me" },
  save: { te: "భద్రపరచండి", en: "Save" },
  saved: { te: "భద్రమైంది", en: "Saved" },
  language: { te: "భాష", en: "Language" },
  hoping: { te: "వెతుకుతున్నది", en: "Hoping for" },
  redo: { te: "వదిలేసిన వారిని తిరిగి తెచ్చు", en: "Bring back people I passed" },
  erase: { te: "అంతా చెరిపి మళ్లీ మొదలుపెట్టు", en: "Erase everything and start over" },
  eraseHint: {
    te: "పరిచయాలు, సందేశాలు, మీ వివరాలు పోతాయి.",
    en: "Introductions, notes, and your details will be removed.",
  },
  confirmErase: { te: "అవును, చెరిపేయి", en: "Yes, erase" },
  cancel: { te: "వద్దు", en: "Cancel" },
  name: { te: "పేరు", en: "Name" },
  keyHint: {
    te: "కుడి బాణం నచ్చింది, ఎడమ బాణం వద్దు.",
    en: "Right arrow to like, left arrow to pass.",
  },
} as const;
