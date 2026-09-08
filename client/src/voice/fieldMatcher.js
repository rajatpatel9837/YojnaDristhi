/**
 * fieldMatcher.js
 * Matchers and command phrase recognizers for "बोलकर भरें" voice wizard.
 * Includes fuzzy Levenshtein distance for Devanagari/Hindi string matching.
 */

import {
  YES_WORDS_HI,
  NO_WORDS_HI,
  STOP_WORDS_HI,
  REPEAT_WORDS_HI,
  BACK_WORDS_HI,
  SKIP_WORDS_HI,
  HELP_WORDS_HI
} from './wizardVoiceSchema.js';
import { parseHindiNumber } from './hindiNumberParser.js';

/**
 * Computes Levenshtein edit distance between two strings.
 */
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Returns normalized similarity score between 0.0 and 1.0.
 */
function stringSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return 1 - dist / maxLen;
}

/**
 * Cleans and normalizes Hindi/English text for comparison.
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Matches a user's transcript to one option value from a closed options list.
 * @param {string} transcript - Speech text
 * @param {Array} options - [{ value, label_hi, synonyms_hi }]
 * @returns {string|null} - Selected option's value or null
 */
export function matchSelectOption(transcript, options) {
  if (!transcript || !Array.isArray(options) || options.length === 0) return null;

  const text = cleanText(transcript);
  if (!text) return null;

  // 1. Exact match against label_hi or any synonym
  for (const opt of options) {
    const candidates = [opt.label_hi, ...(opt.synonyms_hi || []), opt.value];
    for (const cand of candidates) {
      const cleanedCand = cleanText(cand);
      if (text === cleanedCand) {
        return opt.value;
      }
    }
  }

  // 2. Substring match: check if candidate is contained within transcript or vice versa
  for (const opt of options) {
    const candidates = [opt.label_hi, ...(opt.synonyms_hi || [])];
    for (const cand of candidates) {
      const cleanedCand = cleanText(cand);
      if (cleanedCand.length >= 2) {
        // Word boundary or contained substring
        if (text.includes(cleanedCand) || (cleanedCand.length >= 4 && text.split(' ').includes(cleanedCand))) {
          return opt.value;
        }
      }
    }
  }

  // 3. Fuzzy Levenshtein match across all words and n-grams
  let bestMatch = null;
  let highestScore = 0;
  const words = text.split(' ');

  for (const opt of options) {
    const candidates = [opt.label_hi, ...(opt.synonyms_hi || [])];
    for (const cand of candidates) {
      const cleanedCand = cleanText(cand);
      if (!cleanedCand) continue;

      // Full text similarity
      const fullSim = stringSimilarity(text, cleanedCand);
      if (fullSim > highestScore) {
        highestScore = fullSim;
        bestMatch = opt.value;
      }

      // Word-by-word similarity
      for (const word of words) {
        if (word.length >= 3) {
          const wordSim = stringSimilarity(word, cleanedCand);
          if (wordSim > highestScore) {
            highestScore = wordSim;
            bestMatch = opt.value;
          }
        }
      }
    }
  }

  // Threshold: ≥ 0.60
  if (highestScore >= 0.60) {
    return bestMatch;
  }

  return null;
}

/**
 * Matches a boolean response (Yes / No) in Hindi.
 * @param {string} transcript - Speech text
 * @returns {boolean|null}
 */
export function matchBoolean(transcript) {
  if (!transcript) return null;
  const text = cleanText(transcript);
  if (!text) return null;

  // 1. Check NO first (e.g. "नहीं", "नहीं है", "जी नहीं" must take precedence over "है")
  for (const word of NO_WORDS_HI) {
    const cleanWord = cleanText(word);
    if (text === cleanWord || text.startsWith(cleanWord + ' ') || text.endsWith(' ' + cleanWord) || text.includes(' ' + cleanWord + ' ')) {
      return false;
    }
  }

  // If text contains "नहीं" or "नही" or "not", it's definitely false
  if (/\b(?:नहीं|नही|ना|no|not)\b/.test(text) || text.includes('नहीं') || text.includes('नही')) {
    return false;
  }

  // 2. Check YES
  for (const word of YES_WORDS_HI) {
    const cleanWord = cleanText(word);
    if (text === cleanWord || text.startsWith(cleanWord + ' ') || text.endsWith(' ' + cleanWord) || text.includes(' ' + cleanWord + ' ')) {
      return true;
    }
  }

  return null;
}

