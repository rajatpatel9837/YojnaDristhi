/**
 * hindiNumberParser.js
 * Pure JavaScript parser to convert spoken Hindi/Indian number expressions into numeric values.
 * Handles Devanagari numerals, Hindi words (0-100), Indian multipliers (हज़ार, लाख, करोड़),
 * fractions (आधा, डेढ़, ढाई, साढ़े), and digit fallbacks.
 */

// Devanagari digit mapping
const DEVANAGARI_DIGITS = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

// Hindi words for 0 to 100
const HINDI_NUMBER_WORDS = {
  'शून्य': 0, 'जीरो': 0, 'सिफर': 0,
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5,
  'छह': 6, 'छः': 6, 'छे': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
  'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15,
  'सोलह': 16, 'सत्रह': 17, 'अठारह': 18, 'अट्ठारह': 18, 'उन्नीस': 19, 'बीस': 20,
  'इक्कीस': 21, 'बाईस': 22, 'तेईस': 23, 'चौबीस': 24, 'पच्चीस': 25,
  'छब्बीस': 26, 'सत्ताईस': 27, 'अट्ठाईस': 28, 'अठ्ठाईस': 28, 'उनतीस': 29, 'तीस': 30,
  'इकतीस': 31, 'बत्तीस': 32, 'तैंतीस': 33, 'चौंतीस': 34, 'पैंतीस': 35,
  'छत्तीस': 36, 'सैंतीस': 37, 'अड़तीस': 38, 'उनतालीस': 39, 'चालीस': 40,
  'इकतालीस': 41, 'बयालीस': 42, 'तैंतालीस': 43, 'चवालीस': 44, 'पैंतालीस': 45,
  'छियालीस': 46, 'सैंतालीस': 47, 'अड़तालीस': 48, 'उनचास': 49, 'पचास': 50,
  'एकावन': 51, 'बावन': 52, 'तिरपन': 53, 'चौवन': 54, 'पचपन': 55,
  'छप्पन': 56, 'सत्तावन': 57, 'अट्ठावन': 58, 'उनसठ': 59, 'साठ': 60,
  'इकसठ': 61, 'बासठ': 62, 'तिरसठ': 63, 'चौंसठ': 64, 'पैंसठ': 65,
  'छियासठ': 66, 'सड़सठ': 67, 'अड़सठ': 68, 'उनहत्तर': 69, 'सत्तर': 70,
  'इकहत्तर': 71, 'बहत्तर': 72, 'तिहत्तर': 73, 'चौहत्तर': 74, 'पचहत्तर': 75,
  'छिहत्तर': 76, 'सतहत्तर': 77, 'अठहत्तर': 78, 'उन्यासी': 79, 'अस्सी': 80,
  'इक्यासी': 81, 'बयासी': 82, 'तिरासी': 83, 'चौरासी': 84, 'पचासी': 85,
  'छियासी': 86, 'सत्तासी': 87, 'अठासी': 88, 'नवासी': 89, 'नब्बे': 90,
  'इक्यानवे': 91, 'बयानवे': 92, 'तिरानवे': 93, 'चौरानवे': 94, 'पंचानवे': 95,
  'छियानवे': 96, 'सत्तानवे': 97, 'अट्ठानवे': 98, 'निन्यानवे': 99, 'सौ': 100
};

// Hindi multipliers
const MULTIPLIERS = [
  { words: ['करोड़', 'करोड', 'करोड़ों', 'करोडो', 'crore', 'crores'], factor: 10000000 },
  { words: ['लाख', 'लाखों', 'लाखां', 'lakh', 'lakhs', 'lac', 'lacs'], factor: 100000 },
  { words: ['हज़ार', 'हजार', 'हज़ारों', 'हजारों', 'thousand', 'k'], factor: 1000 },
  { words: ['सौ', 'सैकड़ा', 'hundred'], factor: 100 }
];

/**
 * Converts Devanagari digits to Latin digits.
 */
function normalizeDigits(str) {
  return str.replace(/[०-९]/g, d => DEVANAGARI_DIGITS[d] || d);
}

/**
 * Parses a simple word or digit token into a number (0-999) if recognized.
 */
function parseTokenValue(token) {
  if (!token) return null;
  const normalized = normalizeDigits(token.trim().toLowerCase());
  
  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return parseFloat(normalized);
  }
  
  if (HINDI_NUMBER_WORDS[normalized] !== undefined) {
    return HINDI_NUMBER_WORDS[normalized];
  }
  
  return null;
}

