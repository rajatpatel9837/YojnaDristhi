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