/**
 * Matches multiple items from a transcript (used in Step 6 Document Checklist).
 * @param {string} transcript - Speech text
 * @param {Array} options - [{ value, label_hi, synonyms_hi }]
 * @returns {Array<string>} - Array of matched option values
 */
export function matchMultiSelect(transcript, options) {
  if (!transcript || !Array.isArray(options)) return [];
  const text = cleanText(transcript);
  if (!text) return [];

  const matchedValues = new Set();

  for (const opt of options) {
    const candidates = [opt.label_hi, ...(opt.synonyms_hi || []), opt.value];
    for (const cand of candidates) {
      const cleanedCand = cleanText(cand);
      if (cleanedCand && cleanedCand.length >= 2) {
        if (text.includes(cleanedCand)) {
          matchedValues.add(opt.value);
          break;
        }
        // Check fuzzy word matching
        for (const token of text.split(' ')) {
          if (token.length >= 4 && stringSimilarity(token, cleanedCand) >= 0.72) {
            matchedValues.add(opt.value);
            break;
          }
        }
      }
    }
  }

  return Array.from(matchedValues);
}

// ─── Global Command Predicates ──────────────────────────────────────

export function isStopPhrase(transcript) {
  if (!transcript) return false;
  const text = cleanText(transcript);
  return STOP_WORDS_HI.some(w => {
    const cw = cleanText(w);
    return text === cw || text.startsWith(cw) || text.endsWith(cw);
  });
}

export function isRepeatPhrase(transcript) {
  if (!transcript) return false;
  const text = cleanText(transcript);
  return REPEAT_WORDS_HI.some(w => {
    const cw = cleanText(w);
    return text === cw || text.includes(cw);
  });
}

export function isBackPhrase(transcript) {
  if (!transcript) return false;
  const text = cleanText(transcript);
  return BACK_WORDS_HI.some(w => {
    const cw = cleanText(w);
    return text === cw || text.includes(cw);
  });
}

export function isSkipPhrase(transcript) {
  if (!transcript) return false;
  const text = cleanText(transcript);
  return SKIP_WORDS_HI.some(w => {
    const cw = cleanText(w);
    return text === cw || text.includes(cw);
  });
}

export function isHelpPhrase(transcript) {
  if (!transcript) return false;
  const text = cleanText(transcript);
  return HELP_WORDS_HI.some(w => {
    const cw = cleanText(w);
    return text === cw || text.includes(cw);
  });
}

// ─── Multi-Slot Compound Extraction Engine ──────────────────────────

/**
 * High-precision exact/substring matcher for compound sentences.
 * Avoids false positive fuzzy collisions with Hindi particles.
 */
export function matchSelectStrict(text, options) {
  if (!text || !Array.isArray(options)) return null;
  const clean = text.toLowerCase();

  for (const opt of options) {
    const candidates = [opt.label_hi, ...(opt.synonyms_hi || []), opt.value].filter(Boolean);
    for (const cand of candidates) {
      const c = cand.toLowerCase().trim();
      if (!c) continue;
      // If candidate is at least 3 chars, check inclusion or word boundary
      if (c.length >= 3 && clean.includes(c)) {
        return opt.value;
      } else if (c.length < 3) {
        // Strict word boundary for very short candidates (like "up", "sc", "st")
        const words = clean.split(/\s+/);
        if (words.includes(c)) return opt.value;
      }
    }
  }
  return null;
}

/**
 * Extracts multiple structured fields from a single compound spoken utterance.
 * E.g. "मेरा नाम सुनीता देवी है, उम्र 28 साल, मैं पटना बिहार से हूँ और ग्रामीण क्षेत्र में रहती हूँ"
 *
 * @param {string} transcript - User's full spoken text
 * @param {Array} stepFields - Field definitions of the current step
 * @returns {Record<string, any>} - Map of fieldKey -> resolvedValue
 */
