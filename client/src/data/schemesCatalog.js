/**
 * schemesCatalog.js
 * Comprehensive client-side scheme catalog for instant zero-latency dynamic search in Navbar.
 * Contains verified central and state schemes with keywords, benefits, and category tags.
 */

export const SCHEMES_CATALOG = [
  {
    id: 'pmegp',
    slug: 'pmegp-micro-units-grant-loan',
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    name_hi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
    provider: 'Khadi and Village Industries Commission (KVIC) / Ministry of MSME',
    category: 'Subsidy & Loan',
    benefit: 'Up to ₹50 Lakh • 35% Govt Subsidy',
    benefit_hi: '₹50 लाख तक ऋण • 35% सरकारी सब्सिडी',
    keywords: ['pmegp', 'kvic', 'msme', 'subsidy', 'manufacturing', 'service', 'loan', 'rural', 'woman', 'sc', 'st', 'obc'],
    sector: 'Manufacturing / Services / Food Processing'
  },
  {
    id: 'mudra',
    slug: 'mudra-shishu-kishore-tarun-loan',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    name_hi: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    provider: 'MUDRA / Department of Financial Services',
    category: 'Collateral-Free Loan',
    benefit: 'Up to ₹20 Lakh • Collateral-Free Micro Credit',
    benefit_hi: '₹20 लाख तक बिना गारंटी ऋण',
    keywords: ['mudra', 'pmmy', 'shishu', 'kishore', 'tarun', 'loan', 'bank', 'shop', 'retail', 'vendor'],
    sector: 'Micro Business / Trading / Services'
  },
  {
    id: 'standup-india',
    slug: 'stand-up-india-sc-st-women',
    name: 'Stand-Up India Scheme for SC/ST and Women Entrepreneurs',
    name_hi: 'स्टैंड-अप इंडिया योजना (अनुसूचित जाति/जनजाति व महिला उद्यमी)',
    provider: 'Department of Financial Services / SIDBI',
    category: 'Greenfield Enterprise Credit',
    benefit: '₹10 Lakh to ₹1 Crore Bank Loan',
    benefit_hi: '₹10 लाख से ₹1 करोड़ तक बैंक ऋण',
    keywords: ['standup', 'sc', 'st', 'women', 'sidbi', 'greenfield', 'manufacturing', 'trading', 'loan'],
    sector: 'Manufacturing / Trading / Services'
  },
  {
    id: 'pm-vishwakarma',
    slug: 'pm-vishwakarma-artisan-toolkit-incentive',
    name: 'PM Vishwakarma Scheme for Traditional Artisans',
    name_hi: 'पीएम विश्वकर्मा योजना (पारंपरिक कारीगर एवं शिल्पी)',
    provider: 'Ministry of MSME / Skill Development',
    category: 'Toolkit Grant & Concessional Credit',
    benefit: '₹15,000 Toolkit Grant + ₹3 Lakh Loan @ 5%',
    benefit_hi: '₹15,000 टूलकिट अनुदान + ₹3 लाख ऋण (5% ब्याज)',
    keywords: ['vishwakarma', 'artisan', 'craftsman', 'toolkit', 'carpenter', 'blacksmith', 'tailor', 'potter', 'sc', 'st'],
    sector: 'Traditional Crafts / Artisans / Handloom'
  },
  {
    id: 'pmfme',
    slug: 'pmfme-micro-food-processing-cluster',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    name_hi: 'पीएम सूक्ष्म खाद्य उद्योग उन्नयन योजना (PMFME)',
    provider: 'Ministry of Food Processing Industries (MoFPI)',
    category: 'Capital Subsidy & ODOP Support',
    benefit: '35% Credit-Linked Subsidy (Up to ₹10 Lakh)',
    benefit_hi: '35% क्रेडिट-लिंक्ड सब्सिडी (अधिकतम ₹10 लाख)',
    keywords: ['pmfme', 'food processing', 'odop', 'dairy', 'spices', 'bakery', 'pickle', 'agriculture'],
    sector: 'Food Processing / Agro-allied'
  },
  {
    id: 'cgtmse',
    slug: 'cgtmse-credit-guarantee-scheme',
    name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
    name_hi: 'क्रेडिट गारंटी ट्रस्ट योजना (CGTMSE)',
    provider: 'Ministry of MSME / SIDBI',
    category: 'Collateral Guarantee',
    benefit: 'Up to ₹5 Crore Guarantee Cover without Third-Party Collateral',
    benefit_hi: '₹5 करोड़ तक बिना बंधक गारंटी कवर',
    keywords: ['cgtmse', 'guarantee', 'collateral', 'sidbi', 'msme', 'bank loan'],
    sector: 'MSME / Small Enterprise'
  },
  {
    id: 'day-nulm',
    slug: 'day-nulm-urban-self-employment',
    name: 'DAY-NULM Urban Livelihoods Self-Employment Program',
    name_hi: 'दीनदयाल अंत्योदय योजना - राष्ट्रीय शहरी आजीविका मिशन (DAY-NULM)',
    provider: 'Ministry of Housing and Urban Affairs',
    category: 'Subsidized Credit & SHG',
    benefit: 'Up to ₹2 Lakh Individual / ₹10 Lakh Group @ 7%',
    benefit_hi: 'व्यक्तिगत ₹2 लाख / समूह ₹10 लाख (7% ब्याज)',
    keywords: ['nulm', 'day nulm', 'urban', 'shg', 'women', 'livelihood', 'self-help group'],
    sector: 'Urban Livelihoods / Micro-Enterprise'
  },
  {
    id: 'startup-india-seed-fund',
    slug: 'startup-india-seed-fund-sisfs',
    name: 'Startup India Seed Fund Scheme (SISFS)',
    name_hi: 'स्टार्टअप इंडिया सीड फंड योजना (SISFS)',
    provider: 'DPIIT / Ministry of Commerce and Industry',
    category: 'Seed Grant & Debt',
    benefit: 'Up to ₹20 Lakh Grant / ₹50 Lakh Debt/Convertible',
    benefit_hi: '₹20 लाख तक अनुदान / ₹50 लाख परिवर्तनीय ऋण',
    keywords: ['startup', 'dpiit', 'seed fund', 'innovation', 'tech', 'incubation'],
    sector: 'Technology / Innovation / Startups'
  },
  {
    id: 'pm-svanidhi',
    slug: 'pm-svanidhi-street-vendor-micro-credit',
    name: 'PM SVANidhi Micro-Credit Scheme for Street Vendors',
    name_hi: 'पीएम स्वनिधि स्ट्रीट वेंडर माइक्रो-क्रेडिट योजना',
    provider: 'Ministry of Housing and Urban Affairs',
    category: 'Working Capital Loan',
    benefit: '₹10k to ₹50k Working Capital + 7% Interest Subsidy',
    benefit_hi: '₹10,000 से ₹50,000 कार्यशील पूंजी + 7% ब्याज सब्सिडी',
    keywords: ['svanidhi', 'street vendor', 'thela', 'rehri', 'micro loan', 'urban vendor'],
    sector: 'Street Vendors / Micro Retail'
  },
  {
    id: 'bihar-mahila-udyamita',
    slug: 'bihar-mukhyamantri-mahila-udyamita-yojana',
    name: 'Bihar Mukhyamantri Mahila & Yuva Udyami Yojana',
    name_hi: 'बिहार मुख्यमंत्री महिला एवं युवा उद्यमी योजना',
    provider: 'Department of Industries, Government of Bihar',
    category: 'State Capital Subsidy & Zero-Interest Loan',
    benefit: '₹10 Lakh (₹5 Lakh Grant + ₹5 Lakh 0-1% Interest Loan)',
    benefit_hi: '₹10 लाख (₹5 लाख सीधा अनुदान + ₹5 लाख ब्याज-मुक्त ऋण)',
    keywords: ['bihar', 'mahila udyami', 'yuva udyami', 'patna', 'state scheme', 'women'],
    sector: 'Manufacturing / Services / Agro-allied'
  },
  {
    id: 'mysy-up',
    slug: 'mukhyamantri-yuva-swarojgar-yojana-up',
    name: 'Mukhyamantri Yuva Swarojgar Yojana (UP MYSY)',
    name_hi: 'मुख्यमंत्री युवा स्वरोजगार योजना (उत्तर प्रदेश)',
    provider: 'Department of MSME, Government of Uttar Pradesh',
    category: 'State Margin Money Subsidy',
    benefit: 'Up to ₹25 Lakh with 25% Govt Margin Money Subsidy',
    benefit_hi: '₹25 लाख तक परियोजना • 25% सरकारी सब्सिडी',
    keywords: ['uttar pradesh', 'up', 'mysy', 'swarojgar', 'lucknow', 'state scheme'],
    sector: 'Industry / Services / MSME'
  },
  {
    id: 'scholarsetu-pms-sc',
    slug: 'post-matric-scholarship-sc-st',
    name: 'Post-Matric Scholarship Scheme for SC/ST/OBC Students',
    name_hi: 'अनुसूचित जाति/जनजाति पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    provider: 'Ministry of Social Justice & Empowerment',
    category: 'Direct Benefit Transfer (DBT)',
    benefit: '100% Tuition Fee Reimbursement + Monthly Maintenance Allowance',
    benefit_hi: '100% शिक्षण शुल्क प्रतिपूर्ति + मासिक छात्रवृत्ति भत्ता',
    keywords: ['scholarship', 'scholarsetu', 'post matric', 'sc', 'st', 'obc', 'student', 'college', 'tuition'],
    sector: 'Education / Higher Studies'
  }
];

/**
 * Filter schemes by query text matching name, provider, keywords, or sector
 */
export function searchSchemesLocally(queryText) {
  if (!queryText || queryText.trim().length === 0) return [];
  const q = queryText.toLowerCase().trim();

  return SCHEMES_CATALOG.filter((scheme) => {
    if (scheme.name.toLowerCase().includes(q)) return true;
    if (scheme.name_hi && scheme.name_hi.includes(q)) return true;
    if (scheme.provider.toLowerCase().includes(q)) return true;
    if (scheme.category.toLowerCase().includes(q)) return true;
    if (scheme.sector && scheme.sector.toLowerCase().includes(q)) return true;
    if (scheme.keywords && scheme.keywords.some(k => k.toLowerCase().includes(q))) return true;
    return false;
  });
}
