/**
 * Mock DigiLocker Service Adapter - YojnaSetu AI
 * 
 * ============================================================================
 * PRODUCTION NOTE:
 * This is a sandbox / simulation adapter for Smart India Hackathon demonstrations.
 * In a live production environment, this module would integrate with the official
 * DigiLocker Partner API (https://digilocker.gov.in) using OAuth 2.0 PKCE authorization,
 * digitally signed XML/JSON payloads, and UIDAI e-KYC consent artifacts.
 * 
 * SENSITIVE DATA PRIVACY & STORAGE LIMITATION:
 * Aligned with the Digital Personal Data Protection (DPDP) Act 2023 principles:
 * - Data Minimization: Only specifically consented document types are retrieved.
 * - Storage Limitation: Raw document payloads are stored EXCLUSIVELY in a short-lived
 *   in-memory cache (Map with 45-minute TTL) on the server.
 * - Raw documents are NEVER permanently written to MongoDB user or profile collections.
 * ============================================================================
 */

// In-Memory Temporary Session Store: Map<sessionId, { userId, docs, createdAt, expiresAt }>
const temporaryDocumentStore = new Map();

// Session TTL: 45 minutes (2700000 ms)
const SESSION_TTL_MS = 45 * 60 * 1000;

// Periodic cleanup of expired sessions (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of temporaryDocumentStore.entries()) {
    if (session.expiresAt && session.expiresAt <= now) {
      temporaryDocumentStore.delete(sessionId);
    }
  }
}, 10 * 60 * 1000);

/**
 * Generates realistic mock DigiLocker documents for consented document types.
 * 
 * @param {string} userId - User identifier
 * @param {Array<string>} requestedDocTypes - Array of document names requested
 * @param {Object} [profileHint] - Optional profile information to keep mock consistent
 * @returns {Object} Consented documents dataset and temporary session token
 */
const fetchConsentedDocuments = async (userId, requestedDocTypes = [], profileHint = {}) => {
  const normalizedTypes = requestedDocTypes.map(t => String(t).toLowerCase());
  const now = Date.now();
  const sessionId = `dgl_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const fullName = profileHint.fullName || profileHint.name || 'Sunita Devi';
  const state = profileHint.state || 'Bihar';
  const category = profileHint.category || 'SC';
  const annualIncome = profileHint.familyIncome || 180000;

  const mockDocuments = {};

  // 1. Aadhaar Card (UIDAI Standard)
  if (normalizedTypes.length === 0 || normalizedTypes.some(t => t.includes('aadhaar') || t.includes('identity') || t.includes('id'))) {
    mockDocuments.aadhaar = {
      docType: 'Aadhaar Card',
      issuer: 'Unique Identification Authority of India (UIDAI)',
      issuingAuthority: 'UIDAI (Government of India)',
      maskedNumber: 'XXXX-XXXX-7842',
      rawAadhaarLast4: '7842',
      fullName,
      gender: profileHint.gender || 'Female',
      dateOfBirth: profileHint.dob || '1996-04-15',
      address: {
        line1: 'Ward No. 4, Village Khagaul',
        district: profileHint.district || 'Patna',
        state,
        pincode: '801105'
      },
      verificationStatus: 'DIGITALLY_VERIFIED_BY_UIDAI',
      timestamp: new Date().toISOString()
    };
  }

  // 2. Income Certificate (State Revenue Dept / e-District)
  if (normalizedTypes.length === 0 || normalizedTypes.some(t => t.includes('income') || t.includes('tehsildar'))) {
    mockDocuments.incomeCertificate = {
      docType: 'Annual Income Certificate',
      issuer: `Revenue Department, Government of ${state}`,
      issuingAuthority: 'Sub-Divisional Magistrate / Tehsildar Office',
      certificateNumber: `INC/${state.substring(0, 2).toUpperCase()}/2026/091823`,
      beneficiaryName: fullName,
      fatherOrSpouseName: 'Ramesh Kumar',
      certifiedAnnualIncome: annualIncome,
      certifiedAnnualIncomeWords: 'Rupees One Lakh Eighty Thousand Only',
      issueDate: '2026-01-10',
      validTill: '2027-03-31',
      digitalSignatory: `SDM / Tehsildar (${profileHint.district || 'Patna'})`,
      verificationStatus: 'VERIFIED_EDISTRICT_PORTAL'
    };
  }

  // 3. Social Category / Caste Certificate
  if (normalizedTypes.length === 0 || normalizedTypes.some(t => t.includes('caste') || t.includes('category') || t.includes('social'))) {
    mockDocuments.casteCertificate = {
      docType: 'Community / Social Category Certificate',
      issuer: `Department of Social Welfare, Government of ${state}`,
      issuingAuthority: 'District Magistrate / Executive Magistrate',
      certificateNumber: `CST/${state.substring(0, 2).toUpperCase()}/${category}/2025/44812`,
      beneficiaryName: fullName,
      category,
      subCaste: 'Chamar / Ravidas',
      gazetteNotificationRef: 'GOI-SOC-WEL-1950-SCHED-CASTES',
      issueDate: '2025-06-18',
      verificationStatus: 'VERIFIED_NATIONAL_CATEGORY_VAULT'
    };
  }

  // 4. Udyam MSME Registration Certificate
  if (normalizedTypes.length === 0 || normalizedTypes.some(t => t.includes('udyam') || t.includes('msme') || t.includes('business'))) {
    mockDocuments.udyamCertificate = {
      docType: 'Udyam Registration Certificate',
      issuer: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
      issuingAuthority: 'National MSME Portal (udyamregistration.gov.in)',
      udyamNumber: `UDYAM-${state.substring(0, 2).toUpperCase()}-08-0091823`,
      enterpriseName: `${fullName.split(' ')[0]} Enterprise & Food Products`,
      enterpriseType: 'MICRO',
      majorActivity: 'MANUFACTURING',
      nic2DigitCode: '10 - Manufacture of food products',
      dateOfIncorporation: '2024-03-12',
      nationalIndustryCode: '10799',
      verificationStatus: 'ACTIVE_UDYAM_REGISTRATION'
    };
  }

  // Store in short-lived in-memory cache only
  temporaryDocumentStore.set(sessionId, {
    sessionId,
    userId: String(userId || 'guest_user'),
    documents: mockDocuments,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  });

  return {
    success: true,
    sessionId,
    expiresInSeconds: Math.round(SESSION_TTL_MS / 1000),
    documents: mockDocuments,
    disclaimer: 'Sandbox simulated DigiLocker payload for hackathon demonstration. Valid for 45 minutes in temporary server cache only.'
  };
};

/**
 * Retrieves temporary consented documents by sessionId.
 */
const getConsentedDocumentsBySession = (sessionId) => {
  if (!sessionId) return null;
  const session = temporaryDocumentStore.get(sessionId);
  if (!session) return null;
  if (session.expiresAt && session.expiresAt <= Date.now()) {
    temporaryDocumentStore.delete(sessionId);
    return null;
  }
  return session.documents;
};

/**
 * Explicitly clears temporary session data.
 */
const clearDigilockerSession = (sessionId) => {
  if (sessionId) temporaryDocumentStore.delete(sessionId);
};

module.exports = {
  fetchConsentedDocuments,
  getConsentedDocumentsBySession,
  clearDigilockerSession,
  SESSION_TTL_MS
};