/**
 * Main parser function.
 * @param {string} transcript - Speech-to-text output
 * @returns {number|null} - Extracted integer or float number, or null if unparseable
 */
export function parseHindiNumber(transcript) {
  if (!transcript || typeof transcript !== 'string') return null;

  let text = transcript.trim().toLowerCase();

  // Strip currency and filler words
  text = text.replace(/₹|रु\.|रुपये|रुपया|रुपए|रूपया|रूपए|रु|रुपयों|रुपियो|rs\.?|inr|साल|वर्ष|लोग|कर्मचारी/gi, ' ');
  text = normalizeDigits(text);
  text = text.replace(/,/g, '').replace(/\s+/g, ' ').trim();

  if (!text) return null;

  // Handle special fractional Hindi quantities directly
  if (/^(?:आधा|half)\s*(?:लाख|lakh)/i.test(text)) return 50000;
  if (/^(?:डेढ़|डेढ)\s*(?:लाख|lakh)/i.test(text)) return 150000;
  if (/^(?:ढाई)\s*(?:लाख|lakh)/i.test(text)) return 250000;
  if (/^(?:डेढ़|डेढ)\s*(?:हज़ार|हजार|thousand)/i.test(text)) return 1500;
  if (/^(?:ढाई)\s*(?:हज़ार|हजार|thousand)/i.test(text)) return 2500;
  if (/^(?:डेढ़|डेढ)\s*(?:करोड़|करोड|crore)/i.test(text)) return 15000000;
  if (/^(?:ढाई)\s*(?:करोड़|करोड|crore)/i.test(text)) return 25000000;

  // Handle "साढ़े <x> लाख" / "साढ़े <x> हज़ार" (n + 0.5)
  const sadeMatch = text.match(/साढ़े\s+([^\s]+)\s+(लाख|lakh|करोड़|करोड|crore|हज़ार|हजार|thousand)/i);
  if (sadeMatch) {
    const baseVal = parseTokenValue(sadeMatch[1]);
    if (baseVal !== null) {
      let multiplier = 1;
      const multWord = sadeMatch[2];
      if (/लाख|lakh/i.test(multWord)) multiplier = 100000;
      else if (/करोड़|करोड|crore/i.test(multWord)) multiplier = 10000000;
      else if (/हज़ार|हजार|thousand/i.test(multWord)) multiplier = 1000;
      return Math.round((baseVal + 0.5) * multiplier);
    }
  }

  // Handle "सवा <x> लाख" (n + 0.25)
  const sawaMatch = text.match(/सवा\s+([^\s]+)\s+(लाख|lakh|करोड़|करोड|crore|हज़ार|हजार|thousand)/i);
  if (sawaMatch) {
    const baseVal = parseTokenValue(sawaMatch[1]);
    if (baseVal !== null) {
      let multiplier = 1;
      const multWord = sawaMatch[2];
      if (/लाख|lakh/i.test(multWord)) multiplier = 100000;
      else if (/करोड़|करोड|crore/i.test(multWord)) multiplier = 10000000;
      else if (/हज़ार|हजार|thousand/i.test(multWord)) multiplier = 1000;
      return Math.round((baseVal + 0.25) * multiplier);
    }
  }

  // Tokenize words
  const tokens = text.split(/\s+/).filter(Boolean);

  let total = 0;
  let currentSegment = 0;
  let hasNumber = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Check if token is a known multiplier
    const multiplierObj = MULTIPLIERS.find(m => m.words.includes(token));
    if (multiplierObj) {
      // If no current segment preceded it (e.g. "एक लाख" omitted as just "लाख"), assume 1
      const factorBase = currentSegment === 0 ? 1 : currentSegment;
      total += factorBase * multiplierObj.factor;
      currentSegment = 0;
      hasNumber = true;
      continue;
    }

    // Check token value
    const val = parseTokenValue(token);
    if (val !== null) {
      currentSegment += val;
      hasNumber = true;
    }
  }

  total += currentSegment;

  if (hasNumber && total >= 0) {
    return Math.round(total);
  }

  // Direct single-number word lookup fallback
  if (HINDI_NUMBER_WORDS[text] !== undefined) {
    return HINDI_NUMBER_WORDS[text];
  }

  // Regex digit sequence fallback (e.g. "50000", "28", "2,50,000")
  const digitMatch = text.match(/\b\d+(\.\d+)?\b/);
  if (digitMatch) {
    const parsed = parseFloat(digitMatch[0]);
    if (!isNaN(parsed)) return Math.round(parsed);
  }

  return null;
}