export function extractMultiFields(transcript, stepFields = []) {
  if (!transcript || typeof transcript !== 'string') return {};
  const cleanTranscript = transcript.trim();
  const results = {};

  for (const field of stepFields) {
    const key = field.key;
    const type = field.type;

    // ── 1. Text Fields ──
    if (key === 'fullName') {
      const nameMatch = cleanTranscript.match(/(?:मेरा\s*नाम|नाम\s*है|नाम)\s*[:=]?\s*([A-Za-z\u0900-\u097F]+(?:\s+[A-Za-z\u0900-\u097F]+){0,2})/i);
      if (nameMatch && nameMatch[1]) {
        let n = nameMatch[1].replace(/\s+(?:है|हूँ|हू|की|का|था|थी)$/g, '').replace(/^(?:है|हूँ|हू)\s+/g, '').trim();
        if (n.length >= 2) {
          results[key] = n.charAt(0).toUpperCase() + n.slice(1);
        }
      }
    } else if (key === 'businessName') {
      const bMatch = cleanTranscript.match(/(?:व्यवसाय\s*का\s*नाम|दुकान\s*का\s*नाम|दुकान\s*है|काम\s*है)\s*[:=]?\s*([A-Za-z\u0900-\u097F0-9\s]+?)(?:है|हूँ|$|,|।)/i);
      if (bMatch && bMatch[1]) {
        let b = bMatch[1].replace(/\s+(?:है|हूँ|का|की)$/g, '').trim();
        if (b.length >= 2) results[key] = b;
      }
    } else if (key === 'district') {
      const distMatch = cleanTranscript.match(/(?:ज़िला|जिला|शहर)\s*[:=]?\s*([A-Za-z\u0900-\u097F]+)/i);
      if (distMatch && distMatch[1]) {
        results[key] = distMatch[1].trim();
      } else {
        const cityMatch = cleanTranscript.match(/(?:मैं|हम)\s+([A-Za-z\u0900-\u097F]+)\s+(?:बिहार|पंजाब|उत्तर प्रदेश|झारखंड|महाराष्ट्र|राजस्थान|मध्य प्रदेश)/i);
        if (cityMatch && cityMatch[1]) {
          results[key] = cityMatch[1].trim();
        }
      }
    } else if (key === 'fundingPurpose') {
      const pMatch = cleanTranscript.match(/(?:के\s*लिए|मकसद|उद्देश्य)\s*[:=]?\s*([A-Za-z\u0900-\u097F\s]+)/i)
        || cleanTranscript.match(/([A-Za-z\u0900-\u097F\s]+?)\s*के\s*लिए/i);
      if (pMatch && pMatch[1]) {
        let p = pMatch[1].replace(/\b(?:चाहिए|लाख|रुपये|रु|हज़ार)\b/g, '').trim();
        if (p.length >= 3) results[key] = p;
      }
    }

    // ── 2. Select Fields ──
    if (type === 'select' && Array.isArray(field.options)) {
      const matched = matchSelectStrict(cleanTranscript, field.options);
      if (matched) {
        results[key] = matched;
      }
    }

    // ── 3. Number Fields ──
    if (type === 'number') {
      let numVal = null;

      if (key === 'age') {
        const ageMatch = cleanTranscript.match(/(?:उम्र|आयु)\s*(?:है)?\s*([०-९\d]+|[एक-सौ\w]+)\s*(?:साल|वर्ष)?/i)
          || cleanTranscript.match(/([०-९\d]+|[एक-सौ\w]+)\s*(?:साल|वर्ष)\s*(?:की\s*उम्र|का\s*उम्र|उम्र)?/i);
        if (ageMatch) {
          numVal = parseHindiNumber(ageMatch[1], field.min, field.max);
        }
      } else if (key === 'annualTurnover') {
        const turnMatch = cleanTranscript.match(/(?:टर्नओवर|कारोबार|सालाना\s*टर्नओवर|बिक्री)\s*(?:है)?\s*([०-९\d\s\wलाखहज़ारकरोड़]+)/i)
          || cleanTranscript.match(/([०-९\d\s\wलाखहज़ारकरोड़]+)\s*(?:टर्नओवर|कारोबार|सालाना\s*टर्नओवर|बिक्री)/i);
        if (turnMatch) {
          numVal = parseHindiNumber(turnMatch[1], field.min, field.max);
        }
      } else if (key === 'employeesCount') {
        const empMatch = cleanTranscript.match(/([०-९\d\w\s]+)\s*(?:लोग|कर्मचारी|कामगार|वर्कर)/i)
          || cleanTranscript.match(/(?:कर्मचारी|कामगार)\s*([०-९\d\w\s]+)/i);
        if (empMatch) {
          numVal = parseHindiNumber(empMatch[1], field.min, field.max);
        }
      } else if (key === 'familyIncome') {
        const incMatch = cleanTranscript.match(/(?:पारिवारिक\s*आय|परिवार\s*की\s*आय|सालाना\s*आय|आय)\s*(?:है)?\s*([०-९\d\s\wलाखहज़ारकरोड़]+)/i)
          || cleanTranscript.match(/([०-९\d\s\wलाखहज़ारकरोड़]+)\s*(?:पारिवारिक\s*आय|आय)/i);
        if (incMatch) {
          numVal = parseHindiNumber(incMatch[1], field.min, field.max);
        }
      } else if (key === 'ownContribution') {
        const ownMatch = cleanTranscript.match(/(?:स्वयं\s*का\s*निवेश|खुद\s*का\s*निवेश|खुद\s*का|स्वयं|अपनी\s*पूंजी)\s*(?:है)?\s*([०-९\d\s\wलाखहज़ारकरोड़]+)/i)
          || cleanTranscript.match(/([०-९\d\s\wलाखहज़ारकरोड़]+)\s*(?:खुद\s*का|स्वयं\s*का|अपनी\s*पूंजी)/i);
        if (ownMatch) {
          numVal = parseHindiNumber(ownMatch[1], field.min, field.max);
        }
      } else if (key === 'fundingAmount') {
        const fundMatch = cleanTranscript.match(/([०-९\d\s\wलाखहज़ारकरोड़]+)\s*(?:रुपये|रु)?\s*(?:की\s*सहायता|चाहिए|लोन\s*चाहिए|फंडिंग|ऋण)/i)
          || cleanTranscript.match(/(?:सहायता\s*राशि|लोन|ऋण|फंडिंग)\s*(?:है)?\s*([०-९\d\s\wलाखहज़ारकरोड़]+)/i);
        if (fundMatch) {
          numVal = parseHindiNumber(fundMatch[1], field.min, field.max);
        }
      }

      if (numVal !== null && numVal !== undefined && !isNaN(numVal)) {
        results[key] = numVal;
      }
    }

    // ── 4. Boolean Fields ──
    if (type === 'boolean') {
      if (key === 'hasIncomeCertificate' && /(?:आय\s*प्रमाण\s*पत्र|इनकम\s*सर्टिफिकेट)/i.test(cleanTranscript)) {
        results[key] = !/नहीं|नही|ना|उपलब्ध नहीं/i.test(cleanTranscript);
      } else if (key === 'existingLoans' && /(?:लोन|कर्ज|ऋण)/i.test(cleanTranscript)) {
        results[key] = !/नहीं|नही|ना|कोई\s*नहीं/i.test(cleanTranscript);
      } else if (key === 'isWomanEntrepreneur' && /(?:महिला\s*उद्यमी|महिला|औरत)/i.test(cleanTranscript)) {
        results[key] = !/नहीं|नही|ना/i.test(cleanTranscript);
      } else if (key === 'isFirstGeneration' && /(?:पहली\s*पीढ़ी|फर्स्ट\s*जनरेशन)/i.test(cleanTranscript)) {
        results[key] = !/नहीं|नही|ना/i.test(cleanTranscript);
      } else if (key === 'isPwD' && /(?:दिव्यांग|विकलांग|pwd)/i.test(cleanTranscript)) {
        results[key] = !/नहीं|नही|ना/i.test(cleanTranscript);
      }
    }
  }

  return results;
}

